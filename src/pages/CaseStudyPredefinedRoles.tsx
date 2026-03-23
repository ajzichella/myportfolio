import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight, List, X } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import { ResultsSection } from "../components/ResultsSection";

const base = import.meta.env.BASE_URL;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const linkClass =
  "font-medium text-[#00aeef] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

const sectionTitle =
  "text-xl font-bold tracking-tight text-white md:text-2xl";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-accent-readable";

const CASE_STUDY_SECTION_INDEX = [
  { id: "rbac-results-heading", label: "Results" },
  { id: "rbac-scope-heading", label: "Scope & collaboration" },
  { id: "rbac-research-heading", label: "Research" },
  { id: "rbac-strategy-heading", label: "Strategy" },
  { id: "rbac-docs-heading", label: "Documentation" },
  { id: "rbac-experience-heading", label: "Experience & communication" },
  { id: "rbac-video-heading", label: "Walkthrough" },
  { id: "rbac-quote-heading", label: "Customer voice" },
  { id: "rbac-peer-heading", label: "Peer feedback" },
] as const;

const WALKTHROUGH_EMBED_SRC =
  "https://www.youtube.com/embed/MKSNUTt3PuQ?si=uEFqLt-00ti7sGjA";

/** In-flow responsive embed (no portal / fixed tracking; player stays in normal document scroll). */
function WalkthroughYoutubeEmbed() {
  return (
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
  );
}

function Figure({
  src,
  alt,
  caption,
  captionClassName,
  imageClassName,
}: {
  src: string;
  alt: string;
  caption?: string;
  captionClassName?: string;
  imageClassName?: string;
}) {
  return (
    <figure className="mt-6">
      <img
        src={src}
        alt={alt}
        className={imageClassName ?? "w-full max-w-4xl rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"}
      />
      {caption ? (
        <figcaption
          className={`mt-2 max-w-3xl text-sm leading-relaxed ${captionClassName ?? "text-[#999999]"}`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function CaseStudyPredefinedRoles() {
  const [isSectionIndexOpen, setIsSectionIndexOpen] = useState(false);

  const goToSection = (id: string) => {
    const main = document.getElementById("main-scroll");
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 24;
    if (main) {
      const mainRect = main.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const windowTop = targetRect.top + window.scrollY - offset;
      const top =
        main.scrollTop +
        (targetRect.top - mainRect.top) -
        offset;
      const desiredTop = Math.max(0, top);
      main.scrollTo({ top: desiredTop, behavior: "smooth" });
      requestAnimationFrame(() => {
        const afterRaf = main.scrollTop;
        if (afterRaf === 0 && desiredTop > 0) {
          // In some runtimes, window is the real scroller even when #main-scroll exists.
          window.scrollTo({ top: Math.max(0, windowTop), behavior: "smooth" });
        }
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    setIsSectionIndexOpen(false);
  };

  return (
    <section className="relative w-full min-w-0 min-h-screen shrink-0 overflow-x-hidden px-6 py-16 md:px-12 lg:px-16">
      <BlobBackground />
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-[1200px]">
        <motion.nav
          {...fadeUp}
          transition={{ duration: 0.35 }}
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1 text-sm text-[#999999]"
        >
          <Link to="/case-studies" className={linkClass}>
            Case studies
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span className="text-slate-400">Predefined Roles</span>
        </motion.nav>

        <motion.header
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.03 }}
          className="max-w-3xl"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-accent-readable">
            <img
              src={`${base}digitalocean-icon.svg`}
              alt=""
              className="h-4 w-4 shrink-0 object-contain"
              aria-hidden
            />
            <span>DigitalOcean · IAM &amp; access control</span>
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            RBAC - Predefined Roles
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#999999]">
            Expanding role options so teams can enforce least privilege without
            the complexity users see from hyperscaler IAM, delivered in the
            &quot;DO Simple&quot; way.
          </p>
        </motion.header>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Problem</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              With only three roles available, customers needed finer-grained
              ways to isolate who could manage infrastructure. Demand for safer,
              clearer access became a top company priority in 2024.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Solution</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              Ship additional predefined roles grounded in common use cases and
              customer requests, so teams can assign the right access quickly,
              without a bespoke build for every scenario.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-5 ring-1 ring-inset ring-white/5">
            <p className={labelClass}>Goals</p>
            <p className="mt-3 text-sm leading-relaxed text-[#999999] md:text-base">
              Help users apply least privilege, offer more restrictive RBAC that
              still feels simple, and set the platform up for the next phases of
              access control.
            </p>
          </div>
        </motion.div>

        <ResultsSection
          headingId="rbac-results-heading"
          description={
            <>
              In the first weeks after launch, newly introduced predefined
              roles reached broad adoption across teams and API usage, with
              strong continued uptake as customers refined how they govern
              access.
            </>
          }
          stats={[
            {
              value: 6000,
              format: "int-plus",
              label: "team members assigned predefined roles",
            },
            {
              value: 13,
              format: "percent",
              label:
                "of API tokens on the new roles (millions of daily hits)",
            },
            {
              value: 23,
              format: "approx-percent",
              label: "month-over-month growth in new role usage",
            },
          ]}
        />

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-labelledby="rbac-scope-heading"
          className="mt-16 rounded-xl border border-slate-600/50 bg-slate-900/30 p-6 md:p-8 ring-1 ring-inset ring-white/5"
        >
          <h2 id="rbac-scope-heading" className={sectionTitle}>
            Scope &amp; collaboration
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#999999] md:text-lg">
            This was one of the largest cross-product efforts at DigitalOcean in
            recent years: permissions touch nearly every surface, so alignment
            across design, product, engineering, insights, GTM, docs, research,
            support, and API teams was essential to ship coherently.
          </p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className={labelClass}>My role</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product design lead and workstream owner for the end-to-end
                experience.
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Timeline</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                102 business days from kickoff to general availability.
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <dt className={labelClass}>Partners</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">
                Product designers, PMs, TPMs, backend and frontend engineering,
                Insights, Marketing/GTM, product docs, UX research, Support,
                API, and engineering directors and managers.
              </dd>
            </div>
          </dl>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.11 }}
          aria-labelledby="rbac-research-heading"
          className="mt-16"
        >
          <h2 id="rbac-research-heading" className={sectionTitle}>
            Research
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Gathering and organizing feedback
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                RBAC demand showed up everywhere. I synthesized years of signals
                from NPS and CSAT, idea boards, customer channels, and CSM
                conversations, then grouped themes into simpler UX needs,
                requested role archetypes, and control over access.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                User interviews
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
                With UX research, we validated those themes through{" "}
                <span className="font-semibold text-slate-300">13 interviews</span>
                , focusing on how teams invite collaborators and govern access
                day to day. Findings shaped a simpler path to more granular
                roles.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-white">
              Research findings
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2 text-base leading-relaxed text-[#999999] md:text-lg">
              <li className="marker:text-accent-readable list-disc list-inside">
                Assign a role at invite time; don&apos;t force a
                default-then-reassign loop.
              </li>
              <li className="marker:text-accent-readable list-disc list-inside">
                Users compare us to AWS and GCP IAM; they want less
                overwhelming granularity and clearer defaults.
              </li>
              <li className="marker:text-accent-readable list-disc list-inside">
                Most wanted broad access{" "}
                <span className="text-slate-300">except delete</span>; the next
                most common need was a true read-only role across the platform.
              </li>
              <li className="marker:text-accent-readable list-disc list-inside">
                Teams were comfortable with CRUD as a mental model and wanted
                future paths to custom permission control.
              </li>
              <li className="marker:text-accent-readable list-disc list-inside md:col-span-2">
                Project-scoped limits on who holds a role mattered for larger
                orgs.
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="rbac-strategy-heading"
          className="mt-16"
        >
          <h2 id="rbac-strategy-heading" className={sectionTitle}>
            Strategy, process, and vision
          </h2>
          <h3 className="mt-6 text-lg font-semibold text-white">UX roadmap</h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            Research pointed to one north star: granular RBAC that still feels
            DO-simple. I framed the roadmap in three slices by need and effort:{" "}
            <span className="font-medium text-slate-300">predefined roles</span>{" "}
            (this launch), then{" "}
            <span className="font-medium text-slate-300">custom roles</span>, and
            later <span className="font-medium text-slate-300">conditions</span>{" "}
            for even finer control.
          </p>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.14 }}
          aria-labelledby="rbac-docs-heading"
          className="mt-16"
        >
          <h2 id="rbac-docs-heading" className={sectionTitle}>
            Documentation &amp; system rules
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            I led a broad documentation effort so permission behavior stays
            consistent as the platform grows: when to hide vs disable, how we
            describe CRUD to users vs engineers, how errors surface, and patterns
            that increase role awareness across surfaces.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#999999] md:text-lg">
            The spreadsheet below became the single source of truth about{" "}
            <span className="font-medium text-slate-300">80% of the launch</span>{" "}
            effort, after we moved off an unscalable &quot;screenshot every
            screen&quot; approach. I coordinated ~10% of every product
            designer&apos;s time to complete rows for their domains, using an
            existing engineering inventory as the foundation.
          </p>
          <Figure
            src={`${base}rbac-permissions-spreadsheet.png`}
            alt="Spreadsheet matrix of DigitalOcean products, permissions, and CRUD actions used as the RBAC source of truth"
            caption="Cross-functional permission matrix: the operational backbone for predefined roles and future RBAC work."
          />
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.15 }}
          aria-labelledby="rbac-experience-heading"
          className="relative mt-16 mx-[-1.5rem] border-y border-sky-700/25 bg-[radial-gradient(130%_160%_at_0%_0%,rgba(204,251,241,0.62)_0%,rgba(224,231,255,0.56)_24%,rgba(254,215,170,0.54)_42%,rgba(251,207,232,0.52)_60%,rgba(219,234,254,0.56)_78%,rgba(248,250,252,0.96)_100%)] px-6 py-10 md:mx-[-3rem] md:px-12 md:py-12 lg:mx-[-4rem] lg:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_100%_at_100%_100%,rgba(110,231,183,0.30)_0%,rgba(56,189,248,0.14)_42%,transparent_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.50)_0%,rgba(244,114,182,0.15)_20%,transparent_48%,rgba(192,132,252,0.14)_72%,rgba(96,165,250,0.10)_100%)]"
            aria-hidden
          />
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="relative z-[1] p-6 md:p-8">
              <h2
                id="rbac-experience-heading"
                className="text-xl font-bold tracking-tight text-black md:text-2xl"
              >
                Experience &amp; communication
              </h2>

              <h3 className="mt-10 text-lg font-semibold text-black">
                Invite with a role
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-black md:text-lg">
                Research showed invites had to carry the right role upfront. Users
                no longer needed to add someone with a default, then reassign,
                saving a full step in team onboarding and ongoing admin work.
              </p>
              <Figure
                src={`${base}rbac-invite-members.png`}
                alt="Invite team members flow with role selection in DigitalOcean"
              imageClassName="w-full max-w-4xl rounded-lg"
              />

              <h3 className="mt-12 text-lg font-semibold text-black">
                Assign predefined roles
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-black md:text-lg">
                Team owners with the right permissions can update roles from team
                settings through a focused modal that explains scope and impact.
              </p>
              <Figure
                src={`${base}rbac-change-role-modal-full.png`}
                alt="Change role modal listing predefined DigitalOcean team roles"
              imageClassName="w-full max-w-4xl rounded-lg"
              />

              <h3 className="mt-12 text-lg font-semibold text-black">
                Role communication
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-black md:text-lg">
                Shipping the UI was only half the story. I added email when a role
                changes, a reminder in the account menu so users always know their
                active role per team, and in-product moments, like a welcome
                banner, that reinforce what access they have.
              </p>
              <Figure
                src={`${base}rbac-role-comms.png`}
                alt="Email and in-product messaging explaining a user's updated team role"
                caption="Clear comms reduce surprise and support tickets during large-scale role migrations."
              captionClassName="text-slate-700"
              imageClassName="w-full max-w-4xl rounded-lg"
              />
            </div>
          </div>
        </motion.section>

        <section
          aria-labelledby="rbac-video-heading"
          className="relative z-[1] mt-16 w-full"
        >
          <h2 id="rbac-video-heading" className={sectionTitle}>
            Walkthrough
          </h2>
          <div className="mt-6 w-full min-w-0 overflow-hidden rounded-xl border border-slate-600/50 bg-black ring-1 ring-inset ring-white/5">
            <WalkthroughYoutubeEmbed />
          </div>
        </section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.17 }}
          className="mt-16 flex flex-col items-start gap-6 rounded-xl border border-slate-600/50 bg-slate-900/40 p-6 md:flex-row md:items-center md:justify-between md:p-8 ring-1 ring-inset ring-white/5"
        >
          <div>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              See it on DigitalOcean
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#999999] md:text-base">
              Official launch write-up with product context and customer impact.
            </p>
          </div>
          <a
            href="https://www.digitalocean.com/blog/introducing-new-predefined-roles-for-rbac"
            target="_blank"
            rel="noreferrer noopener"
            className="rainbow-cta group/cta relative inline-flex shrink-0 rounded-[8px] p-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <span className="relative flex w-full min-w-0 items-center rounded-[6px] bg-[#03040A] px-6 py-3 text-sm font-medium text-white transition-all duration-200 group-hover/cta:opacity-95">
              <span className="flex min-w-0 flex-1 justify-center">
                Read the launch post
              </span>
              <span className="flex w-0 shrink-0 justify-end overflow-hidden transition-all duration-200 ease-out group-hover/cta:ml-2 group-hover/cta:w-4">
                <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover/cta:opacity-100" />
              </span>
            </span>
          </a>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.18 }}
          aria-labelledby="rbac-quote-heading"
          className="mt-16"
        >
          <h2 id="rbac-quote-heading" className={sectionTitle}>
            Customer voice
          </h2>
          <blockquote className="mt-6 border-l-4 border-[#00aeef]/60 pl-6 text-base italic leading-relaxed text-slate-200 md:text-lg">
            <p>
              &ldquo;We create a new resource in DigitalOcean for every customer we
              onboard and granularity in setting up access control is critical
              for the success of our products. RBAC capabilities with predefined
              roles available today are going to help us secure and limit access
              to authorization. We have been part of the beta program and are
              excited to use this at scale in our production environment.&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium not-italic text-[#999999]">
              Gregory, CISO of a storage platform
            </footer>
          </blockquote>
        </motion.section>

        <motion.section
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.19 }}
          aria-labelledby="rbac-peer-heading"
          className="mt-16 pb-8"
        >
          <h2 id="rbac-peer-heading" className={sectionTitle}>
            Peer feedback
          </h2>
          <p className="mt-4 max-w-3xl text-base text-[#999999] md:text-lg">
            Highlights from internal recognition after the launch.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <figure>
              <img
                src={`${base}rbac-peer-feedback-ben.png`}
                alt="Peer feedback comment on predefined roles work"
                className="w-full rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"
              />
            </figure>
            <figure>
              <img
                src={`${base}rbac-peer-feedback-impact.png`}
                alt="Peer feedback on business impact of the RBAC launch"
                className="w-full rounded-lg border border-slate-600/40 bg-slate-950/50 drop-shadow-xl"
              />
            </figure>
          </div>
        </motion.section>

        <p className="mt-12 text-center text-sm text-[#999999]">
          <Link to="/case-studies" className={linkClass}>
            ← All case studies
          </Link>
        </p>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
        {isSectionIndexOpen ? (
          <div className="w-72 max-w-[calc(100vw-3rem)] rounded-xl border border-slate-600/60 bg-slate-950/90 p-3 shadow-2xl ring-1 ring-inset ring-white/10 backdrop-blur">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-accent-readable">
              Navigate to
            </p>
            <div className="max-h-[50vh] space-y-1 overflow-y-auto pr-1">
              {CASE_STUDY_SECTION_INDEX.map((item) => (
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
          aria-label={
            isSectionIndexOpen ? "Close section index" : "Open section index"
          }
          className="inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-900/85 px-4 py-2 text-sm font-medium text-slate-100 shadow-lg backdrop-blur transition-colors hover:border-[#00aeef]/60 hover:text-[#00aeef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {isSectionIndexOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
          Navigate
        </button>
      </div>
    </section>
  );
}
