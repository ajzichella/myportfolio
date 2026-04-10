import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react-swc";

/**
 * Base URL for built assets.
 * - Default `./` works for both custom domain (site at `/`) and project Pages (`/myportfolio/`).
 * - `VITE_BASE=/myportfolio/` if you only deploy to the github.io subpath.
 * - `VITE_BASE=/` for root-only hosts (e.g. DigitalOcean App Platform).
 */
function vitePublicBase(): string {
  const raw = process.env.VITE_BASE;
  if (raw === undefined || raw === "") return "./";
  let b = raw.trim();
  if (b === "./" || b === ".") return "./";
  if (!b.startsWith("/")) b = `/${b}`;
  return b === "/" ? "/" : b.endsWith("/") ? b : `${b}/`;
}

export default defineConfig({
  base: vitePublicBase(),
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        "C:/Users/AJ/.cursor/projects/c-Users-AJ-Documents-GitHub-myportfolio/assets",
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/")
          ) {
            return "react-vendor";
          }
          if (id.includes("react-router")) {
            return "router";
          }
          if (id.includes("motion")) {
            return "motion";
          }
          if (id.includes("lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
