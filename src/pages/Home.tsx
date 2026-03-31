import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight, Award, Code2, Users, Handshake, TrendingUp } from "lucide-react";

import GradientText from "../components/GradientText";
import BlurText from "../components/BlurText";
import GlareHover from "../components/GlareHover";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { FixedBlobBackdrop, SOFT_FIXED_BLOB_PRESET } from "../components/BlobBackground";
import { PawDotPattern } from "../components/PawDotPattern";
import { DigitalOceanHeaderWordmark } from "../components/DigitalOceanHeaderWordmark";
import { getFeaturedCaseStudies } from "../data/caseStudies";

/** Glass tooltips + cyan edge glow (ResultsSection-style). */
const csTooltipDo =
  "portfolio-tooltip-panel pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-[110] w-max max-w-[min(18rem,calc(100vw-2rem))] sm:max-w-[22rem] -translate-x-1/2 rounded-xl case-study-card case-study-card--no-left-accent px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-slate-100 opacity-0 transition-opacity duration-200 group-hover/do-cs:opacity-100 group-focus-within/do-cs:opacity-100 sm:px-4 sm:py-3.5";

const csTooltipAmd =
  "portfolio-tooltip-panel pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-[110] w-max max-w-[min(13rem,calc(100vw-15rem))] sm:max-w-[15rem] -translate-x-1/2 rounded-xl case-study-card case-study-card--no-left-accent px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-slate-100 opacity-0 transition-opacity duration-200 group-hover/amd-cs:opacity-100 group-focus-within/amd-cs:opacity-100 sm:px-4 sm:py-3.5";

const csTooltipAshley =
  "portfolio-tooltip-panel pointer-events-none absolute bottom-[calc(100%+0.5rem)] right-0 left-auto z-[110] w-max max-w-[min(13rem,calc(100vw-15rem))] sm:max-w-[15rem] rounded-xl case-study-card case-study-card--no-left-accent px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-slate-100 opacity-0 transition-opacity duration-200 group-hover/ashley-cs:opacity-100 group-focus-within/ashley-cs:opacity-100 sm:px-4 sm:py-3.5";

const digitalOceanTooltipCopy = (
  <>
    DigitalOcean is a cloud service provider tailored towards all, from tech
    newcomers and principal engineers alike. DO is best known for its UX and
    simplicity in the cloud computing industry.
  </>
);

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <FixedBlobBackdrop {...SOFT_FIXED_BLOB_PRESET} />
      <section
        ref={sectionRef}
        id="home"
        className="relative z-10 w-full shrink-0 min-h-[calc(100vh+5rem)] lg:min-h-0 lg:h-screen -mt-[max(env(safe-area-inset-top),5rem)] lg:mt-0"
      >
        <PawDotPattern className="z-[1]" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.3) 85%, transparent 100%)' }} />
        <div
          className="hero-overlay absolute inset-0 pointer-events-none z-[5]"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-56 sm:h-64 md:h-72 pointer-events-none z-[6]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.45) 68%, rgba(0,0,0,0.72) 88%, rgba(0,0,0,0.88) 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-center items-center px-6 md:px-12 lg:px-16 pt-[max(env(safe-area-inset-top),5rem)] lg:pt-0">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="flex flex-col items-start flex-1 min-w-0 relative">
              <div className="absolute inset-0 -z-10 rounded-lg blur-2xl" style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 70%)', pointerEvents: 'none' }} aria-hidden />
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            >
              AJ Zichella
            </GradientText>
          </motion.div>
          <BlurText
            text="I'm a Senior Product Designer with an 8+ year specialty in web apps for developer and retail experiences who is dedicated to crafting simple, pleasant, and usable experiences for humans."
            className="mt-4 max-w-2xl text-lg sm:text-xl md:text-[30px] text-[#999999] font-semibold leading-[1.6] gap-y-2"
            delay={30}
            animateBy="words"
            direction="top"
            stepDuration={0.15}
            threshold={0}
            animationFrom={undefined}
            animationTo={undefined}
            onAnimationComplete={undefined}
            getWordClassName={(_: string, i: number) => {
              if (i >= 2 && i <= 4) return 'text-white font-bold';
              if (i >= 7 && i <= 8) return 'text-white';
              return '';
            }}
          />
          <motion.div
            className="mt-6 flex items-center gap-2"
            initial={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#39ff14] shadow-[0_0_8px_2px_#39ff14] animate-blink"
              aria-hidden
            />
            <p className="text-base text-[#999999]">
              Current status - Senior product designer, design engineer for{" "}
              <a
                href="https://www.digitalocean.com"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              >
                DigitalOcean
              </a>
              .
            </p>
          </motion.div>
          <motion.div
            className="mt-10"
            initial={{ filter: "blur(10px)", opacity: 0, y: -20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          >
            <a
              href="https://www.linkedin.com/in/angela-zichella/"
              target="_blank"
              rel="noreferrer noopener"
              className="rainbow-cta group relative inline-flex rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover:opacity-95">
                <span className="flex flex-1 justify-center min-w-0">
                  Connect with me on LinkedIn
                </span>
                <span className="flex shrink-0 w-0 overflow-hidden justify-end transition-all duration-200 ease-out group-hover:ml-2 group-hover:w-4">
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </span>
              </span>
            </a>
          </motion.div>
            </div>
            <motion.div
              className="shrink-0 w-full max-w-[340px] lg:max-w-[360px] xl:max-w-[380px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderRadius="0.5rem"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.4}
                glareSize={200}
                maskImage={`${import.meta.env.BASE_URL}portpic.png`}
                className="!border-0 block overflow-hidden rounded-lg"
              >
                <img
                  src={`${import.meta.env.BASE_URL}portpic.png`}
                  alt="AJ Zichella"
                  className="w-full h-auto object-cover shadow-[6px_6px_20px_rgba(0,0,0,0.5)]"
                />
              </GlareHover>
            </motion.div>
            {/* Scroll indicator on mobile - in flow below image, centered */}
            <motion.div
              className="flex flex-col items-center justify-center gap-1 mt-6 w-full self-center lg:hidden"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="h-10 w-px bg-gradient-to-b from-[#00aeef]/80 to-transparent" />
                <ChevronDown className="h-7 w-7 text-[#00aeef]/80 -mt-1" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - desktop only, absolute at bottom */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-1 lg:bottom-8"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-10 w-px bg-gradient-to-b from-[#00aeef]/80 to-transparent" />
            <ChevronDown className="h-7 w-7 text-[#00aeef]/80 -mt-1" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* Case Studies section - appears after scrolling */}
      <section
        id="case-studies"
        className="relative z-10 w-full shrink-0 overflow-visible px-6 py-16 md:px-12 lg:px-16"
      >
        {/* Bridges hero bottom black fade → blob field so the fold is not a hard seam */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-36 sm:h-44 md:h-52"
          style={{
            background:
              'linear-gradient(to bottom, rgb(0,0,0) 0%, rgba(0,0,0,0.92) 12%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.18) 72%, transparent 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          >
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Case Studies
              </h2>
            </div>
            <div
              className="flex shrink-0 flex-wrap items-center gap-6 sm:gap-8 lg:justify-end"
              aria-label="DigitalOcean, AMD, and Ashley — hover or focus each logo for details"
            >
              <span className="relative z-[100] inline-flex items-center group/do-cs">
                <span
                  tabIndex={0}
                  className="block min-w-[9rem] max-w-[min(100%,28rem)] rounded-md p-1 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label="DigitalOcean"
                  aria-describedby="digitalocean-case-studies-tooltip"
                >
                  <DigitalOceanHeaderWordmark className="block h-6 w-auto max-h-6 max-w-[min(28rem,calc(100vw-10rem))]" />
                </span>
                <span
                  id="digitalocean-case-studies-tooltip"
                  role="tooltip"
                  className={csTooltipDo}
                >
                  {digitalOceanTooltipCopy}
                </span>
              </span>
              <span
                className="relative z-[100] inline-flex cursor-default items-center rounded-sm outline-none group/amd-cs focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                tabIndex={0}
                aria-label="AMD"
                aria-describedby="amd-case-studies-tooltip"
              >
                <img
                  src={`${import.meta.env.BASE_URL}logo-amd-white.svg`}
                  alt=""
                  aria-hidden
                  className="h-6 w-auto max-h-6 max-w-[min(4.5rem,22vw)] object-contain object-center opacity-90"
                  width={72}
                  height={18}
                />
                <span
                  id="amd-case-studies-tooltip"
                  role="tooltip"
                  className={csTooltipAmd}
                >
                  <span className="mb-1 block text-center text-4xl leading-none" aria-hidden>
                    🤫
                  </span>
                  <span className="mb-1.5 block text-center text-base font-bold leading-tight sm:text-lg">
                    Under NDA
                  </span>
                  Worked with AMD on massive product release as the sole lead
                  product designer
                </span>
              </span>
              <span
                className="relative z-[100] inline-flex cursor-default items-center rounded-sm outline-none group/ashley-cs focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                tabIndex={0}
                aria-label="Ashley Home Furnishings"
                aria-describedby="ashley-case-studies-tooltip"
              >
                <img
                  src={`${import.meta.env.BASE_URL}logo-ashley-white.svg`}
                  alt=""
                  aria-hidden
                  className="h-6 w-auto max-h-6 max-w-[min(6.5rem,40vw)] object-contain object-center opacity-90"
                  width={96}
                  height={46}
                />
                <span
                  id="ashley-case-studies-tooltip"
                  role="tooltip"
                  className={csTooltipAshley}
                >
                  Designed Ashley&apos;s Home Furnishings&apos; eCommerce
                  delivery tracker while working at STORIS. Unable to provide
                  further details.
                </span>
              </span>
            </div>
          </motion.div>

          <div className="mt-12 flex flex-col gap-10 md:gap-12">
            {getFeaturedCaseStudies().map((study, i) => (
              <CaseStudyCard
                key={study.title}
                study={study}
                index={i}
                glassIntensity="light"
              />
            ))}
          </div>
          <p className="mt-10 text-center text-base text-[#999999]">
            <Link
              to="/portfolio"
              className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
            >
              View all case studies
            </Link>
          </p>
        </div>
      </section>

      {/* Me in a nutshell — bento */}
      <section
        id="why-hire"
        className="relative z-10 w-full shrink-0 overflow-visible px-6 py-16 md:px-12 lg:px-16"
      >
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Me in a nutshell
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1 — 8+ years (col-span-2) · cyan */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6 sm:col-span-2 lg:col-span-2"
              style={{ '--bc': '0, 174, 239' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 rounded-full bg-[#00aeef]/10 blur-3xl" aria-hidden />
              <TrendingUp className="h-5 w-5 text-[#00aeef]" aria-hidden />
              <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-5xl font-bold leading-none text-white md:text-6xl">
                  8<span className="text-[#00aeef]">+</span>
                </span>
                <span className="text-lg font-semibold text-slate-300">years of experience</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#999999] md:text-base">
                Spanning across <span className="text-slate-200">cloud infrastructure</span>,{" "} <span className="text-slate-200">IAM (Identity and Access Management)</span>,{" "}and <span className="text-slate-200"> retail eCommerce</span>.{" "}
                              I turn ambiguous, complex problems into measurable, usable, and delightful experiences for B2B and B2C users.
              </p>
            </motion.div>

            {/* 2 — Leadership impact · emerald */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6"
              style={{ '--bc': '16, 185, 129' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -left-4 -bottom-4 h-36 w-36 rounded-full bg-emerald-500/12 blur-2xl" aria-hidden />
              <Users className="h-5 w-5 text-emerald-400" aria-hidden />
              <p className="mt-3 text-base font-bold text-white">Leadership that ships</p>
              <p className="mt-2 text-sm leading-relaxed text-[#999999]">
                Led a team of{" "}
                <span className="font-medium text-emerald-300">8 designers</span>{" "}
                through a tight launch, giving designers a sense of ownership of their product. Also mentored junior and mid-level designers, helping them grow their skills and confidence.
              </p>
            </motion.div>

            {/* 3 — IAM & eCommerce · indigo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6"
              style={{ '--bc': '99, 102, 241' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" aria-hidden />
              <Award className="h-5 w-5 text-indigo-400" aria-hidden />
              <p className="mt-3 text-base font-bold text-white">IAM &amp; eCommerce specialist</p>
              <p className="mt-2 text-sm leading-relaxed text-[#999999]">
                Deep experience in IAM, platform-wide permissions, audit-friendly logs, and enhancing the eCommerce shopping experience from product discovery to checkout. Every design decision directly affects security and revenue.
              </p>
            </motion.div>

            {/* 4 — Design × Code · amber */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6"
              style={{ '--bc': '245, 158, 11' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" aria-hidden />
              <Code2 className="h-5 w-5 text-amber-400" aria-hidden />
              <p className="mt-3 text-base font-bold text-white">Product Design × Design Engineering</p>
              <p className="mt-2 text-sm leading-relaxed text-[#999999]">
                Senior product designer that leverages tools to build realistic prototypes in code to validate early,
                reduce handoff friction, and increase shipping speed from PRD to GA.
              </p>
            </motion.div>

            {/* 5 — Led 8 Designers · purple */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6"
              style={{ '--bc': '168, 85, 247' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" aria-hidden />
              <Users className="h-5 w-5 text-purple-400" aria-hidden />
              <p className="mt-3 text-base font-bold text-white">Own end-to-end experiences</p>
              <p className="mt-2 text-sm leading-relaxed text-[#999999]">
                I define strategic opportunities, simplify complex workflows, and lead design from concept
                to delivery with product and engineering partners - balancing craft, speed, user empathy, and
                business impact.
              </p>
            </motion.div>

            {/* 7 — Collaboration · rose */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="case-study-card case-study-card--no-left-accent bento-card relative overflow-hidden rounded-2xl p-6 sm:col-span-2 lg:col-span-3"
              style={{ '--bc': '244, 63, 94' } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" aria-hidden />
              <Handshake className="h-5 w-5 text-rose-400" aria-hidden />
              <p className="mt-3 text-base font-bold text-white">Collaboration at the center</p>
              <p className="mt-2 text-sm leading-relaxed text-[#999999]">
                I partner closely with product, engineering, researchers, security, pdocs, and other stakeholders to strategize product requirements, insert user voices, run workshops,
                share context early, and align on trade-offs and shifting requirements so design decisions stick while keeping teams focused and unblocked. Strong
                collaboration turns fuzzy goals into shipped work the whole team can stand behind.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
