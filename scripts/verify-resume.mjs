import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PRERENDER_ROUTES, SITEMAP_ROUTES } from "./sitemap-routes.mjs";

const dist = "dist";
const publicDir = "public";

function read(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${path}`);
  }
  return readFileSync(path, "utf8");
}

let failed = false;

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
}

function ok(message) {
  console.log(`OK ${message}`);
}

const resumePath = existsSync(join(dist, "resume.txt"))
  ? join(dist, "resume.txt")
  : join(publicDir, "resume.txt");
const llmsPath = existsSync(join(dist, "llms.txt"))
  ? join(dist, "llms.txt")
  : join(publicDir, "llms.txt");

const resume = read(resumePath);
const llms = read(llmsPath);

const requiredSections = [
  "SUMMARY",
  "CURRENT ROLE",
  "PRIOR EXPERIENCE",
  "SELECTED WORK",
  "SKILLS & TOOLS",
  "CERTIFICATIONS",
  "AVAILABILITY",
];

for (const section of requiredSections) {
  if (!resume.includes(section)) {
    fail(`resume.txt missing section: ${section}`);
  }
}
if (!failed) ok("resume.txt sections");

for (const route of PRERENDER_ROUTES) {
  if (route === "/") continue;
  const url = `https://ajzichella.com${route}`;
  if (!resume.includes(url) && !llms.includes(url)) {
    fail(`resume.txt or llms.txt missing URL: ${url}`);
  }
}

if (resume.includes("ddos-protection")) {
  fail("resume.txt must not include ddos-protection case study content");
} else {
  ok("resume.txt excludes password-gated DDoS");
}

if (!llms.includes("resume.txt")) {
  fail("llms.txt must link to resume.txt");
} else {
  ok("llms.txt links resume.txt");
}

if (!/https:\/\/ajzichella\.com\/#\//.test(llms)) {
  ok("llms.txt avoids hash URLs in links");
} else {
  fail("llms.txt should not promote hash URLs");
}

if (SITEMAP_ROUTES.length < 9) {
  fail("sitemap route list shorter than expected");
}

process.exit(failed ? 1 : 0);
