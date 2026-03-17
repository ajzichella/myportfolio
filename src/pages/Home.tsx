import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import LiquidEther from "../components/LiquidEther";
import GradientText from "../components/GradientText";
import BlurText from "../components/BlurText";
import GlareHover from "../components/GlareHover";

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollBlur, setScrollBlur] = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntranceDone(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollParent = document.getElementById("main-scroll");
    if (!scrollParent) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolledOut = Math.max(0, -rect.top);
      const blurAmount = Math.min(8, (scrolledOut / viewportHeight) * 8);
      setScrollBlur(blurAmount);
    };

    scrollParent.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="home"
        className="relative h-screen w-full shrink-0"
      >
        <div className="absolute inset-0 w-full h-full">
          <LiquidEther
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            colors={["#5227FF", "#00aeef", "#4ba6b3"]}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            autoResumeDelay={0}
            isBounce
            resolution={0.5}
          />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-center items-center px-6 md:px-12 lg:px-16">
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
              animationSpeed={6}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            >
              AJ Zichella
            </GradientText>
          </motion.div>
          <BlurText
            text="I'm a Senior Product Designer with a 7+ year specialty in web apps for developer and retail experiences who is dedicated to crafting simple, pleasant, and usable experiences for humans."
            className="mt-4 max-w-2xl text-lg sm:text-xl md:text-[30px] text-[#999999] font-semibold leading-[1.6] gap-y-2"
            delay={50}
            animateBy="words"
            direction="top"
            stepDuration={0.25}
            threshold={0}
            getWordClassName={(_, i) => {
              if (i >= 2 && i <= 4) return 'text-white font-bold';
              if (i >= 7 && i <= 8) return 'text-white';
              return '';
            }}
          />
          <div className="mt-6 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#39ff14] shadow-[0_0_8px_2px_#39ff14] animate-blink"
              aria-hidden
            />
            <p className="text-base text-[#999999]">
              Current status — Senior product designer for{" "}
              <a
                href="https://digitalocean.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#00aeef] hover:underline"
              >
                DigitalOcean
              </a>
            </p>
          </div>
            </div>
            <motion.div
              className="shrink-0 w-full max-w-[340px] lg:max-w-[420px]"
              initial={{ filter: "blur(12px)", opacity: 0 }}
              animate={{
                filter: `blur(${entranceDone ? scrollBlur : 0}px)`,
                opacity: 1,
              }}
              transition={{
                filter: { duration: entranceDone ? 0.2 : 0.6, ease: "easeOut" },
                opacity: { duration: 0.6, ease: "easeOut" },
              }}
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
          </div>
        </div>

        {/* Scroll indicator - line arrow pointing down */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
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
            <div className="h-8 w-px bg-gradient-to-b from-[#00aeef]/80 to-transparent" />
            <ChevronDown className="h-5 w-5 text-[#00aeef]/80 -mt-1" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
