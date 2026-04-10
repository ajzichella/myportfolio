/**
 * DigitalOcean App Platform serves this app at the domain root; force Vite base "/".
 * GitHub Pages uses `npm run build` (default base `./` — works for custom domain + /myportfolio/).
 */
import { spawnSync } from "node:child_process";

process.env.VITE_BASE = "/";
const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
