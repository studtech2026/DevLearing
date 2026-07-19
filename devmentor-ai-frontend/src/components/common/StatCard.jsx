import React from "react";

export default function StatCard({ icon: Icon, label, value, delta, accent }) {
  return (
    <div className="bg-[#12141f] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Icon size={15} className={accent} />
        {label}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-xs text-emerald-400">{delta}</div>
    </div>
  );
}
