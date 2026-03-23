import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Award,
  Brain,
  Briefcase,
  GraduationCap,
  Lightbulb,
  UserRound,
} from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import GlareHover from "../components/GlareHover";
import { LinkedInLogoSolid } from "../components/LinkedInLogoSolid";
import GradientText from "../components/GradientText";

const assetBase = import.meta.env.BASE_URL;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const IMPACT_LETTERS = "IMPACT".split("");

function ImpactBurst({
  reduceMotion,
}: {
  reduceMotion: boolean | null;
}) {
  if (reduceMotion) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold">
        <span aria-hidden className="text-[1.05em] leading-none">
          💥
        </span>
        <span className="bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text font-bold text-transparent">
          IMPACT
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-baseline font-semibold">
      <span aria-hidden className="inline-flex items-center gap-0.5">
        <motion.span
          className="mr-0.5 text-[1.1em] leading-none drop-shadow-[0_0_10px_rgba(251,146,60,0.85)]"
          whileHover={{
            scale: [1, 1.35, 1.15],
            rotate: [0, -14, 8, 0],
            transition: { duration: 0.45, ease: "easeOut" },
          }}
        >
          💥
        </motion.span>
        <motion.span
          className="inline-flex cursor-default select-none items-baseline"
          initial="rest"
          whileHover="hover"
          variants={{
            rest: {},
            hover: {
              transition: { staggerChildren: 0.05, delayChildren: 0.03 },
            },
          }}
          aria-hidden
        >
          {IMPACT_LETTERS.map((char, i) => {
            const spread = (i - (IMPACT_LETTERS.length - 1) / 2) * 10;
            return (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 bg-clip-text font-bold text-transparent [filter:drop-shadow(0_0_6px_rgba(251,113,133,0.55))]"
                variants={{
                  rest: {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    filter: "drop-shadow(0 0 6px rgba(251, 113, 133, 0.45))",
                  },
                  hover: {
                    x: spread * 1.15,
                    y: -14,
                    scale: 1.28,
                    rotate: spread * 0.65,
                    filter:
                      "drop-shadow(0 0 14px rgba(255, 90, 60, 0.95)) drop-shadow(0 0 22px rgba(251, 191, 36, 0.5))",
                    transition: {
                      type: "spring",
                      stiffness: 420,
                      damping: 14,
                      mass: 0.55,
                    },
                  },
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.span>
      </span>
      <span className="sr-only">IMPACT</span>
    </span>
  );
}

export function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-screen shrink-0 overflow-hidden px-6 py-16 md:px-12 lg:px-16">
      <BlobBackground />
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="mb-12 border-b border-slate-800/70 pb-12 lg:mb-16 lg:pb-16"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-accent-readable">
            About
          </p>
          <div className="mt-6 flex flex-col items-center gap-8 lg:mt-8 lg:flex-row lg:items-start lg:justify-start lg:gap-12">
            <div className="w-full max-w-[300px] shrink-0 sm:max-w-[320px] lg:max-w-[340px]">
              <div className="rounded-xl border border-[#00aeef]/25 bg-slate-900/30 p-1 ring-1 ring-inset ring-white/5">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="transparent"
                  borderRadius="0.5rem"
                  borderColor="transparent"
                  glareColor="#ffffff"
                  glareOpacity={0.4}
                  glareSize={200}
                  maskImage={`${assetBase}portpic-about.png`}
                  className="!border-0 block aspect-square w-full overflow-hidden rounded-lg"
                >
                  <img
                    src={`${assetBase}portpic-about.png`}
                    alt="AJ Zichella"
                    className="h-full w-full min-h-0 rounded-lg object-cover object-[50%_32%] shadow-[6px_6px_20px_rgba(0,0,0,0.45)]"
                  />
                </GlareHover>
              </div>
            </div>
            <div className="min-w-0 flex-1 text-center lg:pt-1 lg:text-left">
              <h1 className="inline-block min-w-0">
                <GradientText
                  colors={["#7ee8ff", "#00aeef", "#006b8f"]}
                  direction="diagonal"
                  animationSpeed={3}
                  className="text-3xl font-bold tracking-tight md:text-4xl"
                >
                  AJ Zichella
                </GradientText>
              </h1>
              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-300 lg:justify-start">
                <motion.img
                  src={`${assetBase}outline-nj.svg`}
                  alt=""
                  width={14}
                  height={20}
                  className="h-5 w-auto shrink-0 origin-center object-contain object-left"
                  aria-hidden
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          x: [0, -2, 2, -2, 2, -1, 1, 0],
                          y: [0, 1, -1, 1, -1, 0],
                          rotate: [0, -6, 6, -5, 5, -3, 3, 0],
                          transition: {
                            duration: 0.42,
                            ease: "easeInOut",
                          },
                        }
                  }
                />
                Jersey girl, born and raised
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-[#999999] md:text-xl lg:mx-0">
                I&apos;m an energetic, nerdy, cat-obsessed, joke-cracking{" "}
                <span className="font-semibold text-white">
                  senior product designer and design engineer
                </span>
                . I craft end-to-end scalable design solutions for{" "}
                <span className="font-semibold text-white">
                  developer platforms and retail
                </span>
                . I care about user needs, business goals, cross-functional
                partnerships, and how those together create{" "}
                <ImpactBurst reduceMotion={prefersReducedMotion} />.
              </p>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="relative mx-auto mt-6 w-full max-w-xl overflow-hidden rounded-xl case-study-card p-4 transition-all duration-300 sm:p-5 lg:mx-0"
              >
                <div className="relative z-[1] flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0 text-center sm:text-left">
                    <p className="flex items-center justify-center gap-2 text-sm font-medium text-accent-readable sm:justify-start">
                      <LinkedInLogoSolid className="h-4 w-4 shrink-0 text-[#00aeef] opacity-90" />
                      <span>Let&apos;s connect</span>
                    </p>
                    <p className="mt-1 text-xs leading-snug text-slate-400 sm:text-sm">
                      Open to new opportunities and conversations.
                    </p>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/angela-zichella/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rainbow-cta group relative mx-auto inline-flex w-fit shrink-0 self-center rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] sm:mx-0 sm:self-auto"
                  >
                    <span className="relative flex min-w-0 items-center rounded-[6px] bg-[#03040A] px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 group-hover:opacity-95 sm:px-5 sm:text-sm">
                      <span className="flex flex-1 justify-center min-w-0">
                        Connect
                      </span>
                      <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover:ml-1.5 group-hover:w-4">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:h-4 sm:w-4" />
                      </span>
                    </span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        <h2 className="sr-only">Profile</h2>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="flex min-w-0 flex-col gap-12">
            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              aria-labelledby="about-who-heading"
            >
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 shrink-0 text-[#00aeef]" aria-hidden />
                <h3
                  id="about-who-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  Who I am
                </h3>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#999999] md:text-lg">
                Well met, traveler! I&apos;m AJ{" "}
                <motion.span
                  className="relative inline-block top-px text-[1.35em] leading-none will-change-transform"
                  style={{ transformOrigin: "70% 85%" }}
                  role="img"
                  aria-label="Waving hand"
                  animate={
                    prefersReducedMotion
                      ? { rotate: 0 }
                      : { rotate: [0, 18, -14, 16, -10, 0] }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 1.1,
                          repeat: Infinity,
                          repeatDelay: 1.5,
                          ease: "easeInOut",
                        }
                  }
                >
                  👋
                </motion.span>
                . I believe user-centered design is more than just an easy-to-use
                visual experience that solves complex problems; it&apos;s a form of{" "}
                <span className="text-slate-200">storytelling</span>. It creates a
                functional product that engages users and provides an intuitive
                experience while accurately representing brands and meeting goals.
              </p>
              <ul className="mt-6 flex flex-col gap-2 text-base text-slate-200">
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    User-centered senior product designer
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>IAM and eCommerce specialist</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    New tech dabbler (always curious){" "}
                    <motion.span
                      className="inline-block cursor-default text-[1.15em] leading-none will-change-transform"
                      role="img"
                      aria-label="Smiling cat"
                      style={{ transformOrigin: "50% 90%" }}
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : {
                              y: [0, -7, -2, -6, -1, 0],
                              rotate: [0, -6, 4, -4, 3, 0],
                              transition: {
                                duration: 0.5,
                                ease: "easeInOut",
                              },
                            }
                      }
                    >
                      😸
                    </motion.span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Grammy winner and two-time Oscar nominee
                    <span className="text-[#999999]">
                      {" "}
                      (kidding, but I did win &ldquo;Rookie of the Year&rdquo; and
                      &ldquo;Dream Team&rdquo; for Growth.)
                    </span>
                  </span>
                </li>
              </ul>
            </motion.section>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.09 }}
              aria-labelledby="about-philosophies-heading"
            >
              <div className="flex items-center gap-2">
                <Lightbulb
                  className="h-5 w-5 shrink-0 text-[#00aeef]"
                  aria-hidden
                />
                <h3
                  id="about-philosophies-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  My design philosophies
                </h3>
              </div>
              <ul className="mt-4 flex max-w-2xl flex-col gap-3 text-base leading-relaxed text-[#999999] md:text-lg">
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Solving real user problems creates real measurable business
                    outcomes.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Be concise yet clear. Users should rarely need to go to a chat
                    or product docs for answers.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Treat peers like a D&amp;D party; creating strong partnerships
                    with coworkers is vital for a smooth campaign that remains
                    aligned and moves fast.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Document. Document. Document. You never know when someone
                    needs to know what you did or why you did it.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent-readable" aria-hidden>
                    ·
                  </span>
                  <span>
                    Processes should be adaptable. I generally use a
                    double-diamond approach, but not all problems fit that
                    case.
                  </span>
                </li>
              </ul>
            </motion.section>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.1 }}
              aria-labelledby="about-years-heading"
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 shrink-0 text-[#00aeef]" aria-hidden />
                <h3
                  id="about-years-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  8+ years of visually solving complex problems
                </h3>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#999999] md:text-lg">
                Proudly focusing on user needs and building experiences
                supported by research and data that pushes design further and
                helps solve real problems.
              </p>
            </motion.section>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.12 }}
              aria-labelledby="about-focus-heading"
            >
              <div className="flex items-center gap-2">
                <Brain
                  className="h-5 w-5 shrink-0 text-[#00aeef]"
                  aria-hidden
                />
                <h3
                  id="about-focus-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  What I focus on
                </h3>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#999999] md:text-lg">
                I work where complex systems meet real people, whether that&apos;s
                cloud infrastructure, access and security, or retail and
                eCommerce flows. Recent themes in my{" "}
                <Link
                  to="/case-studies"
                  className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                >
                  case studies
                </Link>{" "}
                include{" "}
                <span className="text-slate-300">
                  IAM, networking, and both B2B and B2C experiences.
                </span>
              </p>
            </motion.section>
          </div>

          <div className="flex min-w-0 flex-col gap-12">
            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.14 }}
              aria-labelledby="about-experience-heading"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 shrink-0 text-[#00aeef]" aria-hidden />
                <h3
                  id="about-experience-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  Experience
                </h3>
              </div>
              <ul className="mt-6 flex flex-col gap-4">
                <li className="rounded-xl border border-slate-600/50 bg-slate-900/40 px-5 py-4 ring-1 ring-inset ring-white/5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-semibold text-white">
                      DigitalOcean{" "}
                      <span className="font-normal text-[#999999]">
                        · Cloud computing &amp; hosting
                      </span>
                    </h4>
                    <span className="rounded-md bg-[#00aeef]/10 px-2 py-0.5 text-xs font-medium text-accent-readable">
                      Current
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#999999] md:text-sm">
                    Senior Product Designer I, Design Engineer · July 2022 –
                    present
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                    Product design lead on{" "}
                    <span className="text-slate-300">
                      Identity and Access Management (IAM)
                    </span>
                    , with emphasis on{" "}
                    <span className="text-slate-300">RBAC</span>, org-wide
                    permissions, and audit-friendly access flows. Led a team of
                    eight designers through a major{" "}
                    <span className="text-slate-300">RBAC</span> launch (three
                    new roles), with roughly{" "}
                    <span className="text-slate-300">23% month-over-month</span>{" "}
                    growth in usage for the security experience. I mentor
                    designers, align cross-functionally, and use research and the
                    design system to quickly move from idea (PRD) to GA. More in my{" "}
                    <Link
                      to="/case-studies"
                      className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      case studies
                    </Link>
                    .
                  </p>
                  <a
                    href="https://digitalocean.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-block text-sm font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    digitalocean.com
                  </a>
                </li>

                <li className="rounded-xl border border-slate-600/50 bg-slate-900/40 px-5 py-4 ring-1 ring-inset ring-white/5">
                  <h4 className="font-semibold text-white">
                    STORIS{" "}
                    <span className="font-normal text-[#999999]">
                      · Retail ERP &amp; eCommerce
                    </span>
                  </h4>
                  <p className="mt-1 text-xs text-[#999999] md:text-sm">
                    UI/UX Designer · October 2018 – June 2022
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
                    Designed GUI and web SaaS for tens of thousands of{" "}
                    <span className="text-slate-300">B2B</span> users and built an{" "}
                    <span className="text-slate-300">atomic design system</span>{" "}
                    for faster, consistent work. Led UX for
                    client <span className="text-slate-300">B2C eCommerce</span>{" "}
                    sites and internal portals with clean dev handoff. Used
                    personas, empathy maps, and journeys to keep work
                    human-centered. Redesigned a broken multi-step checkout (see{" "}
                    <Link
                      to="/case-studies"
                      className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      case studies
                    </Link>
                    ) that increased cart conversions and thus revenue.
                  </p>
                </li>

                <li className="rounded-xl border border-slate-600/50 bg-slate-900/40 px-5 py-4 ring-1 ring-inset ring-white/5">
                  <h4 className="font-semibold text-white">AMD</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#999999] md:text-base">
                    Worked on a major product release as the sole lead product
                    designer. Details are under NDA.
                  </p>
                </li>

                <li className="rounded-xl border border-slate-600/50 bg-slate-900/40 px-5 py-4 ring-1 ring-inset ring-white/5">
                  <h4 className="font-semibold text-white">Earlier roles</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#999999] md:text-base">
                    <span className="text-slate-300">Jimmy Jazz</span>: digital
                    designer (UI/web, eCommerce, mobile app design, marketing,
                    retouching, conversion-focused UX).{" "}
                    <span className="text-slate-300">Ramsey Auto Group</span>:
                    email designer.{" "}
                    <span className="text-slate-300">
                      Financial Resources FCU
                    </span>
                    : multi-media designer across print/digital, website, and
                    banking portal.
                  </p>
                </li>
              </ul>
            </motion.section>

            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.16 }}
              aria-labelledby="about-certs-heading"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 shrink-0 text-[#00aeef]" aria-hidden />
                <h3
                  id="about-certs-heading"
                  className="text-xl font-bold tracking-tight text-white"
                >
                  Certifications
                </h3>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="rounded-lg border border-slate-600/40 bg-slate-900/30 px-4 py-3 text-sm text-slate-200 ring-1 ring-inset ring-white/5">
                  <span className="font-medium text-white">
                    Interaction Design Foundation
                  </span>
                  <ul className="mt-2 space-y-2 text-[#999999]">
                    <li>Human-Computer Interaction (HCI)</li>
                    <li>
                      Conducting Usability Testing ·{" "}
                      <span className="font-medium text-accent-readable">
                        Top 10% distinction
                      </span>
                    </li>
                    <li>
                      Web Design for Usability ·{" "}
                      <span className="font-medium text-accent-readable">
                        Top 10% distinction
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </motion.section>
          </div>
        </div>
      </div>
    </section>
  );
}
