import React, { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
interface Study {
  company: string;
  title: string;
  description: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  link: string;
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

  return (
    <motion.article
      key={study.title}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="group relative overflow-hidden rounded-xl case-study-card border border-slate-700/40 p-6 backdrop-blur-xl transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-following spotlight overlay - visible when hovered */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle 140px at ${spotlight.x}% ${spotlight.y}%, rgba(0, 174, 239, 0.15), transparent 65%)`,
          transition: "background 0.2s ease-out",
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4">
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
            {study.company}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {study.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
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
    </motion.article>
  );
}
