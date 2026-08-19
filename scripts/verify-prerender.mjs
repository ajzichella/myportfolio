import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRERENDER_ROUTES,
  PRERENDER_SKIP,
  SITEMAP_ROUTES,
  routeToTxtRelPath,
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
      "resume.txt",
      "Senior Product Designer",
      'canonical" href="https://ajzichella.com/"',
      "AJ Zichella",
      'id="crawler-instructions"',
      "pages-index.txt",
      "name=\"crawler-instructions\"",
    ],
    ['id="home"'],
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
      'href="/pages-index.txt"',
      'href="/llms.txt"',
      'data-page-mirror="true"',
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
  const inner = rootMatch[1].trim();
  const bootOnly =
    inner.length === 0 ||
    (inner.includes('id="app-boot"') && !inner.includes('id="main-scroll"'));
  if (!bootOnly) {
    console.error(
      `FAIL ${label}: #root must be empty or app-boot only for live React mount`,
    );
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

  const txtPath = join(dist, routeToTxtRelPath(route));
  if (!existsSync(txtPath)) {
    console.error(`FAIL missing plain-text mirror for ${route} (${txtPath})`);
    failed = true;
  } else {
    const txt = readFileSync(txtPath, "utf8");
    if (txt.trim().length < 200) {
      console.error(`FAIL ${txtPath}: content too short (${txt.trim().length} chars)`);
      failed = true;
    } else {
      console.log(`OK ${routeToTxtRelPath(route)}`);
    }
  }
}

for (const route of PRERENDER_SKIP) {
  const file = routeToFile(route);
  if (existsSync(file)) {
    console.error(`FAIL ${route} should not be prerendered (${file} exists)`);
    failed = true;
  }
}

for (const agentFile of ["resume.txt", "llms.txt", "hiring.md", "pages-index.txt"]) {
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

  const rootIdCount = (html.match(/id="root"/g) || []).length;
  if (rootIdCount !== 1) {
    console.error(`FAIL ${file}: expected exactly one id="root", found ${rootIdCount}`);
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
  } else if (!html.includes('id="root"') || !html.includes('id="app-boot"')) {
    console.error("FAIL dist/404.html missing #root app-boot shell");
    failed = true;
  } else {
    console.log("OK dist/404.html SPA shell");
  }
}

const TXT_METRIC_CHECKS = [
  ["case-studies/predefined-roles.txt", ["6,000+", "13%", "23%"], ["\n0+\n", "\n0%\n", "\n~0%\n"]],
  ["case-studies/custom-roles.txt", ["~5,000", "2,857", "6%"], ["\n~0\n", "\n0\n", "\n0%\n"]],
  ["case-studies/kafka.txt", ["~3x", "0.52%"], ["~0x", "\n0.00%\n"]],
];

for (const [file, mustInclude, mustNotInclude] of TXT_METRIC_CHECKS) {
  const path = join(dist, file);
  if (!existsSync(path)) continue;
  const txt = readFileSync(path, "utf8");
  let fileOk = true;
  for (const token of mustInclude) {
    if (!txt.includes(token)) {
      console.error(`FAIL ${file}: missing metric "${token}"`);
      failed = true;
      fileOk = false;
    }
  }
  for (const token of mustNotInclude) {
    if (txt.includes(token)) {
      console.error(`FAIL ${file}: animated counter placeholder "${token.trim()}"`);
      failed = true;
      fileOk = false;
    }
  }
  if (fileOk) console.log(`OK ${file} metrics`);
}

if (SITEMAP_ROUTES.length !== 9) {
  console.error(`FAIL expected 9 sitemap routes, got ${SITEMAP_ROUTES.length}`);
  failed = true;
}

process.exit(failed ? 1 : 0);
