/**
 * DigitalOcean App Platform sets PORT and prunes devDependencies before run.
 * Serves `dist/` with `serve` (production dependency).
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT || "3000";
const serveBin = join(root, "node_modules", "serve", "build", "main.js");
const distDir = join(root, "dist");

if (!existsSync(serveBin)) {
  console.error("[start-production] missing serve at", serveBin);
  process.exit(1);
}
if (!existsSync(distDir)) {
  console.error("[start-production] missing dist/ — run npm run build first");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    serveBin,
    "-s",
    "dist",
    // App Platform health checks $PORT; serve otherwise picks another port if busy (silent mismatch → terminated).
    "--no-port-switching",
    "-l",
    `tcp://0.0.0.0:${port}`,
  ],
  { stdio: "inherit", cwd: root }
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
