import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../common/Logo.jsx";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it Works" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
];

export default function Header({ go, active }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0D17]/80 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => go("landing")}
          className="transition-transform duration-300 hover:scale-105"
        >
          <Logo />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`relative text-sm font-medium transition-all duration-300
                ${
                  active === item.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {item.label}

              <span
                className={`absolute left-0 -bottom-2 h-[2px] bg-purple-500 transition-all duration-300
                ${active === item.id ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </button>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => go("login")}
            className="px-5 py-2.5 rounded-lg border border-white/15 text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => go("signup")}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:scale-105 transition-all duration-300 font-medium shadow-lg shadow-purple-500/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B0D17]/95 backdrop-blur-xl">
          <div className="flex flex-col p-6 space-y-4">
            {LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  go(item.id);
                  setMobileOpen(false);
                }}
                className={`text-left py-2 transition ${
                  active === item.id
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}

            <hr className="border-white/10" />

            <button
              onClick={() => {
                go("login");
                setMobileOpen(false);
              }}
              className="border border-white/10 rounded-lg py-3 hover:bg-white/5"
            >
              Login
            </button>

            <button
              onClick={() => {
                go("signup");
                setMobileOpen(false);
              }}
              className="rounded-lg py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
