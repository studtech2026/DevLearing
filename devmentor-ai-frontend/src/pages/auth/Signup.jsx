import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import Logo from "../../components/common/Logo.jsx";
import AuthShell from "../../components/auth/AuthShell.jsx";

export default function Signup({ go }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="text-2xl" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-white">
          Create an Account 🚀
        </h2>

        <p className="text-center text-gray-400 mt-2 mb-8">
          Start your AI-powered coding journey
        </p>

        {/* Google Signup */}
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

        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[#0F1322] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition text-white"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-[#0F1322] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition text-white"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm text-gray-300 mb-2">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#0F1322] border border-white/10 rounded-xl px-4 py-3 pr-12 outline-none focus:border-purple-500 transition text-white"
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

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#0F1322] border border-white/10 rounded-xl px-4 py-3 pr-12 outline-none focus:border-purple-500 transition text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 text-sm text-gray-400 mb-8">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="accent-purple-600 mt-1"
          />

          <span>
            I agree to the{" "}
            <button
              type="button"
              className="text-purple-400 hover:text-purple-300"
            >
              Terms & Conditions
            </button>
          </span>
        </label>

        {/* Signup Button */}
        <button
          onClick={() => go("dashboard")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-semibold hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-8">
          Already have an account?
          <button
            onClick={() => go("login")}
            className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
