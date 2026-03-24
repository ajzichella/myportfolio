import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronRight, Heart, List, X } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import { Bubbles } from "../components/Bubbles";
import BlurText from "../components/BlurText";
import { ImageLightbox, LightboxImageButton } from "../components/ImageLightbox";
import GradientText from "../components/GradientText";
import { ResultsSection } from "../components/ResultsSection";

const base = import.meta.env.BASE_URL;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const linkClass =
  "font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

const sectionTitle =
  "text-xl font-bold tracking-tight text-white md:text-2xl";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-accent-readable";

/** Hero meta pills: flat matte chips (reference), not card-style bordered panels. */
const heroTagClass =
  "inline-flex items-center rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-200";

const CASE_STUDY_SECTION_INDEX = [
  { id: "rbac-results-heading", label: "Results" },
  { id: "rbac-scope-heading", label: "Scope & collaboration" },
  { id: "rbac-research-heading", label: "Research" },
  { id: "rbac-strategy-heading", label: "Strategy" },
  { id: "rbac-docs-heading", label: "Documentation" },
  { id: "rbac-experience-heading", label: "Experience & communication" },
  { id: "rbac-video-heading", label: "Walkthrough" },
  { id: "rbac-quote-heading", label: "Customer voice" },
  { id: "rbac-peer-heading", label: "Peer feedback" },
] as const;

const WALKTHROUGH_EMBED_SRC =
  "https://www.youtube.com/embed/MKSNUTt3PuQ?si=uEFqLt-00ti7sGjA";

const SCOPE_COLLAB_STATS = [
  { value: 34, label: "products affected" },
  { value: 8, label: "product designers" },
  { value: 15, label: "front-end engineers" },
  { value: 124, label: "total contributors" },
] as const;

function ScopeStatValue({
  value,
  active,
  delay,
}: {
  value: number;
  active: boolean;
  delay: number;
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
      duration: 1.65,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [active, value, delay, reduceMotion]);

  return (
    <span className="tabular-nums">{Math.round(display).toLocaleString("en-US")}</span>
  );
}

function ScopeCollaborationStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div
      ref={ref}
      className="mt-8 border-b border-slate-600/50 pb-8"
      aria-label="Collaboration scale"
    >
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
        {SCOPE_COLLAB_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <p className="text-3xl font-bold tabular-nums text-white md:text-4xl">
              <ScopeStatValue value={stat.value} active={inView} delay={i * 0.1} />
            </p>
            <p className="mt-2 text-sm leading-snug text-[#999999] md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const RBAC_SHEET_TYPING_HEADING = "One spreadsheet to rule them all";

const PEER_FEEDBACK_HEARTS = [
  { left: "5%", top: "12%", size: 18, delay: 0, duration: 8, color: "rgba(0, 174, 239, 0.52)" },
  { left: "18%", top: "58%", size: 14, delay: 1.1, duration: 10, color: "rgba(163, 232, 247, 0.48)" },
  { left: "42%", top: "8%", size: 12, delay: 2.4, duration: 9, color: "rgba(14, 165, 233, 0.44)" },
  { left: "55%", top: "72%", size: 16, delay: 0.6, duration: 11, color: "rgba(56, 189, 248, 0.42)" },
  { left: "72%", top: "18%", size: 13, delay: 3.2, duration: 8.5, color: "rgba(0, 107, 143, 0.5)" },
  { left: "88%", top: "45%", size: 15, delay: 1.8, duration: 9.5, color: "rgba(126, 232, 255, 0.4)" },
  { left: "28%", top: "82%", size: 11, delay: 4, duration: 12, color: "rgba(34, 211, 238, 0.45)" },
  { left: "78%", top: "78%", size: 12, delay: 2, duration: 10.5, color: "rgba(2, 132, 199, 0.46)" },
  { left: "12%", top: "38%", size: 10, delay: 5.5, duration: 13, color: "rgba(103, 232, 249, 0.38)" },
  { left: "92%", top: "12%", size: 14, delay: 0.3, duration: 9, color: "rgba(0, 180, 216, 0.48)" },
] as const;

const PAW_PATH_D =
  "M15.3245 5.71107C15.1511 5.29889 14.8629 5.0017 14.4911 4.85201L14.4861 4.85014C14.3168 4.78387 14.1366 4.74995 13.9548 4.75014H13.9348C13.0836 4.76295 12.2145 5.48639 11.7726 6.55045C11.4486 7.32857 11.4114 8.16545 11.6732 8.7892C11.8464 9.2017 12.1351 9.49889 12.5086 9.64857L12.5126 9.65014C12.6819 9.7164 12.8621 9.75032 13.0439 9.75014C13.9032 9.75014 14.7814 9.0267 15.2314 7.94857C15.5514 7.17139 15.5867 6.33514 15.3245 5.71107ZM11.9232 10.3004C11.4323 10.0054 10.9682 9.72639 10.6651 9.22514C9.82887 7.83764 9.32387 7.00014 7.99981 7.00014C6.67574 7.00014 6.16949 7.83764 5.33137 9.22514C5.02762 9.72701 4.56262 10.0064 4.07012 10.3026C3.50543 10.642 2.92199 10.9926 2.67012 11.6826C2.57218 11.9314 2.52285 12.1966 2.52481 12.4639C2.52481 13.5873 3.39981 14.5014 4.47481 14.5014C5.02949 14.5014 5.61981 14.3092 6.24449 14.1058C6.84512 13.9101 7.46606 13.7079 8.00293 13.7079C8.53981 13.7079 9.15918 13.9101 9.75762 14.1058C10.3811 14.3079 10.9686 14.5001 11.5248 14.5001C12.5982 14.5001 13.4717 13.5861 13.4717 12.4626C13.4726 12.1951 13.4222 11.9299 13.3232 11.6814C13.0714 10.9908 12.4876 10.6398 11.9232 10.3004ZM4.68731 5.9017C5.05918 6.36826 5.53106 6.62514 6.01606 6.62514C6.08226 6.62512 6.14838 6.62021 6.21387 6.61045C7.22543 6.4617 7.85574 5.22732 7.64887 3.79795C7.56231 3.19701 7.33106 2.63732 6.99981 2.22232C6.62856 1.7567 6.15606 1.50014 5.67137 1.50014C5.60516 1.50015 5.53904 1.50506 5.47356 1.51482C4.46199 1.66357 3.83168 2.89795 4.03856 4.32732C4.12481 4.92732 4.35606 5.48639 4.68731 5.9017ZM9.78606 6.61045C9.85154 6.62021 9.91766 6.62512 9.98387 6.62514C10.4692 6.62514 10.9407 6.36826 11.3126 5.9017C11.6436 5.48639 11.8736 4.92732 11.9611 4.3267C12.1679 2.89795 11.5376 1.66357 10.5261 1.5142C10.4606 1.50444 10.3945 1.49953 10.3282 1.49951C9.84356 1.50014 9.37106 1.7567 8.99981 2.22232C8.66856 2.63732 8.43731 3.19701 8.35106 3.79857C8.14418 5.22732 8.77449 6.4617 9.78606 6.61045ZM3.48699 9.65014L3.49137 9.64857C3.86418 9.49889 4.15262 9.20201 4.32543 8.78982C4.58731 8.16482 4.55043 7.32889 4.22699 6.55076C3.77918 5.47389 2.90137 4.75014 2.04293 4.75014C1.86114 4.74987 1.68093 4.7838 1.51168 4.85014L1.50731 4.8517C1.13543 5.00014 0.846993 5.29826 0.67418 5.71045C0.412305 6.33545 0.44918 7.17139 0.772618 7.94951C1.22043 9.02639 2.09824 9.75014 2.95668 9.75014C3.13815 9.75028 3.31804 9.71636 3.48699 9.65014Z";
const PAW_VIEWBOX_WIDTH = 1600;
const PAW_VIEWBOX_HEIGHT = 2400;

type RbacExperiencePaw = { x: number; y: number; r: number; o: number };

function buildRbacExperiencePaws(): RbacExperiencePaw[] {
  const yScale = PAW_VIEWBOX_HEIGHT / 900;
  const makeTrail = (
    startX: number,
    endX: number,
    baseY: number,
    amplitude: number,
    phase: number,
    count: number,
    rotateBias: number,
  ) => {
    const n = Math.max(1, count - 1);
    const stepX = (endX - startX) / n;
    const freq = Math.PI * 1.35;
    return Array.from({ length: count }, (_, i) => {
      const t = i / n;
      const x = startX + (endX - startX) * t;
      const wave = t * freq + phase;
      const y = baseY * yScale + Math.sin(wave) * (amplitude * yScale);
      const slopeY = amplitude * yScale * Math.cos(wave) * freq;
      const tangentDeg = (Math.atan2(slopeY, stepX) * 180) / Math.PI;
      const headingDeg = tangentDeg + 90;
      const stepSwing = i % 2 === 0 ? -6 : 6;
      return {
        x,
        y,
        r: headingDeg + rotateBias + stepSwing,
        o: 0.06 + t * 0.06,
      };
    });
  };

  return [
    ...makeTrail(30, 360, 90, 42, 0.05, 9, -26),
    ...makeTrail(70, 430, 120, 48, 0.15, 10, -24),
    ...makeTrail(120, 520, 155, 46, 0.28, 10, -20),
    ...makeTrail(220, 700, 220, 56, 0.6, 11, -14),
    ...makeTrail(290, 820, 255, 58, 0.82, 11, -8),
    ...makeTrail(420, 980, 300, 60, 1.0, 12, 4),
    ...makeTrail(560, 1120, 350, 64, 1.2, 12, 8),
    ...makeTrail(660, 1260, 400, 66, 1.4, 13, 12),
    ...makeTrail(780, 1380, 455, 62, 1.62, 12, 2),
    ...makeTrail(900, 1500, 500, 62, 1.8, 12, -6),
    ...makeTrail(980, 1560, 545, 58, 2.0, 11, -10),
    ...makeTrail(1060, 1590, 620, 54, 2.25, 10, -16),
    ...makeTrail(760, 1360, 675, 46, 2.48, 10, -4),
    ...makeTrail(180, 820, 700, 44, 2.7, 10, 18),
    ...makeTrail(60, 640, 760, 40, 2.95, 9, 24),
  ];
}

const RBAC_EXPERIENCE_PAWS = buildRbacExperiencePaws();

const RbacExperiencePawPaths = memo(function RbacExperiencePawPaths() {
  return (
    <svg
      className="absolute inset-0 z-0 h-full w-full opacity-75 text-slate-300/40 [mask-image:radial-gradient(ellipse_76%_72%_at_50%_42%,#000_34%,#000_62%,transparent_86%)]"
      viewBox={`0 0 ${PAW_VIEWBOX_WIDTH} ${PAW_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {RBAC_EXPERIENCE_PAWS.map((paw, i) => (
        <path
          key={i}
          d={PAW_PATH_D}
          fill="currentColor"
          opacity={paw.o}
          transform={`translate(${paw.x} ${paw.y}) rotate(${paw.r}) scale(2) translate(-8 -8)`}
        />
      ))}
    </svg>
  );
});

/** In-flow responsive embed (no portal / fixed tracking; player stays in normal document scroll). */
function WalkthroughYoutubeEmbed() {
  return (
    <div className="relative aspect-video w-full min-w-0 overflow-hidden rounded-lg bg-slate-950">
      <iframe
        className="absolute inset-0 h-full w-full rounded-lg border-0"
        src={WALKTHROUGH_EMBED_SRC}
        title="YouTube video player"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export function CaseStudyPredefinedRoles() {
  const [isSectionIndexOpen, setIsSectionIndexOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [imageLightbox, setImageLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const pageRef = useRef<HTMLElement>(null);
  const sectionIndexFloatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSectionIndexOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = sectionIndexFloatingRef.current;
      if (!root) return;
      const t = e.target;
      if (t instanceof Node && !root.contains(t)) {
        setIsSectionIndexOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isSectionIndexOpen]);

  useEffect(() => {
    const page = pageRef.current;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    let frame = 0;

    const lastCommittedRef = { current: -1 as number };

    /** Avoid setState on every scroll tick (micro float changes); limits full-page re-renders and improves INP. */
    const commitReadingProgress = (next: number) => {
      const prev = lastCommittedRef.current;
      if (
        prev >= 0 &&
        Math.round(next * 100) === Math.round(prev * 100)
      ) {
        return;
      }
      lastCommittedRef.current = next;
      setReadingProgress(next);
    };

    const compute = () => {
      const main = document.getElementById("main-scroll");
      const doc = document.documentElement;
      const windowScrollable = doc.scrollHeight - window.innerHeight;
      if (main) {
        const mainScrollable = main.scrollHeight - main.clientHeight;
        if (mainScrollable > 1) {
          const next = clamp01(main.scrollTop / mainScrollable);
          commitReadingProgress(next);
          return;
        }
        if (windowScrollable > 1) {
          const next = clamp01(window.scrollY / windowScrollable);
          commitReadingProgress(next);
          return;
        }
        commitReadingProgress(1);
        return;
      }

      const scrollable = windowScrollable;
      if (scrollable <= 1) {
        commitReadingProgress(1);
        return;
      }
      const next = clamp01(window.scrollY / scrollable);
      commitReadingProgress(next);
    };

    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        compute();
      });
    };

    compute();

    const main = document.getElementById("main-scroll");
    main?.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const ro =
      typeof ResizeObserver !== "undefined" && page
        ? new ResizeObserver(() => schedule())
        : null;
    if (page && ro) ro.observe(page);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      main?.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
    };
  }, []);

  const goToSection = (id: string) => {
    const main = document.getElementById("main-scroll");
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 24;
    if (main) {
      const mainRect = main.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const windowTop = targetRect.top + window.scrollY - offset;
      const top =
        main.scrollTop +
        (targetRect.top - mainRect.top) -
        offset;
      const desiredTop = Math.max(0, top);
      main.scrollTo({ top: desiredTop, behavior: "smooth" });
      requestAnimationFrame(() => {
        const afterRaf = main.scrollTop;
        if (afterRaf === 0 && desiredTop > 0) {
          // In some runtimes, window is the real scroller even when #main-scroll exists.
          window.scrollTo({ top: Math.max(0, windowTop), behavior: "smooth" });
        }
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    setIsSectionIndexOpen(false);
  };

  return (
    <section
      ref={pageRef}
      className="relative w-full min-w-0 min-h-screen shrink-0 overflow-x-visible py-16 md:py-16 lg:py-16"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 w-full overflow-hidden bg-black"
        aria-hidden
      >
        <BlobBackground radiusScale={1.35} alphaScale={0.78} />
      </div>
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 md:px-12 lg:px-16">
        <motion.nav
          {...fadeUp}
          transition={{ duration: 0.35 }}
          aria-label="Breadcrumb"
          className="relative z-20 mb-8 flex flex-wrap items-center gap-1 text-sm text-[#999999]"
        >
          <Link to="/case-studies" className={linkClass}>
            Case studies
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span className="text-slate-400">Predefined Roles</span>
        </motion.nav>

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="relative z-20 max-w-3xl"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}digitalocean-icon.svg`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span className="text-sm font-medium text-accent-readable">
              DigitalOcean
            </span>
            <span className={`${heroTagClass} uppercase tracking-wide`}>IAM</span>
            <span className={heroTagClass}>Access control</span>
          </p>
          <h1 className="mt-3 pt-4">
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              RBAC - Predefined Roles
            </GradientText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Expanding role options so teams can enforce least privilege without
            complexity, delivered in the &quot;DO Simple&quot; way.
          </p>
        </motion.header>

        <div className="relative z-0 mt-12 grid gap-6 overflow-visible lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="relative z-[2] grid content-start gap-6"
          >
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Problem</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                With only 3 available roles at the time, the demand for more
                granular access to secure users&apos; infrastructure was loud.
                Users needed a way to further isolate access to managing
                resources, thus, becoming the number 1 company priority in 2024.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Solution</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Ship additional roles for users to select from based on the most
                common use cases and user requests and help them easily assign
                that new access.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Goals</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Help admin users enforce the principle of least privilege, offer
                more restrictive RBAC solutions that still feel simple, and set
                the platform up for the next phases of access control.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative min-w-0 overflow-visible lg:h-full"
          >
            <div
              className="pointer-events-none absolute left-[-3%] right-[-12%] top-[-7%] bottom-[-7%] z-0 origin-[56%_38%] scale-[1.02] translate-x-[5%] -translate-y-[3%] blur-2xl lg:left-[-2%] lg:right-[-13%] lg:top-[-9%] lg:bottom-[-9%] lg:translate-x-[6%] lg:-translate-y-[4%]"
              aria-hidden
            >
              <BlobBackground
                radiusScale={1.28}
                alphaScale={1.52}
                nxShift={0.06}
              />
            </div>
            <Bubbles className="inset-y-[-10%] left-[-20%] right-[-4%] z-[1]" />
            <LightboxImageButton
              src={`${base}rbac-role-modal.png`}
              alt="Change role modal listing predefined team roles and permissions"
              wrapperClassName="relative z-[2] h-full w-full rounded-lg"
              className="h-full w-full rounded-lg object-cover object-top drop-shadow-xl"
              onOpen={setImageLightbox}
            />
          </motion.div>
        </div>

        <ResultsSection
          headingId="rbac-results-heading"
          description={
            <>
              In the first weeks after launch, newly introduced predefined
              roles reached broad adoption across teams and API usage, with
              strong continued uptake as customers refined how they govern
              access.
            </>
          }
          stats={[
            {
              value: 6000,
              format: "int-plus",
              label: "team members assigned predefined roles",
            },
            {
              value: 13,
              format: "percent",
              label:
                "of API tokens on the new roles (millions of daily hits)",
            },
            {
              value: 23,
              format: "approx-percent",
              label: "month-over-month growth in new role usage",
            },
          ]}
        />

        <section
          className="mt-12 w-screen max-w-[100vw] shrink-0 -translate-x-1/2 relative left-1/2 py-8 md:py-10"
          aria-label="Launch screenshots: success state, invite flow, and change role"
        >
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.09 }}
            className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 md:grid-cols-3 md:gap-6 md:px-6"
          >
            <LightboxImageButton
              src={`${base}rbac-success-banner.png`}
              alt="Success banner after joining a team as Modifier: create, read, and update access without delete, with link to team admin"
              wrapperClassName="w-full"
              className="h-[min(680px,74vh)] w-full rounded-lg object-contain"
              onOpen={setImageLightbox}
            />
            <LightboxImageButton
              src={`${base}rbac-invite-members.png`}
              alt="Invite team members flow: Modifier role selected, multiple email chips, secure sign-in option, and send invites"
              wrapperClassName="w-full"
              className="h-[min(680px,74vh)] w-full rounded-lg object-contain"
              onOpen={setImageLightbox}
            />
            <LightboxImageButton
              src={`${base}rbac-change-role-modal-full.png`}
              alt="Change role modal listing Owner, Member, Modifier, Biller, Billing Viewer, and Resource Viewer with permission summaries"
              wrapperClassName="w-full"
              className="h-[min(680px,74vh)] w-full rounded-lg object-contain"
              onOpen={setImageLightbox}
            />
          </motion.div>
        </section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-labelledby="rbac-scope-heading"
          className="case-study-card case-study-card--no-left-accent relative mt-16 rounded-xl p-6 md:p-8"
        >
          <h2 id="rbac-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <p className="mt-2 text-base font-medium leading-snug text-accent-readable md:text-lg">
            The largest collaboration DO has seen in years
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            Permissions touch nearly every surface of the product, so alignment
            across the entire product org was crucial to ship coherently and
            quickly.
          </p>
          <ScopeCollaborationStats />
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product design lead and workstream owner for the end-to-end
                experience.
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Timeline</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                102 business days from kickoff to general availability.
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <dt className={labelClass}>Partners</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product designers, PMs, TPMs, backend and frontend engineering,
                Insights, Marketing/GTM, product docs, UX research, Support,
                API, and engineering directors and managers.
              </dd>
            </div>
          </dl>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="rbac-research-heading"
          className="mt-16"
        >
          <h2 id="rbac-research-heading" className={sectionTitle}>
            Research
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              <div>
              <h3 className="text-lg font-semibold text-white">
                Gathering and organizing feedback
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                RBAC demand showed up everywhere. I synthesized years of signals
                from NPS and CSAT, idea boards, customer channels, and CSM
                conversations, then grouped themes into simpler UX needs,
                requested role archetypes, and control over access.
              </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  User interviews
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                  With UX research, we validated those themes through{" "}
                  <span className="font-semibold text-slate-300">13 interviews</span>
                  , focusing on how teams invite collaborators and govern access
                  day to day. Findings shaped a simpler path to more granular
                  prebuilt roles.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Research findings
              </h3>
              <ul className="mt-4 grid gap-y-3 marker:text-[#00aeef] text-base leading-relaxed text-[#999999] md:text-lg">
              <li className="list-disc list-inside">
                Assign a role at invite time; don&apos;t force a
                default-then-reassign loop.
              </li>
              <li className="list-disc list-inside">
                Users compare us to AWS and GCP IAM; they want less
                overwhelming granularity and clearer defaults.
              </li>
              <li className="list-disc list-inside">
                Most wanted broad access{" "}
                <span className="text-slate-300">except delete</span>; the next
                most common need was a true read-only role across the platform.
              </li>
              <li className="list-disc list-inside">
                Users want custom control of certain permissions and were mostly
                satisfied with the CRUD actions (create, read, update, delete).
              </li>
              <li className="list-disc list-inside">
                Project-scoped limits on who holds a role mattered for larger
                orgs.
              </li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="rbac-strategy-heading rbac-docs-heading"
          className="mt-16"
        >
          <h2 id="rbac-strategy-heading" className={sectionTitle}>
            Strategy, process, and vision
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white">UX roadmap</h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                Research pointed to one north star: granular RBAC that still feels
                DO simple. I framed the roadmap in 3 distinct parts by need and effort:
              </p>
              <ul className="mt-4 max-w-3xl grid gap-y-3 marker:text-[#00aeef] text-base leading-relaxed text-[#999999] md:text-lg">
                <li className="list-disc list-inside">
                  <span className="font-medium text-slate-300">
                    Predefined roles
                  </span>{" "}
                  (this launch)
                </li>
                <li className="list-disc list-inside">
                  <span className="font-medium text-slate-300">Custom roles</span>
                </li>
                <li className="list-disc list-inside">
                  <span className="font-medium text-slate-300">Conditions</span>{" "}
                  for even finer control
                </li>
              </ul>
            </div>
            <div className="min-w-0">
              <h3
                id="rbac-docs-heading"
                className="text-lg font-semibold text-white"
              >
                Documentation &amp; system rules
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                I executed a vast documentation effort in order to establish UX
                rules to be used across the entire platform for current and future
                permission and role needs. I laid out guidelines touching on: when
                to hide content from users who don&apos;t have permission to
                interact with it, how we define CRUD actions (what is technically
                happening vs what is happening from the perspective of users), how
                to display permission-related errors, and created experiences
                around the platform to increase role awareness and communication.
              </p>
            </div>
          </div>
          <BlurText
            text={RBAC_SHEET_TYPING_HEADING}
            className="mt-10 md:mt-12 text-accent-readable text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl"
            delay={20}
            animateBy="words"
            direction="top"
            stepDuration={0.2}
            threshold={0.2}
            animationFrom={undefined}
            animationTo={undefined}
            onAnimationComplete={undefined}
            getWordClassName={undefined}
          />
          <motion.figure
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.02 }}
            className="mt-6 w-full min-w-0 md:mt-8"
          >
            <LightboxImageButton
              src={`${base}rbac_sheet.png`}
              alt="Spreadsheet matrix: UX Design IAM controlpanel roles and permissions—product areas, pages, elements, roles, and show or hidden states"
              wrapperClassName="rounded-lg"
              className="w-full max-w-none rounded-lg"
              onOpen={setImageLightbox}
            />
          </motion.figure>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.03 }}
            className="mt-6 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg md:mt-8"
          >
            While not interesting to show, this spreadsheet became the single
            source of truth and about{" "}
            <span className="font-medium text-slate-300">80% of the launch</span>{" "}
            effort, after we moved off an unscalable &quot;screenshot every
            screen&quot; approach.
          </motion.p>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.07 }}
            className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg"
          >
            I coordinated ~10% of every product designer&apos;s time to complete
            rows for their domains, using an existing engineering inventory as the
            foundation. I assigned sections of the products that I knew that the
            designers would be most successful in handling.
          </motion.p>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.35, delay: 0.11 }}
            className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg"
          >
            This approach was well-received, and enabled fast cross-functional
            collaboration to keep the initiative momentum going.
          </motion.p>
        </motion.section>
      </div>

        <section
          aria-labelledby="rbac-experience-heading"
          className="relative isolate z-10 mt-16 w-screen max-w-[100vw] shrink-0 left-1/2 min-w-0 -translate-x-1/2"
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            aria-hidden
          >
            <div className="absolute inset-x-[-6%] inset-y-0 rounded-[32px] bg-gradient-to-br from-[#00aeef]/[0.12] via-[#0f172a]/[0.03] to-[#7c3aed]/[0.1] [mask-image:radial-gradient(ellipse_86%_74%_at_50%_50%,#000_32%,transparent_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00aeef]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden
          >
            <RbacExperiencePawPaths />
          </div>
          <div className="relative z-10 w-full px-6 py-6 md:px-12 md:py-10 lg:px-16">
            <div className="relative z-10 mx-auto w-full max-w-[1200px]">
              <h2 id="rbac-experience-heading" className="sr-only">
                Experience &amp; communication
              </h2>
              <BlurText
                text="Experience & communication"
                className="text-accent-readable text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl"
                delay={20}
                animateBy="words"
                direction="top"
                stepDuration={0.2}
                threshold={0.2}
                animationFrom={undefined}
                animationTo={undefined}
                onAnimationComplete={undefined}
                getWordClassName={undefined}
              />

              <motion.section
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.02 }}
                aria-labelledby="rbac-invite-role-heading"
                className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
              >
                <div className="min-w-0">
                  <h3
                    id="rbac-invite-role-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Invite team members with a role
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Uncovered from research, I addressed the need to add the
                    ability to select a role while inviting team members into
                    the DO team. Previously, users needed to invite a team
                    member with a default role and then reassign that role
                    after they have joined. This saves a giant step for users
                    and saves time with role management duties.
                  </p>
                </div>
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-invite-members.png`}
                    alt="Invite team members flow with role selection in DigitalOcean"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                </figure>
              </motion.section>

              <motion.section
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.06 }}
                aria-labelledby="rbac-assign-role-heading"
                className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)] lg:items-start"
              >
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-change-role-modal-full.png`}
                    alt="Change role modal listing predefined DigitalOcean team roles"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                </figure>
                <div className="min-w-0">
                  <h3
                    id="rbac-assign-role-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Assign predefined roles
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Team owners, or users with the correct associated
                    permissions, can update members&apos; roles from team settings
                    through a focused modal that explains scope and impact.
                  </p>
                </div>
              </motion.section>

              <motion.section
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.1 }}
                aria-labelledby="rbac-role-comms-heading"
                className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
              >
                <div className="min-w-0">
                  <h3
                    id="rbac-role-comms-heading"
                    className="text-lg font-semibold text-white"
                  >
                    Role communication
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    Communicating role changes is as important as the UI itself.
                    I added email notifications that explain when a role changes
                    and what that role can do, plus an account menu reminder so
                    users can quickly confirm their active role per team.
                  </p>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                    It&apos;s also just as vital to celebrate the little moments. I
                    added a banner welcoming new users into their teams and
                    added another line of communication about their role.
                  </p>
                </div>
                <figure className="min-w-0">
                  <LightboxImageButton
                    src={`${base}rbac-role-comms.png`}
                    alt="Email and in-product messaging explaining a user's updated team role"
                    wrapperClassName="rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    className="w-full rounded-lg"
                    onOpen={setImageLightbox}
                  />
                  <figcaption className="mt-2 max-w-3xl text-sm leading-relaxed text-[#999999]">
                    Clear comms reduce surprise and support tickets during
                    large-scale role migrations.
                  </figcaption>
                </figure>
              </motion.section>
            </div>
          </div>
        </section>

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 md:px-12 lg:px-16">
        <section
          aria-labelledby="rbac-video-heading"
          className="relative z-[1] mt-16 w-full"
        >
          <h2 id="rbac-video-heading" className={sectionTitle}>
            Check out predefined roles - created by me!
          </h2>
          <div className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-slate-600/50 bg-black ring-1 ring-inset ring-white/5">
            <WalkthroughYoutubeEmbed />
          </div>
        </section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.17 }}
          className="case-study-card case-study-card--no-left-accent mt-16 flex flex-col items-start gap-6 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              See it on DigitalOcean
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#999999] md:text-base">
              Official launch post with product context and user impact.
            </p>
          </div>
          <a
            href="https://www.digitalocean.com/blog/introducing-new-predefined-roles-for-rbac"
            target="_blank"
            rel="noreferrer noopener"
            className="rainbow-cta group/cta relative inline-flex shrink-0 rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover/cta:opacity-95">
              <span className="flex min-w-0 flex-1 justify-center">
                Read the launch post
              </span>
              <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover/cta:ml-2 group-hover/cta:w-4">
                <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover/cta:opacity-100" />
              </span>
            </span>
          </a>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.18 }}
          aria-labelledby="rbac-quote-heading"
          className="mt-16"
        >
          <h2 id="rbac-quote-heading" className={sectionTitle}>
            🧑‍💻 User feedback
          </h2>
          <blockquote className="mt-6 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;We create a new resource in DigitalOcean for every customer we
              onboard and granularity in setting up access control is critical
              for the success of our products. RBAC capabilities with predefined
              roles available today are going to help us secure and limit access
              to authorization. We have been part of the beta program and are
              excited to use this at scale in our production environment.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Gregory, CISO of a storage platform
            </footer>
          </blockquote>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="rbac-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="rbac-peer-heading" className={sectionTitle}>
            ✍️ Peer feedback
          </h2>
          <p className="mt-4 max-w-3xl text-base text-[#999999] md:text-lg">
            Highlights from internal recognition after the launch.
          </p>
          <div className="case-study-card case-study-card--no-left-accent relative mt-8 rounded-xl p-6 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl"
              aria-hidden
            >
              {PEER_FEEDBACK_HEARTS.map((h, i) => (
                <Heart
                  key={i}
                  className="peer-feedback-heart"
                  style={{
                    left: h.left,
                    top: h.top,
                    width: h.size,
                    height: h.size,
                    color: h.color,
                    animationDelay: `${h.delay}s`,
                    animationDuration: `${h.duration}s`,
                  }}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>
            <div className="relative z-[1] grid gap-6 lg:grid-cols-2">
              <figure className="min-w-0">
                <LightboxImageButton
                  src={`${base}rbac-peer-feedback-ben.png`}
                  alt="Peer feedback comment on predefined roles work"
                  wrapperClassName="rounded-lg"
                  className="w-full rounded-lg drop-shadow-xl"
                  onOpen={setImageLightbox}
                />
              </figure>
              <figure className="min-w-0">
                <LightboxImageButton
                  src={`${base}rbac-peer-feedback-impact.png`}
                  alt="Peer feedback on business impact of the RBAC launch"
                  wrapperClassName="rounded-lg"
                  className="w-full rounded-lg drop-shadow-xl"
                  onOpen={setImageLightbox}
                />
              </figure>
            </div>
          </div>
        </motion.section>

        <p className="mt-12 text-center text-sm text-[#999999]">
          <Link to="/case-studies" className={linkClass}>
            ← All case studies
          </Link>
        </p>
      </div>

      <ImageLightbox
        open={imageLightbox !== null}
        onClose={() => setImageLightbox(null)}
        src={imageLightbox?.src ?? ""}
        alt={imageLightbox?.alt ?? ""}
      />

      <div
        ref={sectionIndexFloatingRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 md:bottom-8 md:right-8"
      >
        {isSectionIndexOpen ? (
          <div className="w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-slate-600/60 bg-slate-950/90 p-3 shadow-2xl ring-1 ring-inset ring-white/10 backdrop-blur">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-accent-readable">
              Navigate to
            </p>
            <div className="max-h-[50vh] space-y-1 overflow-y-auto pr-1">
              {CASE_STUDY_SECTION_INDEX.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800/80 hover:text-[#00aeef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsSectionIndexOpen((prev) => !prev)}
          aria-expanded={isSectionIndexOpen}
          aria-label={
            isSectionIndexOpen ? "Close section index" : "Open section index"
          }
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-600/70 bg-slate-900/85 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition-colors hover:border-[#00aeef]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#00aeef]/20"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[#00aeef] transition-[width] duration-200"
            style={{ width: `${Math.round(readingProgress * 100)}%` }}
          />
          <span className="inline-flex items-center gap-2 text-[#00aeef] group-hover:text-[#7ee8ff]">
            {isSectionIndexOpen ? (
              <X className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <List className="h-4 w-4 shrink-0" aria-hidden />
            )}
            Navigate
          </span>
          <span className="tabular-nums text-[11px] text-[#999999]">
            {Math.round(readingProgress * 100)}%
          </span>
        </button>
      </div>
    </section>
  );
}
