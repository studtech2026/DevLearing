import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import Logo from "../../components/common/Logo.jsx";
import AuthShell from "../../components/auth/AuthShell.jsx";

export default function Login({ go }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <AuthShell>
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}

        <div className="flex justify-center mb-6">
          <Logo size="text-2xl" />
        </div>

        {/* Heading */}

        <h2 className="text-3xl font-bold text-center text-white">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-8">
          Login to continue your coding journey
        </p>

        {/* Google Login */}

        <button
          className="w-full flex items-center justify-center gap-3
          bg-[#0B0D17]
          border border-white/10
          rounded-xl
          py-3
          hover:border-purple-500
          hover:bg-[#151826]
          transition-all duration-300"
        >
          <FcGoogle size={24} />

          <span className="font-medium text-white">Continue with Google</span>
        </button>

        {/* Divider */}

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>

          <span className="px-4 text-xs tracking-[4px] text-gray-500">OR</span>

          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Email */}

        <div className="mb-5">
          <label className="text-sm text-gray-300 mb-2 block">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl
            bg-[#0F1322]
            border border-white/10
            px-4
            py-3
            outline-none
            focus:border-purple-500
            transition text-white"
          />
        </div>

        {/* Password */}

        <div className="mb-2">
          <label className="text-sm text-gray-300 mb-2 block">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl
              bg-[#0F1322]
              border border-white/10
              px-4
              py-3
              pr-12
              outline-none
              focus:border-purple-500
              transition text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember */}

        <div className="flex items-center justify-between mb-8">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-purple-600"
            />
            Remember me
          </label>

          <button className="text-purple-400 hover:text-purple-300 text-sm">
            Forgot Password?
          </button>
        </div>

        {/* Login */}

        <button
          onClick={() => go("dashboard")}
          className="
          w-full
          py-3
          rounded-xl
          bg-gradient-to-r
          from-purple-600
          to-fuchsia-600
          font-semibold
          hover:scale-[1.02]
          hover:shadow-xl
          hover:shadow-purple-500/30
          transition-all
          duration-300"
        >
          Login
        </button>

        {/* Footer */}

        <p className="text-center text-gray-400 mt-8">
          Don't have an account?
          <button
            onClick={() => go("signup")}
            className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
