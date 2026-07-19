import React from "react";
import {
  Plus,
  BarChart3,
  Bug,
  Layers,
  GitBranch,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import StatCard from "../../components/common/StatCard.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import Tilt3DCard from "../../components/common/Tilt3DCard.jsx";

import { LANGS, RECENT_ANALYSES } from "../../data/mockData.js";

// ======================================================
// Dashboard Component
// This page displays the user's coding statistics,
// recent analyses, and language usage.
// ======================================================

const STAT_ACCENTS = [
  "from-purple-500 to-fuchsia-500",
  "from-red-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
];

const STAT_GLOW = [
  "rgba(168,85,247,0.35)",
  "rgba(244,63,94,0.32)",
  "rgba(59,130,246,0.32)",
  "rgba(16,185,129,0.32)",
];

// Deterministic pseudo-random activity intensities (0-4) for the
// commit-style streak graph — stands in for real "analyses per day"
// history until the backend field lands.
function seededActivity(weeks, days) {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(rand() * 5)),
  );
}

const ACTIVITY = seededActivity(18, 7);
const ACTIVITY_SHADES = [
  "bg-white/[0.04]",
  "bg-purple-500/25",
  "bg-purple-500/45",
  "bg-purple-500/70",
  "bg-purple-400",
];

export default function Dashboard({ go, mobileOpen, setMobileOpen }) {
  /*
  ======================================================
  Backend Integration (Future)

  GET /dashboard

  Response Example:

  {
    totalAnalyses,
    bugsFound,
    linesAnalyzed,
    repositories,
    recentAnalyses,
    topLanguages,
    activityStreak   // daily analysis counts, for the streak graph
  }

  TODO:
  - Replace mockData with backend response.
  - Store response in React state.
  - Display real user statistics.
  ======================================================
  */

  const topLang = LANGS.reduce(
    (best, l) => (l.value > (best?.value ?? -1) ? l : best),
    LANGS[0],
  );

  return (
    <div className="relative flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      {/* ======================================================
          Ambient depth background — blurred color blobs plus a
          faint dot grid, evoking an IDE canvas rather than a
          plain gradient wash.
      ====================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="acm-blob absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-purple-600/20 blur-[110px]" />
        <div
          className="acm-blob absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-blue-600/15 blur-[110px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="acm-blob absolute bottom-0 left-1/4 w-[320px] h-[320px] rounded-full bg-emerald-500/10 blur-[110px]"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      {/* ======================================================
          Dashboard Header
      ====================================================== */}

      <TopBar
        title="Dashboard"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ======================================================
          Welcome Section
      ====================================================== */}

      <div className="acm-fade-up relative flex items-center justify-between mb-6 flex-wrap gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-5 py-4 md:px-6 md:py-5 overflow-hidden">
        {/* faint corner glyph, reinforcing the "code" subject without shouting it */}
        <Terminal
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -bottom-3 text-white/[0.03]"
          size={110}
          strokeWidth={1}
        />

        <div className="relative">
          <p className="text-[11px] font-mono tracking-[0.18em] text-purple-400/70 uppercase mb-1.5">
            ~/dashboard
          </p>
          {/* Backend:
              Display logged-in user's name
              Example:
              Welcome back, {user.name}
          */}
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Welcome back, Prem!{" "}
            <span className="inline-block acm-wave origin-[70%_70%]">👋</span>
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Here's your coding overview
          </p>
        </div>

        {/* Navigate to AI Editor */}
        <button
          onClick={() => go("editor")}
          className="acm-cta-btn relative flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={15} />
          New Analysis
        </button>
      </div>

      {/* ======================================================
          Dashboard Statistics

          Backend:
          totalAnalyses
          bugsFound
          linesAnalyzed
          repositories
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: BarChart3,
            label: "Total Analyses",
            value: "128",
            delta: "+12% this week",
            accent: "text-purple-400",
          },
          {
            icon: Bug,
            label: "Bugs Found",
            value: "45",
            delta: "+8% this week",
            accent: "text-red-400",
          },
          {
            icon: Layers,
            label: "Lines Analyzed",
            value: "12.5K",
            delta: "+18% this week",
            accent: "text-blue-400",
          },
          {
            icon: GitBranch,
            label: "Repositories",
            value: "8",
            delta: "+2 this week",
            accent: "text-emerald-400",
          },
        ].map((stat, i) => (
          <Tilt3DCard
            key={stat.label}
            accent={STAT_ACCENTS[i]}
            className="acm-fade-up rounded-xl acm-stat-card"
            style={{
              animationDelay: `${i * 60}ms`,
              "--acm-glow": STAT_GLOW[i],
            }}
          >
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              delta={stat.delta}
              accent={stat.accent}
            />
          </Tilt3DCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* ======================================================
            Recent Analyses

            Backend:
            GET /dashboard

            recentAnalyses[]
        ====================================================== */}

        <Tilt3DCard
          accent="from-purple-500/70 to-transparent"
          className="acm-fade-up rounded-xl"
          style={{ animationDelay: "240ms" }}
          maxTilt={3}
        >
          <div className="bg-[#12141f] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Analyses</h3>
              <span className="text-[11px] font-mono text-gray-500">
                {RECENT_ANALYSES.length} total
              </span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {RECENT_ANALYSES.map((a) => (
                <div
                  key={a.file}
                  className="acm-row flex items-center justify-between py-3 first:pt-0 last:pb-0 -mx-2 px-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="acm-row-icon w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-purple-500/25 to-fuchsia-500/10 border border-white/10 flex items-center justify-center text-[10px] font-mono font-semibold text-purple-300 transition-transform duration-200">
                      {a.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {a.file}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {a.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <span className="text-xs font-mono text-gray-500">
                      {a.time}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="acm-row-arrow text-gray-600 -translate-x-1 opacity-0 transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tilt3DCard>

        {/* ======================================================
            Top Programming Languages

            Backend:
            GET /dashboard

            topLanguages[]
        ====================================================== */}

        <Tilt3DCard
          accent="from-blue-500/70 to-transparent"
          className="acm-fade-up rounded-xl"
          style={{ animationDelay: "300ms" }}
          maxTilt={3}
        >
          <div className="bg-[#12141f] border border-white/5 rounded-xl p-5">
            <h3 className="font-semibold mb-4">Top Languages</h3>

            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={LANGS}
                      dataKey="value"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {LANGS.map((l) => (
                        <Cell key={l.name} fill={l.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center label overlay — top language at a glance */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold font-mono leading-none">
                    {topLang?.value}%
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1 max-w-[64px] text-center truncate">
                    {topLang?.name}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 min-w-0">
                {LANGS.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center gap-2 text-xs text-gray-300"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: l.color }}
                    />
                    <span className="w-16 truncate">{l.name}</span>
                    <span className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <span
                        className="acm-lang-bar block h-full rounded-full"
                        style={{ "--acm-w": `${l.value}%`, background: l.color }}
                      />
                    </span>
                    <span className="text-gray-500 font-mono w-8 text-right shrink-0">
                      {l.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tilt3DCard>
      </div>

      {/* ======================================================
          Signature element — a commit-style activity streak,
          the one place this dashboard takes a visual risk: it
          reads like a terminal/VCS artifact rather than a chart.
      ====================================================== */}
      <Tilt3DCard
        accent="from-fuchsia-500/50 to-transparent"
        className="acm-fade-up rounded-xl"
        style={{ animationDelay: "360ms" }}
        maxTilt={2}
      >
        <div className="bg-[#12141f] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-semibold flex items-center gap-2">
              Analysis Streak
              <span className="text-[11px] font-mono text-gray-500 font-normal">
                last 18 weeks
              </span>
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span>Less</span>
              {ACTIVITY_SHADES.map((shade, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-[3px] ${shade}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="flex gap-[3px] overflow-x-auto pb-1">
            {ACTIVITY.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => (
                  <span
                    key={di}
                    title={`${level} analyses`}
                    className={`acm-cell w-2.5 h-2.5 rounded-[3px] ${ACTIVITY_SHADES[level]}`}
                    style={{ animationDelay: `${(wi * 7 + di) * 4}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Tilt3DCard>

      <style>{`
        .acm-fade-up {
          animation: acmFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes acmFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .acm-blob {
          animation: acmDrift 22s ease-in-out infinite;
        }
        @keyframes acmDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -14px) scale(1.06); }
        }

        .acm-wave {
          display: inline-block;
          animation: acmWave 2.2s ease-in-out 1;
        }
        @keyframes acmWave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          45% { transform: rotate(14deg); }
          60% { transform: rotate(-4deg); }
          75% { transform: rotate(10deg); }
        }

        .acm-cta-btn {
          box-shadow: 0 8px 20px -6px rgba(147, 51, 234, 0.55);
          transition: box-shadow 0.2s ease, transform 0.15s ease, background-color 0.15s ease;
        }
        .acm-cta-btn:hover {
          box-shadow: 0 10px 24px -6px rgba(147, 51, 234, 0.7);
          transform: translateY(-1px);
        }
        .acm-cta-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .acm-stat-card {
          transition: box-shadow 0.25s ease;
        }
        .acm-stat-card:hover {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 14px 32px -10px var(--acm-glow);
        }

        .acm-row {
          transition: background-color 0.15s ease;
        }
        .acm-row:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        .acm-row:hover .acm-row-icon {
          transform: scale(1.08);
        }
        .acm-row:hover .acm-row-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .acm-lang-bar {
          width: 0%;
          animation: acmLangGrow 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        @keyframes acmLangGrow {
          to { width: var(--acm-w); }
        }

        .acm-cell {
          opacity: 0;
          animation: acmCellIn 0.4s ease both;
          transition: transform 0.12s ease;
        }
        .acm-cell:hover {
          transform: scale(1.35);
        }
        @keyframes acmCellIn {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .acm-fade-up, .acm-blob, .acm-wave, .acm-lang-bar, .acm-cell {
            animation: none !important;
          }
          .acm-cta-btn, .acm-row, .acm-row-icon, .acm-stat-card { transition: none; }
        }
      `}</style>
    </div>
  );
}
