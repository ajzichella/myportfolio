import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";

const base = import.meta.env.BASE_URL;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const linkClass =
  "font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

const sectionTitle =
  "text-xl font-bold tracking-tight text-white md:text-2xl";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-accent-readable";

/** Neon green / teal gradient for animated result counters */
const resultMetricNumberClass =
  "text-2xl font-bold tabular-nums md:text-3xl bg-gradient-to-br from-[#8fffc4] via-[#3ee0c8] to-[#5bdbd8] bg-clip-text text-transparent [filter:drop-shadow(0_0_12px_rgba(62,224,200,0.4))]";

const WALKTHROUGH_EMBED_SRC =
  "https://www.youtube.com/embed/MKSNUTt3PuQ?si=uEFqLt-00ti7sGjA";

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

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="mt-6">
      <img
        src={src}
        alt={alt}
        className="w-full max-w-4xl rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"
      />
      {caption ? (
        <figcaption className="mt-2 max-w-3xl text-sm leading-relaxed text-[#999999]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type ResultNumberFormat = "int-plus" | "percent" | "approx-percent";

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

/** Subtle palette; pieces spawn at the top edge and fall through the card (seamless loop). */
const CONFETTI_PALETTE = [
  "rgba(0, 174, 239, 0.5)",
  "rgba(103, 232, 249, 0.42)",
  "rgba(165, 180, 252, 0.38)",
  "rgba(148, 163, 184, 0.4)",
  "rgba(251, 191, 36, 0.32)",
];

const LAUNCH_BURST_DURATION = 0.55;
const LAUNCH_BURST_CYCLE = 2.15;

/** Party popper (🎉) with a short radial “confetti shot” synced to the pop motion. */
function LaunchImpactPartyPopper() {
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

function ResultsConfetti({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean | null;
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        leftPct: 3 + ((i * 17) % 94),
        delay: i * 0.032,
        duration: 2.1 + (i % 4) * 0.22,
        w: 4 + (i % 3),
        h: 6 + (i % 4),
        baseRot: i * 37,
        drift: ((i % 5) - 2) * 16,
        color: CONFETTI_PALETTE[i % CONFETTI_PALETTE.length] ?? "rgba(0, 174, 239, 0.45)",
        rounded: i % 3 === 0,
      })),
    [],
  );

  if (reducedMotion || !active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl"
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute will-change-transform ${p.rounded ? "rounded-full" : "rounded-[1px]"}`}
          style={{
            left: `${p.leftPct}%`,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
          }}
          initial={{
            top: "0%",
            x: 0,
            opacity: 0.42,
            rotate: p.baseRot,
          }}
          animate={{
            top: ["0%", "108%"],
            x: [0, p.drift],
            rotate: [p.baseRot, p.baseRot + 200 + p.id * 6],
            opacity: [0.42, 0.48, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            times: [0, 0.06, 0.86, 1],
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        />
      ))}
    </div>
  );
}

export function CaseStudyPredefinedRoles() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, { once: true, amount: 0.28 });
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full min-w-0 min-h-screen shrink-0 overflow-x-hidden px-6 py-16 md:px-12 lg:px-16">
      <BlobBackground />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px]">
        <motion.nav
          {...fadeUp}
          transition={{ duration: 0.35 }}
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1 text-sm text-[#999999]"
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
          className="max-w-3xl"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}digitalocean-icon.svg`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span>DigitalOcean · IAM &amp; access control</span>
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            RBAC - Predefined Roles
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Expanding role options so teams can enforce least privilege without
            the complexity users see from hyperscaler IAM, delivered in the
            &quot;DO Simple&quot; way.
          </p>
        </motion.header>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Problem</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              With only three roles available, customers needed finer-grained
              ways to isolate who could manage infrastructure. Demand for safer,
              clearer access became a top company priority in 2024.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Solution</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              Ship additional predefined roles grounded in common use cases and
              customer requests, so teams can assign the right access quickly,
              without a bespoke build for every scenario.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Goals</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              Help users apply least privilege, offer more restrictive RBAC that
              still feels simple, and set the platform up for the next phases of
              access control.
            </p>
          </div>
        </motion.div>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          aria-labelledby="rbac-results-heading"
          className="mt-16"
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
              <ResultsConfetti
                active={resultsInView}
                reducedMotion={reduceMotion}
              />

              <div className="relative z-[2]">
                <p className="inline-flex items-center gap-2 overflow-visible rounded-full border border-[#00aeef]/20 bg-[#00aeef]/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-readable">
                  <LaunchImpactPartyPopper />
                  Launch impact
                </p>
                <h2
                  id="rbac-results-heading"
                  className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl"
                >
                  Results
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#b8c0cc] md:text-lg">
                  In the first weeks after launch, newly introduced predefined
                  roles reached broad adoption across teams and API usage, with
                  strong continued uptake as customers refined how they govern
                  access.
                </p>

                <div className="mt-8 grid gap-4 py-1 sm:grid-cols-3">
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                    animate={
                      resultsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: reduceMotion ? 0 : 14 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      delay: reduceMotion ? 0 : 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="results-metric-glow relative min-h-0 min-w-0"
                  >
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <AnimatedResultNumber
                        value={6000}
                        format="int-plus"
                        active={resultsInView}
                        delay={0.08}
                        className={resultMetricNumberClass}
                      />
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        team members assigned predefined roles
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                    animate={
                      resultsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: reduceMotion ? 0 : 14 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      delay: reduceMotion ? 0 : 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="results-metric-glow relative min-h-0 min-w-0"
                  >
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <AnimatedResultNumber
                        value={13}
                        format="percent"
                        active={resultsInView}
                        delay={0.2}
                        className={resultMetricNumberClass}
                      />
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        of API tokens on the new roles (millions of daily hits)
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                    animate={
                      resultsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: reduceMotion ? 0 : 14 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      delay: reduceMotion ? 0 : 0.23,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="results-metric-glow relative min-h-0 min-w-0"
                  >
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <AnimatedResultNumber
                        value={23}
                        format="approx-percent"
                        active={resultsInView}
                        delay={0.32}
                        className={resultMetricNumberClass}
                      />
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        month-over-month growth in new role usage
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-16 rounded-xl border border-slate-600/50 bg-slate-900/30 p-6 md:p-8 ring-1 ring-inset ring-white/5"
        >
          <h2 className={sectionTitle}>Scope &amp; collaboration</h2>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            This was one of the largest cross-product efforts at DigitalOcean in
            recent years: permissions touch nearly every surface, so alignment
            across design, product, engineering, insights, GTM, docs, research,
            support, and API teams was essential to ship coherently.
          </p>
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
          <div className="mt-6 space-y-8">
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
                <span className="font-medium text-slate-300">13 interviews</span>
                , focusing on how teams invite collaborators and govern access
                day to day. Findings shaped a simpler path to more granular
                roles.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="rbac-findings-heading"
          className="mt-16"
        >
          <h2 id="rbac-findings-heading" className={sectionTitle}>
            Research findings
          </h2>
          <ul className="mt-6 max-w-3xl list-inside list-disc space-y-3 text-base leading-relaxed text-[#999999] md:text-lg marker:text-accent-readable">
            <li>
              Assign a role at invite time; don&apos;t force a default-then-reassign
              loop.
            </li>
            <li>
              Users compare us to AWS and GCP IAM; they want less overwhelming
              granularity and clearer defaults.
            </li>
            <li>
              Most wanted broad access{" "}
              <span className="text-slate-300">except delete</span>; the next
              most common need was a true read-only role across the platform.
            </li>
            <li>
              Teams were comfortable with CRUD as a mental model and wanted
              future paths to custom permission control.
            </li>
            <li>
              Project-scoped limits on who holds a role mattered for larger
              orgs.
            </li>
          </ul>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.13 }}
          aria-labelledby="rbac-strategy-heading"
          className="mt-16"
        >
          <h2 id="rbac-strategy-heading" className={sectionTitle}>
            Strategy, process, and vision
          </h2>
          <h3 className="mt-6 text-lg font-semibold text-white">UX roadmap</h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            Research pointed to one north star: granular RBAC that still feels
            DO-simple. I framed the roadmap in three slices by need and effort:{" "}
            <span className="font-medium text-slate-300">predefined roles</span>{" "}
            (this launch), then{" "}
            <span className="font-medium text-slate-300">custom roles</span>, and
            later <span className="font-medium text-slate-300">conditions</span>{" "}
            for even finer control.
          </p>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.14 }}
          aria-labelledby="rbac-docs-heading"
          className="mt-16"
        >
          <h2 id="rbac-docs-heading" className={sectionTitle}>
            Documentation &amp; system rules
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            I led a broad documentation effort so permission behavior stays
            consistent as the platform grows: when to hide vs disable, how we
            describe CRUD to users vs engineers, how errors surface, and patterns
            that increase role awareness across surfaces.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            The spreadsheet below became the single source of truth about{" "}
            <span className="font-medium text-slate-300">80% of the launch</span>{" "}
            effort, after we moved off an unscalable &quot;screenshot every
            screen&quot; approach. I coordinated ~10% of every product
            designer&apos;s time to complete rows for their domains, using an
            existing engineering inventory as the foundation.
          </p>
          <Figure
            src={`${base}rbac-permissions-spreadsheet.png`}
            alt="Spreadsheet matrix of DigitalOcean products, permissions, and CRUD actions used as the RBAC source of truth"
            caption="Cross-functional permission matrix: the operational backbone for predefined roles and future RBAC work."
          />
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          aria-labelledby="rbac-experience-heading"
          className="mt-16"
        >
          <h2 id="rbac-experience-heading" className={sectionTitle}>
            Experience &amp; communication
          </h2>

          <h3 className="mt-10 text-lg font-semibold text-white">
            Invite with a role
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            Research showed invites had to carry the right role upfront. Users
            no longer needed to add someone with a default, then reassign, saving
            a full step in team onboarding and ongoing admin work.
          </p>
          <Figure
            src={`${base}rbac-invite-members.png`}
            alt="Invite team members flow with role selection in DigitalOcean"
          />

          <h3 className="mt-12 text-lg font-semibold text-white">
            Assign predefined roles
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            Team owners with the right permissions can update roles from team
            settings through a focused modal that explains scope and impact.
          </p>
          <Figure
            src={`${base}rbac-change-role-modal-full.png`}
            alt="Change role modal listing predefined DigitalOcean team roles"
          />

          <h3 className="mt-12 text-lg font-semibold text-white">
            Role communication
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            Shipping the UI was only half the story. I added email when a role
            changes, a reminder in the account menu so users always know their
            active role per team, and in-product moments, like a welcome
            banner, that reinforce what access they have.
          </p>
          <Figure
            src={`${base}rbac-role-comms.png`}
            alt="Email and in-product messaging explaining a user's updated team role"
            caption="Clear comms reduce surprise and support tickets during large-scale role migrations."
          />
          <Figure
            src={`${base}rbac-success-banner.png`}
            alt="Success banner welcoming a user to a team and summarizing their role"
          />
        </motion.section>

        <section
          aria-labelledby="rbac-video-heading"
          className="relative z-[1] mt-16 w-full"
        >
          <h2 id="rbac-video-heading" className={sectionTitle}>
            Walkthrough
          </h2>
          <div className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-slate-600/50 bg-black ring-1 ring-inset ring-white/5">
            <WalkthroughYoutubeEmbed />
          </div>
        </section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.17 }}
          className="mt-16 flex flex-col items-start gap-6 rounded-xl border border-slate-600/50 bg-slate-900/40 p-6 md:flex-row md:items-center md:justify-between md:p-8 ring-1 ring-inset ring-white/5"
        >
          <div>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              See it on DigitalOcean
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#999999] md:text-base">
              Official launch write-up with product context and customer impact.
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
            Customer voice
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
            Peer feedback
          </h2>
          <p className="mt-4 max-w-3xl text-base text-[#999999] md:text-lg">
            Highlights from internal recognition after the launch.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <figure>
              <img
                src={`${base}rbac-peer-feedback-ben.png`}
                alt="Peer feedback comment on predefined roles work"
                className="w-full rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"
              />
            </figure>
            <figure>
              <img
                src={`${base}rbac-peer-feedback-impact.png`}
                alt="Peer feedback on business impact of the RBAC launch"
                className="w-full rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"
              />
            </figure>
          </div>
        </motion.section>

        <p className="mt-12 text-center text-sm text-[#999999]">
          <Link to="/case-studies" className={linkClass}>
            ← All case studies
          </Link>
        </p>
      </div>
    </section>
  );
}
