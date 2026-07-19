import React, { useEffect, useState } from "react";
import { Bookmark, Trash2, Copy, Eye, Pencil, Check, X } from "lucide-react";
import TopBar from "../../components/layout/TopBar";
import { toast } from "sonner";

export default function SnippetsPage({ mobileOpen, setMobileOpen }) {
  const [snippets, setSnippets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCode, setDraftCode] = useState("");
  const [previewSnippet, setPreviewSnippet] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedSnippets")) || [];
    setSnippets(data);
  }, []);

  const persist = (updated) => {
    setSnippets(updated);
    localStorage.setItem("savedSnippets", JSON.stringify(updated));
  };

  const deleteSnippet = (id) => {
    persist(snippets.filter((item) => item.id !== id));
    toast.success("Removed");
  };

  const copySnippet = async (snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedId(snippet.id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const startEditing = (snippet) => {
    setEditingId(snippet.id);
    setDraftTitle(snippet.title);
    setDraftCode(snippet.code);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftTitle("");
    setDraftCode("");
  };

  const saveEdit = (id) => {
    const updated = snippets.map((item) =>
      item.id === id
        ? { ...item, title: draftTitle.trim() || item.title, code: draftCode }
        : item,
    );
    persist(updated);
    toast.success("Snippet updated");
    cancelEditing();
  };

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="Saved Snippets"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <h1 className="text-3xl font-bold mb-1">Saved Snippets</h1>

      <p className="text-gray-500 mb-6">Your bookmarked code snippets</p>

      {snippets.length === 0 ? (
        <div className="bg-[#12141f] border border-white/5 rounded-xl p-10 text-center text-gray-500">
          <Bookmark className="mx-auto mb-3" size={24} />
          You haven't saved any snippets yet.
        </div>
      ) : (
        <div
          className="
            grid md:grid-cols-2 gap-6
            max-h-[650px]
            overflow-y-auto
            pr-2
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-white/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-white/20
          "
        >
          {snippets.map((snippet) => {
            const isEditing = editingId === snippet.id;

            return (
              <div
                key={snippet.id}
                className="bg-[#12141f] border border-white/5 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div className="min-w-0">
                    {isEditing ? (
                      <input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="bg-[#0d0f18] border border-white/10 rounded-md px-2 py-1 text-sm text-white w-full outline-none focus:border-purple-500/50"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold truncate">
                        {snippet.title}
                      </h2>
                    )}
                    <p className="text-sm text-gray-400">{snippet.language}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(snippet.id)}
                          title="Save"
                          className="text-green-400 hover:text-green-300 transition"
                        >
                          <Check size={17} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          title="Cancel"
                          className="text-gray-500 hover:text-gray-300 transition"
                        >
                          <X size={17} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => copySnippet(snippet)}
                          title="Copy code"
                          className="text-gray-400 hover:text-purple-400 transition"
                        >
                          {copiedId === snippet.id ? (
                            <Check size={16} className="text-green-400" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setPreviewSnippet(snippet)}
                          title="Preview"
                          className="text-gray-400 hover:text-blue-400 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => startEditing(snippet)}
                          title="Edit"
                          className="text-gray-400 hover:text-yellow-400 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteSnippet(snippet.id)}
                          title="Delete"
                          className="text-red-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={draftCode}
                    onChange={(e) => setDraftCode(e.target.value)}
                    rows={10}
                    className="w-full bg-[#0d0f18] p-4 rounded-lg text-sm text-gray-200 font-mono outline-none border border-white/10 focus:border-purple-500/50 resize-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/40 [&::-webkit-scrollbar-thumb]:rounded-full"
                  />
                ) : (
                  <pre className="bg-[#0d0f18] p-4 rounded-lg overflow-auto max-h-64 text-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/70">
                    <code>{snippet.code}</code>
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Preview modal */}
      {previewSnippet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setPreviewSnippet(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[80vh] bg-[#12141f] border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {previewSnippet.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {previewSnippet.language}
                </p>
              </div>
              <button
                onClick={() => setPreviewSnippet(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <pre className="bg-[#0d0f18] p-4 rounded-lg overflow-auto text-sm flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/40 [&::-webkit-scrollbar-thumb]:rounded-full">
              <code>{previewSnippet.code}</code>
            </pre>

            <button
              onClick={() => copySnippet(previewSnippet)}
              className="mt-4 flex items-center justify-center gap-2 text-sm bg-purple-600 hover:bg-purple-500 transition px-4 py-2 rounded-lg font-medium"
            >
              <Copy size={14} />
              Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
