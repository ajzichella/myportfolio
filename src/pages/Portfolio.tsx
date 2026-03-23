import React, { useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { BlobBackground } from "../components/BlobBackground";
import { CaseStudyCard } from "../components/CaseStudyCard";
import GradientText from "../components/GradientText";
import { CASE_STUDIES, getAllTags } from "../data/caseStudies";

const TAGS_PARAM = "tags";

function parseTagsParam(
  raw: string | null,
  valid: ReadonlySet<string>,
): Set<string> {
  if (!raw?.trim()) return new Set();
  const out = new Set<string>();
  for (const part of raw.split(",")) {
    let decoded = part.trim();
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      /* keep trimmed part */
    }
    if (decoded && valid.has(decoded)) {
      out.add(decoded);
    }
  }
  return out;
}

function serializeTagsParam(selected: Set<string>): string | undefined {
  if (selected.size === 0) return undefined;
  return [...selected]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((t) => encodeURIComponent(t))
    .join(",");
}

export function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allTags = useMemo(() => getAllTags(), []);
  const validTagSet = useMemo(() => new Set(allTags), [allTags]);

  const selectedTags = useMemo(
    () => parseTagsParam(searchParams.get(TAGS_PARAM), validTagSet),
    [searchParams, validTagSet],
  );

  const filteredStudies = useMemo(() => {
    if (selectedTags.size === 0) {
      return CASE_STUDIES;
    }
    return CASE_STUDIES.filter((s) =>
      s.tags.some((t) => selectedTags.has(t)),
    );
  }, [selectedTags]);

  const toggleTag = useCallback(
    (tag: string) => {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        const current = parseTagsParam(p.get(TAGS_PARAM), validTagSet);
        const next = new Set(current);
        if (next.has(tag)) {
          next.delete(tag);
        } else {
          next.add(tag);
        }
        const serialized = serializeTagsParam(next);
        if (serialized) {
          p.set(TAGS_PARAM, serialized);
        } else {
          p.delete(TAGS_PARAM);
        }
        return p;
      });
    },
    [setSearchParams, validTagSet],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete(TAGS_PARAM);
      return p;
    });
  }, [setSearchParams]);

  const showEmpty = filteredStudies.length === 0 && selectedTags.size > 0;

  return (
    <section className="relative w-full min-h-screen shrink-0 overflow-hidden px-6 py-16 md:px-12 lg:px-16">
      <BlobBackground />
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold md:text-3xl">
            <GradientText
              colors={["#7ee8ff", "#00aeef", "#006b8f"]}
              direction="diagonal"
              animationSpeed={3}
            >
              Case studies
            </GradientText>
          </h1>
          <p className="mt-2 text-lg text-[#999999]">
            Case studies — filter by badge to explore by topic.
          </p>
        </motion.div>

        <div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          role="group"
          aria-label="Filter case studies by topic"
        >
          <button
            type="button"
            onClick={clearFilters}
            aria-pressed={selectedTags.size === 0}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              selectedTags.size === 0
                ? "border border-[#00aeef] bg-[#00aeef]/10 text-accent-readable"
                : "border border-transparent bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
            }`}
          >
            All
          </button>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    active
                      ? "border border-[#00aeef] bg-[#00aeef]/10 text-accent-readable"
                      : "border border-transparent bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {showEmpty ? (
            <div className="rounded-xl border border-slate-600/60 bg-slate-900/40 px-6 py-10 text-center">
              <p className="text-slate-200">
                No case studies match these filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredStudies.map((study, i) => (
              <CaseStudyCard key={study.title} study={study} index={i} />
            ))
          )}
        </div>

        <p className="mt-12 text-center text-sm text-[#999999]">
          <Link
            to="/"
            className="font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
          >
            Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}
