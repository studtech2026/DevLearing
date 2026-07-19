import React from "react";
import { FileText, Download } from "lucide-react";
import TopBar from "../../components/layout/TopBar.jsx";
import { REPORTS } from "../../data/mockData.js";

export default function ReportsPage({ mobileOpen, setMobileOpen }) {
  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="Reports"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <h1 className="text-2xl font-bold mb-1">Reports</h1>
      <p className="text-gray-500 text-sm mb-6">
        Your AI-generated analysis reports
      </p>

      <div className="space-y-3">
        {REPORTS.map((r) => (
          <div
            key={r.title}
            className="bg-[#12141f] border border-white/5 rounded-xl p-4 flex items-center justify-between flex-wrap gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText size={15} className="text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-gray-500">{r.date}</div>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs border border-white/10 px-3 py-1.5 rounded-lg text-gray-300 hover:bg-white/5">
              <Download size={13} /> PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
