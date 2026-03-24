const SESSION = "be930d";

/** Dev-only: POSTs NDJSON to Vite middleware → `debug-be930d.log` at repo root. */
export function debugAgentLog(payload: Record<string, unknown>) {
  if (!import.meta.env.DEV) return;
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const url = `${base}__debug-ingest`;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION,
    },
    body: JSON.stringify({
      sessionId: SESSION,
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});
}
