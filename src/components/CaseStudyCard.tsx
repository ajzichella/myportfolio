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
  /** Two-image layout variant. Default "side-overlap" puts both at similar size.
   *  "hero-phone" puts images[0] as a wide hero with images[1] as a narrow phone mock overlaid at the right. */
  twoImageLayout?: "side-overlap" | "hero-phone";
  /** Side-overlap layout only: move the front (second) image further left by this many px (more overlap); invite/first unchanged */
  sideOverlapSecondLeftExtraPx?: number;
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

  /* Stacked / overlapping images: motion.img + no drop-shadow on those layers avoids
     Chromium black matte (transform parent + filter on child). Single-hero still uses
     drop-shadow on the img only. No overflow-hidden/isolate on image wrappers. */
  const imageChromeSingle = "rounded-lg";

  return (
    <motion.article
      key={study.title}
      data-figma-capture={study.title === "RBAC - Predefined Roles" ? "rbac-card" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className={`relative rounded-xl case-study-card p-8 transition-all duration-300 lg:min-h-[min(380px,46vh)] ${hasImages && imageCount === 2 ? "overflow-visible" : "overflow-hidden"}`}
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
      <div
        className={`relative flex h-full gap-8 ${hasImages ? "flex-col lg:flex-row lg:items-stretch" : "flex-row"}`}
      >
        <div
          className={`flex min-w-0 flex-1 flex-col gap-4 rounded-xl ${hasImages ? "w-full lg:w-1/2 lg:flex-none lg:min-h-0" : "w-full"}`}
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
              {study.company.startsWith("STORIS") && (
                <img
                  src={`${import.meta.env.BASE_URL}storis-favicon.ico`}
                  alt=""
                  className="h-4 w-4 shrink-0 object-contain"
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
          <div
            className="max-lg:hidden min-h-[1px] w-full flex-1 basis-0 shrink max-h-12"
            aria-hidden
          />
          <a
            href={study.link}
            target="_blank"
            rel="noreferrer noopener"
            className="rainbow-cta group/cta relative inline-flex self-start rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] max-lg:mt-2"
          >
            <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover/cta:opacity-95">
              <span className="flex min-w-0 flex-1 justify-center">
                View case study
              </span>
              <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover/cta:ml-2 group-hover/cta:w-4">
                <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover/cta:opacity-100" />
              </span>
            </span>
          </a>
        </div>
        {/* Single hero image */}
        {images && imageCount === 1 && (
          <>
            <div
              className={`flex w-full justify-center order-first lg:hidden ${imageChromeSingle}`}
            >
              <img
                src={images[0]}
                alt={altFor(0)}
                className="max-h-[min(460px,65vh)] w-auto max-w-[min(400px,95%)] object-contain object-center object-top drop-shadow-xl"
              />
            </div>
            <div className="relative hidden min-w-0 shrink-0 flex-col items-end justify-start lg:flex lg:w-1/2 lg:flex-none">
              <motion.div
                className={`pointer-events-auto w-full max-w-[min(100%,520px)] origin-bottom lg:mr-6 ${imageChromeSingle}`}
                whileHover={{ y: -14, scale: 1.04 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={images[0]}
                  alt={altFor(0)}
                  className="max-h-[min(600px,68vh)] w-full min-h-0 object-contain object-right object-top drop-shadow-xl"
                />
              </motion.div>
            </div>
          </>
        )}
        {/* Two stacked images — side-overlap (RBAC / Kafka) */}
        {images && imageCount === 2 && study.twoImageLayout !== "hero-phone" && (
          <>
            <div className="w-full lg:hidden order-first">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <img
                    src={images[0]}
                    alt={altFor(0)}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <img
                    src={images[1]}
                    alt={altFor(1)}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="relative z-[2] hidden min-h-[min(320px,40vh)] lg:w-1/2 lg:flex-none lg:block">
              <motion.img
                src={images[0]}
                alt={altFor(0)}
                className="pointer-events-auto absolute -top-4 left-0 z-[1] w-[55%] rounded-lg"
                style={{ transformOrigin: "bottom center" }}
                whileHover={{ y: -12, scale: 1.04 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.img
                src={images[1]}
                alt={altFor(1)}
                className="pointer-events-auto absolute -top-[54px] left-[calc(55%-32px)] z-10 w-[55%] rounded-lg"
                style={{
                  transformOrigin: "bottom center",
                  ...(study.sideOverlapSecondLeftExtraPx != null
                    ? {
                        left: `calc(55% - ${32 + study.sideOverlapSecondLeftExtraPx}px)`,
                      }
                    : {}),
                }}
                whileHover={{ y: -16, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </>
        )}
        {/* Two stacked images — hero-phone (wide desktop + narrow phone overlay) */}
        {images && imageCount === 2 && study.twoImageLayout === "hero-phone" && (
          <>
            <div className="w-full lg:hidden order-first">
              <div className="flex items-start justify-center gap-3">
                <div className="flex min-h-0 min-w-0 flex-1 justify-center">
                  <img
                    src={images[0]}
                    alt={altFor(0)}
                    className="max-h-[min(300px,46vh)] w-full rounded-lg object-contain object-top"
                  />
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 justify-center">
                  <img
                    src={images[1]}
                    alt={altFor(1)}
                    className="max-h-[min(300px,46vh)] w-full rounded-lg object-contain object-top"
                  />
                </div>
              </div>
            </div>
            <div className="relative z-[2] hidden min-h-[min(320px,40vh)] lg:w-1/2 lg:flex-none lg:block">
              <motion.img
                src={images[0]}
                alt={altFor(0)}
                className="pointer-events-auto absolute -top-3 left-[-12px] z-[1] max-h-[min(400px,44vh)] max-w-[74%] w-auto rounded-lg object-contain object-left object-top"
                style={{ transformOrigin: "bottom left" }}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.img
                src={images[1]}
                alt={altFor(1)}
                className="pointer-events-auto absolute -top-[26px] right-5 z-10 w-[32%] max-w-[200px]"
                style={{ transformOrigin: "bottom center" }}
                whileHover={{ y: -14, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </>
        )}
        {!hasImages && <div className="hidden lg:block lg:w-1/2 lg:flex-none" aria-hidden />}
      </div>
    </motion.article>
  );
}
