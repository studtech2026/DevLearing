import React from "react";
import {
  Bug,
  Clock,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function AnalysisTab({ analysis }) {
  // Backend data (Future)
  // If backend data is not available, use default values.

  const data = analysis || {
    bugsFound: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    qualityScore: 92,
    executionTime: "0.25 ms",
    memoryUsage: "1.2 MB",

    issues: [
      {
        title: "Logical Issue",
        severity: "Medium",
        description:
          "AI detected a possible logical issue in the algorithm.",
      },
      {
        title: "Edge Case",
        severity: "Low",
        description:
          "Handle empty array input before processing.",
      },
    ],
  };

  return (
    <div className="space-y-5 max-h-[70vh]  pr-2 ">

      {/* =======================================
          Analysis Overview
      ======================================= */}

      <h4 className="text-lg font-semibold mb-4">
        Analysis Overview
      </h4>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        {/* Bugs */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Bug size={14} className="text-red-400" />
            Bugs Found
          </div>

          <h2 className="text-2xl font-bold text-red-400">
            {data.bugsFound}
          </h2>
        </div>

        {/* Time */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Clock size={14} className="text-blue-400" />
            Time Complexity
          </div>

          <h2 className="text-2xl font-bold text-blue-400">
            {data.timeComplexity}
          </h2>
        </div>

        {/* Space */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Layers size={16} className="text-emerald-400" />
            Space Complexity
          </div>

          <h2 className="text-2xl font-bold text-emerald-400">
            {data.spaceComplexity}
          </h2>
        </div>

        {/* Quality */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <CheckCircle2
              size={16}
              className="text-purple-400"
            />
            Code Quality
          </div>

          <h2 className="text-2xl font-bold text-purple-400">
            {data.qualityScore}/100
          </h2>
        </div>

        {/* Execution */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-2">
            Execution Time
          </div>

          <h2 className="text-2xl font-bold">
            {data.executionTime}
          </h2>
        </div>

        {/* Memory */}

        <div className="bg-[#0d0f18] border border-white/5 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-2">
            Memory Usage
          </div>

          <h2 className="text-2xl font-bold">
            {data.memoryUsage}
          </h2>
        </div>

      </div>

      

      <h4 className="text-lg font-semibold mb-4">
        Issues Detected
      </h4>

      <div className="space-y-3">

        {data.issues.map((issue, index) => (

          <div
            key={index}
            className="bg-[#0d0f18] border border-white/5 rounded-xl p-4 flex gap-3"
          >

            <AlertTriangle
              size={18}
              className="text-yellow-400 mt-1"
            />

            <div>

              <div className="flex items-center gap-2 mb-1">

                <h5 className="font-semibold">
                  {issue.title}
                </h5>

                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                  {issue.severity}
                </span>

              </div>

              <p className="text-sm text-gray-400">
                {issue.description}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}