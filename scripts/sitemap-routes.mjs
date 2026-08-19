/** Keep in sync with public/sitemap.xml and src/App.tsx */
export const SITEMAP_ROUTES = [
  "/",
  "/case-studies",
  "/kind-words",
  "/about",
  "/case-studies/predefined-roles",
  "/case-studies/custom-roles",
  "/case-studies/kafka",
  "/case-studies/ddos-protection",
  "/case-studies/enhanced-checkout",
];

/** Password-gated — SPA only (dist/404.html shell), not static prerender. */
export const PRERENDER_SKIP = new Set(["/case-studies/ddos-protection"]);

export const PRERENDER_ROUTES = SITEMAP_ROUTES.filter(
  (route) => !PRERENDER_SKIP.has(route),
);
