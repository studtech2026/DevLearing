import React, { useState } from "react";
import { GitBranch, Loader2, CheckCircle2 } from "lucide-react";
import TopBar from "../../components/layout/TopBar.jsx";
import { REPOS } from "../../data/mockData.js";

export default function RepoAnalyzer({ mobileOpen, setMobileOpen }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    const githubRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;

    if (!githubRegex.test(url)) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    try {
      setLoading(true);

      // Backend API call later

      /*
      const response = await axios.post(
        "http://localhost:8000/github/analyze",
        { url }
      );

      console.log(response.data);
      */

      console.log("Repository URL:", url);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowModal(true);
    } catch (err) {
      setError("Unable to analyze repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="Repository Analyzer"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <h1 className="text-3xl font-bold mb-2">Repository Analyzer</h1>

      <p className="text-gray-500 mb-8">
        Analyze any GitHub repository using AI
      </p>

      {/* Input Card */}

      <div className="bg-[#12141f] border border-white/5 rounded-xl p-5 mb-6">
        <label className="block text-sm mb-2 text-gray-300">
          GitHub Repository URL
        </label>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnalyze();
              }
            }}
            className="flex-1 bg-[#0d0f18] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed transition rounded-lg px-6 py-3 font-medium flex items-center justify-center gap-2 min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Repository"
            )}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Recent Repositories */}

      <div className="bg-[#12141f] border border-white/5 rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-5">
          Recent Analyzed Repositories
        </h3>

        <div className="space-y-4">
          {REPOS.map((repo) => (
            <button
              key={repo.name}
              className="w-full text-left flex items-center justify-between hover:bg-white/5 rounded-lg p-3 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <GitBranch size={18} className="text-gray-400" />
                </div>

                <div>
                  <h4 className="font-medium">{repo.name}</h4>

                  <p className="text-xs text-gray-500">{repo.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    background: `${repo.langColor}22`,
                    color: repo.langColor,
                  }}
                >
                  {repo.lang}
                </span>

                <span className="text-emerald-400 font-semibold">
                  {repo.score}/100
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[430px] bg-[#151824] border border-white/10 rounded-2xl p-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                <CheckCircle2 size={34} className="text-purple-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-3">
              Repository Submitted
            </h2>

            <p className="text-center text-gray-400 mb-8">
              Your repository has been submitted for AI analysis. Results will
              appear after the analysis is completed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/10 rounded-lg py-3 hover:bg-white/5"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setUrl("");
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 rounded-lg py-3"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
