import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRERENDER_ROUTES,
  PRERENDER_SKIP,
  SITEMAP_ROUTES,
} from "./sitemap-routes.mjs";

const dist = "dist";

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.slice(1), "index.html");
}

const contentChecks = [
  ["/about/index.html", ["crawler-fallback", "about-who-heading", "DigitalOcean"], ['id="home"']],
  [
    "/case-studies/index.html",
    ["crawler-fallback", "Filter case studies by topic", "Case studies"],
    ['id="home"'],
  ],
  [
    "/case-studies/custom-roles/index.html",
    ["crawler-fallback", "cr-scope-heading", "Custom Roles"],
    ['id="home"', "password protected"],
  ],
  [
    "/case-studies/predefined-roles/index.html",
    ["crawler-fallback", "rbac-results-heading", "RBAC"],
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

for (const [file, must, mustNot] of contentChecks) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    console.error(`FAIL missing ${file}`);
    failed = true;
    continue;
  }
  const html = readFileSync(path, "utf8");
  let fileOk = true;
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
    fileOk = false;
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
