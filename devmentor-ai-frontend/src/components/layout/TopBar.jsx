import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ title, mobileOpen, setMobileOpen }) {
  return (
    <div className="flex items-center gap-3 md:hidden mb-4">
      <button
        onClick={() => setMobileOpen(true)}
        className="text-gray-300 border border-white/10 rounded-lg p-2"
      >
        <Menu size={18} />
      </button>
      <span className="font-semibold">{title}</span>
    </div>
  );
}
