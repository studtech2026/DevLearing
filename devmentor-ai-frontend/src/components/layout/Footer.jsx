import { Code2, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const socials = [
  {
    label: "GitHub",
    href: "#",
    path: "M12 0C5.37 0 0 5.5 0 12.3c0 5.43 3.44 10.03 8.2 11.66.6.11.82-.27.82-.6 0-.29-.01-1.06-.02-2.08-3.34.75-4.04-1.64-4.04-1.64-.55-1.44-1.34-1.82-1.34-1.82-1.09-.77.08-.75.08-.75 1.21.09 1.84 1.28 1.84 1.28 1.07 1.87 2.81 1.33 3.5 1.02.11-.79.42-1.33.76-1.64-2.67-.31-5.47-1.38-5.47-6.15 0-1.36.47-2.47 1.24-3.34-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.28a11.2 11.2 0 0 1 6.01 0c2.29-1.61 3.3-1.28 3.3-1.28.66 1.71.24 2.97.12 3.28.77.87 1.24 1.98 1.24 3.34 0 4.78-2.81 5.83-5.48 6.14.43.38.81 1.13.81 2.29 0 1.65-.02 2.98-.02 3.39 0 .33.22.72.83.6C20.57 22.32 24 17.72 24 12.3 24 5.5 18.63 0 12 0z",
  },
  {
    label: "X (Twitter)",
    href: "#",
    path: "M18.9 1.6h3.7l-8.1 9.2 9.5 12.6h-7.4l-5.8-7.6-6.6 7.6H.6l8.6-9.9L0 1.6h7.6l5.3 7 6-7zm-1.3 19.5h2L6.5 3.7H4.3l13.3 17.4z",
  },
  {
    label: "Discord",
    href: "#",
    path: "M20.3 4.4A19.8 19.8 0 0 0 15.4 3c-.2.4-.5 1-.7 1.4a18.3 18.3 0 0 0-5.4 0A13 13 0 0 0 8.6 3a19.8 19.8 0 0 0-4.9 1.5C.9 8.9.2 13.3.5 17.6a19.9 19.9 0 0 0 6 3c.5-.7.9-1.4 1.3-2.1-.7-.3-1.4-.6-2-1.1l.5-.4c3.9 1.8 8.1 1.8 12 0l.5.4c-.6.4-1.3.8-2 1.1.4.7.8 1.4 1.3 2.1a19.9 19.9 0 0 0 6-3c.4-5-.9-9.3-3.8-13.2zM8.5 15c-1.2 0-2.1-1.1-2.1-2.4S7.3 10.2 8.5 10.2s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4zm7 0c-1.2 0-2.1-1.1-2.1-2.4s1-2.4 2.1-2.4c1.2 0 2.2 1.1 2.1 2.4 0 1.3-.9 2.4-2.1 2.4z",
  },
];

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },

  {
    title: "Company",
    links: [{ label: "About", href: "/about" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-neutral-950 text-neutral-50 font-sans">
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s steps(1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cursor-blink { animation: none; }
        }
      `}</style>

      {/* top accent line, echoes the gradient used on the logo mark / CTA button */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-violet-500 to-purple-500 opacity-60" />

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-12 md:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-neutral-800 pb-14 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                <Code2
                  className="h-[18px] w-[18px] text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-base font-bold tracking-tight">
                DevMentor AI
              </span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-neutral-400">
              Paste your code, get a senior engineer&apos;s read on it — bugs,
              complexity, and a plain-language walkthrough in seconds.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 transition hover:-translate-y-0.5 hover:border-violet-500 hover:text-violet-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[15px] w-[15px]"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-neutral-400 transition hover:text-white"
                    >
                      {link.label}

                      {link.badge && (
                        <span className="ml-2 rounded border border-violet-500 px-1.5 py-0.5 text-xs text-violet-400">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start gap-6 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 font-mono text-xs leading-relaxed">
            <span className="text-neutral-600">
              devmentor@main <span className="text-violet-400">~</span> $ status
              --check
            </span>
            <span className="flex items-center gap-2 text-neutral-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              all systems operational · v2.4.1
              <span className="cursor-blink inline-block h-3 w-1.5 bg-violet-400" />
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-neutral-600">
            <span>© {year} DevMentor AI. All rights reserved.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 px-3 py-2 text-xs text-neutral-400 transition hover:border-violet-500 hover:text-white"
            >
              <ArrowUp className="h-3 w-3" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
