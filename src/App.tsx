import React, { useState, useEffect, useLayoutEffect } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { Home, FolderKanban, User, Menu, X } from "lucide-react";
import { Home as HomePage } from "./pages/Home";
import { Portfolio as PortfolioPage } from "./pages/Portfolio";
import { About as AboutPage } from "./pages/About";
import { Footer } from "./components/Footer";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md px-4 py-6 lg:py-4 text-left hover:bg-slate-800 text-lg lg:text-sm ${
    isActive ? "text-[#00aeef] bg-slate-800/50" : "text-[#00aeef]"
  }`;

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on every navigation (before paint so content doesn’t flash mid-scroll).
  // `location.key` changes per history entry; pathname/search cover query updates.
  useLayoutEffect(() => {
    const main = document.getElementById("main-scroll");
    if (main) {
      main.scrollTop = 0;
      main.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search, location.key]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const NavContent = ({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) => (
    <>
      <div className={`flex flex-col items-center px-4 ${variant === "mobile" ? "pt-2" : "gap-6 py-8"}`}>
        <div className="w-24">
          <img
            src={`${import.meta.env.BASE_URL}logo-aj.png`}
            alt="AJ Zichella monogram"
            className="h-auto w-full"
          />
        </div>
      </div>
      <nav className={`flex flex-col gap-1 px-4 text-sm font-medium ${variant === "mobile" ? "mt-24" : "mt-4"}`}>
        <NavLink
          to="/"
          end
          className={navLinkClass}
          onClick={() => setMenuOpen(false)}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/case-studies"
          className={navLinkClass}
          onClick={() => setMenuOpen(false)}
        >
          <FolderKanban className="h-4 w-4" />
          <span>Case studies</span>
        </NavLink>
        <NavLink
          to="/about"
          className={navLinkClass}
          onClick={() => setMenuOpen(false)}
        >
          <User className="h-4 w-4" />
          <span>About me</span>
        </NavLink>
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-black text-slate-50">
      {/* Hamburger / X button - mobile only, top right, always above content */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed z-[60] flex lg:hidden items-center justify-center w-12 h-12 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile drawer - drops from top, backdrop */}
      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          aria-label="Close menu"
        />
      )}
      <div
        className={`
          fixed top-0 left-0 right-0 z-50 lg:hidden
          h-[80vh]
          flex flex-col bg-black text-white border-b border-slate-800 rounded-b-2xl
          transform transition-transform duration-300 ease-out
          ${menuOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-6 overflow-y-auto">
          <NavContent variant="mobile" />
        </div>
      </div>

      {/* Sidebar - desktop only, fixed so it never scrolls */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-52 shrink-0 border-r border-slate-800 bg-black text-white flex-col z-30">
        <NavContent />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:ml-52">
        <main
          id="main-scroll"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto pt-[max(env(safe-area-inset-top),5rem)] lg:pt-0"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/case-studies" element={<PortfolioPage />} />
            <Route path="/portfolio" element={<Navigate to="/case-studies" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
