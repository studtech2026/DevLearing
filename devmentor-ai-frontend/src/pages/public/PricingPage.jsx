import React from "react";
import { Check } from "lucide-react";
import MarketingNav from "../../components/layout/Header";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For trying DevMentor out on personal projects.",
    features: [
      "20 analyses / month",
      "Bug detection & explanation",
      "1 saved repository",
      "Community support",
    ],
    cta: "Get Started for Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    desc: "For developers who analyze code every day.",
    features: [
      "Unlimited analyses",
      "Optimization & complexity insights",
      "Unlimited saved repositories",
      "Unit test generation",
      "PDF report exports",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ user / month",
    desc: "For teams reviewing code together.",
    features: [
      "Everything in Pro",
      "Shared team workspace",
      "Code review annotations",
      "Admin & usage dashboard",
      "SSO & audit logs",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function PricingPage({ go }) {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <MarketingNav go={go} active="pricing" />

      <header className="max-w-4xl mx-auto text-center px-8 pt-16 pb-12">
        <h1 className="text-4xl font-bold mb-4">
          Simple pricing, <span className="text-purple-500">no surprises</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Start free. Upgrade when you need more.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 flex flex-col ${
                p.featured
                  ? "bg-[#14162a] border-2 border-purple-500"
                  : "bg-[#12141f] border border-white/5"
              }`}
            >
              {p.featured && (
                <span className="self-start text-[11px] font-medium bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-md mb-4">
                  Most popular
                </span>
              )}
              <div className="text-lg font-semibold mb-1">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{p.price}</span>
                <span className="text-sm text-gray-500">{p.period}</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">{p.desc}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <Check
                      size={15}
                      className="text-purple-400 mt-0.5 shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => go("signup")}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition ${
                  p.featured
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "border border-white/15 hover:bg-white/5"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
