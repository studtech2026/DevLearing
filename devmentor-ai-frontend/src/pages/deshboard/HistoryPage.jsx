import React, { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, Trash2 } from "lucide-react";

import TopBar from "../../components/layout/TopBar";
import { getHistory, deleteHistory } from "../../utils/history";

export default function HistoryPage({ mobileOpen, setMobileOpen }) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const loadHistory = () => {
    setRows(getHistory());
  };

  const handleDelete = (originalIndex) => {
    deleteHistory(originalIndex);
    loadHistory();
    setOpenMenu(null);
  };

  const filteredRows = rows
    .map((item, index) => ({
      ...item,
      originalIndex: index,
    }))
    .filter((item) => item.file.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar
        title="History"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <h1 className="text-2xl font-bold mb-1">History</h1>

      <p className="text-gray-500 text-sm mb-6">
        View and manage your past code analyses
      </p>

      {/* Search */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search analysis..."
            className="w-full bg-[#12141f] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-purple-500"
          />
        </div>

        <button className="border border-white/10 px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/5">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#12141f] border border-white/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400">
              <th className="px-4 py-3">File / Title</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Analysis Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((item) => (
                <tr
                  key={item.originalIndex}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-medium">{item.file}</td>

                  <td className="px-4 py-3 text-gray-400">{item.lang}</td>

                  <td className="px-4 py-3 text-gray-400">{item.type}</td>

                  <td className="px-4 py-3 text-gray-400">{item.date}</td>

                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenMenu(
                          openMenu === item.originalIndex
                            ? null
                            : item.originalIndex,
                        );
                      }}
                      className="p-2 rounded-md hover:bg-white/10"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === item.originalIndex && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-6 top-12 w-40 bg-[#1B1D2B] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                      >
                        <button
                          onClick={() => handleDelete(item.originalIndex)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No Analysis Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
