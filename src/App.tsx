import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home, FolderKanban, User } from "lucide-react";
import { Home as HomePage } from "./pages/Home";
import { Portfolio as PortfolioPage } from "./pages/Portfolio";
import { About as AboutPage } from "./pages/About";

export function App() {
  return (
    <div className="flex min-h-screen bg-black text-slate-50">
      <aside className="w-52 shrink-0 border-r border-slate-800 bg-black text-white flex flex-col">
        <div className="flex flex-col items-center gap-6 px-4 py-8">
          <div className="w-24">
            <img
              src="/logo-aj.png"
              alt="AJ Zichella monogram"
              className="h-auto w-full"
            />
          </div>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-4 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-4 py-4 text-left hover:bg-slate-800 ${
                isActive ? "text-[#00aeef] bg-slate-800/50" : "text-[#00aeef]"
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-4 py-4 text-left hover:bg-slate-800 ${
                isActive ? "text-[#00aeef] bg-slate-800/50" : "text-[#00aeef]"
              }`
            }
          >
            <FolderKanban className="h-4 w-4" />
            <span>Portfolio</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-4 py-4 text-left hover:bg-slate-800 ${
                isActive ? "text-[#00aeef] bg-slate-800/50" : "text-[#00aeef]"
              }`
            }
          >
            <User className="h-4 w-4" />
            <span>About me</span>
          </NavLink>
        </nav>
      </aside>
      <main id="main-scroll" className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  );
}
