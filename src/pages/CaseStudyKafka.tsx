import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronRight, Heart, List, X } from "lucide-react";
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

const KAFKA_SECTION_INDEX = [
  { id: "kafka-results-heading", label: "Results" },
  { id: "kafka-scope-heading", label: "Scope & collaboration" },
  { id: "kafka-research-heading", label: "Research" },
  { id: "kafka-cluster-heading", label: "Cluster Create" },
  { id: "kafka-onboard-heading", label: "Onboarding" },
  { id: "kafka-topics-heading", label: "Topic Creation" },
  { id: "kafka-table-heading", label: "Table Overview" },
  { id: "kafka-challenges-heading", label: "Challenges & Opportunities" },
  { id: "kafka-video-heading", label: "Walkthrough" },
  { id: "kafka-quote-heading", label: "👨‍💻 User Feedback" },
  { id: "kafka-peer-heading", label: "Peer Feedback" },
] as const;

const WALKTHROUGH_EMBED_SRC =
  "https://www.youtube.com/embed/bEgUI4uB8DQ?start=3";

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

function KafkaAnimatedStat({
  from,
  to,
  format,
  active,
  delay = 0,
}: {
  from: number;
  to: number;
  format: (v: number) => string;
  active: boolean;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setDisplay(to);
      return;
    }
    const controls = animate(from, to, {
      duration: 1.75,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [active, to, delay, reduceMotion, from]);

  return <p className={resultMetricClass}>{format(display)}</p>;
}

export function CaseStudyKafka() {
  const [isSectionIndexOpen, setIsSectionIndexOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [imageLightbox, setImageLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const pageRef = useRef<HTMLElement>(null);
  const sectionIndexFloatingRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, { once: true, margin: "-80px" });

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
          <span className="text-slate-400">DBaaS - Kafka</span>
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
            <span className={heroTagClass}>Managed databases</span>
            <span className={heroTagClass}>DevOps</span>
          </p>
          <h1 className="mt-3 pt-4">
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              DBaaS - Kafka
            </GradientText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Integrating a Kafka solution into our Managed Databases product to simplify
            users&apos; architecture and Topic upkeep as well as provide a reliable
            environment to prevent data loss.
          </p>
        </motion.header>

        <div className="relative z-0 mt-12 grid gap-6 overflow-visible lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <motion.div
            {...fadeUpGlass}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="relative z-[2] grid content-start gap-6"
          >
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Problem</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Our scaling users want to use a managed service for their Kafka clusters so
                they can have more time to focus on their goals instead of their architecture.
                Self-managed Kafka is a huge learning curve and challenge for users and takes
                several months to get a production-ready system up and running.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Solution</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Integrate Kafka into our Managed Database engine solutions and provide a
                simple experience to setup Kafka-specific inputs. This allows users to not
                worry about the provisioning, managing, scaling, updating, and security of
                Kafka clusters and help mitigate human-error of self-managing a multi-node
                cluster that could lead to operational downtime and data loss.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Goals</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Ensure Apache Kafka is fully integrated into our Managed Database engines
                with high availability and reliability with an easy-to-use experience that
                breaks down Kafka&apos;s complex &ldquo;Topics&rdquo;.
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
              src={`${base}kafka-overview.png`}
              alt="Kafka cluster overview showing Topics and Users tables"
              wrapperClassName="relative z-[2] h-full w-full rounded-lg"
              className="h-full w-full rounded-lg object-cover object-top drop-shadow-xl"
              onOpen={setImageLightbox}
            />
          </motion.div>
        </div>

        {/* Results */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          aria-labelledby="kafka-results-heading"
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
                <h2 id="kafka-results-heading" className="mt-4 block leading-tight">
                  <span className={resultMetricClass}>Results</span>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#b8c0cc] md:text-lg">
                  Though accounting only for 0.52% of engine type usage of the total DBaaS
                  user count, managed Kafka engines have nearly a 3x ARPU (average revenue
                  per user) than all other offered managed engines
                </p>
                <div ref={resultsRef} className="mt-8 grid gap-4 py-1 sm:grid-cols-2">
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <KafkaAnimatedStat
                        from={0}
                        to={3}
                        format={(v) => `~${Math.round(v)}x`}
                        active={resultsInView}
                        delay={0.1}
                      />
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        ARPU vs. all other managed database engines
                      </p>
                    </div>
                  </div>
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <KafkaAnimatedStat
                        from={0}
                        to={0.52}
                        format={(v) => `${v.toFixed(2)}%`}
                        active={resultsInView}
                        delay={0.3}
                      />
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        of total DBaaS engine type usage
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
        aria-label="Kafka cluster create, topic overview, and connection screenshots"
      >
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="grid w-full grid-cols-1 gap-2 px-0 py-6 sm:gap-3 md:grid-cols-3 md:gap-4 md:py-40 lg:gap-5"
        >
          <LightboxImageButton
            src={`${base}kafka-create.png`}
            alt="Kafka cluster create flow showing 3-node configuration and pricing breakdown"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}kafka-topic.png`}
            alt="Kafka topic overview table showing topics list and user roles"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}kafka-tables.png`}
            alt="Post-creation view showing both Topics and Users tables"
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
          aria-labelledby="kafka-scope-heading"
          className="case-study-card case-study-card--no-left-accent relative mt-3 rounded-xl p-6 md:mt-4 md:p-8"
        >
          <h2 id="kafka-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product Designer Lead for DBaaS
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Timeline</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                3 months
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Partners</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                PM, Technical PM, Back-end Eng, Front-end Eng, Insights, Marketing, Pdocs
              </dd>
            </div>
          </dl>
        </motion.section>

        {/* Research */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="kafka-research-heading"
          className="mt-16"
        >
          <h2 id="kafka-research-heading" className={sectionTitle}>
            Research
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">What is Kafka?</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Apache Kafka is a distributed event triggers and streaming platform used
                  to handle large amounts of real-time data that is used by more than 80%
                  of Fortune 100 companies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Why use Managed Kafka?</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Self-managed Kafka has a high operational overhead and comes with risks
                  including potential customer data loss if misconfigured. Using a managed
                  Kafka clusters allows users to setup a Kafka database within minutes that
                  is reliable and easy to scale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Research approach</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  As always, competitors are researched to evaluate how their managed Kafka
                  solutions are presented to their users and how the complexity is broken down.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  NPS and CSAT surveys were used to view past feedback that mentioned Kafka.
                  Additionally an initial interest survey was sent to existing DBaaS users
                  and answered by 60+ users about:
                </p>
                <ul className="mt-4 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
                  <li className="list-disc list-inside">Their knowledge of event streaming technologies</li>
                  <li className="list-disc list-inside">What they currently use or have used</li>
                  <li className="list-disc list-inside">What challenges they face with self-managed Kafka</li>
                  <li className="list-disc list-inside">What pain points they expect to solve with Managed Kafka</li>
                  <li className="list-disc list-inside">How they plan to use Managed Kafka for testing and production</li>
                  <li className="list-disc list-inside">What information or tutorials would be helpful</li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Research findings</h3>
                <ul className="mt-4 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
                  <li className="list-disc list-inside">
                    Average 4/5 rating knowledge of streaming technologies. Users are generally knowledgeable
                  </li>
                  <li className="list-disc list-inside">
                    Users are looking for a managed solution and to simplify their architecture
                  </li>
                  <li className="list-disc list-inside">
                    Users are wanting uptime reliability and High Availability
                  </li>
                  <li className="list-disc list-inside">
                    Users are concerned about pricing and the ease of Topic management
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Beta feedback</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  While the UI or experience wasn&apos;t brought up by Beta users (I consider
                  that a good thing), Beta users requested 2 graphs be added into Insights,
                  messages per second and incoming messages. Most users use Kafka through
                  the API.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Price was the largest concern during Beta. We were able to work through
                  configurations to offer lower cost Kafka clusters that are still stable
                  and are highly available.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cluster Create */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="kafka-cluster-heading"
          className="mt-16"
        >
          <h2 id="kafka-cluster-heading" className={sectionTitle}>
            Cluster Create
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Kafka has different creation and configuration requirements than any of
                DO&apos;s other Managed Database engines. Kafka is unique in the fact that
                it absolutely requires 3 nodes instead of the usual per node configuration
                that is offered. This is due to the fact that Kafka requires High
                Availability as well as its Replica condition. In order to properly convey
                this in our UI, I designed an info box describing that Kafka requires 3
                nodes in a cluster and that pricing is based on that. Additionally, our
                engines usually have read-only and standby nodes so I made sure to make
                users aware of that in case they find themselves wondering why those options
                are not visible.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                Since we are packaging the Kafka configurations much differently than other
                databases, I made sure to label the total review section to thoroughly
                explain to users that they are in fact priced for 3 nodes and I broke down
                the specs for each node. This breakdown is not available or needed for the
                other DBaaS engines.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}kafka-create.png`}
                alt="Kafka cluster create flow showing 3-node configuration and per-node spec breakdown"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Onboarding & Connection Details */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="kafka-onboard-heading"
          className="mt-16"
        >
          <h2 id="kafka-onboard-heading" className={sectionTitle}>
            Onboarding &amp; Connection Details
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}kafka-onboard.png`}
                alt="Kafka onboarding flow guiding users to set up their first Topic and connect"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                To quickly guide users on setting up their Kafka clusters after
                provisioning, I have created an onboarding experience in which users can
                quickly set up their first Kafka Topic and connect to their architecture.
                To aid users in creating a Highly Available Topic, the defaulted values
                are optimal for stability so users can simply name their Topic and quickly
                move on without being bogged down by making sure they input the right
                values.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
                Users are quickly able to copy and paste their connection details. I
                reinforced security messaging by a persistent VPC info box explaining why
                users should connect via VPC. Additionally, I collaborated with the
                back-end engineering and product documentation team to create a connection
                video for Kafka to help users who may be stuck connecting the Kafka cluster.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Topic Creation */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="kafka-topics-heading"
          className="mt-16"
        >
          <h2 id="kafka-topics-heading" className={sectionTitle}>
            Topic Creation
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Topics are what make Kafka specifically unique in DO&apos;s DBaaS experience.
                As mentioned above in Onboarding, I&apos;ve added prefilled values into the
                inputs so users are quickly able to create Highly Available Topics by simply
                just naming them. To help guide users and educate them about fields that
                may not understand, I have created helpful tooltips that not only explain
                what the item does, but talk about the limitations. The limitations for
                both the Retention fields are so incredibly high that users should not
                realistically encounter the max limit.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}kafka-create-topic.png`}
                alt="Create Topic form with partition count, replication factor, and retention settings with tooltips"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Table Overview & User Roles */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="kafka-table-heading"
          className="mt-16"
        >
          <h2 id="kafka-table-heading" className={sectionTitle}>
            Table Overview &amp; User Roles
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}kafka-permissions.png`}
                alt="Kafka topic permissions modal with Admin, Produce, Consume, and Consume and Produce roles"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                DO&apos;s other database tables typically show Users &amp; Databases but Kafka
                is a bit different. For Kafka, I have split the table overviews into Topics
                &amp; Users. Topics is the most important aspect of Kafka while Users have
                roles in which they are able to access Topics. I designed a modal for the
                permissions editor that clearly describe what those roles are and how those
                roles apply to Topics. For this first launch, all permission types are
                applied to all Topics.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Challenges & Opportunities */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.13 }}
          aria-labelledby="kafka-challenges-heading"
          className="mt-16"
        >
          <h2 id="kafka-challenges-heading" className={sectionTitle}>
            🤔 Challenges
          </h2>
          <ul className="mt-6 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
            <li className="list-disc list-inside">
              This was my very first task when I first joined DO and I&apos;ve never worked
              on such a technical product before so there were some learning curves that I
              had to overcome in order to provide the best experience for DBaaS users
            </li>
            <li className="list-disc list-inside">
              The ability to assign specific users to Topics was removed out of this first
              launch Kafka but allows us to see if this feature is highly requested by
              production Kafka users
            </li>
          </ul>

          <h2 className={`${sectionTitle} mt-10`}>
            ✨ Opportunities
          </h2>
          <ul className="mt-6 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
            <li className="list-disc list-inside">
              Beta Users requested several Kafka features that they would like to see:
              Kafka Connect, Kafka MirrorMaker, and ZooKeeper
            </li>
            <li className="list-disc list-inside">
              This first GA launch of Kafka doesn&apos;t have the ability to assign users
              to a specific Topic but it is something the DBaaS team and users would love
              the ability to do to increase security in their architecture
            </li>
          </ul>
        </motion.section>

        {/* Walkthrough */}
        <section
          aria-labelledby="kafka-video-heading"
          className="relative z-[1] mt-16 w-full"
        >
          <h2 id="kafka-video-heading" className={sectionTitle}>
            Check out DBaaS Kafka
          </h2>
          <div className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-slate-600/50 bg-black ring-1 ring-inset ring-white/5">
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
          </div>
        </section>

        {/* User Feedback */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.18 }}
          aria-labelledby="kafka-quote-heading"
          className="mt-16"
        >
          <h2 id="kafka-quote-heading" className={sectionTitle}>
            👨‍💻 User feedback
          </h2>
          <blockquote className="mt-6 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;DigitalOcean Managed Kafka simplified and sped up our management of
              Kafka. Self-managing Kafka, it would take about eight weeks to go from
              initial development to a production-ready system. With DigitalOcean Managed
              Kafka, we cut that timeline to just one week.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Daniel, CTO of a sports tech company
            </footer>
          </blockquote>
          <blockquote className="mt-8 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;The ability to create topics using a UI is super nice. It used to be
              a CLI job.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Unknown survey user
            </footer>
          </blockquote>
        </motion.section>

        {/* Peer Feedback */}
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="kafka-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="kafka-peer-heading" className={sectionTitle}>
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
            <div className="relative z-[1]">
              {/* Add peer feedback screenshot images here: kafka-peer-feedback.png */}
              <p className="text-sm text-[#999999]">
                Peer feedback images coming soon — drop{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-accent-readable">
                  kafka-peer-feedback.png
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
              {KAFKA_SECTION_INDEX.map((item) => (
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
