import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import {
  ChevronDown,
  X,
  Plus,
  FolderOpen,
  Save,
  Play,
  AlertTriangle,
  Pencil,
  Check,
  Download,
  Loader2,
  CircleCheck,
  CircleX,
  Sparkles,
  BookOpen,
  Bug,
  Zap,
  BarChart3,
  TestTube2,
  Mic,
} from "lucide-react";

import TopBar from "../../components/layout/TopBar.jsx";
import AnalysisTab from "../../components/editor/AnalysisTab.jsx";
import ExplanationTab from "../../components/editor/ExplanationTab.jsx";
import BugsTab from "../../components/editor/BugsTab.jsx";
import OptimizationTab from "../../components/editor/OptimizationTab.jsx";
import ComplexityTab from "../../components/editor/ComplexityTab.jsx";
import TestsTab from "../../components/editor/TestsTab.jsx";
import { saveHistory } from "../../utils/history.js";
import AIInterview from "../../components/editor/AIInterview.jsx";

const TABS = [
  { name: "Analysis", icon: Sparkles },
  { name: "Explanation", icon: BookOpen },
  { name: "Bugs", icon: Bug },
  { name: "Optimization", icon: Zap },
  { name: "Complexity", icon: BarChart3 },
  { name: "Tests", icon: TestTube2 },
  { name: "Interview", icon: Mic },
];

const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python", extension: "py", dot: "bg-blue-400" },
  {
    value: "javascript",
    label: "JavaScript",
    extension: "js",
    dot: "bg-amber-400",
  },
  { value: "java", label: "Java", extension: "java", dot: "bg-orange-400" },
  { value: "cpp", label: "C++", extension: "cpp", dot: "bg-sky-400" },
];

const DEFAULT_CODE = `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        diff = target - num

        if diff in seen:
            return [seen[diff], i]

        seen[num] = i

    return []`;

const DEFAULT_FILE_NAME = "two_sum.py";

// ------------------------------------------------------------------
// Shared, module-level language sniffer (used on paste). Defined once
// outside the component so it isn't rebuilt on every keystroke/paste.
// ------------------------------------------------------------------
const LANGUAGE_RULES = [
  { lang: "python", test: /^\s*(def |import |from .+ import|print\()/m },
  { lang: "html", test: /<!DOCTYPE html>|<html[\s>]|<div[\s>]|<\/[a-z]+>/i },
  { lang: "css", test: /^[.#]?[\w-]+\s*{[\s\S]*:[\s\S]*;[\s\S]*}/m },
  { lang: "json", test: /^\s*[{\[][\s\S]*[}\]]\s*$/ },
  {
    lang: "typescript",
    test: /:\s*(string|number|boolean|any|void)\b|interface\s+\w+|<[A-Za-z]+>\(/,
  },
  {
    lang: "javascript",
    test: /(const|let|var)\s+\w+\s*=|function\s*\(|=>|console\.log\(/,
  },
  {
    lang: "java",
    test: /public\s+(static\s+)?(class|void)\s+\w+|System\.out\.println/,
  },
  { lang: "cpp", test: /#include\s*<.*>|std::|cout\s*<<|cin\s*>>/ },
  { lang: "c", test: /#include\s*<stdio\.h>|printf\(|scanf\(/ },
  { lang: "csharp", test: /using System;|Console\.WriteLine|namespace\s+\w+/ },
  { lang: "php", test: /^\s*<\?php|\$\w+\s*=/ },
  { lang: "ruby", test: /^\s*(def |puts |require ['"])/m },
  { lang: "go", test: /^\s*package\s+main|func\s+\w+\(|fmt\.Println/m },
  {
    lang: "sql",
    test: /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE)\b/i,
  },
  { lang: "shell", test: /^#!\/bin\/(bash|sh)|^\s*(echo |cd |ls |sudo )/m },
];

function detectLanguageFromContent(code) {
  for (const rule of LANGUAGE_RULES) {
    if (rule.test.test(code)) return rule.lang;
  }
  return null;
}

// Only auto-switch the language dropdown for languages we actually
// support there — detecting "html"/"sql"/etc. is still useful info,
// but silently forcing the selector to a value that isn't one of the
// options would be worse than leaving it alone.
const SUPPORTED_LANGUAGES = new Set(LANGUAGE_OPTIONS.map((o) => o.value));

// ============================================================
// Backend integration point
// ------------------------------------------------------------
// Once a backend is available, initialize an API client here,
// e.g.:
//
//   import axios from "axios";
//   const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
//
// See handleAnalyze() and handleSave() below for the exact
// request/response contracts this UI expects.
// ============================================================

/**
 * AIEditor
 *
 * Code editor + AI analysis workspace. Renders a Monaco editor on the
 * left and a tabbed results panel (Analysis / Explanation / Bugs /
 * Optimization / Complexity / Tests / Interview) on the right.
 *
 * Backend contract for "Analyze Code":
 *   POST /analyze-code  { code, language }  ->
 *   {
 *     bugs: [{ line, severity, message }],
 *     explanation: [{ line, code, explanation }],
 *     complexity: { time, space },
 *     optimizationTips: [...],
 *     tests: "..."
 *   }
 */
export default function AIEditor({ mobileOpen, setMobileOpen }) {
  const [tab, setTab] = useState("Analysis");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("python");
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);
  const [consoleOutput, setConsoleOutput] = useState("No output");
  const [consoleStatus, setConsoleStatus] = useState("idle"); // idle | success | error
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Bumped every time "Analyze Code" runs. Tabs that need to react to a
  // fresh analysis (currently: Interview) watch this instead of relying
  // on being mounted at the exact moment the button was clicked.
  const [runId, setRunId] = useState(0);

  // File name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftFileName, setDraftFileName] = useState(fileName);
  const fileNameInputRef = useRef(null);

  // Monaco editor instance, kept so onDidPaste can be wired up once
  // in onMount rather than needing a React-level onPaste prop (which
  // @monaco-editor/react's wrapper doesn't expose).
  const editorRef = useRef(null);

  useEffect(() => {
    if (isEditingName && fileNameInputRef.current) {
      fileNameInputRef.current.focus();
      fileNameInputRef.current.select();
    }
  }, [isEditingName]);

  // ------------------------------------------------------------
  // Analyze
  // ------------------------------------------------------------
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setConsoleStatus("idle");
    setConsoleOutput("Analyzing code...");
    // Bump runId right away so any tab watching it (e.g. Interview)
    // starts its own loading state in sync with this button.
    setRunId((n) => n + 1);

    try {
      // ---- BACKEND API CALL GOES HERE ----
      // const { data } = await api.post("/analyze-code", { code, language });
      //
      // setAnalysis(data);                 // -> <AnalysisTab data={analysis} />
      // setExplanation(data.explanation);  // -> <ExplanationTab data={explanation} />

      setConsoleOutput("Code analyzed successfully");
      setConsoleStatus("success");
      setTab("Analysis");
      const analysisResult = {
        file: fileName || "Untitled.py",
        lang: language,
        type: "AI Code Analysis",
        date: new Date().toLocaleString(),
      };
      saveHistory(analysisResult);
    } catch (error) {
      console.error("Analyze request failed:", error);
      setConsoleOutput("Analysis failed. Please try again.");
      setConsoleStatus("error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ------------------------------------------------------------
  // File actions
  // ------------------------------------------------------------
  const handleNew = () => {
    // Local-only reset. To persist new files server-side, call
    // something like: await api.post("/files", { name, language });
    const ext =
      LANGUAGE_OPTIONS.find((o) => o.value === language)?.extension || "txt";
    setCode("");
    setFileName(`untitled.${ext}`);
    setConsoleOutput("New file created");
    setConsoleStatus("idle");
  };

  const handleSave = () => {
    const snippet = {
      id: Date.now(),
      title: fileName,
      language,
      code,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("savedSnippets")) || [];
    existing.unshift(snippet);
    localStorage.setItem("savedSnippets", JSON.stringify(existing));

    toast.success("Snippet saved successfully");
    setConsoleOutput("Snippet saved successfully");
    setConsoleStatus("success");
  };

  const handleOpen = (event) => {
    // Reads a file from local disk. To support opening files stored
    // server-side (e.g. saved snippets), fetch them instead, e.g.:
    // const { data } = await api.get(`/files/${id}`);
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
      setFileName(file.name);
      setConsoleOutput(`${file.name} opened successfully`);
      setConsoleStatus("success");

      const ext = file.name.split(".").pop()?.toLowerCase();
      const extMatch = LANGUAGE_OPTIONS.find((o) => o.extension === ext);
      if (extMatch) {
        setLanguage(extMatch.value);
      } else {
        const detected = detectLanguageFromContent(e.target.result);
        if (detected && SUPPORTED_LANGUAGES.has(detected))
          setLanguage(detected);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleCloseFile = () => setShowCloseModal(true);

  const confirmCloseFile = () => {
    setCode("");
    setFileName("");
    setConsoleOutput("File closed");
    setConsoleStatus("idle");
    setShowCloseModal(false);
  };

  const cancelCloseFile = () => setShowCloseModal(false);

  // ------------------------------------------------------------
  // File name editing
  // ------------------------------------------------------------
  const startEditingName = () => {
    setDraftFileName(fileName);
    setIsEditingName(true);
  };

  const commitFileName = () => {
    const trimmed = draftFileName.trim();
    if (trimmed && trimmed !== fileName) {
      setFileName(trimmed);
      setConsoleOutput(`Renamed to ${trimmed}`);
    }
    setIsEditingName(false);
  };

  const cancelEditingName = () => {
    setDraftFileName(fileName);
    setIsEditingName(false);
  };

  const handleFileNameKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitFileName();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEditingName();
    }
  };

  // ------------------------------------------------------------
  // Results panel
  // ------------------------------------------------------------
  const renderTabContent = () => {
    switch (tab) {
      case "Analysis":
        // Once handleAnalyze receives real data: <AnalysisTab data={analysis} />
        return <AnalysisTab />;
      case "Explanation":
        return <ExplanationTab />;
      case "Bugs":
        return <BugsTab />;
      case "Optimization":
        return <OptimizationTab />;
      case "Complexity":
        return <ComplexityTab />;
      case "Tests":
        return <TestsTab />;
      case "Interview":
        return <AIInterview code={code} language={language} runId={runId} />;
      default:
        return (
          <div className="text-sm text-gray-500 py-10 text-center">
            {tab} results will appear here once you analyze your code.
          </div>
        );
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "untitled.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Custom Monaco theme so the editor's background, cursor, selection,
  // and gutter match the app's dark/purple palette instead of the
  // stock "vs-dark" blue-gray.
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("acm-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d0f18",
        "editor.foreground": "#e5e7eb",
        "editorLineNumber.foreground": "#4b5563",
        "editorLineNumber.activeForeground": "#a78bfa",
        "editor.selectionBackground": "#a855f733",
        "editor.inactiveSelectionBackground": "#a855f71a",
        "editorCursor.foreground": "#c4b5fd",
        "editor.lineHighlightBackground": "#ffffff08",
        "editorIndentGuide.background": "#ffffff0f",
        "editorIndentGuide.activeBackground": "#a855f733",
        "editorWidget.background": "#12141f",
        "editorWidget.border": "#ffffff1a",
        "editorSuggestWidget.background": "#12141f",
        "editorSuggestWidget.border": "#ffffff1a",
        "editorSuggestWidget.selectedBackground": "#a855f726",
        "scrollbarSlider.background": "#ffffff14",
        "scrollbarSlider.hoverBackground": "#ffffff22",
      },
    });
  };

  // Wires up real paste-language-detection using Monaco's own event
  // API — @monaco-editor/react's <Editor /> wrapper has no onPaste
  // prop, so this has to happen against the underlying editor instance.
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidPaste((e) => {
      const pastedText = editor.getModel()?.getValueInRange(e.range);
      if (!pastedText) return;

      const detected = detectLanguageFromContent(pastedText);
      if (detected && SUPPORTED_LANGUAGES.has(detected)) {
        setLanguage(detected);
        setConsoleOutput(`Detected language: ${detected}`);
        setConsoleStatus("idle");
      }
    });
  };

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="AI Editor"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Editor toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${
                LANGUAGE_OPTIONS.find((o) => o.value === language)?.dot ||
                "bg-gray-400"
              }`}
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none text-sm bg-[#12141f] border border-white/10 hover:border-white/20 pl-6 pr-8 py-1.5 rounded-lg text-gray-300 outline-none transition-colors focus-visible:ring-1 focus-visible:ring-purple-500/60"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-2.5 pointer-events-none text-gray-400"
            />
          </div>

          <div
            className="hidden md:block w-px h-6 bg-white/10 mx-1"
            aria-hidden="true"
          />

          {fileName && !isEditingName && (
            <span className="group flex items-center gap-2 text-sm bg-[#12141f] border border-white/10 hover:border-white/20 transition-colors px-3 py-1.5 rounded-lg text-gray-300">
              {fileName}
              <button
                onClick={startEditingName}
                className="text-gray-500 hover:text-white transition opacity-70 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/60 rounded"
                aria-label="Rename file"
                title="Rename file"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={handleCloseFile}
                className="text-gray-500 hover:text-white transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/60 rounded"
                aria-label="Close file"
                title="Close file"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {fileName && isEditingName && (
            <span className="flex items-center gap-2 text-sm bg-[#12141f] border border-purple-500/40 px-3 py-1.5 rounded-lg text-gray-300">
              <input
                ref={fileNameInputRef}
                value={draftFileName}
                onChange={(e) => setDraftFileName(e.target.value)}
                onKeyDown={handleFileNameKeyDown}
                onBlur={commitFileName}
                className="bg-transparent outline-none text-gray-100 w-32 md:w-40"
                aria-label="File name"
              />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={commitFileName}
                className="text-purple-400 hover:text-purple-300 transition"
                aria-label="Confirm rename"
                title="Confirm"
              >
                <Check size={13} />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={cancelEditingName}
                className="text-gray-500 hover:text-white transition"
                aria-label="Cancel rename"
                title="Cancel"
              >
                <X size={13} />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleNew}
            className="acm-tool-btn flex items-center gap-1 text-xs border border-white/10 px-3 py-1.5 rounded-lg text-gray-300"
          >
            <Plus size={13} />
            New
          </button>

          <label className="acm-tool-btn flex items-center gap-1 text-xs border border-white/10 px-3 py-1.5 rounded-lg text-gray-300 cursor-pointer">
            <FolderOpen size={13} />
            Open
            <input type="file" className="hidden" onChange={handleOpen} />
          </label>

          <button
            onClick={handleSave}
            className="acm-tool-btn flex items-center gap-1 text-xs border border-white/10 px-3 py-1.5 rounded-lg text-gray-300"
          >
            <Save size={13} />
            Save
          </button>

          <button
            onClick={handleDownload}
            className="acm-tool-btn flex items-center gap-1 text-xs border border-white/10 px-3 py-1.5 rounded-lg text-gray-300"
          >
            <Download size={13} />
            Download
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="acm-analyze-btn flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:hover:bg-purple-600 disabled:opacity-80 disabled:cursor-not-allowed transition px-3 py-1.5 rounded-lg font-medium"
          >
            {isAnalyzing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze Code"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Monaco editor */}
        <div className="acm-editor-card bg-[#0d0f18] border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              Editor
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  LANGUAGE_OPTIONS.find((o) => o.value === language)?.dot ||
                  "bg-gray-400"
                }`}
              />
              {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label}
            </span>
          </div>

          <Editor
            height="500px"
            language={language}
            theme="acm-dark"
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              tabSize: 4,
            }}
          />

          <div
            className={`border-t px-4 py-3 transition-colors ${
              consoleStatus === "success"
                ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                : consoleStatus === "error"
                  ? "border-red-500/20 bg-red-500/[0.03]"
                  : "border-white/10"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">Console</div>
            <div className="flex items-center gap-1.5 text-xs">
              {consoleStatus === "success" && (
                <CircleCheck size={13} className="text-emerald-400 shrink-0" />
              )}
              {consoleStatus === "error" && (
                <CircleX size={13} className="text-red-400 shrink-0" />
              )}
              <span
                className={
                  consoleStatus === "success"
                    ? "text-emerald-300"
                    : consoleStatus === "error"
                      ? "text-red-300"
                      : "text-gray-400"
                }
              >
                {consoleOutput}
              </span>
            </div>
          </div>
        </div>

        {/* Analysis panel */}
        <div className="bg-[#12141f] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-1 flex-wrap mb-4 border-b border-white/5 pb-2">
            {TABS.map((t) => (
              <button
                key={t.name}
                onClick={() => setTab(t.name)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-150 ${
                  tab === t.name
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <t.icon size={13} />
                {t.name}
              </button>
            ))}
          </div>

          <div key={tab} className="acm-tab-fade">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {showCloseModal && (
        <div className="acm-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="acm-modal-panel w-full max-w-sm bg-[#12141f] border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/15">
              <AlertTriangle size={24} className="text-purple-400" />
            </div>

            <h2 className="text-lg font-semibold text-white text-center">
              Close File?
            </h2>

            <p className="text-sm text-gray-400 text-center mt-2">
              Are you sure you want to close{" "}
              <span className="text-purple-400 font-medium">{fileName}</span>?
            </p>

            <p className="text-xs text-gray-500 text-center mt-1">
              Unsaved changes may be lost.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelCloseFile}
                className="flex-1 px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseFile}
                className="flex-1 px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .acm-tool-btn {
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }
        .acm-tool-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .acm-tool-btn:active {
          transform: scale(0.97);
        }
        .acm-tool-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.6);
        }

        .acm-analyze-btn {
          box-shadow: 0 6px 16px -6px rgba(147, 51, 234, 0.5);
        }
        .acm-analyze-btn:hover:not(:disabled) {
          box-shadow: 0 8px 20px -6px rgba(147, 51, 234, 0.65);
        }
        .acm-analyze-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .acm-analyze-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.8);
        }

        .acm-editor-card {
          transition: border-color 0.2s ease;
        }

        .acm-tab-fade {
          animation: acmTabFade 0.2s ease;
        }
        @keyframes acmTabFade {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .acm-modal-backdrop {
          animation: acmBackdropFade 0.18s ease;
        }
        .acm-modal-panel {
          animation: acmModalIn 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes acmBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes acmModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .acm-tab-fade, .acm-modal-backdrop, .acm-modal-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * Backend wiring reference
 * ------------------------------------------------------------
 * Drop-in replacement for handleAnalyze once a FastAPI (or
 * equivalent) backend is available at /analyze-code.
 * ============================================================
 *
 * const handleAnalyze = async () => {
 *   setConsoleOutput("Analyzing code...");
 *   try {
 *     const { data } = await axios.post("http://localhost:8000/analyze-code", {
 *       code,
 *       language,
 *     });
 *
 *     // setAnalysis(data);
 *     // setExplanation(data.explanation);
 *
 *     setConsoleOutput("Code analyzed successfully.");
 *     setTab("Analysis");
 *   } catch (error) {
 *     console.error(error);
 *     setConsoleOutput("Analysis failed.");
 *   }
 * };
 */
