import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEBUG_LOG = path.join(__dirname, "debug-be930d.log");

function debugIngestPlugin() {
  return {
    name: "debug-ingest",
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || !req.url?.includes("__debug-ingest")) {
          next();
          return;
        }
        let body = "";
        req.on("data", (c: Buffer) => {
          body += c.toString();
        });
        req.on("end", () => {
          try {
            const line = body.trim();
            if (line) fs.appendFileSync(DEBUG_LOG, `${line}\n`);
          } catch {
            void 0;
          }
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  base: "/myportfolio/",
  plugins: [react(), debugIngestPlugin()],
  server: {
    port: 5173,
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
          if (id.includes("three")) {
            return "three";
          }
          if (id.includes("lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});

