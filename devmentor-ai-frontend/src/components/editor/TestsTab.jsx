import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, TestTube2 } from "lucide-react";

const DEFAULT_TESTS = [
  { id: 1, type: "Normal Case", input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
  { id: 2, type: "Duplicate Values", input: "nums = [3,3], target = 6", expected: "[0,1]" },
  { id: 3, type: "Empty Array", input: "nums = [], target = 5", expected: "[]" },
  { id: 4, type: "Single Element", input: "nums = [5], target = 5", expected: "[]" },
];

export default function TestsTab({ tests }) {
  const data = tests || DEFAULT_TESTS;

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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generated Test Cases</h3>

      <div
        ref={scrollRef}
        className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scroll-smooth
                   [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-white/10
                   [&::-webkit-scrollbar-thumb]:rounded-full
                   [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
      >
        {data.map((test, idx) => {
          const isVisible = visible.has(idx);
          return (
            <div
              key={test.id}
              ref={(el) => (itemRefs.current[idx] = el)}
              data-index={idx}
              className={`bg-[#0d0f18] border border-white/5 rounded-lg p-4
                          transition-all duration-700 ease-out will-change-transform
                          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: isVisible ? `${idx * 80}ms` : "0ms" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TestTube2 size={18} className="text-purple-400" />
                <span className="font-medium">{test.type}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Input</span>
                  <pre className="mt-1 bg-black/20 rounded p-2 text-gray-200 overflow-x-auto">
                    {test.input}
                  </pre>
                </div>

                <div>
                  <span className="text-gray-500">Expected Output</span>
                  <pre className="mt-1 bg-black/20 rounded p-2 text-green-400 overflow-x-auto">
                    {test.expected}
                  </pre>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
                <CheckCircle2 size={16} />
                Ready for Execution
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}