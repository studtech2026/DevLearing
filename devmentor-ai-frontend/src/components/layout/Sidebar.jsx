import React from "react";
import { LogOut, X } from "lucide-react";
import Logo from "../common/Logo.jsx"
import { NAV_ITEMS } from "../../data/mockData.js";

export default function Sidebar({ active, go, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-screen w-64 flex flex-col
          bg-gradient-to-b from-[#0d0f18] via-[#0d0f18] to-[#0a0b12]
          border-r border-white/5 shadow-2xl shadow-black/40
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Subtle top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5">
          <Logo size="text-base" />
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors duration-150"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/10
          [&::-webkit-scrollbar-thumb]:rounded-full
        ">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  go(item.id);
                  setMobileOpen(false);
                }}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-all duration-200 ease-out
                  ${
                    isActive
                      ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-[0_0_20px_-8px_rgba(168,85,247,0.6)]"
                      : "text-gray-400 border border-transparent hover:bg-white/5 hover:text-gray-200 hover:translate-x-0.5"
                  }
                `}
              >
                {/* Active indicator bar */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-purple-400 transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <item.icon
                  size={16}
                  className={`transition-transform duration-200 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="relative px-3 py-4 border-t border-white/5">
          <button
            onClick={() => go("landing")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400
              transition-all duration-200 ease-out
              hover:bg-red-500/10 hover:text-red-400 hover:translate-x-0.5"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}