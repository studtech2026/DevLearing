import React, { useEffect, useRef, useState } from "react";
import { Zap, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

const SUGGESTIONS = [
  {
    title: "Use HashMap",
    before: "Nested Loop",
    after: "HashMap Lookup",
    improvement: "Time Complexity: O(n²) → O(n)",
  },
  {
    title: "Remove Unnecessary Variable",
    before: "Extra variable allocation",
    after: "Direct computation",
    improvement: "Cleaner & more readable code",
  },
  {
    title: "Improve Variable Names",
    before: "a, b, c",
    after: "currentNumber, targetValue",
    improvement: "Improves code readability",
  },
];

export default function OptimizationTab() {
  const [visible, setVisible] = useState(() => new Set());
  const itemRefs = useRef([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
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
  }, []);

  return (
    <div
      ref={scrollRef}
      className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scroll-smooth
                 [&::-webkit-scrollbar]:w-1.5
                 [&::-webkit-scrollbar-track]:bg-transparent
                 [&::-webkit-scrollbar-thumb]:bg-white/10
                 [&::-webkit-scrollbar-thumb]:rounded-full
                 [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">AI Optimization Suggestions</h3>
        <p className="text-sm text-gray-500 mt-1">
          AI recommendations to improve performance, readability, and maintainability.
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <TrendingUp size={16} />
            Performance
          </div>
          <h2 className="text-2xl font-bold mt-2">+65%</h2>
          <p className="text-xs text-gray-500 mt-1">Estimated performance improvement</p>
        </div>

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <Zap size={16} />
            Optimizations
          </div>
          <h2 className="text-2xl font-bold mt-2">3</h2>
          <p className="text-xs text-gray-500 mt-1">AI suggestions generated</p>
        </div>

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-400 text-sm">
            <CheckCircle2 size={16} />
            Code Quality
          </div>
          <h2 className="text-2xl font-bold mt-2">92/100</h2>
          <p className="text-xs text-gray-500 mt-1">After applying recommendations</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {SUGGESTIONS.map((item, idx) => {
          const isVisible = visible.has(idx);
          return (
            <div
              key={idx}
              ref={(el) => (itemRefs.current[idx] = el)}
              data-index={idx}
              className={`bg-[#0d0f18] border border-white/5 rounded-xl p-5
                          transition-all duration-700 ease-out will-change-transform
                          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: isVisible ? `${idx * 80}ms` : "0ms" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-yellow-400" />
                <h4 className="font-semibold">{item.title}</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Before</p>
                  <div className="bg-[#151826] rounded-lg p-3 text-sm">{item.before}</div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">After</p>
                  <div className="bg-[#151826] rounded-lg p-3 text-sm flex items-center justify-between">
                    {item.after}
                    <ArrowRight size={16} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-sm text-emerald-400">{item.improvement}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}