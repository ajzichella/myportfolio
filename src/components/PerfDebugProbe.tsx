import { useEffect } from "react";
import { debugAgentLog } from "../lib/debugAgentLog";

/**
 * Dev-only: samples main-thread health (long tasks + rAF deltas) per route.
 * Hypotheses: H_longtask, H_frame_jitter, H_nav_context.
 */
export function PerfDebugProbe({ pathname }: { pathname: string }) {
  useEffect(() => {
    const runId = `run-${Date.now()}`;

    // #region agent log
    debugAgentLog({
      runId,
      hypothesisId: "H_nav_context",
      location: "PerfDebugProbe.tsx:mount",
      message: "route_sample_start",
      data: {
        pathname,
        dpr: window.devicePixelRatio,
        innerW: window.innerWidth,
        innerH: window.innerHeight,
      },
    });
    // #endregion

    let obs: PerformanceObserver | null = null;
    try {
      obs = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          // #region agent log
          debugAgentLog({
            runId,
            hypothesisId: "H_longtask",
            location: "PerfDebugProbe.tsx:PerformanceObserver",
            message: "longtask",
            data: {
              pathname,
              duration: e.duration,
              name: e.name,
              startTime: e.startTime,
            },
          });
          // #endregion
        }
      });
      obs.observe({ type: "longtask", buffered: true } as PerformanceObserverInit);
    } catch {
      // Long Task API not supported
    }

    let frames = 0;
    let last = performance.now();
    const deltas: number[] = [];
    let raf = 0;

    const sampleLoop = (now: number) => {
      const d = now - last;
      last = now;
      if (frames > 0) deltas.push(d);
      frames += 1;
      if (frames <= 120) {
        raf = requestAnimationFrame(sampleLoop);
      } else {
        const sorted = [...deltas].sort((a, b) => a - b);
        const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
        const max = sorted[sorted.length - 1] ?? 0;
        const mean =
          deltas.length > 0
            ? deltas.reduce((a, b) => a + b, 0) / deltas.length
            : 0;
        // #region agent log
        debugAgentLog({
          runId,
          hypothesisId: "H_frame_jitter",
          location: "PerfDebugProbe.tsx:raf_sample",
          message: "raf_frame_deltas_sample",
          data: {
            pathname,
            sampleFrames: deltas.length,
            meanDeltaMs: mean,
            p95DeltaMs: p95,
            maxDeltaMs: max,
          },
        });
        // #endregion
      }
    };

    raf = requestAnimationFrame(sampleLoop);

    return () => {
      obs?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
