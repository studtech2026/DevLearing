import React from "react";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#12141f] border border-white/5 rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
}
