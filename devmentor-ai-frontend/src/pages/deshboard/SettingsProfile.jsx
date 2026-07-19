import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import TopBar from "../../components/layout/TopBar";

// ======================================================
// Profile Component
// Lets the user view and update their account info
// (full name + email) and shows an avatar badge derived
// from their name.
// ======================================================

// ------------------------------------------------------------
// Mock signed-in user. Frontend-only for now — swap this for
// real data once auth/backend is wired up (see the GET /profile
// comment block below).
// ------------------------------------------------------------
const MOCK_USER = {
  fullName: "prem",
  email: "demo@gmail.com",
};

export default function Profile({ mobileOpen, setMobileOpen }) {
  /*
  ======================================================
  Backend Integration (Future) — load profile

  GET /profile

  Response Example:

  {
    fullName: "prem",
    email: "baliwalaprem@gmail.com"
  }

  TODO:
  - Fetch this on mount (e.g. useEffect + api.get("/profile")).
  - Store the response in `profile` state below instead of MOCK_USER.
  - Show a loading skeleton while the request is in flight.
  ======================================================
  */
  const [profile, setProfile] = useState(MOCK_USER); // saved/displayed state (avatar, header)
  const [fullName, setFullName] = useState(MOCK_USER.fullName); // draft input state
  const [email, setEmail] = useState(MOCK_USER.email);
  const [isSaving, setIsSaving] = useState(false);

  const initial = (profile.fullName || "?").trim().charAt(0).toUpperCase() || "?";
  const isDirty = fullName !== profile.fullName;

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Full name can't be empty");
      return;
    }

    setIsSaving(true);

    try {
      /*
      ======================================================
      Backend Integration (Future) — save profile

      PUT /profile
      Body: { fullName }

      Response Example:
      { fullName: "prem", email: "baliwalaprem@gmail.com" }

      TODO:
      - Replace the setTimeout below with:
          const { data } = await api.put("/profile", { fullName });
          setProfile(data);
      - Handle validation errors from the server (duplicate name,
        length limits, etc.) and surface them via toast.error(...).
      ======================================================
      */
      await new Promise((resolve) => setTimeout(resolve, 700)); // simulated network delay
      setProfile((p) => ({ ...p, fullName: fullName.trim() }));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Save profile failed:", error);
      toast.error("Couldn't save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 px-5 md:px-8 py-6 max-w-7xl mx-auto w-full">
      <TopBar title="Profile" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
      </div>

      <div className="max-w-2xl bg-[#12141f] border border-white/5 rounded-2xl p-6 md:p-7">
        {/* Avatar + name/email summary */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-white truncate">{profile.fullName}</div>
            <div className="text-sm text-gray-400 truncate">{profile.email}</div>
          </div>
        </div>

        {/* Full name */}
        <div className="mb-5">
          <label htmlFor="profile-full-name" className="block text-sm font-semibold text-gray-200 mb-2">
            Full name
          </label>
          <input
            id="profile-full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-[#0d0f18] border border-white/10 hover:border-white/20 focus-visible:border-purple-500/50 focus-visible:ring-1 focus-visible:ring-purple-500/40 rounded-lg px-3.5 py-2.5 text-sm text-gray-100 outline-none transition-colors"
          />
        </div>

        {/* Email — read-only here; changing it usually requires a
            verification flow, so it's disabled rather than a free
            text field. Swap `disabled` for a real "change email"
            flow once that backend endpoint exists. */}
        <div className="mb-6">
          <label htmlFor="profile-email" className="block text-sm font-semibold text-gray-200 mb-2">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            readOnly
            className="w-full bg-[#0d0f18] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="acm-save-btn flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <style>{`
        .acm-save-btn {
          box-shadow: 0 6px 16px -6px rgba(147, 51, 234, 0.5);
          transition: box-shadow 0.2s ease, transform 0.1s ease, background-color 0.15s ease, opacity 0.15s ease;
        }
        .acm-save-btn:hover:not(:disabled) {
          box-shadow: 0 8px 20px -6px rgba(147, 51, 234, 0.65);
        }
        .acm-save-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
