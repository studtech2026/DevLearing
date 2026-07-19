import React, { useEffect, useRef, useState } from "react";
import { Mic, Loader2 } from "lucide-react";

// ------------------------------------------------------------------
// Fully client-side "mentor feedback" generator. No backend call —
// it looks at the pasted code (function name, recursion, loops) and
// assembles a categorized set of interview questions + model answers.
// ------------------------------------------------------------------

function detectFunctionName(code) {
  const py = code.match(/def\s+([A-Za-z_]\w*)\s*\(/);
  if (py) return py[1];
  const js = code.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (js) return js[1];
  const arrow = code.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*\(?[^)=]*\)?\s*=>/);
  if (arrow) return arrow[1];
  return "thisFunction";
}

function isRecursiveFn(code, fnName) {
  if (fnName === "thisFunction") return false;
  const firstCallIdx = code.indexOf(fnName);
  if (firstCallIdx === -1) return false;
  const rest = code.slice(firstCallIdx + fnName.length);
  return new RegExp(`\\b${fnName}\\s*\\(`).test(rest);
}

function hasLoop(code) {
  return /\b(for|while)\b/.test(code);
}

function generateInterviewFeedback(code) {
  const fnName = detectFunctionName(code);
  const recursive = isRecursiveFn(code, fnName);
  const looped = hasLoop(code);

  const topic = recursive
    ? "recursion, base cases, and handling edge inputs"
    : looped
    ? "iteration, complexity, and edge-case handling"
    : "control flow and edge-case handling";

  const intro = [
    "Hello there! I'm DevMentor AI, your guide in the fascinating world of software engineering. Let's break down this code and craft some interview questions that really probe its depths.",
    `This snippet is a great starting point for discussing ${topic}.`,
    "Here are 6 interview questions, categorized by difficulty, along with model answers.",
  ].join("\n\n");

  const easy = recursive
    ? [
        [
          `What does the \`${fnName}\` function aim to compute?`,
          "Trace the return value for a couple of concrete inputs to explain, in plain language, what the function is building toward.",
        ],
        [
          "What is the base case here, and why does it stop the recursion?",
          `The base case is the condition that returns a value directly instead of calling \`${fnName}\` again — without it, the recursion would never terminate.`,
        ],
      ]
    : [
        [`Walk through what \`${fnName}\` does, line by line.`, "Describe the inputs, the main loop or branch, and what gets returned at the end."],
        [
          `What input types does \`${fnName}\` expect, and what happens if they're missing or the wrong type?`,
          "Without a guard clause, passing `null`/`undefined` or the wrong type will likely throw at runtime rather than fail gracefully.",
        ],
      ];

  const medium = [
    [
      `What is the time and space complexity of \`${fnName}\` as written?`,
      "Look at how many times the input is scanned (time) and how much extra memory is allocated relative to input size (space).",
    ],
    recursive
      ? [
          "How deep can the recursion go before you risk a stack overflow?",
          "Recursion depth is roughly proportional to the input size here, so a very large input could exceed the call stack limit.",
        ]
      : looped
      ? [
          "Are there any nested loops here, and how would you eliminate them?",
          "Nested loops usually mean quadratic time — a hash map or set can often flatten that back down to linear time.",
        ]
      : [
          "What would you add to make this function more robust?",
          "Input validation, clearer error messages, and explicit handling of edge cases would all help.",
        ],
  ];

  const hard = [
    recursive
      ? [
          `How would you rewrite \`${fnName}\` iteratively, and what tradeoffs would that introduce?`,
          "An iterative version (often using an explicit stack) avoids the recursion-depth limit at the cost of some readability.",
        ]
      : [
          "How would you optimize this for very large inputs?",
          "Consider algorithmic changes — better data structures, fewer passes over the data — before reaching for micro-optimizations.",
        ],
    [
      "What edge cases should this be tested against, and why?",
      "Empty input, a single element, duplicate values, and (if numeric) negative numbers or zero are all worth covering explicitly.",
    ],
  ];

  const section = (title, qs, startIdx) =>
    `## ${title}\n\n` + qs.map(([q, a], i) => `#### Question ${startIdx + i}: ${q}\n\n${a}`).join("\n\n");

  return [intro, "...", section("Easy Questions", easy, 1), section("Medium Questions", medium, 3), section("Hard Questions", hard, 5)].join(
    "\n\n"
  );
}

// ------------------------------------------------------------------
// Tiny markdown-lite renderer for the generated feedback: supports
// "## Section", "#### Question N: ...", `inline code`, **bold**, and
// a "..." divider. No external markdown library required.
// ------------------------------------------------------------------

function renderInline(text, keyPrefix) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-${key++}`} className="text-violet-300 font-semibold">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(
        <code
          className="font-mono text-[12.5px] bg-green-400/10 text-green-300 rounded px-1.5 py-px"
          key={`${keyPrefix}-${key++}`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function FeedbackDoc({ raw }) {
  const blocks = raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-3.5">
      {blocks.map((block, i) => {
        if (block === "...") {
          return (
            <div className="flex justify-center gap-1.5 py-1.5" key={i}>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
            </div>
          );
        }
        if (block.startsWith("#### ")) {
          return (
            <h4 className="text-[14.5px] font-semibold leading-relaxed text-slate-200" key={i}>
              {renderInline(block.slice(5), `h4-${i}`)}
            </h4>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h3 className="mt-2.5 text-[17px] font-bold text-white" key={i}>
              {block.slice(3)}
            </h3>
          );
        }
        return (
          <p className="text-sm leading-relaxed text-slate-300" key={i}>
            {renderInline(block, `p-${i}`)}
          </p>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------
// AIInterview
//
// Drop this into your app and render it next to your editor. It has
// NO Analyze Code button of its own — bump the `runId` prop from your
// existing header button and this panel will run and scroll into view
// on its own:
//
//   const [runId, setRunId] = useState(0);
//   <button onClick={() => setRunId((n) => n + 1)}>Analyze Code</button>
//   <AIInterview code={code} language={language} runId={runId} />
// ------------------------------------------------------------------

export default function AIInterview({ code, language = "python", runId }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [feedback, setFeedback] = useState("");
  const panelRef = useRef(null);

  // Run analysis whenever runId is truthy — either because the header's
  // Analyze Code button just bumped it, OR because this panel mounted
  // late (e.g. its tab was inactive during the click) and is catching
  // up to a run that already happened. `!runId` alone is enough to keep
  // it idle on a fresh mount where runId starts at 0.
  useEffect(() => {
    if (!runId) return;

    if (!code || !code.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    const timer = setTimeout(() => {
      try {
        const text = generateInterviewFeedback(code, language);
        setFeedback(text);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  // Scroll effect: bring the panel back to the top, smoothly, every
  // time a new run starts and every time results land — so a long
  // previous write-up never hides the new one below the fold.
  useEffect(() => {
    if (status === "loading" || status === "done" || status === "error") {
      panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [status]);

  return (
    <div
      ref={panelRef}
      className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scroll-smooth
                 [&::-webkit-scrollbar]:w-1.5
                 [&::-webkit-scrollbar-track]:bg-transparent
                 [&::-webkit-scrollbar-thumb]:bg-white/10
                 [&::-webkit-scrollbar-thumb]:rounded-full
                 [&::-webkit-scrollbar-thumb:hover]:bg-white/20"
    >
      {status === "idle" && (
        <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center gap-1.5 text-slate-500">
          <Mic size={22} className="mx-auto text-slate-600" />
          <h4 className="mt-2.5 text-sm font-semibold text-slate-400">No questions yet</h4>
          <p className="text-[12.5px] max-w-[260px] leading-relaxed">
            Paste code on the left and click Analyze Code — the interview writeup shows up here.
          </p>
        </div>
      )}
      {status === "loading" && (
        <div className="flex items-center justify-center gap-2.5 text-slate-400 text-[13.5px] py-10">
          <Loader2 size={20} className="animate-spin" />
          Reading your code and drafting questions…
        </div>
      )}
      {status === "error" && (
        <div className="text-red-400 text-[13px] bg-red-400/10 border border-red-400/25 rounded-[10px] px-4 py-3.5">
          Couldn't generate feedback that time — try Analyze Code again.
        </div>
      )}
      {status === "done" && (
        <>
          <div className="flex items-center gap-3 mb-[18px]">
            <div className="font-mono text-xs font-bold tracking-wide text-cyan-400">↳ MENTOR_FEEDBACK</div>
            <div className="text-xs text-slate-500">
              Action: <span className="text-violet-400 font-semibold">interview</span>
            </div>
          </div>
          <FeedbackDoc raw={feedback} />
        </>
      )}
    </div>
  );
}
