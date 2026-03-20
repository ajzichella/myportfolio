import React, { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export interface Study {
  company: string;
  title: string;
  description: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  link: string;
  /** One hero screenshot or two stacked thumbnails */
  images?: readonly [string] | readonly [string, string];
  /** Alt text for each image; parallel to `images` when provided */
  imageAlts?: readonly [string] | readonly [string, string];
}

interface CaseStudyCardProps {
  study: Study;
  index: number;
}

export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setSpotlight({ x: 50, y: 50 });
  }, []);

  const images = study.images;
  const imageCount = images?.length ?? 0;
  const hasImages = imageCount === 1 || imageCount === 2;
  const altFor = (i: 0 | 1) =>
    study.imageAlts?.[i] ?? "Case study screenshot";

  /* No backdrop-filter on image column — transparent PNGs would composite black.
     Single-hero: no overflow-hidden on wrapper so drop-shadow isn’t clipped;
     img uses drop-shadow (follows alpha) instead of rectangular box-shadow. */
  const imageChrome = "rounded-lg overflow-hidden isolate";
  const imageChromeSingle = "rounded-lg isolate";

  return (
    <motion.article
      key={study.title}
      data-figma-capture={study.title === "RBAC - Predefined Roles" ? "rbac-card" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className={`group relative rounded-xl case-study-card border border-slate-700/40 p-6 transition-all duration-300 ${hasImages && imageCount === 2 ? "overflow-visible" : "overflow-hidden"}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-following spotlight overlay - visible when hovered */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle 140px at ${spotlight.x}% ${spotlight.y}%, rgba(0, 174, 239, 0.15), transparent 65%)`,
          transition: "background 0.2s ease-out",
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden
      />
      <div className={`relative flex gap-6 ${hasImages ? "flex-col lg:flex-row" : "flex-row"}`}>
        <div
          className={`flex min-w-0 flex-1 flex-col gap-4 rounded-xl backdrop-blur-xl ${hasImages ? "w-full lg:max-w-[60%]" : "max-w-[60%]"}`}
        >
          <div>
            <p className="text-sm font-medium text-[#00aeef] flex items-center gap-2">
              {study.company.startsWith("DigitalOcean") && (
                <img
                  src={`${import.meta.env.BASE_URL}digitalocean-icon.svg`}
                  alt=""
                  className="h-4 w-4 shrink-0"
                  aria-hidden
                />
              )}
              <span className="break-words">{study.company}</span>
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white break-words">
              {study.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 break-words">
            {study.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-700/50 px-2.5 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <span className="font-semibold text-[#00aeef]">
                  {m.value}{" "}
                </span>
                <span className="text-sm text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>
          <a
            href={study.link}
            target="_blank"
            rel="noreferrer noopener"
            className="rainbow-cta group/card relative mt-2 inline-flex w-fit rounded-[6px] p-[1.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <span className="relative flex items-center gap-0 rounded-[4px] bg-[#03040A] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 group-hover/card:gap-1.5 group-hover/card:opacity-95">
              View case study
              <span className="flex shrink-0 w-0 overflow-hidden transition-all duration-200 ease-out group-hover/card:w-4">
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100" />
              </span>
            </span>
          </a>
        </div>
        {/* Single hero image */}
        {images && imageCount === 1 && (
          <>
            <div
              className={`flex w-full justify-end pr-6 order-first lg:hidden ${imageChromeSingle}`}
            >
              <img
                src={images[0]}
                alt={altFor(0)}
                className="max-h-[min(410px,62vh)] w-auto max-w-[min(368px,95%)] object-contain object-right object-top drop-shadow-xl"
              />
            </div>
            <div className="relative hidden min-w-0 shrink-0 flex-col items-end justify-start lg:flex lg:max-w-[56%]">
              <motion.div
                className={`pointer-events-auto w-full max-w-[min(100%,460px)] origin-center lg:mr-8 ${imageChromeSingle}`}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={images[0]}
                  alt={altFor(0)}
                  className="max-h-[min(540px,62vh)] w-full min-h-0 object-contain object-right object-top drop-shadow-xl"
                />
              </motion.div>
            </div>
          </>
        )}
        {/* Two stacked images */}
        {images && imageCount === 2 && (
          <>
            <div className="w-full lg:hidden order-first">
              <div className="flex items-start gap-2">
                <div className={`flex-1 min-w-0 ${imageChrome}`}>
                  <img
                    src={images[0]}
                    alt={altFor(0)}
                    className="w-full"
                  />
                </div>
                <div className={`flex-1 min-w-0 ${imageChrome}`}>
                  <img
                    src={images[1]}
                    alt={altFor(1)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block min-w-[40%] flex-1">
              <motion.div
                className={`pointer-events-auto absolute -top-16 left-0 w-[55%] z-[1] origin-bottom ${imageChrome}`}
                whileHover={{ y: -12, scale: 1.04 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img src={images[0]} alt={altFor(0)} className="w-full" />
              </motion.div>
              <motion.div
                className={`pointer-events-auto absolute -top-24 right-0 w-[55%] z-10 origin-bottom ${imageChrome}`}
                whileHover={{ y: -16, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img src={images[1]} alt={altFor(1)} className="w-full" />
              </motion.div>
            </div>
          </>
        )}
        {!hasImages && <div className="min-w-[40%] flex-1" aria-hidden />}
      </div>
    </motion.article>
  );
}
