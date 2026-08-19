/**
 * Post-build static HTML for each route so ATS crawlers and no-JS clients see content.
 * Requires `npm run build` first (use VITE_BASE=/ so deep routes load assets).
 */
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PRERENDER_ROUTES } from "./sitemap-routes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const port = 4173;
const origin = `http://127.0.0.1:${port}`;

/** Unique markers that appear after the correct route has rendered. */
const ROUTE_READY = {
  "/": "#home",
  "/case-studies": '[aria-label="Filter case studies by topic"]',
  "/kind-words": "#kind-words-board-heading",
  "/about": "#about-who-heading",
  "/case-studies/predefined-roles": "#rbac-results-heading",
  "/case-studies/custom-roles": "#cr-scope-heading",
  "/case-studies/kafka": "#kafka-scope-heading",
  "/case-studies/enhanced-checkout": "#checkout-scope-heading",
};

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.slice(1), "index.html");
}

function startServer() {
  const serveBin = join(root, "node_modules", "serve", "build", "main.js");
  if (!existsSync(serveBin)) {
    throw new Error("Missing serve — run npm install");
  }
  if (!existsSync(dist)) {
    throw new Error("Missing dist/ — run npm run build first");
  }

  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.execPath,
      [serveBin, "-s", "dist", "--no-port-switching", "-l", String(port)],
      { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
    );

    const onReady = (chunk) => {
      const text = String(chunk);
      if (text.includes("Accepting connections") || text.includes("http://")) {
        resolve(proc);
      }
    };

    proc.stdout?.on("data", onReady);
    proc.stderr?.on("data", onReady);
    proc.on("error", reject);
    setTimeout(() => resolve(proc), 4000);
  });
}

async function waitForPageContent(page, route) {
  const selector = ROUTE_READY[route];
  if (!selector) {
    throw new Error(`Missing ROUTE_READY selector for ${route}`);
  }

  await page.waitForSelector(selector, { timeout: 90_000 });
  await page.waitForSelector("footer.site-footer", { timeout: 90_000 });

  if (route !== "/") {
    await page.waitForFunction(
      () => !document.querySelector("#home"),
      undefined,
      { timeout: 45_000 },
    );
  }

  await page.waitForTimeout(600);
}

/** Keep prerender text for crawlers; leave #root empty so React does not fight hydrated markup. */
async function captureCrawlerHtml(page) {
  return page.evaluate(() => {
    document
      .querySelectorAll('link[href*="127.0.0.1"]')
      .forEach((el) => el.remove());

    const root = document.getElementById("root");
    if (root && root.childElementCount > 0) {
      const crawler = document.createElement("div");
      crawler.id = "crawler-fallback";
      crawler.hidden = true;
      crawler.setAttribute("aria-hidden", "true");
      while (root.firstChild) {
        crawler.appendChild(root.firstChild);
      }
      root.after(crawler);
    }

    return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
  });
}

async function main() {
  const shellHtml = readFileSync(join(dist, "index.html"), "utf8");

  const restoreShell = () => {
    writeFileSync(join(dist, "index.html"), shellHtml, "utf8");
  };

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (url.includes("contentsquare.net")) {
      return route.abort();
    }
    return route.continue();
  });

  try {
    for (const route of PRERENDER_ROUTES) {
      restoreShell();

      const page = await context.newPage();
      page.on("pageerror", (error) => {
        console.warn(`[prerender] ${route} page error:`, error.message);
      });

      await page.goto(`${origin}${route}`, {
        waitUntil: "load",
        timeout: 120_000,
      });
      await waitForPageContent(page, route);

      const html = await captureCrawlerHtml(page);
      const out = routeToFile(route);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html, "utf8");
      console.log(
        `[prerender] ${route} → ${out.replace(root + "\\", "").replace(root + "/", "")}`,
      );
      await page.close();
    }

    writeFileSync(join(dist, "404.html"), shellHtml, "utf8");
    console.log("[prerender] wrote dist/404.html SPA shell for non-prerender routes");
  } finally {
    await context.close();
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("[prerender] failed:", error);
  process.exit(1);
});
