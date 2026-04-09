/**
 * DigitalOcean App Platform sets PORT and prunes devDependencies before run.
 * Serves `dist/` with `serve` (production dependency).
 */
import { spawn } from "node:child_process";
import { existsSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT || "3000";
const serveBin = join(root, "node_modules", "serve", "build", "main.js");
const distDir = join(root, "dist");
const logPath = join(root, "debug-aace76.log");

// #region agent log
function agentLog(message, data, hypothesisId) {
  const line = JSON.stringify({
    sessionId: "aace76",
    timestamp: Date.now(),
    location: "start-production.mjs",
    message,
    data,
    hypothesisId,
    runId: process.env.DEBUG_RUN_ID || "pre-fix",
  });
  appendFileSync(logPath, `${line}\n`);
  fetch("http://127.0.0.1:7919/ingest/d2b52fce-e44b-4bd5-9cb5-34c9b8e54618", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "aace76",
    },
    body: line,
  }).catch(() => {});
}
// #endregion

// #region agent log
const distExists = existsSync(distDir);
const serveBinExists = existsSync(serveBin);
agentLog("startup checks", {
  port,
  cwd: process.cwd(),
  root,
  distExists,
  serveBinExists,
  rssMb: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
}, "H1-H2-H5");
// #endregion

if (!serveBinExists) {
  // #region agent log
  agentLog("abort: serve binary missing", { serveBin }, "H1");
  // #endregion
  console.error("[start-production] missing serve at", serveBin);
  process.exit(1);
}
if (!distExists) {
  // #region agent log
  agentLog("abort: dist missing", { distDir }, "H1");
  // #endregion
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

// #region agent log
child.on("error", (err) => {
  agentLog("spawn error", { message: err.message, code: err.code }, "H5");
});
child.on("spawn", () => {
  agentLog("serve spawned", { pid: child.pid, port }, "H2");
});
// #endregion

child.on("exit", (code, signal) => {
  // #region agent log
  agentLog("serve exit", { code, signal }, "H5");
  // #endregion
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
