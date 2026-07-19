import React from "react";
import { Target, Users, Sparkles, ArrowRight } from "lucide-react";
import MarketingNav from "../../components/layout/Header";
import Tilt3DCard from "../../components/common/Tilt3DCard";

const VALUES = [
  {
    icon: Target,
    title: "Our mission",
    desc: "Make world-class code review feedback available to every developer, not just teams with a senior engineer on hand.",
  },
  {
    icon: Sparkles,
    title: "How we build",
    desc: "We treat AI suggestions as a second opinion, not a verdict. Every insight explains its reasoning so you can judge it yourself.",
  },
  {
    icon: Users,
    title: "Who it's for",
    desc: "Students learning to code, solo developers without a team to review PRs, and engineering teams who want a faster first pass.",
  },
];

const TEAM = [
  {
    name: "Prem Baliwala",
    role: "Frontend Developer",
  },
  {
    name: "Vikas Chenna",
    role: "Frontend Developer",
  },
  {
    name: "Raj Maheta ",
    role: "Backend Developer",
  },
  {
    name: "Aryan Paghadal",
    role: "Backend Developer",
  },
  {
    name: "Meet Chandel",
    role: "Backend Developer",
  },
];

const VALUE_ACCENTS = ["from-purple-500 to-fuchsia-500", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500"];

// TEAM entries no longer carry a precomputed `initials` field, so derive
// it from `name` — first letter of the first word + first letter of the
// last word (falls back gracefully for single-word names).
function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function AboutPage({ go }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a12] text-white overflow-hidden">
      {/* ======================================================
          Ambient depth background — soft blurred color blobs
          fixed behind the whole page for a premium, layered feel.
      ====================================================== */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-32 w-[380px] h-[380px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <MarketingNav go={go} active="about" />

      <header className="acm-fade-up max-w-3xl mx-auto text-center px-8 pt-16 pb-14">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-5">
          <Sparkles size={11} />
          About DevMentor AI
        </span>

        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Built by developers,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            for developers
          </span>
        </h1>
        <p className="text-gray-400 leading-relaxed">
          DevMentor AI started as a weekend project to explain a confusing bug.
          It's now used by thousands of developers to understand, fix, and
          improve their code every day.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-8 pb-16">
        <p className="acm-fade-up text-center text-xs font-semibold tracking-wide text-gray-500 uppercase mb-6" style={{ animationDelay: "80ms" }}>
          What we believe
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <Tilt3DCard
              key={v.title}
              accent={VALUE_ACCENTS[i]}
              maxTilt={6}
              className="acm-fade-up rounded-xl"
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <div className="acm-value-card group bg-[#12141f] border border-white/5 rounded-xl p-6 h-full">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 group-hover:bg-purple-500/15">
                  <v.icon size={18} className="text-purple-400" />
                </div>
                <div className="text-sm font-semibold mb-2">{v.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{v.desc}</div>
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-20">
        <h2 className="acm-fade-up text-xl font-semibold mb-8 text-center" style={{ animationDelay: "160ms" }}>
          The team
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TEAM.map((t, i) => (
            <Tilt3DCard
              key={t.name}
              accent="from-purple-500/60 to-transparent"
              maxTilt={5}
              className="acm-fade-up rounded-xl"
              style={{ animationDelay: `${220 + i * 70}ms` }}
            >
              <div className="acm-team-card group bg-[#12141f] border border-white/5 rounded-xl p-5 text-center h-full">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-sm font-semibold mx-auto mb-3 transition-transform duration-200 group-hover:scale-105 shadow-[0_6px_18px_-6px_rgba(147,51,234,0.6)]">
                  {getInitials(t.name)}
                </div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </Tilt3DCard>
          ))}
        </div>

       
      </section>

      <style>{`
        .acm-fade-up {
          animation: acmFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes acmFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .acm-cta-btn {
          box-shadow: 0 8px 22px -6px rgba(147, 51, 234, 0.55);
          transition: box-shadow 0.2s ease, transform 0.15s ease, background-color 0.15s ease;
        }
        .acm-cta-btn:hover {
          box-shadow: 0 10px 26px -6px rgba(147, 51, 234, 0.7);
          transform: translateY(-1px);
        }
        .acm-cta-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .acm-value-card, .acm-team-card {
          transition: border-color 0.2s ease;
        }
        .acm-value-card:hover, .acm-team-card:hover {
          border-color: rgba(168, 85, 247, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .acm-fade-up { animation: none; }
          .acm-cta-btn, .acm-value-card, .acm-team-card { transition: none; }
        }
      `}</style>
    </div>
  );
}
