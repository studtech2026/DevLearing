import React from "react";
import {
  Code2,
  Bug,
  Zap,
  BarChart3,
  TestTube2,
  RefreshCw,
  GitBranch,
  FileText,
} from "lucide-react";
import MarketingNav from "../../components/layout/Header.jsx";

const FEATURES = [
  {
    icon: Code2,
    title: "AI Code Explanation",
    desc: "Paste any function and get a plain-language, line-by-line walkthrough of what it does and why.",
  },
  {
    icon: Bug,
    title: "Bug Detection",
    desc: "Catches syntax slips and logical errors before they ship, with the exact line and reason flagged.",
  },
  {
    icon: Zap,
    title: "Optimization",
    desc: "Suggests concrete rewrites that cut runtime, memory, or both, with before/after comparisons.",
  },
  {
    icon: BarChart3,
    title: "Complexity Analysis",
    desc: "Time and space complexity worked out automatically, so you know how your code scales.",
  },
  {
    icon: TestTube2,
    title: "Unit Tests",
    desc: "Generates a starting test suite covering typical cases, edge cases, and failure paths.",
  },
  {
    icon: RefreshCw,
    title: "Code Conversion",
    desc: "Translate a function between Python, JavaScript, Java, C++, and more while preserving behavior.",
  },
  {
    icon: GitBranch,
    title: "Repository Analyzer",
    desc: "Point it at a public GitHub repo for a full health score, language breakdown, and hotspots.",
  },
  {
    icon: FileText,
    title: "Reports",
    desc: "Export any analysis as a shareable PDF report for code reviews or team standups.",
  },
];

export default function FeaturesPage({ go }) {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <MarketingNav go={go} active="features" />

      <header className="max-w-4xl mx-auto text-center px-8 pt-16 pb-12">
        <h1 className="text-4xl font-bold mb-4">
          Everything you need to write{" "}
          <span className="text-purple-500">better code</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          One editor, eight ways to understand, fix, and improve what you've
          written.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[#12141f] border border-white/5 rounded-xl p-5 hover:border-purple-500/40 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-purple-400" />
              </div>
              <div className="text-sm font-semibold mb-2">{f.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => go("signup")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition"
          >
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
}
