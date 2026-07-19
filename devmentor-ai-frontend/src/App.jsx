import React, { useState } from "react";

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { Toaster } from "sonner";

import Sidebar from "./components/layout/Sidebar.jsx";
import Footer from "./components/layout/Footer.jsx";

import Landing from "./pages/public/Landing.jsx";
import FeaturesPage from "./pages/public/FeaturesPage.jsx";
import HowItWorksPage from "./pages/public/HowItWorksPage.jsx";
import PricingPage from "./pages/public/PricingPage.jsx";

import AboutPage from "./pages/public/AboutPage.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";

import Dashboard from "./pages/deshboard/Dashboard.jsx";
import AIEditor from "./pages/deshboard/AIEditor.jsx";
import RepoAnalyzer from "./pages/deshboard/RepoAnalyzer.jsx";
import CodeConverter from "./pages/deshboard/CodeConverter.jsx";
import HistoryPage from "./pages/deshboard/HistoryPage.jsx";
import ReportsPage from "./pages/deshboard/ReportsPage.jsx";
import SnippetsPage from "./pages/deshboard/SnippetsPage.jsx";
import SettingsProfile from "./pages/deshboard/SettingsProfile.jsx";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const go = (page) => {
    const routes = {
      landing: "/",
      features: "/features",
      "how-it-works": "/how-it-works",
      pricing: "/pricing",
   
      about: "/about",

      login: "/login",
      signup: "/signup",

      dashboard: "/dashboard",
      editor: "/editor",
      repo: "/repository-analyzer",

      converter: "/code-converter",

      history: "/history",
      reports: "/reports",
      snippets: "/snippets",
      settings: "/settings",
      profile: "/profile",
    };

    navigate(routes[page] || "/");

    window.scrollTo(0, 0);

    setMobileOpen(false);
  };

  const publicRoutes = [
    "/",
    "/features",
    "/how-it-works",
    "/pricing",
    
    "/about",
    "/login",
    "/signup",
  ];

  const isPublicPage = publicRoutes.includes(location.pathname);

  const pathToNav = {
    "/dashboard": "dashboard",
    "/editor": "editor",
    "/repository-analyzer": "repo",

    "/code-converter": "converter",

    "/history": "history",
    "/reports": "reports",
    "/snippets": "snippets",
    "/settings": "settings",
    "/profile": "profile",
  };

  const activeNav = pathToNav[location.pathname];

  return (
    <>
      {isPublicPage ? (
        <>
          <Routes>
            <Route path="/" element={<Landing go={go} />} />

            <Route path="/features" element={<FeaturesPage go={go} />} />

            <Route path="/how-it-works" element={<HowItWorksPage go={go} />} />

            <Route path="/pricing" element={<PricingPage go={go} />} />

            

            <Route path="/about" element={<AboutPage go={go} />} />

            <Route path="/login" element={<Login go={go} />} />

            <Route path="/signup" element={<Signup go={go} />} />
          </Routes>

          {location.pathname !== "/login" &&
            location.pathname !== "/signup" && <Footer />}
        </>
      ) : (
        <div className="min-h-screen bg-[#0a0a12] text-white flex">
          <Sidebar
            active={activeNav}
            go={go}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <Routes>
            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={
                <Dashboard
                  go={go}
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* AI Editor */}

            <Route
              path="/editor"
              element={
                <AIEditor
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Repository Analyzer */}

            <Route
              path="/repository-analyzer"
              element={
                <RepoAnalyzer
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Code Converter */}

            <Route
              path="/code-converter"
              element={
                <CodeConverter
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Interview Prep */}

            {/* History */}

            <Route
              path="/history"
              element={
                <HistoryPage
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Reports */}

            <Route
              path="/reports"
              element={
                <ReportsPage
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Snippets */}

            <Route
              path="/snippets"
              element={
                <SnippetsPage
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Settings */}

            <Route
              path="/settings"
              element={
                <SettingsProfile
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />

            {/* Profile */}

            <Route
              path="/profile"
              element={
                <SettingsProfile
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
              }
            />
          </Routes>
        </div>
      )}

      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton={false}
        duration={2000}
        visibleToasts={3}
        expand={false}
      />
    </>
  );
}
