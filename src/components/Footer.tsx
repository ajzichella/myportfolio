import React from "react";
import { NavLink } from "react-router-dom";
import { LinkedInLogoSolid } from "./LinkedInLogoSolid";

const footerNavClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
    isActive ? "text-[#00aeef]" : "text-slate-400 hover:text-[#00aeef]"
  }`;

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-slate-800/80 bg-black px-6 py-4 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="max-w-3xl text-left text-xs leading-relaxed text-slate-500 sm:text-sm flex flex-col gap-1">
          <span>
            AJ Zichella &middot; Senior Product Designer &amp; Design Engineer
          </span>
          <span>
            Made with love, open-source React and Shadcn libraries, and Cursor.
          </span>
        </p>
        <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-x-2 gap-y-2 sm:flex-1 sm:justify-end sm:gap-x-3">
          <nav
            className="flex flex-wrap items-center gap-x-3 sm:gap-x-4"
            aria-label="Site"
          >
            <NavLink to="/" end className={footerNavClass}>
              Home
            </NavLink>
            <NavLink to="/case-studies" className={footerNavClass}>
              Case studies
            </NavLink>
            <NavLink to="/about" className={footerNavClass}>
              About me
            </NavLink>
          </nav>
          <span className="flex shrink-0 items-center border-slate-700 sm:border-l sm:pl-3">
            <a
              href="https://www.linkedin.com/in/angela-zichella/"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-sm text-[#00aeef] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00aeef] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="AJ Zichella on LinkedIn"
            >
              <LinkedInLogoSolid className="h-5 w-5" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
