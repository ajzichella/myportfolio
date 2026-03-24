import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import type { ResultsSectionProps } from "./ResultsSection.types";
import { LaunchImpactPartyPopper } from "./ResultsSectionBadge";

type ResultNumberFormat = ResultsSectionProps["stats"][number]["format"];

function AnimatedResultNumber({
  value,
  format,
  active,
  delay = 0,
  className,
}: {
  value: number;
  format: ResultNumberFormat;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.75,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [active, value, delay, reduceMotion]);

  let text: string;
  if (format === "int-plus") {
    text = `${Math.round(display).toLocaleString("en-US")}+`;
  } else if (format === "percent") {
    text = `${Math.round(display)}%`;
  } else {
    text = `~${Math.round(display)}%`;
  }

  return <p className={className}>{text}</p>;
}

/** Subtle palette; pieces fall through the card on a loop, starting at varied heights (no “row at the top”). */
const CONFETTI_PALETTE = [
  "rgba(0, 174, 239, 0.5)",
  "rgba(103, 232, 249, 0.42)",
  "rgba(165, 180, 252, 0.38)",
  "rgba(148, 163, 184, 0.4)",
  "rgba(251, 191, 36, 0.32)",
];

function ResultsConfetti({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean | null;
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        // Golden-ratio spread so phases aren’t aligned with the horizontal grid
        const phase = (i * 0.618033988749895) % 1;
        return {
          id: i,
          leftPct: 3 + ((i * 17) % 94),
          phase,
          duration: 2.1 + (i % 4) * 0.22,
          w: 4 + (i % 3),
          h: 6 + (i % 4),
          baseRot: i * 37,
          drift: ((i % 5) - 2) * 16,
          color:
            CONFETTI_PALETTE[i % CONFETTI_PALETTE.length] ??
            "rgba(0, 174, 239, 0.45)",
          rounded: i % 3 === 0,
        };
      }),
    [],
  );

  if (reducedMotion || !active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl"
      aria-hidden
    >
      {pieces.map((p) => {
        const startTop = p.phase * 108;
        const travel = 108;
        const endTop = startTop + travel;
        const rotEnd = p.baseRot + 200 + p.id * 6;
        const rotStart = p.baseRot + p.phase * (rotEnd - p.baseRot) * 0.15;
        const atFall = (t: number) => startTop + travel * t;
        const xStart = p.phase * p.drift;
        return (
          <motion.div
            key={p.id}
            className={`absolute will-change-transform ${
              p.rounded ? "rounded-full" : "rounded-[1px]"
            }`}
            style={{
              left: `${p.leftPct}%`,
              width: p.w,
              height: p.h,
              backgroundColor: p.color,
            }}
            initial={{
              top: `${startTop}%`,
              x: xStart,
              opacity: 0.42,
              rotate: rotStart,
            }}
            animate={{
              top: [
                `${atFall(0)}%`,
                `${atFall(0.06)}%`,
                `${atFall(0.86)}%`,
                `${atFall(1)}%`,
              ],
              x: [
                xStart,
                xStart + (p.drift - xStart) * 0.06,
                xStart + (p.drift - xStart) * 0.86,
                p.drift,
              ],
              rotate: [
                rotStart,
                rotStart + (rotEnd - rotStart) * 0.06,
                rotStart + (rotEnd - rotStart) * 0.86,
                rotEnd,
              ],
              opacity: [0.42, 0.48, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              times: [0, 0.06, 0.86, 1],
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 0,
            }}
          />
        );
      })}
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/** Neon green / teal gradient for animated result counters */
const resultMetricNumberClass =
  "text-2xl font-bold tabular-nums md:text-3xl bg-gradient-to-br from-[#8fffc4] via-[#3ee0c8] to-[#5bdbd8] bg-clip-text text-transparent [filter:drop-shadow(0_0_12px_rgba(62,224,200,0.4))]";

export function ResultsSection({
  headingId,
  badgeLabel = "Launch impact",
  title = "Results",
  description,
  stats,
  sectionClassName = "mt-16",
  sectionDelay = 0.09,
  inViewAmount = 0.28,
}: ResultsSectionProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, { once: true, amount: inViewAmount });
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.4, delay: sectionDelay }}
      aria-labelledby={headingId}
      className={sectionClassName}
    >
      <div
        ref={resultsRef}
        className="relative rounded-2xl border border-[#00aeef]/20 bg-slate-950/25 shadow-[0_0_40px_-18px_rgba(0,174,239,0.2)] ring-1 ring-inset ring-white/[0.06]"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-[#050814] px-5 py-8 ring-1 ring-inset ring-white/[0.07] sm:px-8 sm:py-10">
          {/* Glows sit under confetti so blur layers don’t hide particles */}
          <div
            className="pointer-events-none absolute -top-28 left-1/2 z-0 h-52 w-[min(110%,38rem)] -translate-x-1/2 rounded-full bg-[#00aeef]/[0.08] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 right-0 z-0 h-36 w-56 rounded-full bg-slate-400/[0.04] blur-3xl"
            aria-hidden
          />

          <ResultsConfetti active={resultsInView} reducedMotion={reducedMotion} />

          <div className="relative z-[2]">
            <p className="inline-flex items-center gap-2 overflow-visible rounded-full border border-[#00aeef]/20 bg-[#00aeef]/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-readable">
              <LaunchImpactPartyPopper />
              {badgeLabel}
            </p>

            <h2 id={headingId} className="mt-4 block leading-tight">
              <span className={resultMetricNumberClass}>{title}</span>
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#b8c0cc] md:text-lg">
              {description}
            </p>

            <div className="mt-8 grid gap-4 py-1 sm:grid-cols-3">
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                  animate={
                    resultsInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: reducedMotion ? 0 : 14 }
                  }
                  transition={{
                    duration: reducedMotion ? 0 : 0.45,
                    delay: reducedMotion ? 0 : 0.05 + idx * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="results-metric-glow relative min-h-0 min-w-0"
                >
                  <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                    <AnimatedResultNumber
                      value={s.value}
                      format={s.format}
                      active={resultsInView}
                      delay={0.08 + idx * 0.12}
                      className={resultMetricNumberClass}
                    />
                    <p className="mt-2 text-sm leading-snug text-slate-200">
                      {s.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

