/** BrowserRouter basename aligned with Vite `base` (custom domain vs /myportfolio/). */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "./" || base === "." || base === "/") {
    return undefined;
  }
  const trimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  return trimmed || undefined;
}
