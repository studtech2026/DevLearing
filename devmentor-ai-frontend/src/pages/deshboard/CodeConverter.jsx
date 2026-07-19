import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import {
  ChevronDown,
  ArrowRightLeft,
  RefreshCw,
  Copy,
  Download,
  Loader2,
  CircleCheck,
  CircleX,
} from "lucide-react";

import TopBar from "../../components/layout/TopBar.jsx";

// ============================================================
// Backend integration point
// ------------------------------------------------------------
// Once a backend is available, initialize an API client here,
// e.g.:
//
//   import axios from "axios";
//   const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
//
// See handleConvert() below for the exact request/response
// contract this UI expects.
// ============================================================

const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python", extension: "py", dot: "bg-blue-400" },
  {
    value: "javascript",
    label: "JavaScript",
    extension: "js",
    dot: "bg-amber-400",
  },
  {
    value: "typescript",
    label: "TypeScript",
    extension: "ts",
    dot: "bg-sky-400",
  },
  { value: "java", label: "Java", extension: "java", dot: "bg-orange-400" },
  { value: "cpp", label: "C++", extension: "cpp", dot: "bg-indigo-400" },
  { value: "csharp", label: "C#", extension: "cs", dot: "bg-violet-400" },
  { value: "go", label: "Go", extension: "go", dot: "bg-cyan-400" },
  { value: "ruby", label: "Ruby", extension: "rb", dot: "bg-red-400" },
  { value: "php", label: "PHP", extension: "php", dot: "bg-purple-400" },
];

const DEFAULT_SOURCE_CODE = `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        diff = target - num

        if diff in seen:
            return [seen[diff], i]

        seen[num] = i

    return []`;

function languageMeta(value) {
  return LANGUAGE_OPTIONS.find((o) => o.value === value);
}

// A small select with a colored language dot, reused for both the
// source and target pickers so the two stay visually identical.
function LanguageSelect({ value, onChange, label }) {
  const meta = languageMeta(value);
  return (
    <div className="relative">
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${
          meta?.dot || "bg-gray-400"
        }`}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
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
  );
}

/**
 * CodeConverter
 *
 * Paste code on the left, pick a source and target language, and
 * convert. Renders two Monaco editors side by side, sharing the same
 * dark/purple theme as the AI Editor page.
 *
 * Backend contract for "Convert":
 *   POST /convert-code  { code, fromLanguage, toLanguage }  ->
 *   { convertedCode: string, notes?: string[] }
 */
export default function CodeConverter({ mobileOpen, setMobileOpen }) {
  const [fromLanguage, setFromLanguage] = useState("python");
  const [toLanguage, setToLanguage] = useState("javascript");
  const [sourceCode, setSourceCode] = useState(DEFAULT_SOURCE_CODE);
  const [convertedCode, setConvertedCode] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [statusMessage, setStatusMessage] = useState("No conversion yet");

  // ------------------------------------------------------------
  // Convert
  // ------------------------------------------------------------
  const handleConvert = async () => {
    setIsConverting(true);
    setStatus("idle");
    setStatusMessage("Converting code...");

    try {
      // ---- BACKEND API CALL GOES HERE ----
      // const { data } = await api.post("/convert-code", {
      //   code: sourceCode,
      //   fromLanguage,
      //   toLanguage,
      // });
      // setConvertedCode(data.convertedCode);

      setConvertedCode(
        `// Converted from ${languageMeta(fromLanguage)?.label} to ${
          languageMeta(toLanguage)?.label
        }\n// Connect a backend to see a real conversion here.\n\n${sourceCode}`,
      );
      setStatus("success");
      setStatusMessage(
        `Converted ${languageMeta(fromLanguage)?.label} to ${languageMeta(toLanguage)?.label}`,
      );
    } catch (error) {
      console.error("Convert request failed:", error);
      setStatus("error");
      setStatusMessage("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  // ------------------------------------------------------------
  // Swap languages (and their code, if both are populated)
  // ------------------------------------------------------------
  const handleSwap = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    if (convertedCode) {
      setSourceCode(convertedCode);
      setConvertedCode(sourceCode);
    }
  };

  // ------------------------------------------------------------
  // Output actions
  // ------------------------------------------------------------
  const handleCopy = async () => {
    if (!convertedCode) return;
    try {
      await navigator.clipboard.writeText(convertedCode);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Couldn't copy to clipboard");
    }
  };

  const handleDownload = () => {
    if (!convertedCode) return;
    const extension = languageMeta(toLanguage)?.extension || "txt";
    const blob = new Blob([convertedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Custom Monaco theme matching the app's dark/purple palette,
  // shared with the AI Editor page's editor instances.
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
        "scrollbarSlider.background": "#ffffff14",
        "scrollbarSlider.hoverBackground": "#ffffff22",
      },
    });
  };

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="Code Converter"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Language picker + convert toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <LanguageSelect
            value={fromLanguage}
            onChange={setFromLanguage}
            label="Source language"
          />

          <button
            onClick={handleSwap}
            className="acm-tool-btn flex items-center justify-center w-8 h-8 border border-white/10 rounded-lg text-gray-400 hover:text-purple-300"
            aria-label="Swap languages"
            title="Swap languages"
          >
            <ArrowRightLeft size={14} />
          </button>

          <LanguageSelect
            value={toLanguage}
            onChange={setToLanguage}
            label="Target language"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={isConverting || !sourceCode.trim()}
          className="acm-convert-btn flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 disabled:hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed transition px-4 py-2 rounded-lg font-medium"
        >
          {isConverting ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Source editor */}
        <div className="acm-editor-card bg-[#0d0f18] border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              Source
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span
                className={`w-1.5 h-1.5 rounded-full ${languageMeta(fromLanguage)?.dot}`}
              />
              {languageMeta(fromLanguage)?.label}
            </span>
          </div>

          <Editor
            height="480px"
            language={fromLanguage}
            theme="acm-dark"
            beforeMount={handleEditorWillMount}
            value={sourceCode}
            onChange={(value) => setSourceCode(value || "")}
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
        </div>

        {/* Converted editor */}
        <div className="acm-editor-card bg-[#0d0f18] border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              Converted
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${languageMeta(toLanguage)?.dot}`}
                />
                {languageMeta(toLanguage)?.label}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  disabled={!convertedCode}
                  className="acm-icon-btn text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition"
                  aria-label="Copy converted code"
                  title="Copy"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!convertedCode}
                  className="acm-icon-btn text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition"
                  aria-label="Download converted code"
                  title="Download"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>
          </div>

          <Editor
            height="480px"
            language={toLanguage}
            theme="acm-dark"
            beforeMount={handleEditorWillMount}
            value={convertedCode}
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
            }}
          />

          <div
            className={`border-t px-4 py-3 transition-colors ${
              status === "success"
                ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                : status === "error"
                  ? "border-red-500/20 bg-red-500/[0.03]"
                  : "border-white/10"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs">
              {status === "success" && (
                <CircleCheck size={13} className="text-emerald-400 shrink-0" />
              )}
              {status === "error" && (
                <CircleX size={13} className="text-red-400 shrink-0" />
              )}
              <span
                className={
                  status === "success"
                    ? "text-emerald-300"
                    : status === "error"
                      ? "text-red-300"
                      : "text-gray-500"
                }
              >
                {statusMessage}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .acm-tool-btn {
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }
        .acm-tool-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .acm-tool-btn:active {
          transform: scale(0.94);
        }
        .acm-tool-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.6);
        }

        .acm-icon-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.6);
          border-radius: 4px;
        }

        .acm-convert-btn {
          box-shadow: 0 6px 16px -6px rgba(147, 51, 234, 0.5);
        }
        .acm-convert-btn:hover:not(:disabled) {
          box-shadow: 0 8px 20px -6px rgba(147, 51, 234, 0.65);
        }
        .acm-convert-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .acm-convert-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.8);
        }

        .acm-editor-card {
          transition: border-color 0.2s ease;
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * Backend wiring reference
 * ------------------------------------------------------------
 * Drop-in replacement for handleConvert once a backend is
 * available at /convert-code.
 * ============================================================
 *
 * const handleConvert = async () => {
 *   setIsConverting(true);
 *   setStatus("idle");
 *   setStatusMessage("Converting code...");
 *   try {
 *     const { data } = await axios.post("http://localhost:8000/convert-code", {
 *       code: sourceCode,
 *       fromLanguage,
 *       toLanguage,
 *     });
 *     setConvertedCode(data.convertedCode);
 *     setStatus("success");
 *     setStatusMessage(`Converted ${fromLanguage} to ${toLanguage}`);
 *   } catch (error) {
 *     console.error(error);
 *     setStatus("error");
 *     setStatusMessage("Conversion failed.");
 *   } finally {
 *     setIsConverting(false);
 *   }
 * };
 */
