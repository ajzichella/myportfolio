import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/myportfolio/",
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
