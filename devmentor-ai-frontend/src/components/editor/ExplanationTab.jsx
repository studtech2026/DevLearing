import React, { useEffect, useRef, useState } from "react";
import {
  FileCode,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const explanations = [
  {
    line: 1,
    code: "def two_sum(nums, target):",
    explanation:
      "Defines a function named 'two_sum' that accepts an array and a target value.",
  },
  {
    line: 2,
    code: "seen = {}",
    explanation:
      "Creates an empty dictionary to store previously visited numbers.",
  },
  {
    line: 3,
    code: "for i, num in enumerate(nums):",
    explanation:
      "Loops through every element in the array while keeping track of its index.",
  },
  {
    line: 4,
    code: "diff = target - num",
    explanation:
      "Calculates the number needed to reach the target sum.",
  },
  {
    line: 5,
    code: "if diff in seen:",
    explanation:
      "Checks whether the required complement has already been encountered.",
  },
  {
    line: 6,
    code: "return [seen[diff], i]",
    explanation:
      "Returns the indices of the two numbers whose sum equals the target.",
  },
  {
    line: 7,
    code: "seen[num] = i",
    explanation:
      "Stores the current number and its index in the dictionary.",
  },
  {
    line: 9,
    code: "return []",
    explanation:
      "Returns an empty array if no valid pair exists.",
  },
];

export default function ExplanationTab() {
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
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scroll-smooth
                 [&::-webkit-scrollbar]:w-1.5
                 [&::-webkit-scrollbar-track]:bg-transparent
                 [&::-webkit-scrollbar-thumb]:bg-white/10
                 [&::-webkit-scrollbar-thumb]:rounded-full
                 [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
    >
      {/* Summary */}
      <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-purple-400" />
          <h3 className="font-semibold">AI Code Explanation</h3>
        </div>
        <p className="text-sm text-gray-400 leading-7">
          DevMentor AI explains your program line by line, helping you
          understand the purpose of every statement and how the algorithm
          works.
        </p>
      </div>

      {/* Line-by-Line Explanation */}
      {explanations.map((item, idx) => {
        const isVisible = visible.has(idx);
        return (
          <div
            key={item.line}
            ref={(el) => (itemRefs.current[idx] = el)}
            data-index={idx}
            className={`bg-[#0d0f18] border border-white/5 rounded-xl p-4
                        transition-all duration-700 ease-out will-change-transform
                        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: isVisible ? `${idx * 70}ms` : "0ms" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileCode size={16} className="text-blue-400" />
              <span className="text-xs text-purple-400 font-semibold">
                Line {item.line}
              </span>
            </div>

            <div className="bg-[#12141f] rounded-lg px-3 py-2 font-mono text-sm text-green-400 mb-3 overflow-x-auto">
              {item.code}
            </div>

            <div className="flex items-start gap-2">
              <ChevronRight size={16} className="text-gray-500 mt-1" />
              <p className="text-sm text-gray-300 leading-7">
                {item.explanation}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}