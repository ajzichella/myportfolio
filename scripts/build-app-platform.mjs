/**
 * DigitalOcean App Platform serves this app at the domain root; Vite must use base "/".
 * GitHub Pages keeps using `npm run build` (default base /myportfolio/).
 */
import { spawnSync } from "node:child_process";

process.env.VITE_BASE = "/";
const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
