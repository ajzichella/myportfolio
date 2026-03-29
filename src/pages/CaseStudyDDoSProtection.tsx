import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, Heart, List, X } from "lucide-react";
import { FixedBlobBackdrop } from "../components/BlobBackground";
import { Bubbles } from "../components/Bubbles";
import { ImageLightbox, LightboxImageButton } from "../components/ImageLightbox";
import GradientText from "../components/GradientText";
import { LaunchImpactPartyPopper } from "../components/ResultsSectionBadge";

const base = import.meta.env.BASE_URL;

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

const sectionTitle = "text-xl font-bold tracking-tight text-white md:text-2xl";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-accent-readable";

const heroTagClass =
  "inline-flex items-center rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-200";

const resultMetricClass =
  "text-2xl font-bold md:text-3xl bg-gradient-to-br from-[#8fffc4] via-[#3ee0c8] to-[#5bdbd8] bg-clip-text text-transparent [filter:drop-shadow(0_0_12px_rgba(62,224,200,0.4))]";

const DDOS_SECTION_INDEX = [
  { id: "ddos-results-heading", label: "Results" },
  { id: "ddos-scope-heading", label: "Scope & collaboration" },
  { id: "ddos-research-heading", label: "Research & discovery" },
  { id: "ddos-scoping-heading", label: "Scoping" },
  { id: "ddos-mascot-heading", label: "🦐 DDoS Mascot" },
  { id: "ddos-emptystate-heading", label: "Empty State" },
  { id: "ddos-pricing-heading", label: "Pricing Modals" },
  { id: "ddos-overview-heading", label: "DDoS Overview" },
  { id: "ddos-alerts-heading", label: "Alert Creation" },
  { id: "ddos-logs-heading", label: "Log Details" },
  { id: "ddos-cancel-heading", label: "Cancellation" },
  { id: "ddos-beta-heading", label: "Beta" },
  { id: "ddos-challenges-heading", label: "Challenges & Opportunities" },
  { id: "ddos-peer-heading", label: "Peer Feedback" },
] as const;

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

export function CaseStudyDDoSProtection() {
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
      if (prev >= 0 && Math.round(next * 100) === Math.round(prev * 100)) return;
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
          commitReadingProgress(clamp01(main.scrollTop / mainScrollable));
          return;
        }
        if (windowScrollable > 1) {
          commitReadingProgress(clamp01(window.scrollY / windowScrollable));
          return;
        }
        commitReadingProgress(1);
        return;
      }
      if (windowScrollable <= 1) { commitReadingProgress(1); return; }
      commitReadingProgress(clamp01(window.scrollY / windowScrollable));
    };

    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => { frame = 0; compute(); });
    };

    compute();
    const main = document.getElementById("main-scroll");
    main?.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = typeof ResizeObserver !== "undefined" && page ? new ResizeObserver(() => schedule()) : null;
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
      const top = main.scrollTop + (targetRect.top - mainRect.top) - offset;
      const desiredTop = Math.max(0, top);
      main.scrollTo({ top: desiredTop, behavior: "smooth" });
      requestAnimationFrame(() => {
        const afterRaf = main.scrollTop;
        if (afterRaf === 0 && desiredTop > 0) {
          window.scrollTo({ top: Math.max(0, windowTop), behavior: "smooth" });
        }
      });
    } else {
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: "smooth" });
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
          <span className="text-slate-400">DDoS Protection</span>
        </motion.nav>

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="relative z-20 max-w-3xl"
        >
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}digitalocean-icon.svg`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span className="text-sm font-medium text-accent-readable">
              DigitalOcean | Cloud Computing &amp; Hosting
            </span>
            <span className={heroTagClass}>Security</span>
            <span className={heroTagClass}>Networking</span>
          </p>
          <h1 className="mt-3 pt-4">
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              DDoS Protection
            </GradientText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Building an e2e simple &ldquo;set it and forget it&rdquo; experience for
            DigitalOcean users against DDoS Attacks so users are protected and informed
            about their networks.
          </p>
        </motion.header>

        <div className="relative z-0 mt-12 grid gap-6 overflow-visible lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <motion.div
            {...fadeUpGlass}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="relative z-[2] grid content-start gap-6"
          >
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 ring-1 ring-inset ring-amber-300/[0.08]">
              <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>🤫</span>
              <p className="text-xs leading-relaxed text-amber-200/80">
                <span className="font-semibold text-amber-300">Secret Menu Item</span>
                {" "}– Please keep confidential
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Problem</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Unbeknownst to the customer, DigitalOcean already performs protective
                actions from DDoS (Distributed Denial of Service) attacks on their behalf,
                primarily to defend network operability. Due to users being unaware of
                this, many feature requests and support tickets are made for DDoS Protection.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Solution</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Find an optimal way to quickly bring to market a simply priced DDoS
                Protection product built atop existing capability. Adding the value of
                event visibility helps users become more aware of issues and a native
                DDoS Protection solution would reduce latency and the need to monitor
                various platforms.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Goals</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Build a DDoS Protection product that brings value to the user within their
                pricing needs that provides value and awareness of their
                infrastructure&apos;s health.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeUpGlass}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative min-w-0 overflow-visible lg:h-full"
          >
            <div
              className="pointer-events-none absolute left-[-3%] right-[-12%] top-[-7%] bottom-[-7%] z-0 origin-[56%_38%] scale-[1.02] translate-x-[5%] -translate-y-[3%] blur-2xl lg:left-[-2%] lg:right-[-13%] lg:top-[-9%] lg:bottom-[-9%] lg:translate-x-[6%] lg:-translate-y-[4%]"
              aria-hidden
            >
              <div className="absolute inset-0 rounded-[40%] bg-gradient-to-br from-[#00aeef]/35 via-violet-600/25 to-[#5227FF]/30 opacity-95" />
            </div>
            <Bubbles className="inset-y-[-10%] left-[-20%] right-[-4%] z-[1]" />
            <LightboxImageButton
              src={`${base}ddos1.png`}
              alt="DDoS Protection networking dashboard with Back Online notification card showing shrimp illustration and recovery message"
              wrapperClassName="relative z-[2] h-full w-full rounded-lg"
              className="h-full w-full rounded-lg object-contain object-top drop-shadow-xl"
              onOpen={setImageLightbox}
            />
          </motion.div>
        </div>

        {/* Results */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          aria-labelledby="ddos-results-heading"
          className="mt-16"
        >
          <div className="relative rounded-2xl border border-[#00aeef]/20 bg-slate-950/25 shadow-[0_0_40px_-18px_rgba(0,174,239,0.2)] ring-1 ring-inset ring-white/[0.06]">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-950 to-[#050814] px-5 py-8 ring-1 ring-inset ring-white/[0.07] sm:px-8 sm:py-10">
              <div className="pointer-events-none absolute -top-28 left-1/2 z-0 h-52 w-[min(110%,38rem)] -translate-x-1/2 rounded-full bg-[#00aeef]/[0.08] blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-24 right-0 z-0 h-36 w-56 rounded-full bg-slate-400/[0.04] blur-3xl" aria-hidden />
              <div className="relative z-[2]">
                <p className="inline-flex items-center gap-2 overflow-visible rounded-full border border-[#00aeef]/20 bg-[#00aeef]/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-readable">
                  <LaunchImpactPartyPopper />
                  Launch impact
                </p>
                <h2 id="ddos-results-heading" className="mt-4 block leading-tight">
                  <span className={resultMetricClass}>Results</span>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#b8c0cc] md:text-lg">
                  We were able to retain large scaling users due to the experience of this
                  product. The Beta saw incredible demand — and even resulted in the first
                  known Beta leaker in company history.
                </p>
                <div className="mt-8 grid gap-4 py-1 sm:grid-cols-3">
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <p className={resultMetricClass}>17</p>
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        Beta users (grew from target of 10 due to demand)
                      </p>
                    </div>
                  </div>
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <p className={resultMetricClass}>91</p>
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        users responded to Pendo survey on DDoS Protection needs
                      </p>
                    </div>
                  </div>
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <p className={resultMetricClass}>153</p>
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        lines of user survey feedback reviewed to kick off discovery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Screenshot grid */}
      <section
        className="relative z-10 mt-1 w-full min-w-0 py-0 md:mt-2"
        aria-label="DDoS Protection empty state, overview, and alert screenshots"
      >
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="grid w-full grid-cols-1 gap-2 px-0 py-6 sm:gap-3 md:grid-cols-3 md:gap-4 md:py-40 lg:gap-5"
        >
          <LightboxImageButton
            src={`${base}ddos-empty-state.png`}
            alt="DDoS Protection empty state on Networking tab explaining the product and its benefits"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}ddos-overview.png`}
            alt="DDoS Protection overview showing plan details, protected resources, alerts, and logs"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}ddos-alert.png`}
            alt="DDoS alert creation modal with webhook URL input and Test button"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
        </motion.div>
      </section>

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px] overflow-x-visible px-6 md:px-12 lg:px-16">
        {/* Scope & Collaboration */}
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-labelledby="ddos-scope-heading"
          className="case-study-card case-study-card--no-left-accent relative mt-3 rounded-xl p-6 md:mt-4 md:p-8"
        >
          <h2 id="ddos-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product Designer lead
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Timeline</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                5 months
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Partners</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Growth, PM, Network Security, Internet Edge and Backbone (IEB), Back-end
                Eng, Front-end Eng, Full-stack Eng, Insights, Marketing, Pdocs, Finance,
                Billing, Legal, Support, UX Research
              </dd>
            </div>
          </dl>
          <div className="mt-8 border-t border-slate-600/50 pt-8">
            <h3 className="text-lg font-semibold text-white">
              Cross-Functional Collaboration &amp; Alignment
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
              I worked with the Billing team to ensure DDoS Protection was integrated
              properly within the UI and invoice as well as crafting a new section for it
              as DDoS Protection&apos;s pricing model is unique.
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
              Support needed, well, support introducing DDoS Protection into our internal
              customer service portal. I collaborated with support engineers to create an
              efficient experience for support techs to look up DDoS information that
              attacked users may come to support with. This integration allows support
              techs to troubleshoot webhooks and view DDoS Attack information in order to
              best help our concerned users.
            </p>
            <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
              To ensure that DDoS Protection receives future iterations and its reduced
              scope is built back up over time, I&apos;ve created a very curated UX
              Roadmap that breaks down a larger experience and feature set into smaller
              versions. Stakeholders bought in and align with my simplified roadmap.
            </p>
          </div>
        </motion.section>

        {/* Research & Discovery */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="ddos-research-heading"
          className="mt-16"
        >
          <h2 id="ddos-research-heading" className={sectionTitle}>
            Research &amp; discovery
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">What is DDoS Protection?</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  DDoS Protection safeguards resources, infrastructure, and networks from
                  distributed denial-of-service (DDoS) attacks. These attacks are a
                  malicious targeted attempt to disrupt the targeted network by overwhelming
                  it with a flood of Internet traffic.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Why do people need protection from DDoS Attacks?
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  These malicious attacks often have the goal of attempting to take the
                  resource down/offline. This can cause major problems for businesses as
                  DDoS attacks slow downs at best and complete outage at worst. This can
                  result in data and financial loss. Having DDoS Protection can mitigate
                  this issue.
                </p>
              </div>
              <div>
                <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                  To kick off DDoS Protection and start to understand its users, I reviewed
                  153 lines of user survey feedback regarding DDoS attacks and created 2
                  distinctive user stories using the feedback to identify users and their
                  needs:
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Each user story touches on fleshing out our users by connecting real user
                  feedback to a persona that aligns, listing their needs and painpoints and
                  coupling those with potential solutions (JTBD), and sketching out ideas
                  with possible pre and post paid experiences based on their specific needs
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Competitive Analysis</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  As always, I researched competitors in the cloud space that offer DDoS
                  Protection to gain an understanding of their specs, features, pricing,
                  offerings, experience, flows, and interactions.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  To gather more user feedback, I worked with the PM to launch a Pendo
                  survey was displayed for users who were within Networking asking users for
                  their thoughts on their DDoS Protection needs, use cases, and how they
                  currently address those needs. This was answered by 91 users.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Through these results, I found an overwhelming eagerness from DO users
                  for the need of a DDoS Protection product and that users currently
                  primarily use Cloudflare for protection (which is free).
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Scoping and Experience Direction */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-scoping-heading"
          className="mt-16"
        >
          <h2 id="ddos-scoping-heading" className={sectionTitle}>
            Scoping and Experience Direction
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Using gathered user feedback and inspiration from competitors, I&apos;ve
                quickly put together some ideas to discuss with stakeholders regarding the
                plan options and experience based on limitations provided from the back-end
                team.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                While I pushed for users to be defaulted into a free plan (based on my user
                research that supported the idea of free DDoS Protection) that didn&apos;t
                offer a UI experience and allow users to upgrade to receive alerts and
                DDoS-related information, stakeholders opted for a paid-only experience.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                I quickly mocked up a simplified version of a post-paid experience (shown
                below) and socialized it in our general engineering slack channel to gather
                internal feedback. Some feedback received mentioned: how large the attack
                was, what kind of DDoS attack was it, what resource type was hit, how long
                did the attack last, and when the attack ended
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-sketch.png`}
                alt="Early sketch of post-paid DDoS Protection experience showing attack overview"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* DDoS Mascot */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-mascot-heading"
          className="mt-16"
        >
          <h2 id="ddos-mascot-heading" className={sectionTitle}>
            🦐 DDoS Protection Mascot
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <p className="text-base leading-relaxed text-[#999999] md:text-lg">
              Introducing Jacques, the cleaner shrimp. Digitalocean ties a sea creature to
              a specific product and DDoS Protection needed one. I was thinking of a sea
              creature that represents both the offensive and defensive sides of DDoS
              Protection and thought of a crab. Unfortunately the crab was taken and then
              thought of a cleaner shrimp. DDoS Protection is about scrubbing for bad
              traffic and thought that a cleaner shrimp would be a perfect fit. Jacque was
              beloved and adopted by the DDoS team and used Jacque as a way to excite each
              other in communications. Jacques later gets a &ldquo;glow up&rdquo; from the
              illustration team but this sketch stays in the team&apos;s hearts.
            </p>
            <figure className="min-w-0 rounded-xl bg-white/90 p-4 shadow-md ring-1 ring-black/5">
              <LightboxImageButton
                src={`${base}ddos-jacques.png`}
                alt="Jacques the cleaner shrimp — DDoS Protection mascot sketch"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Empty State */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-emptystate-heading"
          className="mt-16"
        >
          <h2 id="ddos-emptystate-heading" className={sectionTitle}>
            Empty State
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                I asked internal cohorts about where they would go to search for DDoS
                Protection and Networking was the resounding winner. DDoS Protection&apos;s
                flow starts on the Networking tab of the DigitalOcean platform, next to
                Firewalls in which closely relates to DDoS Protection. This empty states
                helps breakdown DDoS Protection and how it can benefit the user. I crafted
                this empty state to be minimal and simple as to not overwhelm users with
                information but enough to provide an idea of safety with the product.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-empty-state.png`}
                alt="DDoS Protection empty state on Networking tab with product overview and CTA"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Pricing Modals */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-pricing-heading"
          className="mt-16"
        >
          <h2 id="ddos-pricing-heading" className={sectionTitle}>
            Add DDoS Protection – Pricing Modals
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-pricing-modals.png`}
                alt="DDoS Protection pricing modals showing team-wide protection features and cost estimates"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                This modal interaction appears when the users clicks the CTA on the empty
                state. In order to view DDoS Protection&apos;s features and experience,
                users must purchase DDoS Protection. I crafted this modal to detail that
                it is a team-wide protection for specific resource types and the pricing
                structure. I made sure to disclose that users can cancel at any time as
                some product have cancelling restrictions. Documentation is provided if
                users want more detail.
              </p>
              <p className="mt-4 text-base font-semibold text-slate-200 md:text-lg">
                There are 2 users types for pricing:
              </p>
              <ul className="mt-3 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
                <li className="list-disc list-inside">
                  <span className="font-medium text-slate-300">
                    New User or User with no invoices:
                  </span>{" "}
                  this user type would have no previous invoice to call and therefore have
                  no price estimates.
                </li>
                <li className="list-disc list-inside">
                  <span className="font-medium text-slate-300">
                    Users with a previous month&apos;s invoice:
                  </span>{" "}
                  most users that would enroll in a paid DDoS Protection subscription
                  would have resources that they are wanting to protect. Using the previous
                  month&apos;s invoice, we are able to provide users would an estimated
                  cost and save themselves mental math. This experience is in tune with
                  DO&apos;s upfront comprehensive pricing value. Ideally, I wanted to
                  provide a more exact number for users based on their current monthly
                  usage but this call was out of scope from the Billing team, so I worked
                  with the Billing team to create a much quicker and smaller call based on
                  the previous month&apos;s invoice.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* DDoS Protection Overview */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-overview-heading"
          className="mt-16"
        >
          <h2 id="ddos-overview-heading" className={sectionTitle}>
            DDoS Protection Overview
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                This overview acts as the primary experience for subscribed DDoS Protection
                users. This allows users to edit their plan, re-explains which resources
                are protected with their purchase, and displays DDoS Alerts and Logs.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                The Alerting and Logging are the largest benefits of being a subscribed
                user of DDoS Protection. Users are able to add up to 20 webhook alerts,
                notifying them of attacks and Blackholes. To users, awareness of incoming
                attacks allows them to be prepared to defend or reroute their
                infrastructure.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                Logs are generated for users whether or not they set up alerts. Originally,
                Alerts was the only awareness experience I crafted but I wanted users to
                get the most out of their post-purchase experience by providing a similar
                feeling of safety and have a singular place to store their DDoS information.
                Logs would also prove to be useful to those who have notifications on
                multiple platforms and do not remember which alerts go where. Due to
                technical and speed restraints, we could not gather some requested
                information from the back-end such as attack volume and when attacks are
                over this first MVP launch.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-overview.png`}
                alt="DDoS Protection overview showing plan details, protected resources, alerts, and logs"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Alert Creation */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-alerts-heading"
          className="mt-16"
        >
          <h2 id="ddos-alerts-heading" className={sectionTitle}>
            Alert Creation
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-alert.png`}
                alt="DDoS alert creation modal with webhook URL input and Test button"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                To increase immediate awareness of users&apos; infrastructures, DDoS
                Attack Start and Blackhole alerts can be created. Users are able to create
                webhook alerts to receive real-time notifications on whichever platforms
                they like to use the most (e.g. email, Slack, Discord, etc.). To ensure
                users know if they have successfully setup their webhooks, I worked with
                engineers to implement a Test button which will push the payload example
                to the user&apos;s inserted webhook. A success/failure toast message will
                tell the user if we have been able to successfully send the request. Users
                can check their original platform to see if they receive our payload test
                and feel certain that their request is working and will notify them of
                future DDoS attacks.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                The payload example is accessible to users via a modal. Users may need the
                sample payload to setup their webhook (for instance, Slack requires it).
                It also gives the user some foresight into which information we are able
                to send them in the case of a DDoS Attack or Blackhole.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                Created alerts are added to a table in which users can easily Test their
                webhook without going into the editing flow.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Log Details */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-logs-heading"
          className="mt-16"
        >
          <h2 id="ddos-logs-heading" className={sectionTitle}>
            Log Details
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                From the DDoS Logs in the overview experience, users are able to view the
                Log Details of individual events. The Log Details serves as a summary of
                the specific attack that the user selected and contains a duplicate of the
                payload at the time of the attack. Users would need Log Details for
                reporting documentation and troubleshooting.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-log.png`}
                alt="DDoS log details showing attack summary and payload for reporting and troubleshooting"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Cancellation */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="ddos-cancel-heading"
          className="mt-16"
        >
          <h2 id="ddos-cancel-heading" className={sectionTitle}>
            Cancellation
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}ddos-cancel.png`}
                alt="DDoS Protection cancellation modal with prorated amount, data deletion warning, and log download option"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Users are easily able to cancel their DDoS Protection by cancelling from
                the overview. I designed this cancellation modal to notify users that it
                is a prorated amount of what they have used if they cancel. I also alerted
                the users that their Alerts and Logs would be deleted if they cancel. In
                anticipating a canceling user would want a record of their Logs, I inserted
                an easy click to download their Logs within the modal. This Log download is
                the same on the overview but makes it easier for users to download right
                then and there.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Beta */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.13 }}
          aria-labelledby="ddos-beta-heading"
          className="mt-16"
        >
          <h2 id="ddos-beta-heading" className={sectionTitle}>
            🚢 Beta
          </h2>
          <div className="case-study-card case-study-card--no-left-accent mt-6 rounded-xl p-6 md:p-8">
            <p className="text-base leading-relaxed text-[#999999] md:text-lg">
              The Private Beta offers a chance to gain more intimate feedback from users,
              conduct further research, test for stability, scan for failures, access
              features, and measure future success all while more engineering work is
              happening to further the product in preparation for the next iteration.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
              We initially wanted a small and easy-to-manage Beta group with a max of 10
              users, but there was such a large demand to access this Beta that we grew to
              17 users! We also had our first Beta leaker in known company history (users
              agree to terms that they cannot share anything about the Beta in a public
              format). We knew that there was incredible demand for this DDoS Protection
              product!
            </p>
          </div>

          <h3 className="mt-10 text-lg font-semibold text-white">
            Conversations with users
          </h3>
          <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
            Customer Success Managers are assigned to each Beta user and frequently talk
            directly to the Beta users and gather very valuable feedback and report their
            findings back to the DDoS Protection Team.
          </p>
          <p className="mt-3 text-base font-semibold text-slate-200 md:text-lg">
            The Top 5 themes from direct user feedback:
          </p>
          <ol className="mt-4 grid gap-y-3 text-base leading-relaxed text-[#999999] md:text-lg">
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">1.</span>
              <span>Users mostly use Cloudflare for their current protection but would like to consolidate into one platform</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">2.</span>
              <span>More price sensitive users want this DDoS Protection for free and compare to competitors that often have better protection at no cost</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">3.</span>
              <span>Beta users had split feedback on the team-wide protection. Some users wanted the ability to pick which resources to protect while other users liked how off-hands it was. It was a near 50/50 split.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">4.</span>
              <span>More DDoS-related data was requested such as Attacker IP, end times, and attack volume</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">5.</span>
              <span>All users had an interest in both using the UI and API (no API was available for Beta)</span>
            </li>
          </ol>

          <h3 className="mt-10 text-lg font-semibold text-white">Surveys</h3>
          <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
            Several surveys were sent during the Beta. I crafted 2 segmented surveys to
            send users during their Beta time. The first survey I sent contained questions
            regarding their onboarding experience, their initial thoughts on the offerings,
            the ease of setup, and pricing. The second survey I wrote was sent deeper into
            Beta when users had more time to play around. These questions were more centered
            around what they felt was missing and what they feel could be improved.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
            The UX Research Team also sent out their own survey and to a much larger
            audience; one outside of the Beta users that I sent my surveys too. The
            research team found:
          </p>
          <ol className="mt-4 grid gap-y-3 text-base leading-relaxed text-[#999999] md:text-lg">
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">1.</span>
              <span>All participants know of DDoS attacks/protection and have experience using DDoS Protection from attacks</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">2.</span>
              <span>There was an expectation of Network Layer 7 protection</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">3.</span>
              <span>10 Gbps was the most popular option for when attack mitigation should kick in</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">4.</span>
              <span>100 Gbps was the most popular mitigation capacity size</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-semibold text-accent-readable">5.</span>
              <span>There may not be a need for additional tiers (evaluation was based on how many paid tiers users would need/pay for)</span>
            </li>
          </ol>
        </motion.section>

        {/* Challenges & Opportunities */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.13 }}
          aria-labelledby="ddos-challenges-heading"
          className="mt-16"
        >
          <h2 id="ddos-challenges-heading" className={sectionTitle}>
            🤔 Challenges
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            While building this product, a layoff occurred and we lost a lot of resources
            and teammates. We had to plan accordingly to keep the product going. Morale was
            also hit but we had to keep pushing through.
          </p>

          <h2 className={`${sectionTitle} mt-10`}>
            ✨ Opportunities
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            With the help of the UX Roadmap, DDoS Protection has a really solid opportunity
            to have its unique place in the DDoS Protection market and offer insight and
            help users and businesses stay online and informed! It is truly an exciting
            product and we were able to retain large scaling users due to the experience
            of this product.
          </p>
        </motion.section>

        {/* Peer Feedback */}
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="ddos-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="ddos-peer-heading" className={sectionTitle}>
            ✍️ Peer feedback
          </h2>
          <blockquote className="mt-6 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>&ldquo;I&apos;d put you on any product I work on, anytime&rdquo;</p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              MM, Product Operations Director
            </footer>
          </blockquote>
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
            <div className="relative z-[1]">
              {/* Add peer feedback screenshot images here: ddos-peer-feedback.png */}
              <p className="text-sm text-[#999999]">
                Peer feedback images coming soon — drop{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-accent-readable">
                  ddos-peer-feedback.png
                </code>{" "}
                into <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-accent-readable">/public</code> to display here.
              </p>
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
              {DDOS_SECTION_INDEX.map((item) => (
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
          aria-label={isSectionIndexOpen ? "Close section index" : "Open section index"}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-600/70 bg-slate-900/85 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition-colors hover:border-[#00aeef]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#00aeef]/20" />
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
