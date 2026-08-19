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
import {
  PRERENDER_ROUTES,
  routeToTxtRelPath,
  routeToTxtUrl,
} from "./sitemap-routes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const SITE = "https://ajzichella.com";

/** Off-screen but parser-readable — no hidden, aria-hidden, or clip rect. */
const CRAWLER_OFFSCREEN_STYLE =
  "position:absolute;left:-9999px;top:0;width:900px;max-width:900px;height:auto;overflow:visible;white-space:normal;margin:0;padding:0;border:0;clip:auto;";

/** Visible until React mounts — avoids a blank black screen when JS is slow or fails. */
const APP_BOOT_HTML =
  '<div id="app-boot" class="flex min-h-screen items-center justify-center bg-black px-6 text-sm text-slate-500" aria-live="polite">Loading…</div>';

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

const ROUTE_META = {
  "/": {
    title: "AJ Zichella · Product Design Leader",
    description:
      "AJ Zichella — senior product designer and design engineer. IAM/RBAC at DigitalOcean, developer platforms, and retail eCommerce. Plain-text profile: /resume.txt",
    canonical: `${SITE}/`,
  },
  "/case-studies": {
    title: "Case Studies · AJ Zichella",
    description:
      "Product design case studies: DigitalOcean IAM/RBAC, Managed Kafka, and STORIS eCommerce checkout.",
    canonical: `${SITE}/case-studies`,
  },
  "/kind-words": {
    title: "Kind Words · AJ Zichella",
    description:
      "Peer feedback and testimonials about AJ Zichella's product design and leadership work.",
    canonical: `${SITE}/kind-words`,
  },
  "/about": {
    title: "About · AJ Zichella",
    description:
      "About AJ Zichella — experience at DigitalOcean, STORIS, and AMD; skills, certifications, and design approach.",
    canonical: `${SITE}/about`,
  },
  "/case-studies/predefined-roles": {
    title: "RBAC Predefined Roles · AJ Zichella",
    description:
      "Case study: DigitalOcean RBAC predefined roles — 3 new roles, 23% MoM growth in security experience usage.",
    canonical: `${SITE}/case-studies/predefined-roles`,
  },
  "/case-studies/custom-roles": {
    title: "RBAC Custom Roles · AJ Zichella",
    description:
      "Case study: DigitalOcean IAM custom roles — guided creation flow, ~5,000 assignments after launch.",
    canonical: `${SITE}/case-studies/custom-roles`,
  },
  "/case-studies/kafka": {
    title: "Managed Kafka · AJ Zichella",
    description:
      "Case study: DigitalOcean Managed Kafka — simplified topic management and reliable data environment.",
    canonical: `${SITE}/case-studies/kafka`,
  },
  "/case-studies/enhanced-checkout": {
    title: "Enhanced Checkout · AJ Zichella",
    description:
      "Case study: STORIS eCommerce checkout redesign — streamlined flow, increased conversions and revenue.",
    canonical: `${SITE}/case-studies/enhanced-checkout`,
  },
};

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.slice(1), "index.html");
}

function routeToTxtFile(route) {
  return join(dist, routeToTxtRelPath(route));
}

async function extractPageText(page, route) {
  const meta = ROUTE_META[route];
  const mainText = await page.evaluate(() => {
    const main = document.getElementById("main-scroll");
    if (!main) return "";
    const clone = main.cloneNode(true);
    clone.querySelector("footer.site-footer")?.remove();

    const blocks = clone.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, td, th, label, button",
    );
    const lines = [];
    const seen = new Set();

    for (const el of blocks) {
      const text = el.innerText.replace(/\s+/g, " ").trim();
      if (!text || seen.has(text)) continue;
      seen.add(text);
      lines.push(text);
    }

    if (lines.length > 0) {
      return lines.join("\n\n");
    }

    return clone.innerText.replace(/\n{3,}/g, "\n\n").trim();
  });

  const canonical = meta?.canonical ?? `${SITE}${route === "/" ? "/" : route}`;
  const title = meta?.title ?? route;

  return [
    title,
    `Canonical: ${canonical}`,
    `Plain-text mirror: ${routeToTxtUrl(route)}`,
    "Automated readers only — not shown in the live site UI.",
    "",
    mainText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim(),
    "",
  ].join("\n");
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
async function captureCrawlerHtml(page, route) {
  const meta = ROUTE_META[route];
  const txtUrl = routeToTxtUrl(route);
  return page.evaluate(
    ({ offscreenStyle, meta: routeMeta, txtMirrorUrl, appBootHtml }) => {
      document
        .querySelectorAll('link[href*="127.0.0.1"]')
        .forEach((el) => el.remove());

      if (routeMeta) {
        document.title = routeMeta.title;

        const setMeta = (key, content, property = false) => {
          const attr = property ? "property" : "name";
          let el = document.querySelector(`meta[${attr}="${key}"]`);
          if (!el) {
            el = document.createElement("meta");
            el.setAttribute(attr, key);
            document.head.appendChild(el);
          }
          el.setAttribute("content", content);
        };

        setMeta("description", routeMeta.description);
        setMeta("og:title", routeMeta.title, true);
        setMeta("og:description", routeMeta.description, true);
        setMeta("og:url", routeMeta.canonical, true);
        setMeta("twitter:title", routeMeta.title);
        setMeta("twitter:description", routeMeta.description);

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
          canonical = document.createElement("link");
          canonical.rel = "canonical";
          document.head.appendChild(canonical);
        }
        canonical.href = routeMeta.canonical;

        let alt = document.querySelector('link[rel="alternate"][type="text/plain"]');
        if (!alt) {
          alt = document.createElement("link");
          alt.rel = "alternate";
          alt.type = "text/plain";
          document.head.appendChild(alt);
        }
        alt.href = txtMirrorUrl;
        alt.title = "Plain-text mirror for automated readers";
      }

      const root = document.getElementById("root");
      if (root && root.childElementCount > 0) {
        const crawler = document.createElement("article");
        crawler.id = "crawler-fallback";
        crawler.setAttribute(
          "aria-label",
          "Static page content for search engines and automated readers",
        );
        crawler.style.cssText = offscreenStyle;
        const snapshot = root.cloneNode(true);
        snapshot.removeAttribute("id");
        snapshot.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        crawler.appendChild(snapshot);
        root.replaceChildren();
        root.innerHTML = appBootHtml;
        root.after(crawler);
      }

      return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
    },
    {
      offscreenStyle: CRAWLER_OFFSCREEN_STYLE,
      meta,
      txtMirrorUrl: txtUrl,
      appBootHtml: APP_BOOT_HTML,
    },
  );
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

  /** Homepage is written last — restoreShell() resets index.html before each route. */
  let homeHtml = null;

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

      const pageText = await extractPageText(page, route);
      const txtOut = routeToTxtFile(route);
      mkdirSync(dirname(txtOut), { recursive: true });
      writeFileSync(txtOut, pageText, "utf8");
      console.log(
        `[prerender] ${route} → ${txtOut.replace(root + "\\", "").replace(root + "/", "")}`,
      );

      const html = await captureCrawlerHtml(page, route);
      const out = routeToFile(route);

      if (route === "/") {
        homeHtml = html;
      } else {
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, html, "utf8");
        console.log(
          `[prerender] ${route} → ${out.replace(root + "\\", "").replace(root + "/", "")}`,
        );
      }

      await page.close();
    }

    if (homeHtml) {
      writeFileSync(join(dist, "index.html"), homeHtml, "utf8");
      console.log("[prerender] / → dist/index.html");
    } else {
      throw new Error("Homepage prerender missing");
    }

    writeFileSync(join(dist, "404.html"), shellHtml, "utf8");
    console.log("[prerender] wrote dist/404.html SPA shell for non-prerender routes");

    const indexLines = [
      "AJ Zichella — plain-text page mirrors for bots and AI agents",
      "Append .txt to any public page path (home: /home.txt). Not shown in the live UI.",
      "",
      ...PRERENDER_ROUTES.map((route) => routeToTxtUrl(route)),
      "",
      "Also: https://ajzichella.com/resume.txt",
      "Also: https://ajzichella.com/llms.txt",
      "Also: https://ajzichella.com/hiring.md",
      "",
    ];
    writeFileSync(join(dist, "pages-index.txt"), indexLines.join("\n"), "utf8");
    console.log("[prerender] wrote dist/pages-index.txt");
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
