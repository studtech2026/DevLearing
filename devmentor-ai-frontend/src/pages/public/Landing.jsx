import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Code2, Bug, Zap, BarChart3, TestTube2, RefreshCw } from "lucide-react";
import MarketingNav from "../../components/layout/Header.jsx";

const FEATURES = [
  {
    icon: Code2,
    title: "AI Code Explanation",
    desc: "Understand your code line-by-line",
  },
  { icon: Bug, title: "Bug Detection", desc: "Find syntax & logical errors" },
  {
    icon: Zap,
    title: "Optimization",
    desc: "Improve code quality & performance",
  },
  {
    icon: BarChart3,
    title: "Complexity Analysis",
    desc: "Time & space complexity insights",
  },
  {
    icon: TestTube2,
    title: "Unit Tests",
    desc: "Generate unit tests automatically",
  },
  {
    icon: RefreshCw,
    title: "Code Conversion",
    desc: "Convert between multiple languages",
  },
];

// Ordered pieces of the demo snippet, each with its syntax-highlight class.
// Two are flagged `bug: true` — these are the lines the AI panel calls out
// once typing finishes (`seen` is created as a tuple `()` instead of a dict
// `{}`, which breaks the two lines that treat it like one).
const CODE_TOKENS = [
  { text: "def", cls: "text-purple-400" },
  { text: " two_sum", cls: "text-blue-300" },
  { text: "(nums, target):\n", cls: "text-gray-300" },
  { text: "    seen = ()\n", cls: "text-gray-300", bug: true },
  { text: "    for", cls: "text-purple-400" },
  { text: " i, num in enumerate(nums):\n", cls: "text-gray-300" },
  { text: "        diff = target - num\n", cls: "text-gray-300" },
  { text: "        if", cls: "text-purple-400" },
  { text: " diff in seen:\n", cls: "text-gray-300" },
  { text: "            return", cls: "text-purple-400" },
  { text: " [seen[diff], i]\n", cls: "text-gray-300" },
  { text: "        seen[num] = i", cls: "text-gray-300", bug: true },
];

const FULL_TEXT = CODE_TOKENS.map((t) => t.text).join("");
const TOTAL_CHARS = FULL_TEXT.length;

const TYPE_SPEED = 18; // ms per character
const LINE_PAUSE = 90; // extra ms after a newline, so typing reads naturally
const SCAN_DURATION = 1300; // ms the "analyzing" scan line runs
const HOLD_DURATION = 2600; // ms the results panel stays visible
const RESET_PAUSE = 700; // ms blank pause before retyping

// Max tilt rotation in degrees for the 3D card effect.
const TILT_MAX = 9;

// The code block used to grow line-by-line as it typed, which resized the
// card and shifted the whole page underneath it. Locking the block to the
// height of the full snippet up front stops that reflow completely.
const CODE_LINE_COUNT = FULL_TEXT.split("\n").length;
const CODE_LINE_HEIGHT_PX = 14 * 1.625; // text-sm (14px) * leading-relaxed (1.625)
const CODE_BLOCK_HEIGHT = Math.ceil(CODE_LINE_COUNT * CODE_LINE_HEIGHT_PX) + 4; // +buffer

// ---------------------------------------------------------------------------
// Three.js hero scene
// ---------------------------------------------------------------------------
// A quiet "knowledge graph" core sitting behind the hero copy and the code
// card: a wireframe icosahedron shell with a faint particle field orbiting
// inside it, plus a handful of connecting edges so it reads as a network
// rather than a generic globe. It's the one 3D signature element on the
// page, so everything else (card tilt, typing animation) stays as-is and
// this stays slow, translucent, and behind the content instead of
// competing with it.
function ThreeHeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Outer shell: a low-poly icosahedron rendered as clean edge lines
    // rather than a filled wireframe, so it stays crisp and doesn't muddy
    // into a ball of triangles.
    const shellGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    const shellMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.28,
    });
    const shell = new THREE.LineSegments(shellEdges, shellMat);
    group.add(shell);

    // Inner core: a smaller, brighter icosahedron so the shape has depth.
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 0);
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0xc4b5fd,
      transparent: true,
      opacity: 0.4,
    });
    const core = new THREE.LineSegments(coreEdges, coreMat);
    group.add(core);

    // Particle field: points scattered across a sphere shell between the
    // core and the outer shell, standing in for "data nodes".
    const NODE_COUNT = 140;
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const radius = 1.4 + Math.random() * 1.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;
    }
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nodePositions, 3),
    );
    const nodesMat = new THREE.PointsMaterial({
      color: 0xe9d5ff,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const nodes = new THREE.Points(nodesGeo, nodesMat);
    group.add(nodes);

    // A sparse set of connecting lines between nearby nodes, so the field
    // reads as a graph instead of loose dust.
    const linePositions = [];
    const MAX_LINKS = 60;
    const MAX_LINK_DIST = 1.1;
    for (
      let i = 0;
      i < NODE_COUNT && linePositions.length / 6 < MAX_LINKS;
      i++
    ) {
      const ax = nodePositions[i * 3];
      const ay = nodePositions[i * 3 + 1];
      const az = nodePositions[i * 3 + 2];
      for (
        let j = i + 1;
        j < NODE_COUNT && linePositions.length / 6 < MAX_LINKS;
        j++
      ) {
        const bx = nodePositions[j * 3];
        const by = nodePositions[j * 3 + 1];
        const bz = nodePositions[j * 3 + 2];
        const dist = Math.hypot(ax - bx, ay - by, az - bz);
        if (dist < MAX_LINK_DIST) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }
    const linksGeo = new THREE.BufferGeometry();
    linksGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePositions), 3),
    );
    const linksMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.18,
    });
    const links = new THREE.LineSegments(linksGeo, linksMat);
    group.add(links);

    group.rotation.set(0.3, -0.4, 0);

    // Gentle pointer parallax, mirroring the tilt already used on the code
    // card so the two motion systems feel like one language.
    const pointer = { x: 0, y: 0 };
    function onPointerMove(e) {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    window.addEventListener("mousemove", onPointerMove);

    let frameId;
    const clock = new THREE.Clock();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        group.rotation.y = -0.4 + t * 0.08 + pointer.x * 0.25;
        group.rotation.x = 0.3 + pointer.y * 0.15;
        core.rotation.y -= 0.0025;
        core.rotation.x += 0.0012;
        nodes.rotation.y += 0.0009;
      }

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      width = mount.clientWidth;
      height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      mount.removeChild(renderer.domElement);
      shellGeo.dispose();
      shellEdges.dispose();
      shellMat.dispose();
      coreGeo.dispose();
      coreEdges.dispose();
      coreMat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      linksGeo.dispose();
      linksMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="acm-three-scene" aria-hidden="true" />;
}

function AnimatedCodeCard() {
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | scanning | analysis | resetting

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    reducedMotionRef.current = reducedMotion;

    if (reducedMotion) {
      setCharCount(TOTAL_CHARS);
      setPhase("analysis");
      return;
    }

    let live = true;
    const timers = [];
    const wait = (fn, ms) => timers.push(setTimeout(() => live && fn(), ms));

    function typeFrom(i) {
      if (!live) return;
      if (i > TOTAL_CHARS) {
        setPhase("scanning");
        wait(() => setPhase("analysis"), SCAN_DURATION);
        wait(() => {
          setPhase("resetting");
          setCharCount(0);
          wait(() => {
            setPhase("typing");
            typeFrom(1);
          }, RESET_PAUSE);
        }, SCAN_DURATION + HOLD_DURATION);
        return;
      }
      setCharCount(i);
      const justTyped = FULL_TEXT[i - 1];
      wait(
        () => typeFrom(i + 1),
        justTyped === "\n" ? TYPE_SPEED + LINE_PAUSE : TYPE_SPEED,
      );
    }

    wait(() => typeFrom(1), TYPE_SPEED);

    return () => {
      live = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  // 3D pointer-tracking tilt. Rotation is driven by cursor position relative
  // to the card's center, and mirrored into custom properties so the CSS
  // glow/shadow can react in the same direction as the tilt.
  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card || reducedMotionRef.current) return;

    function applyTilt(clientX, clientY) {
      const rect = wrap.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width; // 0..1
      const py = (clientY - rect.top) / rect.height; // 0..1
      const rotY = (px - 0.5) * TILT_MAX * 2;
      const rotX = (0.5 - py) * TILT_MAX * 2;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        card.style.setProperty("--acm-rx", `${rotX.toFixed(2)}deg`);
        card.style.setProperty("--acm-ry", `${rotY.toFixed(2)}deg`);
        card.style.setProperty("--acm-px", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--acm-py", `${(py * 100).toFixed(1)}%`);
        card.style.setProperty(
          "--acm-shadow-x",
          `${(-rotY * 1.6).toFixed(1)}px`,
        );
        card.style.setProperty(
          "--acm-shadow-y",
          `${(rotX * 1.6 + 22).toFixed(1)}px`,
        );
      });
    }

    function reset() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.style.setProperty("--acm-rx", `0deg`);
      card.style.setProperty("--acm-ry", `0deg`);
      card.style.setProperty("--acm-px", `50%`);
      card.style.setProperty("--acm-py", `50%`);
      card.style.setProperty("--acm-shadow-x", `0px`);
      card.style.setProperty("--acm-shadow-y", `22px`);
    }

    const onMove = (e) => applyTilt(e.clientX, e.clientY);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", reset);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", reset);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Slice the token list down to `charCount` characters, keeping each
  // token's highlight class (and bug flag) intact.
  let remaining = charCount;
  const visibleTokens = [];
  for (const token of CODE_TOKENS) {
    if (remaining <= 0) break;
    const slice = token.text.slice(0, remaining);
    if (slice) visibleTokens.push({ ...token, text: slice });
    remaining -= token.text.length;
  }

  const showCursor = phase === "typing";
  const showScan = phase === "scanning";
  const showResults = phase === "analysis";
  const bugsActive = showScan || showResults;

  return (
    <div
      ref={wrapRef}
      className="acm-perspective-wrap lp-fade-in-up"
      style={{ animationDelay: "120ms" }}
    >
      <div className="acm-glow" aria-hidden="true" />
      <div
        ref={cardRef}
        className="acm-card bg-[#0d0f18] border border-white/10 rounded-2xl p-4 relative"
      >
        <div className="acm-sheen" aria-hidden="true" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-300">
            Python
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                showScan
                  ? "bg-amber-400 acm-dot-pulse"
                  : showResults
                    ? "bg-red-400"
                    : "bg-purple-500"
              }`}
            />
            {showScan
              ? "Analyzing..."
              : showResults
                ? "2 issues found"
                : "AI Mentor"}
          </span>
        </div>

        <div
          className="acm-code-block relative overflow-hidden rounded-lg"
          style={{ height: `${CODE_BLOCK_HEIGHT}px` }}
        >
          <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
            <code>
              {visibleTokens.map((t, idx) => (
                <span
                  key={idx}
                  className={`${t.cls} ${t.bug && bugsActive ? "acm-bug-line" : ""}`}
                >
                  {t.text}
                </span>
              ))}
              {showCursor && <span className="acm-cursor">▏</span>}
            </code>
          </pre>
          {showScan && <div className="acm-scanline" />}
        </div>

        <div
          className={`acm-panel absolute -bottom-6 -right-4 bg-[#14162a] border border-purple-500/30 rounded-xl p-4 w-52 shadow-xl shadow-black/40 ${
            showResults ? "acm-panel-visible" : ""
          }`}
          style={{ transform: "translateZ(48px)" }}
        >
          <div className="text-sm font-medium mb-2">AI Analysis</div>
          <div className="text-xs text-red-400 mb-2 acm-fade-1">
            🐞 2 Bugs Found
          </div>
          <div className="text-xs text-gray-400 mb-1 acm-fade-2">
            ⏱ Time: O(n)
          </div>
          <div className="text-xs text-gray-400 acm-fade-3">📦 Space: O(n)</div>
        </div>
      </div>
    </div>
  );
}

export default function Landing({ go }) {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white acm-page">
      <MarketingNav go={go} active="landing" />

      <header className="grid md:grid-cols-2 gap-10 px-8 py-16 max-w-7xl mx-auto items-center relative">
        <div className="acm-ambient" aria-hidden="true" />
        <ThreeHeroScene />
        <div className="lp-fade-in-up relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-5">
            Your AI Mentor
            <br />
            for <span className="text-purple-500">Better Code</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Paste your code, get AI-powered explanations, detect bugs, optimize
            performance, and level up your programming skills.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => go("signup")}
              className="acm-btn-primary px-5 py-3 bg-purple-600 rounded-lg font-medium transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started for Free
            </button>
            <button className="px-5 py-3 border border-white/15 rounded-lg hover:bg-white/5 transition hover:scale-[1.03] active:scale-[0.98] backdrop-blur-sm"
            onClick={()=>go("how-it-works")}>
              See How It Works
            </button>
          </div>
        </div>

        <AnimatedCodeCard />
      </header>

      <section className="max-w-7xl mx-auto px-8 pb-20 pt-10">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="acm-feature-card bg-[#12141f] border border-white/5 rounded-xl p-4 lp-fade-in-up"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <div className="acm-feature-icon w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <f.icon size={16} className="text-purple-400" />
              </div>
              <div className="text-sm font-medium mb-1">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .lp-fade-in-up {
          opacity: 0;
          animation: lpFadeUp 0.55s ease forwards;
        }
        @keyframes lpFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ---------- Page-level ambient depth ---------- */
        .acm-page {
          background-image:
            radial-gradient(ellipse 800px 500px at 15% -10%, rgba(168, 85, 247, 0.10), transparent 60%),
            radial-gradient(ellipse 600px 400px at 100% 20%, rgba(99, 102, 241, 0.08), transparent 55%);
        }
        .acm-ambient {
          position: absolute;
          inset: -10% -5%;
          background: radial-gradient(circle at 70% 40%, rgba(168, 85, 247, 0.10), transparent 55%);
          pointer-events: none;
          z-index: 0;
        }

        /* Three.js hero scene: sits behind the copy and the code card,
           spanning the full header so the network core reads as depth
           rather than a competing focal point. */
        .acm-three-scene {
          position: absolute;
          inset: -8% 0%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.9;
        }
        .acm-three-scene canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .acm-btn-primary {
          box-shadow: 0 8px 24px -6px rgba(147, 51, 234, 0.55), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .acm-btn-primary:hover { box-shadow: 0 10px 30px -6px rgba(147, 51, 234, 0.7), inset 0 1px 0 rgba(255,255,255,0.2); }

        /* ---------- 3D tilt card ---------- */
        .acm-perspective-wrap {
          position: relative;
          perspective: 1200px;
        }
        .acm-glow {
          position: absolute;
          inset: -6%;
          background: radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.22), transparent 65%);
          filter: blur(18px);
          z-index: 0;
          pointer-events: none;
        }
        .acm-card {
          --acm-rx: 0deg;
          --acm-ry: 0deg;
          --acm-px: 50%;
          --acm-py: 50%;
          --acm-shadow-x: 0px;
          --acm-shadow-y: 22px;
          position: relative;
          z-index: 1;
          transform-style: preserve-3d;
          transform: perspective(1200px) rotateX(var(--acm-rx)) rotateY(var(--acm-ry)) translateZ(0);
          transition: transform 0.12s ease-out, box-shadow 0.12s ease-out;
          box-shadow:
            var(--acm-shadow-x) var(--acm-shadow-y) 45px -12px rgba(0, 0, 0, 0.55),
            0 1px 0 rgba(255, 255, 255, 0.06) inset,
            0 0 0 1px rgba(168, 85, 247, 0.08);
          will-change: transform;
        }
        .acm-sheen {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--acm-px) var(--acm-py), rgba(255,255,255,0.10), transparent 45%);
          pointer-events: none;
          z-index: 2;
        }
        .acm-card > *:not(.acm-sheen) { position: relative; z-index: 1; }

        /* Fixed-height code block: height is set inline (matches the full
           snippet), this just makes sure it never snaps if anything ever
           does change it, instead of causing a hard jump. */
        .acm-code-block { transition: height 0.2s ease; }

        /* ---------- Feature cards: subtle lift ---------- */
        .acm-feature-card {
          transform: translateY(0) translateZ(0);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 1px 0 rgba(255,255,255,0.03) inset;
        }
        .acm-feature-card:hover {
          transform: translateY(-6px) scale(1.015);
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 20px 34px -16px rgba(88, 28, 135, 0.55), 0 1px 0 rgba(255,255,255,0.05) inset;
        }
        .acm-feature-icon { transition: transform 0.25s ease; }
        .acm-feature-card:hover .acm-feature-icon { transform: translateZ(8px) scale(1.08); }

        .acm-cursor {
          display: inline-block;
          margin-left: 1px;
          color: #a78bfa;
          animation: acmBlink 0.9s steps(1) infinite;
        }
        @keyframes acmBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .acm-dot-pulse { animation: acmDotPulse 1s ease-in-out infinite; }
        @keyframes acmDotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .acm-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 22px;
          top: 0;
          background: linear-gradient(
            to bottom,
            rgba(168, 85, 247, 0) 0%,
            rgba(168, 85, 247, 0.22) 50%,
            rgba(168, 85, 247, 0) 100%
          );
          animation: acmScan ${SCAN_DURATION}ms ease-in-out 1;
          pointer-events: none;
        }
        @keyframes acmScan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .acm-bug-line {
          text-decoration: underline wavy rgba(248, 113, 113, 0.8);
          text-underline-offset: 3px;
          border-radius: 2px;
          animation: acmBugPulse 1.6s ease-in-out infinite;
        }
        @keyframes acmBugPulse {
          0%, 100% { background-color: rgba(248, 113, 113, 0); }
          50% { background-color: rgba(248, 113, 113, 0.12); }
        }

        .acm-panel {
          opacity: 0;
          transform: translateY(6px) translateZ(48px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .acm-panel-visible { opacity: 1; transform: translateY(0) translateZ(48px); }

        .acm-fade-1, .acm-fade-2, .acm-fade-3 { opacity: 0; }
        .acm-panel-visible .acm-fade-1 { animation: acmFadeUp 0.4s ease forwards 0.05s; }
        .acm-panel-visible .acm-fade-2 { animation: acmFadeUp 0.4s ease forwards 0.2s; }
        .acm-panel-visible .acm-fade-3 { animation: acmFadeUp 0.4s ease forwards 0.35s; }
        @keyframes acmFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .lp-fade-in-up { opacity: 1; animation: none; }
          .acm-cursor, .acm-scanline, .acm-bug-line, .acm-dot-pulse { animation: none; }
          .acm-card { transform: none !important; transition: none; }
          .acm-feature-card:hover { transform: none; }
          .acm-three-scene { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
