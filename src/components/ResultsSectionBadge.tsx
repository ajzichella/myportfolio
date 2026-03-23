import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

const CONFETTI_PALETTE = [
  "rgba(0, 174, 239, 0.5)",
  "rgba(103, 232, 249, 0.42)",
  "rgba(165, 180, 252, 0.38)",
  "rgba(148, 163, 184, 0.4)",
  "rgba(251, 191, 36, 0.32)",
];

const LAUNCH_BURST_DURATION = 0.55;
const LAUNCH_BURST_CYCLE = 2.15;

/** Party popper (emoji 🎉) with a short radial “confetti shot”. */
export function LaunchImpactPartyPopper() {
  const reduceMotion = useReducedMotion();

  const burst = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI * 0.65;
        const dist = 14 + (i % 4) * 4;
        return {
          id: i,
          dx: Math.round(Math.cos(a) * dist),
          dy: Math.round(Math.sin(a) * dist),
          color:
            CONFETTI_PALETTE[i % CONFETTI_PALETTE.length] ??
            "rgba(0, 174, 239, 0.55)",
          delay: i * 0.022,
          rot: (i % 2 === 0 ? 1 : -1) * (75 + i * 14),
          round: i % 3 === 0,
        };
      }),
    [],
  );

  if (reduceMotion) {
    return (
      <span
        className="inline-flex shrink-0 select-none text-[1.05rem] leading-none"
        aria-hidden
      >
        🎉
      </span>
    );
  }

  const pause = Math.max(0.15, LAUNCH_BURST_CYCLE - LAUNCH_BURST_DURATION);

  return (
    <span
      className="relative inline-flex h-5 w-[1.85rem] shrink-0 select-none items-center justify-center overflow-visible"
      aria-hidden
    >
      {burst.map((b) => (
        <motion.span
          key={b.id}
          className={`pointer-events-none absolute left-1/2 top-1/2 z-0 block h-[5px] w-[4px] origin-center ${
            b.round ? "rounded-full" : "rounded-[1px]"
          }`}
          style={{
            marginLeft: -2,
            marginTop: -2,
            backgroundColor: b.color,
          }}
          animate={{
            x: [0, b.dx * 0.15, b.dx],
            y: [0, b.dy * 0.15, b.dy],
            opacity: [0, 1, 0],
            rotate: [0, b.rot * 0.4, b.rot],
            scale: [0.35, 1.05, 0.65],
          }}
          transition={{
            duration: LAUNCH_BURST_DURATION,
            repeat: Infinity,
            repeatDelay: pause,
            delay: b.delay,
            ease: [0.22, 0.05, 0.22, 1],
            times: [0, 0.2, 1],
          }}
        />
      ))}

      <motion.span
        className="relative z-[1] inline-block text-[1.05rem] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        style={{ transformOrigin: "55% 85%" }}
        animate={{
          scale: [1, 1.2, 0.94, 1],
          rotate: [0, -16, 12, -5, 0],
          y: [0, -2, 1, 0],
        }}
        transition={{
          duration: LAUNCH_BURST_DURATION,
          repeat: Infinity,
          repeatDelay: pause,
          ease: [0.34, 1.15, 0.25, 1],
        }}
      >
        🎉
      </motion.span>
    </span>
  );
}

