/** Shared glass tooltip panel (ResultsSection-style). */
const portfolioTooltipPanelBase =
  "portfolio-tooltip-panel pointer-events-none absolute bottom-[calc(100%+0.5rem)] z-[110] w-max rounded-xl case-study-card case-study-card--no-left-accent px-3 py-2.5 text-left text-sm font-normal leading-relaxed text-slate-100 opacity-0 transition-opacity duration-200 sm:px-4 sm:py-3.5";

/** Glass tooltips + cyan edge glow — DigitalOcean logo (Home case studies). */
export const csTooltipDo =
  `${portfolioTooltipPanelBase} left-1/2 max-w-[min(18rem,calc(100vw-2rem))] sm:max-w-[22rem] -translate-x-1/2 group-hover/do-cs:opacity-100 group-focus-within/do-cs:opacity-100`;

/** AMD logo tooltip (Home case studies). */
export const csTooltipAmd =
  `${portfolioTooltipPanelBase} left-1/2 max-w-[min(13rem,calc(100vw-15rem))] sm:max-w-[15rem] -translate-x-1/2 group-hover/amd-cs:opacity-100 group-focus-within/amd-cs:opacity-100`;

/** Ashley logo tooltip (Home case studies). */
export const csTooltipAshley =
  `${portfolioTooltipPanelBase} right-0 left-auto max-w-[min(13rem,calc(100vw-15rem))] sm:max-w-[15rem] group-hover/ashley-cs:opacity-100 group-focus-within/ashley-cs:opacity-100`;

/** Same panel as `csTooltipDo` — inline triggers (e.g. DDoS gate password hint). */
export const csTooltipDoInline =
  `${portfolioTooltipPanelBase} left-1/2 max-w-[min(18rem,calc(100vw-2rem))] sm:max-w-[22rem] -translate-x-1/2 group-hover/ddos-pw-tip:opacity-100 group-focus-within/ddos-pw-tip:opacity-100`;
