/**
 * Production build for ajzichella.com (root-hosted). Absolute asset paths (`/assets/…`)
 * are required so deep BrowserRouter URLs load JS correctly.
 */
import { spawnSync } from "node:child_process";

if (!process.env.VITE_BASE) {
  process.env.VITE_BASE = "/";
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npm", ["exec", "--", "vite", "build"]);
run("node", ["scripts/prerender.mjs"]);
run("node", ["scripts/verify-prerender.mjs"]);
run("node", ["scripts/verify-resume.mjs"]);
