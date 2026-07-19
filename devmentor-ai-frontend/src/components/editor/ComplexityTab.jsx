import React, { useEffect, useRef, useState } from "react";
import { Clock, Layers, TrendingUp } from "lucide-react";

const DEFAULT_COMPLEXITY = {
  time: "O(n)",
  space: "O(n)",
  bestCase: "O(n)",
  averageCase: "O(n)",
  worstCase: "O(n)",
  explanation:
    "The algorithm scans the array once and stores visited elements in a HashMap for O(1) lookup.",
};

export default function ComplexityTab({ complexity }) {
  // ==========================================
  // Backend Integration (Future)
  //
  // Props Example:
  //
  // complexity = {
  //   time: "O(n)",
  //   space: "O(n)",
  //   bestCase: "O(n)",
  //   averageCase: "O(n)",
  //   worstCase: "O(n)",
  //   explanation:
  //     "The algorithm traverses the array once while using a HashMap for constant-time lookups."
  // }
  // ==========================================

  const data = complexity || DEFAULT_COMPLEXITY;

  // Sections are treated as individual reveal targets, same idea
  // as the card lists in BugsTab / OptimizationTab / TestsTab.
  const SECTIONS = ["cards", "cases", "explanation"];

  const [visible, setVisible] = useState(() => new Set());
  const itemRefs = useRef([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setVisible(new Set());

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(idx));
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const revealClass = (idx) =>
    `transition-all duration-700 ease-out will-change-transform ${
      visible.has(idx) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const revealStyle = (idx) => ({
    transitionDelay: visible.has(idx) ? `${idx * 100}ms` : "0ms",
  });

  return (
    <div>
      {/* Heading stays fixed above the scroll area */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Complexity Analysis</h2>
        <p className="text-sm text-gray-500">AI-generated performance analysis.</p>
      </div>

      <div
        ref={scrollRef}
        className="space-y-6 max-h-[420px] overflow-y-auto pr-2 scroll-smooth
                   [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-white/10
                   [&::-webkit-scrollbar-thumb]:rounded-full
                   [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
      >
        {/* Complexity Cards */}
        <div
          ref={(el) => (itemRefs.current[0] = el)}
          data-index={0}
          className={`grid md:grid-cols-2 gap-4 ${revealClass(0)}`}
          style={revealStyle(0)}
        >
          <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Clock size={18} />
              <span className="font-medium">Time Complexity</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{data.time}</div>
          </div>

          <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Layers size={18} />
              <span className="font-medium">Space Complexity</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{data.space}</div>
          </div>
        </div>

        {/* Best / Average / Worst */}
        <div
          ref={(el) => (itemRefs.current[1] = el)}
          data-index={1}
          className={`bg-[#0d0f18] border border-white/5 rounded-xl p-5 ${revealClass(1)}`}
          style={revealStyle(1)}
        >
          <h3 className="font-semibold mb-4">Performance Cases</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-gray-500">Best Case</div>
              <div className="text-xl font-semibold text-purple-400 mt-2">{data.bestCase}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-gray-500">Average Case</div>
              <div className="text-xl font-semibold text-yellow-400 mt-2">{data.averageCase}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-gray-500">Worst Case</div>
              <div className="text-xl font-semibold text-red-400 mt-2">{data.worstCase}</div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div
          ref={(el) => (itemRefs.current[2] = el)}
          data-index={2}
          className={`bg-[#0d0f18] border border-white/5 rounded-xl p-5 ${revealClass(2)}`}
          style={revealStyle(2)}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-purple-400" />
            <h3 className="font-semibold">AI Explanation</h3>
          </div>
          <p className="text-sm text-gray-400 leading-7">{data.explanation}</p>
        </div>
      </div>
    </div>
  );
}