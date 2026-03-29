import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
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

const CHECKOUT_SECTION_INDEX = [
  { id: "checkout-results-heading", label: "Results" },
  { id: "checkout-scope-heading", label: "Scope & collaboration" },
  { id: "checkout-research-heading", label: "Research" },
  { id: "checkout-approach-heading", label: "Approach" },
  { id: "checkout-features-heading", label: "Checkout Features" },
  { id: "checkout-financing-heading", label: "Financing" },
  { id: "checkout-giftcards-heading", label: "Gift Cards" },
  { id: "checkout-delivery-heading", label: "Delivery Scheduling" },
  { id: "checkout-challenges-heading", label: "Challenges" },
  { id: "checkout-peer-heading", label: "Peer Feedback" },
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

export function CaseStudyEnhancedCheckout() {
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
          <span className="text-slate-400">Enhanced Checkout</span>
        </motion.nav>

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="relative z-20 max-w-3xl"
        >
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}storis-favicon.ico`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span className="text-sm font-medium text-accent-readable">
              STORIS | Retail ERP &amp; eCommerce
            </span>
            <span className={heroTagClass}>eCommerce</span>
            <span className={heroTagClass}>B2B and B2C</span>
            <span className={heroTagClass}>Billing</span>
          </p>
          <h1 className="mt-3 pt-4">
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-3xl font-bold tracking-tight md:text-4xl"
            >
              eCommerce Enhanced Checkout Redesign
            </GradientText>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            The old multi-step checkout provided a broken checkout system that affected our
            eCommerce clients and shopping end users. The new checkout provides a more
            streamlined experience to increase conversions and revenue.
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
                The checkout processes tens of millions of dollars per month in revenue from
                our clients/users. The checkout has been used for quite awhile by our
                clients is outdated and is an overall frustrating user experience. Checkout
                abandonments are very high on average with the old checkout.
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Solution</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                An enhanced checkout experience that focuses on users to decrease time
                needed for checkout completion and improved usability
              </p>
            </div>
            <div className="case-study-card case-study-card--no-left-accent rounded-xl p-5">
              <p className={labelClass}>Goals</p>
              <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                Increase revenue and eCommerce conversion rate. Decrease checkout
                abandonments
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
              src={`${base}estoris2.png`}
              alt="STORIS admin Checkout Settings with delivery options and store pickup"
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
          aria-labelledby="checkout-results-heading"
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
                <h2 id="checkout-results-heading" className="mt-4 block leading-tight">
                  <span className={resultMetricClass}>Results</span>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#b8c0cc] md:text-lg">
                  eCommerce Conversion rate: An average increase of 0.11% was seen with
                  our Beta clients, contributing to their rising revenue and orders
                </p>
                <div className="mt-8 grid gap-4 py-1 sm:grid-cols-2">
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <p className={resultMetricClass}>+0.11%</p>
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        avg. eCommerce conversion rate increase with Beta clients
                      </p>
                    </div>
                  </div>
                  <div className="results-metric-glow">
                    <div className="relative z-[1] flex h-full min-h-0 flex-col rounded-[6px] bg-[#03040A]/40 px-5 py-5 ring-1 ring-inset ring-white/[0.06] backdrop-blur-[2px]">
                      <p className={resultMetricClass}>5→3</p>
                      <p className="mt-2 text-sm leading-snug text-slate-200">
                        step button clicks reduced for a saved user
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Figma Prototype CTA */}
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="case-study-card case-study-card--no-left-accent mt-10 flex flex-col items-start gap-6 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              View Desktop Prototype
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#999999] md:text-base">
              Interactive high-fidelity prototype of the enhanced checkout experience.
            </p>
          </div>
          <a
            href="https://www.figma.com/proto/ffHNjh3bVhxk39xWmsYgTe/Secure-Checkout-Plugin-Desktop?node-id=857%3A7&viewport=830%2C772%2C0.07792052626609802&scaling=scale-down-width"
            target="_blank"
            rel="noreferrer noopener"
            className="rainbow-cta group/cta relative inline-flex shrink-0 rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover/cta:opacity-95">
              <span className="flex min-w-0 flex-1 justify-center">
                Open Figma prototype
              </span>
              <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover/cta:ml-2 group-hover/cta:w-4">
                <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover/cta:opacity-100" />
              </span>
            </span>
          </a>
        </motion.section>
      </div>

      {/* Screenshot grid */}
      <section
        className="relative z-10 mt-1 w-full min-w-0 py-0 md:mt-2"
        aria-label="Enhanced checkout shipping, payment, and place order screenshots"
      >
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.09 }}
          className="grid w-full grid-cols-1 gap-2 px-0 py-6 sm:gap-3 md:grid-cols-3 md:gap-4 md:py-40 lg:gap-5"
        >
          <LightboxImageButton
            src={`${base}checkout-shipping.png`}
            alt="Enhanced checkout — saved user shipping information step"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}checkout-payment.png`}
            alt="Enhanced checkout — saved user payment step"
            wrapperClassName="w-full"
            className="h-auto max-h-[min(920px,88vh)] w-full rounded-lg object-contain"
            onOpen={setImageLightbox}
          />
          <LightboxImageButton
            src={`${base}checkout-place-order.jpg`}
            alt="Enhanced checkout — saved user place order final step"
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
          aria-labelledby="checkout-scope-heading"
          className="case-study-card case-study-card--no-left-accent relative mt-3 rounded-xl p-6 md:mt-4 md:p-8"
        >
          <h2 id="checkout-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product Designer
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Partners</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Funding clients, stakeholders, product team, development team
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Context</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Client-funded project; met with funding clients in person to gather
                requirements before design began
              </dd>
            </div>
          </dl>
        </motion.section>

        {/* Research */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="checkout-research-heading"
          className="mt-16"
        >
          <h2 id="checkout-research-heading" className={sectionTitle}>
            User Research
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            For this checkout redesign, several different types of research were used in
            order to maximize efficiency going forward and providing an enhanced experience
            for our client&apos;s users.
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Baymard UX Audit</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  We had a Baymard UX Audit completed on one of our client&apos;s sites
                  and reviewed the data and recommendations provided back to us.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Baymard Premium</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  I utilized the vast library of Baymard Premium to access 49,000+ of
                  eCommerce user research in order to make better design and UX decisions.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white">Competitive Analysis</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Additionally, I completed Competitive Analysis by scrutinizing various
                  top checkouts of both eCommerce individual retailers (e.g. Best Buy,
                  wayfair, Walmart, etc.) and eCommerce software companies (e.g. Shopify,
                  Magento, BigCommerce) to see how competition design their checkout
                  procceses.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Usability</h3>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Many usability decisions were made based on Baymard&apos;s user research
                  in combination with the Competitive Analysis and overall personal
                  eCommerce experience. Usability Testing was also completed throughout
                  the wireframing and higher fidelity processes. 8 users were tested in
                  total during the initial design steps. Tested users were shown the
                  prototype and evaluated on the ease-of-use and possible confusion points.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[#999999] md:text-lg">
                  Currently, the update release is with our Beta clients and we are closely
                  monitoring their use of the new checkout and receiving feedback from our
                  clients and from their users.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Approach */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="checkout-approach-heading"
          className="mt-16"
        >
          <h2 id="checkout-approach-heading" className={sectionTitle}>
            Approach
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            After meeting the funding clients by flying to Florida and gathering the
            requirements, I started the research and design process. Using the compounded
            information provided by the research and competitive analysis, I created a
            wireframe and user flow to achieve and optimized checkout process to would be
            easy for our direct client users to install and maintain on their ecom sites
            and well as for the B2C online shopping users.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            I presented the wireframe and userflow to the clients and stakeholders as well
            as the product team in order to gain initial feedback and to see if project
            requirements were met.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            The fidelity increased as the task progressed, leading up to the high-fidelity
            prototype ready for development hand-off and testing.
          </p>
        </motion.section>

        {/* Checkout Features */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="checkout-features-heading"
          className="mt-16"
        >
          <h2 id="checkout-features-heading" className={sectionTitle}>
            Checkout Features
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <ul className="grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
              <li className="list-disc list-inside">
                Reduction of step buttons from 5 clicks to 3 for a saved user
              </li>
              <li className="list-disc list-inside">
                Removal of the eCommerce client navigation and complete separation into its
                own environment
              </li>
              <li className="list-disc list-inside">
                Adding saving ability so users would no longer lose all checkout progress
                if they went to a previous step
              </li>
              <li className="list-disc list-inside">
                Billing information is no longer the first step and is now Shipping/Pickup
              </li>
              <li className="list-disc list-inside">
                Inclusion of the Terms agreement disclaimer to remove the checkbox agreement
                previously used in the cart before checkout
              </li>
              <li className="list-disc list-inside">
                Functionality of being able to see the saved information and having the
                ability to edit the step while in checkout
              </li>
              <li className="list-disc list-inside">
                Making the Place Order button sticky on mobile (and a separate color) to
                remind shopping users to complete their final step
              </li>
            </ul>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}checkout_mobile.png`}
                alt="STORIS mobile secure checkout — shipping information step"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Desktop High-Fidelity Mockups */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-16"
          aria-label="Desktop high-fidelity mockups"
        >
          <h3 className="text-lg font-semibold text-white">Desktop High-Fidelity Mockups</h3>
          <div className="mt-6">
            <LightboxImageButton
              src={`${base}checkout-settings.png`}
              alt="STORIS checkout admin settings showing delivery options and plugin configuration"
              wrapperClassName="rounded-lg"
              className="w-full max-w-none rounded-lg"
              onOpen={setImageLightbox}
            />
          </div>
        </motion.section>

        {/* Financing */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="checkout-financing-heading"
          className="mt-16"
        >
          <h2 id="checkout-financing-heading" className={sectionTitle}>
            Financing
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                The new checkout process started as a client-funded project for them to
                have financing in checkout since they also operate as a bank in addition to
                a furniture retailer. Revolving financing was added into the secure checkout
                process. Registered users that have financing attached to their accounts can
                view the payment information about their cart and easily use their financing
                account to purchase their cart items.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}checkout-financing.png`}
                alt="Checkout financing step showing revolving credit payment option"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Gift Cards */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="checkout-giftcards-heading"
          className="mt-16"
        >
          <h2 id="checkout-giftcards-heading" className={sectionTitle}>
            Gift Cards
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}checkout-gift.png`}
                alt="Checkout gift card entry field integrated into payment step"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Gift card integration has been a highly requested feature. Clients can now
                host their own gift cards so their shoppers can use store credit just for
                their products. Of course, users/shoppers need a way to checkout using
                their gift cards so it was integrated into the new checkout providing a way
                to support the business in desperate times where inventory is close to none.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Delivery Scheduling */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="checkout-delivery-heading"
          className="mt-16"
        >
          <h2 id="checkout-delivery-heading" className={sectionTitle}>
            Delivery Scheduling
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-[#999999] md:text-lg">
                Delivery scheduling during checkout is also a very highly requested feature
                from both clients and their shoppers. Originally, shoppers/users need to
                purchase their cart completely, go into their account management, go to
                their orders, select the order they just created, and then change the
                desired delivery date in the order details. This flow has been greatly
                improved so shoppers can now choose when they want their items delivered
                while checking out.
              </p>
            </div>
            <figure className="min-w-0">
              <LightboxImageButton
                src={`${base}checkout-delivery.png`}
                alt="Checkout delivery scheduling date picker integrated into the checkout flow"
                wrapperClassName="rounded-lg"
                className="w-full rounded-lg"
                onOpen={setImageLightbox}
              />
            </figure>
          </div>
        </motion.section>

        {/* Challenges */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.13 }}
          aria-labelledby="checkout-challenges-heading"
          className="mt-16"
        >
          <h2 id="checkout-challenges-heading" className={sectionTitle}>
            Challenges
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#999999] md:text-lg">
            Many challenges presented themselves during this task:
          </p>
          <ul className="mt-4 grid gap-y-3 text-base leading-relaxed text-[#999999] marker:text-[#00aeef] md:text-lg">
            <li className="list-disc list-inside">
              Trying to think of every setting a client user would need in order to
              customize and use their new Checkout Plugin efficiency while also maintaining
              minimalism to prevent future support efforts and code interference
            </li>
            <li className="list-disc list-inside">
              Working with the development team on where to make expensive calls (2-3
              seconds) back to our software while trying to make important UX decisions to
              make the checkout easier and faster for shopping users. Reducing the calls to
              a minimum while enhancing the checkout experience for users was a give-and-take
              situation
            </li>
            <li className="list-disc list-inside">
              Prioritizing certain elements of the project in order to make the release
              deadline. Features have been left out to make the release time and will be
              included in future iterations/hot fixes
            </li>
          </ul>
        </motion.section>

        {/* Peer Feedback */}
        <motion.section
          {...fadeUpGlass}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="checkout-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="checkout-peer-heading" className={sectionTitle}>
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
              {/* Add peer feedback screenshot images here: checkout-peer-feedback.png */}
              <p className="text-sm text-[#999999]">
                Peer feedback images coming soon — drop{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-accent-readable">
                  checkout-peer-feedback.png
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
              {CHECKOUT_SECTION_INDEX.map((item) => (
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
