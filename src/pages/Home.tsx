import React, { useRef } from "react";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";
import LiquidEther from "../components/LiquidEther";
import GradientText from "../components/GradientText";
import BlurText from "../components/BlurText";
import GlareHover from "../components/GlareHover";
import { CaseStudyCard } from "../components/CaseStudyCard";
import { BlobBackground } from "../components/BlobBackground";

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <section
        ref={sectionRef}
        id="home"
        className="relative w-full shrink-0 min-h-[calc(100vh+5rem)] lg:min-h-0 lg:h-screen -mt-[max(env(safe-area-inset-top),5rem)] lg:mt-0"
      >
        <div className="absolute inset-0 w-full h-full">
          <LiquidEther
            mouseForce={12}
            cursorSize={80}
            isViscous={false}
            colors={["#5227FF", "#00aeef", "#4ba6b3"]}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            autoResumeDelay={0}
            isBounce
            resolution={0.4}
            iterationsViscous={20}
            iterationsPoisson={20}
            preferPerformance
          />
        </div>
        {/* Dark overlay: transparent gradient with smooth transition to 90% black at bottom */}
        <div
          className="hero-overlay absolute inset-0 pointer-events-none z-[5]"
          aria-hidden
        />
        {/* Soft top edge - blends cutoff into black on desktop only; hidden on mobile/tablet so liquid ether reaches top */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[6] hidden lg:block"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-center items-center px-6 md:px-12 lg:px-16 pt-[max(env(safe-area-inset-top),5rem)] lg:pt-0">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="flex flex-col items-start flex-1 min-w-0">
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
            text="I'm a Senior Product Designer with a 7+ year specialty in web apps for developer and retail experiences who is dedicated to crafting simple, pleasant, and usable experiences for humans."
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
              Current status — Senior product designer, design engineer for{" "}
              <a
                href="https://digitalocean.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#00aeef] hover:underline"
              >
                DigitalOcean
              </a>
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
      <section id="case-studies" className="relative w-full shrink-0 overflow-hidden px-6 py-16 md:px-12 lg:px-16">
        <BlobBackground />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Case Studies
            </h2>
            <p className="mt-2 text-lg text-[#999999]">
              What I&apos;ve designed recently
            </p>
          </motion.div>

          <div className="mt-12 flex flex-col gap-6">
            {[
              {
                company: "DigitalOcean | Cloud Computing & Hosting",
                title: "RBAC - Predefined Roles",
                description:
                  "Adding 3 new roles to simplify users' more granular access needs with more restrictive RBAC solutions.",
                tags: ["Product design", "Access control", "Web app"],
                metrics: [
                  { value: "Simplified", label: "access management" },
                  { value: "Granular", label: "role options" },
                ],
                link: "https://ajzichella.com/",
                images: [
                  `${import.meta.env.BASE_URL}invite-team-members.png`,
                  `${import.meta.env.BASE_URL}rbac-role-modal.png`,
                ] as const,
                imageAlts: [
                  "Invite team members screen showing member list and roles",
                  "Change role modal for assigning a predefined RBAC role",
                ] as const,
                sideOverlapSecondLeftExtraPx: 32,
              },
              {
                company: "DigitalOcean | Cloud Computing & Hosting",
                title: "DDoS Protection",
                description:
                  "Building an e2e simple \"set it and forget it\" experience for DigitalOcean users against DDoS Attacks so users are protected and informed about their networks.",
                tags: ["Product design", "Security", "Developer experience"],
                metrics: [
                  { value: "Protected", label: "networks" },
                  { value: "Informed", label: "users" },
                ],
                link: "https://ajzichella.com/",
                images: [`${import.meta.env.BASE_URL}ddos1.png`] as const,
                imageAlts: [
                  "DDoS Protection networking dashboard with Back Online notification card showing shrimp illustration and recovery message",
                ] as const,
              },
              {
                company: "DigitalOcean | Cloud Computing & Hosting",
                title: "DBaaS - Kafka",
                description:
                  "Integrating a Kafka solution into our Managed Databases product to simplify users' architecture and Topic upkeep as well as provide a reliable environment to prevent data loss.",
                tags: ["Product design", "Managed databases", "Developer experience"],
                metrics: [
                  { value: "Simplified", label: "Topic upkeep" },
                  { value: "Reliable", label: "data environment" },
                ],
                link: "https://ajzichella.com/",
                images: [
                  `${import.meta.env.BASE_URL}kafka-permissions.png`,
                  `${import.meta.env.BASE_URL}kafka-create-topic.png`,
                ] as const,
                imageAlts: [
                  "Kafka topic permissions modal with Admin, Produce, Consume, and Consume and Produce roles",
                  "Create Topic form with partition count, replication factor, and retention settings",
                ] as const,
              },
              {
                company: "STORIS | Retail ERP & eCommerce",
                title: "eCommerce Enhanced Checkout Redesign",
                description:
                  "Redesigned a broken multi-step checkout that hurt retailers and shoppers with a faster flow that solved conversion issues and lifted revenue.",
                tags: ["UX redesign", "E‑commerce", "Checkout"],
                metrics: [
                  { value: "Streamlined", label: "checkout experience" },
                  { value: "Increased", label: "conversions and revenue" },
                ],
                link: "https://ajzichella.com/",
                images: [
                  `${import.meta.env.BASE_URL}estoris2.png`,
                  `${import.meta.env.BASE_URL}checkout_mobile.png`,
                ] as const,
                imageAlts: [
                  "STORIS admin Checkout Settings with delivery options and store pickup",
                  "STORIS mobile secure checkout — shipping information step",
                ] as const,
                twoImageLayout: "hero-phone" as const,
              },
            ].map((study, i) => (
              <CaseStudyCard key={study.title} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
