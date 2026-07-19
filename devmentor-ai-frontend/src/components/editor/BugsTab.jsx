import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bug, ShieldAlert } from "lucide-react";

const BUGS = [
  {
    id: 1,
    title: "Logical Issue",
    line: 6,
    severity: "Medium",
    type: "Logic Bug",
    description: "Incorrect index is returned from the hash map.",
    suggestion: "Store the current index correctly before returning the result.",
  },
  {
    id: 2,
    title: "Missing Edge Case",
    line: 10,
    severity: "Low",
    type: "Edge Case",
    description: "Function doesn't handle an empty input array.",
    suggestion: "Return an empty array when no valid pair exists.",
  },
  {
    id: 3,
    title: "Input Validation",
    line: 1,
    severity: "High",
    type: "Validation",
    description: "Input parameters are not validated before processing.",
    suggestion: "Check for null or invalid input before executing the algorithm.",
  },
];

const SEVERITY_STYLES = {
  High: "bg-red-500/20 text-red-300",
  Medium: "bg-amber-500/20 text-amber-300",
  Low: "bg-blue-500/20 text-blue-300",
};

export default function BugsTab() {
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
      className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scroll-smooth
                 [&::-webkit-scrollbar]:w-1.5
                 [&::-webkit-scrollbar-track]:bg-transparent
                 [&::-webkit-scrollbar-thumb]:bg-white/10
                 [&::-webkit-scrollbar-thumb]:rounded-full
                 [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Bug Detection Report</h3>
        <p className="text-sm text-gray-500">AI detected possible issues in your code.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0d0f18] border border-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <Bug size={18} />
            <span className="text-sm">Total Bugs</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">3</h2>
        </div>

        <div className="bg-[#0d0f18] border border-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle size={18} />
            <span className="text-sm">Warnings</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">2</h2>
        </div>

        <div className="bg-[#0d0f18] border border-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-400">
            <ShieldAlert size={18} />
            <span className="text-sm">Critical</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">1</h2>
        </div>
      </div>

      {/* Bug List */}
      <div className="space-y-4">
        {BUGS.map((bug, idx) => {
          const isVisible = visible.has(idx);
          return (
            <div
              key={bug.id}
              ref={(el) => (itemRefs.current[idx] = el)}
              data-index={idx}
              className={`bg-[#0d0f18] border border-white/5 rounded-xl p-5
                          transition-all duration-700 ease-out will-change-transform
                          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: isVisible ? `${idx * 80}ms` : "0ms" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-red-400">{bug.title}</h4>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    SEVERITY_STYLES[bug.severity] || "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {bug.severity}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Line Number</p>
                  <p className="font-medium">{bug.line}</p>
                </div>

                <div>
                  <p className="text-gray-400">Bug Type</p>
                  <p className="font-medium">{bug.type}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="mt-1">{bug.description}</p>
              </div>

              <div className="mt-4 bg-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-purple-300 text-sm font-medium">AI Suggestion</p>
                <p className="text-sm mt-1 text-gray-300">{bug.suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}