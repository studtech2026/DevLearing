import React from "react";
import { ClipboardPaste, Sparkles, ListChecks, Rocket } from "lucide-react";
import MarketingNav from "../../components/layout/Header.jsx";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste your code",
    desc: "Drop in a function, a file, or a whole GitHub repo URL. Python, JavaScript, Java, C++, and more are all supported.",
  },
  {
    icon: Sparkles,
    title: "AI analyzes it",
    desc: "DevMentor reads the code the way a senior engineer would: tracing logic, spotting edge cases, and measuring complexity.",
  },
  {
    icon: ListChecks,
    title: "Review the insights",
    desc: "Get a plain-language explanation, a list of bugs with line numbers, and time/space complexity, side by side with your code.",
  },
  {
    icon: Rocket,
    title: "Apply and improve",
    desc: "Accept suggested fixes, generate unit tests, or convert the code to another language, then save it to your history.",
  },
];

export default function HowItWorksPage({ go }) {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <MarketingNav go={go} active="how-it-works" />

      <header className="max-w-4xl mx-auto text-center px-8 pt-16 pb-12">
        <h1 className="text-4xl font-bold mb-4">
          From pasted code to{" "}
          <span className="text-purple-500">clear insight</span> in seconds
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Four steps, no setup required.
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-8 pb-20">
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="flex items-start gap-5 bg-[#12141f] border border-white/5 rounded-xl p-6"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <s.icon size={18} className="text-purple-400" />
                </div>
                <span className="text-xs text-gray-600 font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <div className="text-base font-semibold mb-1">{s.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => go("signup")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition"
          >
            Try it on your own code
          </button>
        </div>
      </section>
    </div>
  );
}
