import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { PAW_PATH_D } from "../lib/pawPath";

const DPR = 1;
const MAX_FPS = 30;
const MIN_FRAME_MS = 1000 / MAX_FPS;

const GRID_SPACING = 52;
const PAW_SCALE = 0.7;
const PAW_NATIVE = 16;

const BASE_ALPHA = 0.03;
const GLOW_ALPHA = 0.92;
const GLOW_RADIUS = 178;
const GLOW_SCALE_BOOST = 1.68;

const WAVE_PERIOD_SEC = 3.5;
const WAVE_AMPLITUDE = 0.3;
const WAVE_WAVELENGTH = 240;

const GLOW_R = 0;
const GLOW_G = 174;
const GLOW_B = 239;

const AURORA_CYCLE_SEC = 16;

type PawCell = { cx: number; cy: number };

export function PawDotPattern({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const pawPath = new Path2D(PAW_PATH_D);

    const reducedMotionMq = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const isFrozen = () => reducedMotionMq.matches;

    let raf = 0;
    let lastDrawAt = 0;
    let logicalW = 1;
    let logicalH = 1;
    let cells: PawCell[] = [];
    const start = performance.now();

    function buildGrid() {
      cells = [];
      const cols = Math.ceil(logicalW / GRID_SPACING) + 1;
      const rows = Math.ceil(logicalH / GRID_SPACING) + 1;
      const offsetX = ((logicalW - (cols - 1) * GRID_SPACING) / 2);
      const offsetY = ((logicalH - (rows - 1) * GRID_SPACING) / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            cx: offsetX + c * GRID_SPACING,
            cy: offsetY + r * GRID_SPACING,
          });
        }
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      logicalW = Math.max(1, rect.width);
      logicalH = Math.max(1, rect.height);
      const cw = Math.floor(logicalW * DPR);
      const ch = Math.floor(logicalH * DPR);
      canvas!.width = cw;
      canvas!.height = ch;
      canvas!.style.width = `${logicalW}px`;
      canvas!.style.height = `${logicalH}px`;
      buildGrid();
    }

    function drawFrame(now: number) {
      const elapsed = now - lastDrawAt;
      if (elapsed < MIN_FRAME_MS) {
        raf = requestAnimationFrame(drawFrame);
        return;
      }
      lastDrawAt = now;

      const t = isFrozen() ? 0 : (now - start) / 1000;
      const mouse = mouseRef.current;

      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx!.clearRect(0, 0, logicalW, logicalH);

      // Draw all paws in white with high opacity for gradient masking
      ctx!.fillStyle = "rgba(255, 255, 255, 1)";
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        const wave =
          Math.sin(
            ((cell.cx + cell.cy) / WAVE_WAVELENGTH) * Math.PI * 2 -
              (t / WAVE_PERIOD_SEC) * Math.PI * 2,
          ) *
            0.5 +
          0.5;

        const baseAlphaForWave = BASE_ALPHA + wave * WAVE_AMPLITUDE;
        const scale = PAW_SCALE;

        ctx!.save();
        ctx!.globalAlpha = baseAlphaForWave;
        ctx!.translate(cell.cx, cell.cy);
        ctx!.scale(scale, scale);
        ctx!.translate(-PAW_NATIVE / 2, -PAW_NATIVE / 2);
        ctx!.fill(pawPath);
        ctx!.restore();
      }

      // Apply vibrant animated aurora gradient, masked to paws
      // Shift gradient using position offset for smooth background-position-like animation
      const positionOffset = ((t / AURORA_CYCLE_SEC) % 1) * 2 - 1;
      const x0 = logicalW * (0.5 + positionOffset * 0.4);
      const y0 = logicalH * (positionOffset > 0 ? 0.8 - positionOffset * 0.6 : 0.2 + positionOffset * 0.6);
      const x1 = logicalW * (0.5 - positionOffset * 0.4);
      const y1 = logicalH * (positionOffset > 0 ? 0.2 + positionOffset * 0.6 : 0.8 - positionOffset * 0.6);

      const grad = ctx!.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, "rgba(255, 36, 0, 0.9)");       // red
      grad.addColorStop(0.14, "rgba(232, 29, 29, 0.85)");   // crimson
      grad.addColorStop(0.28, "rgba(232, 183, 29, 0.85)");  // gold
      grad.addColorStop(0.42, "rgba(29, 232, 64, 0.85)");   // green
      grad.addColorStop(0.57, "rgba(29, 221, 232, 0.85)");  // cyan
      grad.addColorStop(0.71, "rgba(43, 29, 232, 0.9)");    // blue
      grad.addColorStop(0.85, "rgba(221, 0, 243, 0.9)");    // magenta
      grad.addColorStop(1, "rgba(255, 36, 0, 0.9)");        // red again

      ctx!.globalCompositeOperation = "source-in";
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, logicalW, logicalH);
      ctx!.globalCompositeOperation = "source-over";

      // Redraw cursor glow paws in cyan on top
      if (mouse.active) {
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const dx = cell.cx - mouse.x;
          const dy = cell.cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const glowT = Math.max(0, 1 - dist / GLOW_RADIUS);

          if (glowT > 0.01) {
            const scale = PAW_SCALE * (1 + glowT * (GLOW_SCALE_BOOST - 1));
            const alpha = glowT * GLOW_ALPHA;
            const rim = 0.55 + glowT * 0.45;
            const blur = 5 + glowT * 16;

            ctx!.save();
            ctx!.globalAlpha = alpha;
            ctx!.translate(cell.cx, cell.cy);
            ctx!.scale(scale, scale);
            ctx!.translate(-PAW_NATIVE / 2, -PAW_NATIVE / 2);

            ctx!.lineJoin = "round";
            ctx!.lineCap = "round";
            ctx!.shadowBlur = blur;
            ctx!.shadowColor = `rgba(${GLOW_R}, ${GLOW_G + 40}, ${Math.min(255, GLOW_B + 20)}, ${0.55 + glowT * 0.4})`;
            ctx!.strokeStyle = `rgba(200, 248, 255, ${rim})`;
            ctx!.lineWidth = 1.35 + glowT * 0.85;
            ctx!.stroke(pawPath);

            ctx!.shadowBlur = 0;
            ctx!.fillStyle = "rgba(0, 210, 255, 1)";
            ctx!.fill(pawPath);
            ctx!.restore();
          }
        }
      }

      raf = requestAnimationFrame(drawFrame);
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(drawFrame);
        } else {
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    raf = requestAnimationFrame(drawFrame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside =
        x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = inside;
    };

    const onLeave = () => {
      mouseRef.current.active = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("pointer-events-auto absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
