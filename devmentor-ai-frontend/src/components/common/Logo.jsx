import React from "react";
import { Code2 } from "lucide-react";

export default function Logo({ size = "text-lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-900/40">
        <Code2 size={16} className="text-white" />
      </div>
      <span className={`font-semibold text-white ${size}`}>DevMentor AI</span>
    </div>
  );
}
