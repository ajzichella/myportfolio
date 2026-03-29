import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

let __blobPerfInstanceSeq = 0;

const DPR_CAP = 2;
/** Cap backing-store size so a tall parent (e.g. long page section) cannot allocate multi–100MB canvases. */
const MAX_CANVAS_PIXELS = 10_000_000;

/** Keep glow from bleeding into the top band (e.g. section header / area under hero). */
const TOP_PAD_FRAC = 0.04;
const BOTTOM_PAD_FRAC = 0.006;
/** Minimal — glow can reach very close to left/right edges (still clears by R). */
const SIDE_PAD_FRAC = 0.001;

type BokehOrb = {
  nx: number;
  ny: number;
  /** Radius as fraction of min(width, height); softness comes from `stops`, not radius. */
  radiusMin: number;
  r: number;
  g: number;
  b: number;
  /** createRadialGradient stops: t in [0,1], alpha (same rgb) */
  stops: readonly [number, number][];
  /** Drift amplitude as fraction of width / height */
  ampX: number;
  ampY: number;
  periodSec: number;
  phase: number;
  /** Alpha pulse period (seconds); desync across orbs for organic shimmer. */
  pulsePeriodSec: number;
  /** How strongly alpha breathes around 1 (e.g. 0.28 → multiplier roughly 0.72–1.28 before final clamp). */
  pulseAmp: number;
};

/**
 * Single canvas @ devicePixelRatio (capped). Fewer, larger bokeh orbs; motion is
 * clamped so discs (including radial falloff) stay out of the top of the panel.
 * Anchors skew toward the bottom of the panel so the field reads stronger at the page end.
 */
const ORBS: readonly BokehOrb[] = [
  {
    nx: 0.014,
    ny: 0.56,
    radiusMin: 0.44,
    r: 82,
    g: 39,
    b: 255,
    stops: [
      [0, 0.34],
      [0.15, 0.2],
      [0.3, 0.12],
      [0.45, 0.065],
      [0.58, 0.032],
      [0.72, 0.014],
      [0.85, 0.005],
      [1, 0],
    ],
    ampX: 0.072,
    ampY: 0.036,
    periodSec: 15,
    phase: 0,
    pulsePeriodSec: 6.2,
    pulseAmp: 0.28,
  },
  {
    nx: 0.986,
    ny: 0.57,
    radiusMin: 0.5,
    r: 0,
    g: 174,
    b: 239,
    stops: [
      [0, 0.28],
      [0.18, 0.16],
      [0.34, 0.09],
      [0.5, 0.045],
      [0.65, 0.02],
      [0.8, 0.007],
      [1, 0],
    ],
    ampX: 0.082,
    ampY: 0.032,
    periodSec: 18,
    phase: 1.4,
    pulsePeriodSec: 7.8,
    pulseAmp: 0.24,
  },
  {
    nx: 0.5,
    ny: 0.76,
    radiusMin: 0.26,
    r: 75,
    g: 166,
    b: 179,
    stops: [
      [0, 0.28],
      [0.2, 0.14],
      [0.38, 0.075],
      [0.55, 0.035],
      [0.72, 0.014],
      [0.88, 0.004],
      [1, 0],
    ],
    ampX: 0.056,
    ampY: 0.03,
    periodSec: 12,
    phase: 2.2,
    pulsePeriodSec: 5.4,
    pulseAmp: 0.32,
  },
  {
    nx: 0.012,
    ny: 0.965,
    radiusMin: 0.38,
    r: 82,
    g: 39,
    b: 255,
    stops: [
      [0, 0.24],
      [0.17, 0.14],
      [0.34, 0.075],
      [0.52, 0.034],
      [0.68, 0.014],
      [0.84, 0.005],
      [1, 0],
    ],
    ampX: 0.065,
    ampY: 0.034,
    periodSec: 14,
    phase: 0.6,
    pulsePeriodSec: 8.5,
    pulseAmp: 0.26,
  },
  {
    nx: 0.988,
    ny: 0.96,
    radiusMin: 0.32,
    r: 0,
    g: 174,
    b: 239,
    stops: [
      [0, 0.26],
      [0.2, 0.13],
      [0.4, 0.065],
      [0.58, 0.028],
      [0.76, 0.01],
      [1, 0],
    ],
    ampX: 0.062,
    ampY: 0.027,
    periodSec: 13,
    phase: 3.1,
    pulsePeriodSec: 6.9,
    pulseAmp: 0.25,
  },
];

function clampOrbCenter(
  cx: number,
  cy: number,
  R: number,
  w: number,
  h: number,
  /** Lets orb centers sit lower (fraction of h added to maxCy); glow can extend past canvas bottom. */
  bottomExtentFrac = 0,
): { cx: number; cy: number } {
  const minCx = R + w * SIDE_PAD_FRAC;
  const maxCx = w - R - w * SIDE_PAD_FRAC;
  const minCy = R + h * TOP_PAD_FRAC;
  const maxCy = Math.min(
    h + R * 0.55,
    h - R - h * BOTTOM_PAD_FRAC + h * bottomExtentFrac,
  );

  let nx = cx;
  let ny = cy;
  if (maxCx >= minCx) {
    nx = Math.min(maxCx, Math.max(minCx, cx));
  } else {
    nx = w / 2;
  }
  if (maxCy >= minCy) {
    ny = Math.min(maxCy, Math.max(minCy, cy));
  } else {
    ny = h / 2;
  }
  return { cx: nx, cy: ny };
}

export type BlobBackgroundProps = {
  /** Multiplies orb radii (same gradient quality, larger discs). Default 1. */
  radiusScale?: number;
  /** Multiplies each gradient stop alpha (clamped to 1). Default 1. */
  alphaScale?: number;
  /** Shifts orb anchor positions right (+) or left (-) in normalized canvas space [0,1]. Default 0. */
  nxShift?: number;
  /** Shifts orb anchors down (+) or up (-) in normalized canvas space (fraction of height). Default 0. */
  nyShift?: number;
  /**
   * Relaxes the bottom clamp so centers can move down (fraction of canvas height).
   * Needed when `nyShift` would otherwise hit the old maxCy ceiling with no visible change.
   */
  bottomExtentFrac?: number;
  /** Cap device pixel ratio for the canvas (e.g. `1` on dense listing pages). */
  dprCap?: number;
  /** Limit redraw rate; motion stays visible but cheaper (e.g. `24` with glass cards above). */
  maxFps?: number;
  className?: string;
};

/** Same layout + tuning as CaseStudyPredefinedRoles: full-viewport fixed canvas behind page content. */
export function FixedBlobBackdrop(props: BlobBackgroundProps = {}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 w-full overflow-hidden bg-black"
      aria-hidden
    >
      <BlobBackground
        radiusScale={1.35}
        alphaScale={0.78}
        maxFps={24}
        dprCap={1}
        {...props}
      />
    </div>
  );
}

/** Preset for Home / About: softer than case-study pages, field pulled toward lower viewport. */
export const SOFT_FIXED_BLOB_PRESET: BlobBackgroundProps = {
  alphaScale: 0.68,
  radiusScale: 1.26,
  nyShift: 0.42,
  bottomExtentFrac: 0.38,
};

export function BlobBackground({
  radiusScale = 1,
  alphaScale = 1,
  nxShift = 0,
  nyShift = 0,
  bottomExtentFrac = 0,
  dprCap,
  maxFps,
  className,
}: BlobBackgroundProps = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // Do not use `desynchronized: true`: it trades vsync for latency and causes
    // visible tearing/flicker on some GPUs, external monitors, and Windows compositor setups.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reducedMotionMq = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const isFrozen = () => reducedMotionMq.matches;

    const blobInstanceId = ++__blobPerfInstanceSeq;
    let raf = 0;
    let logicalW = 1;
    let logicalH = 1;
    let dpr = 1;
    let start = performance.now();
    const minFrameMs =
      typeof maxFps === "number" && maxFps > 0 ? 1000 / maxFps : 0;
    let lastDrawAt = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      logicalW = Math.max(1, rect.width);
      logicalH = Math.max(1, rect.height);
      let dprLocal = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      if (typeof dprCap === "number" && dprCap > 0) {
        dprLocal = Math.min(dprLocal, dprCap);
      }
      let cw = Math.floor(logicalW * dprLocal);
      let ch = Math.floor(logicalH * dprLocal);
      const px = cw * ch;
      if (px > MAX_CANVAS_PIXELS) {
        const scale = Math.sqrt(MAX_CANVAS_PIXELS / px);
        cw = Math.max(1, Math.floor(cw * scale));
        ch = Math.max(1, Math.floor(ch * scale));
        dprLocal = cw / logicalW;
      }
      dpr = dprLocal;
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = `${logicalW}px`;
      canvas.style.height = `${logicalH}px`;

    };

    const drawFrame = (now: number) => {
      const t = isFrozen() ? 0 : (now - start) / 1000;
      const w = logicalW;
      const h = logicalH;
      const m = Math.min(w, h);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      for (const o of ORBS) {
        const ang = t * ((2 * Math.PI) / o.periodSec) + o.phase;
        const nx = Math.min(1, Math.max(0, o.nx + nxShift));
        const rawCx =
          nx * w +
          Math.sin(ang) * o.ampX * w +
          Math.sin(ang * 2.17 + o.phase * 1.3) * o.ampX * 0.22 * w;
        const rawCy =
          (o.ny + nyShift) * h +
          Math.cos(ang * 0.87) * o.ampY * h +
          Math.cos(ang * 1.93 + o.phase) * o.ampY * 0.2 * h;
        const pulseRaw =
          1 +
          o.pulseAmp *
            Math.sin(
              (t * 2 * Math.PI) / o.pulsePeriodSec + o.phase * 1.7,
            );
        const pulseMul = Math.max(0.68, Math.min(1.34, pulseRaw));
        const R =
          o.radiusMin *
          m *
          radiusScale *
          (1 + 0.045 * Math.sin((t * 2 * Math.PI) / (o.pulsePeriodSec * 1.4) + o.phase));
        const { cx, cy } = clampOrbCenter(
          rawCx,
          rawCy,
          R,
          w,
          h,
          bottomExtentFrac,
        );
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        for (const [pos, a] of o.stops) {
          const alpha = Math.min(1, a * alphaScale * pulseMul);
          g.addColorStop(pos, `rgba(${o.r},${o.g},${o.b},${alpha})`);
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (!isFrozen()) {
        raf = requestAnimationFrame(loop);
      }
      if (minFrameMs > 0 && lastDrawAt > 0 && now - lastDrawAt < minFrameMs) {
        return;
      }
      lastDrawAt = now;
      drawFrame(now);
    };

    const kick = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      lastDrawAt = 0;
      if (isFrozen()) {
        drawFrame(performance.now());
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(wrap);
    resize();
    kick();

    const onReducedMotionChange = () => {
      start = performance.now();
      kick();
    };
    reducedMotionMq.addEventListener("change", onReducedMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      reducedMotionMq.removeEventListener("change", onReducedMotionChange);
    };
  }, [radiusScale, alphaScale, nxShift, nyShift, bottomExtentFrac, dprCap, maxFps]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black",
        className,
      )}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
