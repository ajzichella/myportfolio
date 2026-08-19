import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRERENDER_ROUTES,
  PRERENDER_SKIP,
  SITEMAP_ROUTES,
} from "./sitemap-routes.mjs";

const dist = "dist";

const CLIP_HIDDEN = /clip:\s*rect\(0,\s*0,\s*0,\s*0\)/;

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.slice(1), "index.html");
}

const contentChecks = [
  [
    "index.html",
    [
      "crawler-fallback",
      'id="static-content"',
      "resume.txt",
      "Senior Product Designer",
      'canonical" href="https://ajzichella.com/"',
      'id="home"',
    ],
    [],
  ],
  [
    "/about/index.html",
    [
      "crawler-fallback",
      "about-who-heading",
      "DigitalOcean",
      'canonical" href="https://ajzichella.com/about"',
    ],
    ['id="home"'],
  ],
  [
    "/case-studies/index.html",
    [
      "crawler-fallback",
      "Filter case studies by topic",
      "Case studies",
      'canonical" href="https://ajzichella.com/case-studies"',
    ],
    ['id="home"'],
  ],
  [
    "/case-studies/custom-roles/index.html",
    [
      "crawler-fallback",
      "cr-scope-heading",
      "Custom Roles",
      'canonical" href="https://ajzichella.com/case-studies/custom-roles"',
    ],
    ['id="home"', "password protected"],
  ],
  [
    "/case-studies/predefined-roles/index.html",
    [
      "crawler-fallback",
      "rbac-results-heading",
      "RBAC",
      'canonical" href="https://ajzichella.com/case-studies/predefined-roles"',
    ],
    ['id="home"'],
  ],
];

function assertEmptyRoot(html, label) {
  const rootMatch = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/);
  if (!rootMatch) {
    console.error(`FAIL ${label}: missing #root`);
    return false;
  }
  if (rootMatch[1].trim().length > 0) {
    console.error(`FAIL ${label}: #root must be empty for live React mount`);
    return false;
  }
  return true;
}

function assertCrawlerNotClipHidden(html, label) {
  const match = html.match(/id="crawler-fallback"[^>]*style="([^"]*)"/);
  if (!match) return true;
  if (CLIP_HIDDEN.test(match[1])) {
    console.error(`FAIL ${label}: crawler-fallback must not use clip rect hiding`);
    return false;
  }
  return true;
}

let failed = false;

for (const route of PRERENDER_ROUTES) {
  const file = routeToFile(route);
  if (!existsSync(file)) {
    console.error(`FAIL missing prerender file for ${route} (${file})`);
    failed = true;
  }
}

for (const route of PRERENDER_SKIP) {
  const file = routeToFile(route);
  if (existsSync(file)) {
    console.error(`FAIL ${route} should not be prerendered (${file} exists)`);
    failed = true;
  }
}

for (const agentFile of ["resume.txt", "llms.txt", "hiring.md"]) {
  const path = join(dist, agentFile);
  if (!existsSync(path)) {
    console.error(`FAIL missing dist/${agentFile}`);
    failed = true;
  } else {
    console.log(`OK dist/${agentFile}`);
  }
}

for (const [file, must, mustNot] of contentChecks) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    console.error(`FAIL missing ${file}`);
    failed = true;
    continue;
  }
  const html = readFileSync(path, "utf8");
  let fileOk = true;

  if (html.includes('id="crawler-fallback" hidden')) {
    console.error(`FAIL ${file}: crawler-fallback must not use hidden attribute`);
    failed = true;
    fileOk = false;
  }

  if (!assertCrawlerNotClipHidden(html, file)) {
    failed = true;
    fileOk = false;
  }

  for (const token of must) {
    if (!html.includes(token)) {
      console.error(`FAIL ${file}: missing "${token}"`);
      failed = true;
      fileOk = false;
    }
  }
  for (const token of mustNot) {
    if (html.includes(token)) {
      console.error(`FAIL ${file}: should not include "${token}"`);
      failed = true;
      fileOk = false;
    }
  }
  if (fileOk) console.log(`OK ${file}`);
  if (!assertEmptyRoot(html, file)) {
    failed = true;
  }
}

const shell404 = join(dist, "404.html");
if (!existsSync(shell404)) {
  console.error("FAIL missing dist/404.html");
  failed = true;
} else {
  const html = readFileSync(shell404, "utf8");
  if (html.includes('id="home"')) {
    console.error("FAIL dist/404.html should be SPA shell, not prerendered home");
    failed = true;
  } else if (!html.includes('<div id="root"></div>')) {
    console.error("FAIL dist/404.html missing empty #root shell");
    failed = true;
  } else {
    console.log("OK dist/404.html SPA shell");
  }
}

if (SITEMAP_ROUTES.length !== 9) {
  console.error(`FAIL expected 9 sitemap routes, got ${SITEMAP_ROUTES.length}`);
  failed = true;
}

process.exit(failed ? 1 : 0);
