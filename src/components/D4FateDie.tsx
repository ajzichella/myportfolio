import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GradientH2 } from "./GradientH2";

export interface FateTarget {
  title: string;
  link: string;
  description: string;
}

interface D4FateDieRollProps {
  result: 1 | 2 | 3;
  targets: FateTarget[];
  onViewCaseStudy: (link: string) => void;
  onDismiss: () => void;
}

export function D4FateDieRoll({
  result,
  targets,
  onViewCaseStudy,
  onDismiss,
}: D4FateDieRollProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"rolling" | "revealed">("rolling");
  const [chosenIndex, setChosenIndex] = useState(result - 1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chosenStudy = targets[chosenIndex] ?? targets[result - 1];
  const rolledNumber = chosenIndex + 1;

  const iframeSrc = useMemo(() => {
    const base = import.meta.env.BASE_URL || "/";
    const root = base.endsWith("/") ? base : `${base}/`;
    return `${root}major-dice/fate-roll.html?result=${result}`;
  }, [result]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const unlockAudio = () => {
      iframe.contentWindow?.postMessage({ type: "fate-unlock-audio" }, "*");
    };

    iframe.addEventListener("load", unlockAudio);
    return () => iframe.removeEventListener("load", unlockAudio);
  }, [iframeSrc]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "fate-roll-complete") return;

      const rolled = parseInt(String(event.data.result), 10);
      const clamped = Math.min(3, Math.max(1, rolled)) || result;
      setChosenIndex(clamped - 1);
      setPhase("revealed");
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [result]);

  return (
    <>
      <div
        className="fixed inset-0 z-[219] bg-black/25 backdrop-blur-2xl backdrop-saturate-[0.92]"
        aria-hidden
      />

      <iframe
        ref={iframeRef}
        title="MajorVictory 3D fate d4 roll"
        src={iframeSrc}
        className="pointer-events-none fixed inset-0 z-[220] h-[100dvh] w-[100dvw] border-0 bg-transparent"
        style={{ background: "transparent", colorScheme: "normal" }}
        allow="autoplay"
        aria-hidden
      />

      {phase === "rolling" ? (
        <p
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[221] mx-auto max-w-md px-4 text-center text-sm text-slate-200 opacity-80"
        >
          <span className="inline-block rounded-full border border-white/10 bg-black/45 px-4 py-2 backdrop-blur-sm">
            The d4 tumbles across your screen…
          </span>
        </p>
      ) : (
        <div
          className="pointer-events-none fixed inset-0 z-[222] flex items-start justify-center px-6 pb-12 pt-[min(12vh,6rem)] sm:items-center sm:py-12"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fate-reveal-result fate-reveal-title"
          aria-describedby="fate-reveal-desc"
        >
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close and stay on the homepage"
            className="pointer-events-auto fixed right-2 top-2 z-[223] flex h-10 w-10 items-center justify-center rounded-sm text-[#00aeef] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <X className="h-6 w-6" strokeWidth={2.5} aria-hidden />
          </button>
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: 16 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-2xl text-center"
          >
            <p className="font-semibold text-accent-readable">
              The die chose
            </p>
            <p
              id="fate-reveal-result"
              className="mt-3 text-8xl font-bold tabular-nums leading-none tracking-tight text-accent-readable sm:text-9xl md:text-[10rem]"
              aria-label={`Die result ${rolledNumber}`}
            >
              {rolledNumber}
            </p>
            <GradientH2
              id="fate-reveal-title"
              className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
            >
              {chosenStudy.title}
            </GradientH2>
            <p
              id="fate-reveal-desc"
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              {chosenStudy.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <button
                type="button"
                onClick={onDismiss}
                className="text-sm font-medium text-[#00aeef] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-2 py-1"
              >
                Stay on the homepage
              </button>
              <Link
                to={chosenStudy.link}
                onClick={() => onViewCaseStudy(chosenStudy.link)}
                className="rainbow-cta group relative inline-flex rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover:opacity-95">
                  <span className="flex min-w-0 flex-1 justify-center">
                    View case study
                  </span>
                  <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover:ml-2 group-hover:w-4">
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
