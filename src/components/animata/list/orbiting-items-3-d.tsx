import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  siAtlassian,
  siCursor,
  siGithub,
  siLooker,
  type SimpleIcon,
} from "simple-icons";
import { debugAgentLog } from "../../../lib/debugAgentLog";
import { cn } from "../../../lib/utils";

const assetBase = import.meta.env.BASE_URL;

/** Match Home case-study / hero tooltips: gray panel, cyan border, above trigger. */
const orbitTooltipShadow =
  "shadow-[0_0_18px_rgba(0,174,239,0.12),0_6px_24px_rgba(0,0,0,0.22)] ring-1 ring-inset ring-[#00aeef]/18";

const orbitTooltipPanelClass = `pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-[110] w-max max-w-[min(22rem,calc(100vw-2rem))] sm:max-w-[28rem] -translate-x-1/2 rounded-xl border border-[#00aeef]/45 bg-[#999999] px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-slate-900 opacity-0 transition-opacity duration-200 group-hover/orbit:opacity-100 group-focus-within/orbit:opacity-100 sm:px-4 sm:py-3.5 ${orbitTooltipShadow}`;

export const CenterIcon = (
  <div
    className="z-0 flex h-32 w-32 shrink-0 animate-float items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-[#00aeef] to-blue-600 p-2.5 shadow-lg ring-1 ring-white/15"
    style={{
      boxShadow:
        "0 0 14px 5px rgba(0, 174, 239, 0.11), 0 0 18px 7px rgba(147, 51, 234, 0.07)",
    }}
  >
    <img
      src={`${assetBase}aj-orbit-center.png`}
      alt=""
      className="h-full w-full rounded-full object-cover"
    />
  </div>
);

/** Centers the logo only; outer orbit wrapper supplies the glass fill. */
function BrandOrbDisc({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <span
      className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      title={title}
    >
      {children}
    </span>
  );
}

function SimpleIconOrb({ icon }: { icon: SimpleIcon }) {
  return (
    <BrandOrbDisc title={icon.title}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        className="h-7 w-7"
        aria-hidden
      >
        <path fill={`#${icon.hex}`} d={icon.path} />
      </svg>
    </BrandOrbDisc>
  );
}

/** Full-color Figma mark. Paths from Wikimedia Commons Figma-logo.svg. */
function FigmaOrb() {
  return (
    <BrandOrbDisc title="Figma">
      <svg
        role="img"
        viewBox="0 0 200 300"
        className="aspect-[200/300] h-8 w-auto max-h-full"
        aria-hidden
      >
        <path
          fill="#0acf83"
          d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"
        />
        <path
          fill="#a259ff"
          d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"
        />
        <path
          fill="#f24e1e"
          d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"
        />
        <path
          fill="#ff7262"
          d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"
        />
        <path
          fill="#1abcfe"
          d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"
        />
      </svg>
    </BrandOrbDisc>
  );
}

/** Multicolor mark (Slack was removed from simple-icons). Paths from Wikimedia Commons Slack_icon_2019.svg. */
function SlackOrb() {
  return (
    <BrandOrbDisc title="Slack">
      <svg
        role="img"
        viewBox="0 0 127 127"
        className="h-8 w-8"
        aria-hidden
      >
        <path
          fill="#E01E5A"
          d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z"
        />
        <path
          fill="#36C5F0"
          d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z"
        />
        <path
          fill="#2EB67D"
          d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z"
        />
        <path
          fill="#ECB22E"
          d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z"
        />
      </svg>
    </BrandOrbDisc>
  );
}

export const OrbitBrandIcons: ReactNode[] = [
  <SimpleIconOrb key="cursor" icon={siCursor} />,
  <FigmaOrb key="figma" />,
  <SimpleIconOrb key="github" icon={siGithub} />,
  <SimpleIconOrb key="atlassian" icon={siAtlassian} />,
  <SimpleIconOrb key="looker" icon={siLooker} />,
  <SlackOrb key="slack" />,
];

export interface OrbitingItems3DProps {
  /**
   * The radius of the ellipse on X-axis in percentage, relative to the container.
   */
  radiusX?: number;
  /**
   * The radius of the ellipse on Y-axis in percentage, relative to the container.
   */
  radiusY?: number;
  /**
   * The angle at which ellipse is tilted to x-axis (degrees).
   */
  tiltAngle?: number;
  /**
   * Milliseconds between 1° steps of orbit (matches legacy interval timing). Lower = faster.
   */
  duration?: number;
  /**
   * The items to orbit around the center of the parent element.
   */
  items?: ReactNode[];
  /**
   * Class name for the background element.
   */
  backgroundClassName?: string;
  /**
   * Class name for the container element.
   */
  containerClassName?: string;
  /**
   * Additional classes for the item orbit container.
   */
  className?: string;
  /**
   * Optional panel shown above the orbit on hover / keyboard focus (Home-style tooltip).
   */
  tooltip?: ReactNode;
  /**
   * `id` for the tooltip node (for `aria-describedby`). Defaults to a stable `useId` value.
   */
  tooltipId?: string;
  /**
   * Accessible name for the focusable orbit region when `tooltip` is set.
   */
  orbitAriaLabel?: string;
}

function getOrbitItemVectors({
  orbitAngleDeg,
  index,
  radiusX,
  radiusY,
  totalItems,
  tiltAngle,
}: {
  orbitAngleDeg: number;
  index: number;
  radiusX: number;
  radiusY: number;
  totalItems: number;
  tiltAngle: number;
}) {
  const angleStep = 360 / totalItems;
  const angle = (orbitAngleDeg + index * angleStep) % 360;
  const radians = (angle * Math.PI) / 180;

  const x = radiusX * Math.cos(radians);
  const y = radiusY * Math.sin(radians);

  const tiltRadians = (tiltAngle * Math.PI) / 180;
  const xTilted = x * Math.cos(tiltRadians) - y * Math.sin(tiltRadians);
  const yTilted = x * Math.sin(tiltRadians) + y * Math.cos(tiltRadians);

  /* Smooth depth: old `angle < 180 ? 1.2 : 1` popped at the meridian. Same front/back as before
   * (largest near 0°/360°, smallest near 180°) via (1 + cos) / 2. */
  const forwardness = (1 + Math.cos((angle * Math.PI) / 180)) / 2;
  const scale = 1 + forwardness * 0.2;
  const zIndex = angle > 180 ? -1 : 1;

  return { xTilted, yTilted, zIndex, scale };
}

/** Softer, clearer glass over the center logo; full frosted treatment when farther out on the orbit. */
function orbitGlassStyleForOffset(xTilted: number, yTilted: number): CSSProperties {
  const dist = Math.hypot(xTilted, yTilted);
  const dNear = 26;
  const dFar = 62;
  const t = Math.max(0, Math.min(1, (dist - dNear) / (dFar - dNear)));

  const blurPx = 6 + t * 25;
  const sat = 1.04 + t * 0.78;
  const bright = 1.05 + t * 0.1;
  const g0 = 0.22 + t * 0.3;
  const g1 = 0.12 + t * 0.18;
  const g2 = 0.06 + t * 0.12;
  const borderA = 0.48 + t * 0.18;
  const spec = 0.55 + t * 0.22;
  const violetGlow = 0.012 + t * 0.032;
  const insetWash = 0.03 + t * 0.05;

  const backdropFilter = `blur(${blurPx}px) saturate(${sat}) brightness(${bright})`;

  return {
    background: `linear-gradient(to bottom right, rgba(255,255,255,${g0}), rgba(255,255,255,${g1}), rgba(255,255,255,${g2}))`,
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
    border: `1px solid rgba(255,255,255,${borderA})`,
    /* Tight, low-opacity violet; negative spread keeps glow hugging the orb. */
    boxShadow: `inset 0 1px 0 rgba(255,255,255,${spec}), inset 0 -6px 14px rgba(255,255,255,${insetWash}), inset 0 0 0 1px rgba(255,255,255,${0.2 + t * 0.14}), 0 1px 8px -2px rgba(139,92,246,${violetGlow}), 0 2px 16px -4px rgba(139,92,246,${violetGlow * 0.55}), 0 0 0 1px rgba(255,255,255,${0.05 + t * 0.06})`,
  };
}

function applyOrbitItemDomStyle(
  el: HTMLDivElement,
  index: number,
  orbitAngleDeg: number,
  radiusX: number,
  radiusY: number,
  totalItems: number,
  tiltAngle: number,
) {
  const { xTilted, yTilted, zIndex, scale } = getOrbitItemVectors({
    orbitAngleDeg,
    index,
    radiusX,
    radiusY,
    totalItems,
    tiltAngle,
  });
  const glass = orbitGlassStyleForOffset(xTilted, yTilted);
  el.style.left = `${50 + xTilted}%`;
  el.style.top = `${50 + yTilted}%`;
  el.style.transform = `translate(-50%, -50%) scale(${scale})`;
  el.style.zIndex = String(zIndex);
  el.style.background = glass.background ?? "";
  el.style.backdropFilter = glass.backdropFilter ?? "";
  el.style.webkitBackdropFilter =
    glass.WebkitBackdropFilter ?? glass.backdropFilter ?? "";
  el.style.border = glass.border ?? "";
  el.style.boxShadow = glass.boxShadow ?? "";
  el.style.transition = "none";
}

export default function OrbitingItems3D({
  radiusX = 120,
  radiusY = 30,
  tiltAngle = 360 - 30,
  duration = 25,
  items = OrbitBrandIcons,
  backgroundClassName,
  containerClassName,
  className,
  tooltip,
  tooltipId: tooltipIdProp,
  orbitAriaLabel = "Portrait with product logos orbiting around it",
}: OrbitingItems3DProps) {
  const reactId = useId();
  const tooltipDomId = tooltipIdProp ?? `orbit-tooltip-${reactId}`;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const t0 = performance.now();
    const tid = window.setTimeout(() => {
      // #region agent log
      debugAgentLog({
        hypothesisId: "H_orbit_rerenders",
        location: "orbiting-items-3-d.tsx:2s_sample",
        message: "orbit_react_renders",
        data: {
          pathname: window.location.pathname,
          renderCount: renderCountRef.current,
          windowMs: Math.round(performance.now() - t0),
          durationMsPerDegree: duration,
        },
      });
      // #endregion
    }, 2000);
    return () => clearTimeout(tid);
  }, [duration]);

  useEffect(() => {
    const msPerDegree = Math.max(1, duration);
    let raf = 0;
    const start = performance.now();
    const n = items.length;

    const loop = (now: number) => {
      const elapsed = now - start;
      const orbitAngleDeg = (elapsed / msPerDegree) % 360;
      for (let index = 0; index < n; index++) {
        const el = itemRefs.current[index];
        if (!el) continue;
        applyOrbitItemDomStyle(
          el,
          index,
          orbitAngleDeg,
          radiusX,
          radiusY,
          n,
          tiltAngle,
        );
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [duration, items.length, radiusX, radiusY, tiltAngle]);

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center py-32",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-violet-200 to-pink-200",
          backgroundClassName,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative flex h-64 w-64 items-center justify-center",
          tooltip &&
            "group/orbit outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          className,
        )}
        tabIndex={tooltip ? 0 : undefined}
        aria-label={tooltip ? orbitAriaLabel : undefined}
        aria-describedby={tooltip ? tooltipDomId : undefined}
      >
        {tooltip ? (
          <div
            id={tooltipDomId}
            role="tooltip"
            className={orbitTooltipPanelClass}
          >
            {tooltip}
          </div>
        ) : null}
        {CenterIcon}
        {items.map((item, index) => {
          const { xTilted, yTilted, zIndex, scale } = getOrbitItemVectors({
            orbitAngleDeg: 0,
            index,
            radiusX,
            radiusY,
            totalItems: items.length,
            tiltAngle,
          });
          return (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="absolute flex h-20 w-20 items-center justify-center overflow-hidden rounded-full will-change-[backdrop-filter]"
              style={{
                left: `${50 + xTilted}%`,
                top: `${50 + yTilted}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                zIndex,
                ...orbitGlassStyleForOffset(xTilted, yTilted),
                transition: "none",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
