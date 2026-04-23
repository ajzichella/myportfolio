import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronRight, Heart, List, X } from "lucide-react";
import { FixedBlobBackdrop } from "../components/BlobBackground";
import { Bubbles } from "../components/Bubbles";
import BlurText from "../components/BlurText";
import { ImageLightbox, LightboxImageButton } from "../components/ImageLightbox";
import GradientText from "../components/GradientText";
import { ResultsSection } from "../components/ResultsSection";
import { PAW_PATH_D } from "../lib/pawPath";
import { kindWordsTestimonials } from "../data/kindWords";
import { PEER_FEEDBACK_HEARTS } from "../data/peerFeedbackHearts";

const base = import.meta.env.BASE_URL;

const MOLLY_KIND_WORDS = kindWordsTestimonials.find((t) =>
  t.attribution.includes("Molly H"),
);

const CUSTOM_ROLES_LAUNCH_BLOG_URL =
  "https://www.digitalocean.com/blog/introducing-custom-roles";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const fadeUpGlass = {
  initial: { y: 20 },
  whileInView: { y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const linkClass =
  "font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

const sectionTitle =
  "text-xl font-bold tracking-tight text-white md:text-2xl";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-accent-readable";

const heroTagClass =
  "inline-flex items-center rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-200";

const CASE_STUDY_SECTION_INDEX = [
  { id: "cr-results-heading", label: "Results" },
  { id: "cr-scope-heading", label: "Scope & collaboration" },
  { id: "cr-research-heading", label: "Research" },
  { id: "cr-strategy-heading", label: "Core experience principles" },
  { id: "cr-experience-heading", label: "Experience & communication" },
  { id: "cr-quote-heading", label: "User voice" },
  { id: "cr-opportunities-heading", label: "Opportunities" },
  { id: "cr-peer-heading", label: "Peer feedback" },
] as const;

const SCOPE_COLLAB_STATS = [
  { value: 13, label: "user interviews (with UXR)" },
  { value: 9, label: "usability participants (prototype sessions)" },
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
      aria-label="Research and scope scale"
    >
      <div className="grid grid-cols-2 gap-8 lg:gap-6">
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

const PAW_VIEWBOX_WIDTH = 1600;
const PAW_VIEWBOX_HEIGHT = 2400;

type CrExperiencePaw = { x: number; y: number; r: number; o: number };

function buildCrExperiencePaws(): CrExperiencePaw[] {
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

const CR_EXPERIENCE_PAWS = buildCrExperiencePaws();

const CrExperiencePawPaths = memo(function CrExperiencePawPaths() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-75 text-slate-300/40 [mask-image:radial-gradient(ellipse_76%_72%_at_50%_42%,#000_34%,#000_62%,transparent_86%)]"
      viewBox={`0 0 ${PAW_VIEWBOX_WIDTH} ${PAW_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {CR_EXPERIENCE_PAWS.map((paw, i) => (
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

export function CaseStudyCustomRoles() {
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
      <FixedBlobBackdrop />
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
          <span className="text-slate-400">Custom Roles</span>
        </motion.nav>

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="relative z-20 max-w-3xl"
        >
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}digitalocean-icon.svg`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span className="text-sm font-medium text-accent-readable">
              DigitalOcean | Cloud Computing &amp; Hosting
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
              RBAC - Custom Roles
            </GradientText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Custom roles further DO Simple RBAC. Teams can define, create, and
            manage roles with the permissions they
            want, that "just work", in a flow that stays intuitive and minimally complex instead of
            echoing the overwhelming IAM patterns users know (and loathe) from AWS and GCP.
          </p>
        </motion.header>

        <div className="relative z-0 mt-12 grid min-h-0 gap-6 overflow-visible lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-stretch lg:gap-8">
          <motion.div
            {...fadeUpGlass}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="relative z-[2] grid content-start gap-6"
          >
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Problem</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Users need more granular access than predefined roles alone.
                The risk is repeating what they dislike elsewhere: dense
                permission lists, unclear dependencies, and combinations that set
                them up to fail.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Solution</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Provide a simple experience where users can create custom roles with
                the permissions they desire and easily assign those roles to their
                team members.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Goals</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Keep access secure with no surprises (least privilege), prevent
                failures by not allowing role definitions that would break in use, and
                keep creation simple to meet needs of enterprise security-focused users.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeUpGlass}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative flex min-h-0 min-w-0 items-center justify-center overflow-visible lg:h-full"
          >
            <div
              className="pointer-events-none absolute left-[-3%] right-[-12%] top-[-7%] bottom-[-7%] z-0 origin-[56%_38%] scale-[1.02] translate-x-[5%] -translate-y-[3%] blur-2xl lg:left-[-2%] lg:right-[-13%] lg:top-[-9%] lg:bottom-[-9%] lg:translate-x-[6%] lg:-translate-y-[4%]"
              aria-hidden
            >
              <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-[#00aeef]/35 via-violet-600/25 to-[#5227FF]/30 opacity-95" />
            </div>
            <Bubbles className="inset-y-[-10%] left-[-20%] right-[-4%] z-[1]" />
            <LightboxImageButton
              src={`${base}create%20CR_thumb.png`}
              alt="Create custom role flow in DigitalOcean: stepper, role name and description, permissions, and summary sidebar with totals"
              wrapperClassName="relative z-[2] flex h-auto min-h-0 w-full max-w-full items-center justify-center rounded-lg lg:h-full"
              className="h-auto w-full max-h-[min(680px,82vh)] rounded-lg object-contain object-top drop-shadow-xl lg:h-full lg:max-h-full"
              onOpen={setImageLightbox}
            />
          </motion.div>
        </div>

        <ResultsSection
          headingId="cr-results-heading"
          description={
            <>
              After launch, custom roles saw strong early adoption: nearly 5,000
              assignments across thousands of teams, with measurable uptake in
              enterprise accounts.
            </>
          }
          stats={[
            {
              value: 5000,
              format: "int-tilde",
              label: "custom roles assigned to users",
            },
            {
              value: 2857,
              format: "int",
              label: "teams using custom roles",
            },
            {
              value: 6,
              format: "percent",
              label: "usage among enterprise teams",
            },
          ]}
        />
      </div>

      <section
        className="relative z-10 mt-1 w-full min-w-0 py-0 md:mt-2"
        aria-label="Custom role assignment flow and post-create role access overview"
      >
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="grid w-full grid-cols-1 gap-2 px-0 py-6 sm:gap-3 md:grid-cols-2 md:gap-4 md:py-40 lg:gap-5"
        >
          <LightboxImageButton
            src={`${base}CRassign.png`}
            alt="Create custom role: assign optional step with team member table, search, and summary sidebar with permission totals"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}post%20create%20listing%20overview%20-%20open.png`}
            alt="Role Access custom roles list with an expanded role showing control panel and API namespace permission breakdown"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
        </motion.div>
      </section>

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 md:px-12 lg:px-16">
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-labelledby="cr-scope-heading"
          className="case-study-card case-study-card--no-left-accent relative mt-3 rounded-xl p-6 md:mt-4 md:p-8"
        >
          <h2 id="cr-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <p className="mt-2 text-base font-medium leading-snug text-accent-readable md:text-lg">
            IAM design lead on the next chapter of DO Simple RBAC
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            UXR partnered throughout: interviews and usability to pressure-test
            creation, required and related permissions, and assignment flows; joint
            synthesis on where people struggled with other clouds; and ongoing
            sessions so findings fed prototypes and launch readiness.
          </p>
          <ScopeCollaborationStats />
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                IAM design lead for end-to-end UX: creation, required and related
                permissions, assignment paths, and post-create management.
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Research</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                13 interviews and 9 usability participants across prototype sessions,
                plus ongoing IAM/RBAC session summaries.
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <dt className={labelClass}>Artifacts</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                PRFAQ for RBAC phase 2, custom roles workbook, permission naming
                and categorization references, and the shared IAM spreadsheet
                used across product areas.
              </dd>
            </div>
          </dl>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="cr-research-heading"
          className="mt-16"
        >
          <h2 id="cr-research-heading" className={sectionTitle}>
            Research
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  What people told us
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                  Users consistently compare DigitalOcean to AWS, Azure, and GCP and cite
                  complexity as their biggest frustration. Too many permissions and unclear
                  documentation were the most common complaints. They want granular control,
                  but not at the cost of simplicity. CRUD checkboxes were the most commonly
                  requested pattern, with several users describing exactly that before even
                  seeing the prototype. The custom role creation flow tested well, with the
                  majority rating it 7/7 for ease-of-use.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Usability focus
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                  Most participants went straight to granular permissions instead of templates.
                  When Basic Role templates sat above the list, people read them as mandatory or
                  confusing to edit and simply did not seem too useful, so templates moved into an accordion as an optional starting
                  point. Clone role was a praised feature by testers and the clearest shortcut for similar roles. Project-level
                  access came up unprompted in almost every session.
                </p>
              </div>
            </div>

            <div>
              <h3
                id="cr-research-findings-heading"
                className="text-lg font-semibold text-white"
              >
                Research findings
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                In July 2024, 9 prototype sessions on custom role creation and multi-role
                needs, with participants from hobbyists and SMBs to enterprises managing 400+ users.
              </p>
              <ul className="mt-4 grid max-w-3xl gap-y-3 marker:text-[#00aeef] text-base leading-relaxed text-[#999999] md:text-lg">
                <li className="list-disc list-inside pl-1">
                  <span className="font-semibold text-slate-200">Project-level access.</span>{" "}
                  Came up unprompted in almost every session. Many skip the use of DO&apos;s projects
                  today because it does not govern permissions.
                </li>
                <li className="list-disc list-inside pl-1">
                  <span className="font-semibold text-slate-200">Creation flow.</span>{" "}
                  Most rated 7/7 for ease of use. CRUD checkboxes matched what people asked for
                  before they saw the UI in testing. Participants surprisingly has pleasant reactions to the required permissions modal, which completely took me by surprise.
                </li>
                <li className="list-disc list-inside pl-1">
                  <span className="font-semibold text-slate-200">Templates and assignments.</span>{" "}
                  Basic Role templates read as required until they lived in an accordion. Only 2 of 9 users needed multiple
                  roles per user; most expected project-level rules or custom roles to cover their needs.
                </li>
                <li className="list-disc list-inside pl-1">
                  <span className="font-semibold text-slate-200">Simplicity.</span>{" "}
                  Participants kept referencing the mess of AWS and asked that DO Simple UI stay intact as
                  RBAC depth grows.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="cr-strategy-heading"
          aria-describedby="cr-strategy-intro"
          className="relative isolate mt-16 overflow-hidden rounded-2xl border border-slate-600/45 bg-gradient-to-br from-slate-950 via-[#0b1424] to-slate-950 p-6 shadow-[0_0_52px_-16px_rgba(0,174,239,0.22)] ring-1 ring-inset ring-white/[0.06] md:p-8"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-[#00aeef]/45 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent opacity-80"
            aria-hidden
          />
          <h2 id="cr-strategy-heading" className="relative z-[1]">
            <GradientText
              colors={["#7ee8ff", "#c4b5fd", "#5eead4"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-xl font-bold tracking-tight md:text-2xl"
            >
              Core experience principles
            </GradientText>
          </h2>
          <p
            id="cr-strategy-intro"
            className="relative z-[1] mt-4 max-w-3xl text-sm leading-relaxed text-[#999999] md:text-base"
          >
            I created these core principles to guide both myself and team members in order
            to establish alignment and ensure our decisions reflected our goals and user
            needs for custom roles.
          </p>
          <div className="relative z-[1] mt-5 min-w-0">
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5 md:p-6">
                <h4 className="text-base font-semibold tracking-tight text-[#7ee8ff] md:text-lg">
                  No surprises
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                  Users should not be surprised they have more (or less) permissions
                  than expected. This also follows the Principle of Least Privilege.
                  Language and selection stay plain so each permission reads like what
                  it actually does in the product. Permissions are bundled and clear so admins
                  are never left guessing what their role can do once they hit create.
                </p>
              </div>
              <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5 md:p-6">
                <h4 className="text-base font-semibold tracking-tight text-[#c4b5fd] md:text-lg">
                  Prevent failures
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                  In the spirit of DO Simple, users should not be able to create any custom
                  roles that would result in failures. The experience sets them up for success.
                  Additionally, this lessens UX and technical burdens by avoiding extra experiences to
                  handle errors due to the wrong combination of permissions.
                </p>
              </div>
              <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5 md:p-6">
                <h4 className="text-base font-semibold tracking-tight text-[#5eead4] md:text-lg">
                  Simplicity is everything
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                  In research, users compared this work to other clouds and said again and
                  again how much they dislike those role experiences, with too many permissions
                  and too much complexity. CRUD-shaped coverage of core resource types, paired
                  with a simple creation path, balances granularity with a flow light enough to
                  assign to teammates with confidence.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <section
        aria-labelledby="cr-experience-heading"
        className="relative isolate z-10 mt-16 w-full min-w-0 overflow-x-visible"
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
          className="pointer-events-none absolute inset-0 z-0 overflow-x-clip"
          aria-hidden
        >
          <CrExperiencePawPaths />
        </div>
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 py-6 md:px-12 md:py-10 lg:px-16">
          <h2 id="cr-experience-heading" className="sr-only">
            Experience &amp; communication
          </h2>
          <BlurText
            text="Experience & communication"
            className="pt-8 text-accent-readable text-2xl font-bold tracking-tight md:pt-10 md:text-3xl lg:pt-12 lg:text-4xl"
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
            aria-labelledby="cr-create-flow-heading"
            className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
          >
            <div className="min-w-0">
              <h3
                id="cr-create-flow-heading"
                className="text-lg font-semibold text-white"
              >
                Creating a custom role
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                Creating a new custom role uses a 3-step flow: name the role and choose primary permissions (with a
                required-permissions modal when needed), optionally add related
                capabilities, then optionally assign the role immediately.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
              Users mostly jump into the granular selection of permissions, but I crafted a selection of templates from our basic roles (except Owner) or other custom
roles they may have already created to jump start the selection process if the user wants some direction. The granular selection of permissions provide search and grouped headers tame long resource lists where
                search and grouped headers tame long resource lists where
                most actions are CRUD-shaped but some include extras like
                assign or access cluster.
              </p>
            </div>
            <figure className="min-w-0 w-full max-w-2xl md:max-w-3xl lg:ml-auto lg:max-w-4xl">
              <LightboxImageButton
                src={`${base}CRtemplate.png`}
                alt="Permissions step with Basic roles and Custom roles templates to pre-fill granular permission selections"
                wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                className="w-full max-h-[min(660px,78vh)] rounded-lg object-contain object-top"
                onOpen={setImageLightbox}
              />
            </figure>
          </motion.section>

          <motion.section
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.06 }}
            aria-labelledby="cr-required-permissions-heading"
            className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)] lg:items-start"
          >
            <div className="relative z-10 grid min-w-0 w-full grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-0">
              <figure className="min-w-0 md:relative md:z-0 md:-mr-3">
                <LightboxImageButton
                  src={`${base}req_accordion.png`}
                  alt="Droplet permissions row expanded to show required permissions accordion with VPC and Regions dependencies"
                  wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  className="w-full max-h-[min(420px,48vh)] rounded-lg object-contain object-top md:max-h-[min(392px,50vh)]"
                  onOpen={setImageLightbox}
                />
              </figure>
              <figure className="min-w-0 md:relative md:z-10 md:-ml-3">
                <LightboxImageButton
                  src={`${base}req_modal.png`}
                  alt="Required Permissions modal listing dependencies before Add permissions and continue"
                  wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  className="w-full max-h-[min(400px,46vh)] rounded-lg object-contain object-top md:max-h-[min(392px,50vh)]"
                  onOpen={setImageLightbox}
                />
              </figure>
            </div>
            <div className="relative z-0 min-w-0">
              <h3
                id="cr-required-permissions-heading"
                className="text-lg font-semibold text-white"
              >
                Required permissions
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                When a permission has required dependencies, it opens an accordion
                that lists what is required and why. Read permissions are also
                required by any action outside read and are selected automatically, because the UI is not usable
                without them. If the user still misses a required permission, we
                show a modal before we add it so nothing is added without them
                knowing.
              </p>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.08 }}
            aria-labelledby="cr-related-permissions-heading"
            className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
          >
            <div className="relative z-0 min-w-0">
              <h3
                id="cr-related-permissions-heading"
                className="text-lg font-semibold text-white"
              >
                Related permissions
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                Related permissions differ from required permissions; they are
                suggested, optional permissions. We surface permissions that are
                connected to what they already picked in the previous step but are
                not required for the product to work. For example, backups pair well
                with a Droplet but are not required for a Droplet to be created.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                In testing, related permissions were very helpful: people added
                many of them and built more functional roles to assign to their team
                members without bundle bloat.
              </p>
            </div>
            <figure className="relative z-10 min-w-0 w-full max-w-2xl md:max-w-3xl lg:ml-auto lg:max-w-4xl">
              <LightboxImageButton
                src={`${base}relatedperms.png`}
                alt="Create custom role flow on the optional related permissions step: suggested permissions by resource type with summary sidebar and continue"
                wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                className="w-full max-h-[min(660px,78vh)] rounded-lg object-contain object-top"
                onOpen={setImageLightbox}
              />
            </figure>
          </motion.section>

          <motion.section
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            aria-labelledby="cr-assign-during-heading"
            className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)] lg:items-start"
          >
            <figure className="relative z-10 min-w-0">
              <LightboxImageButton
                src={`${base}CRassign.png`}
                alt="Create custom role: assign optional step with team member table, search, and summary sidebar with permission totals"
                wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
                onOpen={setImageLightbox}
              />
              <figcaption className="mt-2 max-w-3xl text-sm leading-relaxed text-[#999999]">
                Optional assign during creation keeps the team table, search, and
                summary totals in one place so admins can ship the role without an
                extra trip through settings.
              </figcaption>
            </figure>
            <div className="relative z-0 min-w-0">
              <h3
                id="cr-assign-during-heading"
                className="text-lg font-semibold text-white"
              >
                Assign during creation
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                While creating a custom role, the person creating it can assign it
                to a team member immediately to reduce mental workload and steps.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                Outside of the custom role creation experience, users reassign
                roles in team settings with the change role modal, which supports
                both basic roles and custom roles.
              </p>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.11 }}
            aria-labelledby="cr-overview-after-create-heading"
            className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.45fr)] lg:items-start"
          >
            <div className="relative z-0 min-w-0">
              <h3
                id="cr-overview-after-create-heading"
                className="text-lg font-semibold text-white"
              >
                Overview after creation
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                After creation, the role access tab lists custom roles with both
                control panel and API namespaces in the table; from there they
                can edit, clone, or delete (delete only when no one is still
                assigned, otherwise we send them to team settings to change roles
                first).
              </p>
            </div>
            <figure className="relative z-10 min-w-0 w-full max-w-2xl md:max-w-3xl lg:ml-auto lg:max-w-4xl">
              <LightboxImageButton
                src={`${base}post%20create%20listing%20overview%20-%20open.png`}
                alt="Role Access custom roles list with an expanded role showing control panel and API namespace permission breakdown"
                wrapperClassName="w-full rounded-lg focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
                onOpen={setImageLightbox}
              />
            </figure>
          </motion.section>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 md:px-12 lg:px-16">
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.17 }}
          className="case-study-card case-study-card--no-left-accent mt-16 flex flex-col items-start gap-6 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              See it on DigitalOcean
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#999999] md:text-base">
              Official launch post on custom roles: what they are, how they work,
              key features, and how teams use them with least privilege.
            </p>
          </div>
          <a
            href={CUSTOM_ROLES_LAUNCH_BLOG_URL}
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
          aria-labelledby="cr-quote-heading"
          aria-describedby="cr-quote-intro"
          className="mt-16"
        >
          <h2 id="cr-quote-heading" className={sectionTitle}>
            🧑‍💻 User voice
          </h2>
          <p
            id="cr-quote-intro"
            className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg"
          >
            Representative feedback from usability tests and user interviews on custom roles
            and related admin needs.
          </p>
          <blockquote className="mt-6 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;As account owner / super admin, would like to be able to create and
              assign a lower account admin role that would be able to invite team members and
              assign permissions but not remove them.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Abhishek (monitoring SaaS), on admin permissions
            </footer>
          </blockquote>
          <blockquote className="mt-10 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;Maybe good role for someone who needs to monitor, an intern, consultant,
              etc. But would want to make sure they can&apos;t see secrets or customer info in
              DBs.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Ismael regarding Resource Viewer predefined role on limiting what viewers can see,
              inspiring outside CRUD permissions for a select few.
            </footer>
          </blockquote>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.185 }}
          aria-labelledby="cr-opportunities-heading"
          className="mt-16 border-t border-slate-600/50 pt-10 md:pt-12"
        >
          <h2 id="cr-opportunities-heading" className={sectionTitle}>
            ✨ Opportunities
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            To meet baseline user expectations of RBAC, our work does not end with
            custom roles. Users expect project-level conditions. This was asked of
            us over 90% of the time, with many stating that custom roles are not
            useful to them and they will not use the feature until they can restrict
            those roles to specific projects. Some people mentioned wanting to
            restrict roles to tags or even to very specific resources, but the
            overwhelming majority want to limit roles to projects.
          </p>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            People also expect to assign more than 1 role to the same user. That
            expectation ties directly to project-level scope: they want different
            permissions for the same person in different projects, which implies
            multi-role support. In interviews, 1 participant described wanting a
            junior engineer to have broad permissions in a sandbox project but very
            limited access in production. Examples in that vein surfaced repeatedly
            in interviews and usability sessions.
          </p>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            Sadly, previewing the role on the platform before finalizing was descoped.
            In research, participants said it would have been very useful to see how
            permissions would behave before committing, and some felt unsure what the
            final results would be without being able to try it on the platform first.
            Bringing preview back into the fold in a future release remains a clear
            opportunity to close that gap.
          </p>
        </motion.section>

        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="cr-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="cr-peer-heading" className={sectionTitle}>
            ✍️ Peer feedback
          </h2>
          {MOLLY_KIND_WORDS ? (
            <div className="case-study-card case-study-card--no-left-accent relative mt-6 rounded-xl p-6 md:p-8">
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
              <blockquote className="relative z-[1] m-0 w-full min-w-0 max-w-none space-y-4 border-l-4 border-[#00aeef]/60 pl-6 md:space-y-5">
                {MOLLY_KIND_WORDS.paragraphs.map((paragraph, i) => {
                  const n = MOLLY_KIND_WORDS.paragraphs.length;
                  const isFirst = i === 0;
                  const isLast = i === n - 1;
                  return (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-slate-200 md:text-lg"
                    >
                      {isFirst ? "\u201c" : null}
                      {paragraph}
                      {isLast ? "\u201d" : null}
                    </p>
                  );
                })}
                <footer className="pt-2 text-sm font-medium not-italic text-[#999999]">
                  {MOLLY_KIND_WORDS.attribution}
                </footer>
              </blockquote>
            </div>
          ) : null}
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
