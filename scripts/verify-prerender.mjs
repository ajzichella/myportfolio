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
  ["/about/index.html", ["about-who-heading", "DigitalOcean"], ["id=\"home\""]],
  [
    "/case-studies/custom-roles/index.html",
    ["cr-scope-heading", "custom"],
    ["id=\"home\"", "password protected"],
  ],
  [
    "/case-studies/predefined-roles/index.html",
    ["rbac-results-heading", "RBAC"],
    ["id=\"home\""],
  ],
];

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
