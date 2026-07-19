import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Field({ label, type = "text", placeholder, right }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-gray-300">{label}</label>
        {right}
      </div>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          className="w-full bg-[#0d0f18] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
