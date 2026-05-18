// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../api/auth";
import {
  IconChartLine, IconMail, IconLock, IconEye, IconEyeOff,
  IconWorld, IconCurrencyDollar, IconChartPie, IconEyeCheck,
  IconDownload, IconCircleCheck,
} from "@tabler/icons-react";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const verified = searchParams.get("verified");
  const justRegistered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await login(email, password);
      loginUser(data.accessToken, data.refreshToken, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <IconWorld size={18} />,          text: "ASX · NYSE · NASDAQ · NEPSE" },
    { icon: <IconCurrencyDollar size={18} />,  text: "AUD · USD · NPR with live FX" },
    { icon: <IconChartPie size={18} />,        text: "Portfolio tracking across 4 platforms" },
    { icon: <IconEyeCheck size={18} />,        text: "Watchlist with price alerts" },
    { icon: <IconDownload size={18} />,        text: "Export to Excel / CSV" },
  ];

  return (
    <div className="flex min-h-screen bg-[#162741]">

      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#1d3354] border-r border-white/10 p-10">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#00c896] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconChartLine size={28} color="#fff" />
          </div>
          <div className="text-xl font-semibold text-white">PortfolioTracker</div>
          <div className="text-xs text-[#5d7a9a] mt-1">Multi-exchange · Multi-currency</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
          {[{ val: "4", lbl: "Exchanges" }, { val: "3", lbl: "Currencies" }].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="text-4xl font-semibold font-mono text-[#00c896]">{s.val}</div>
              <div className="text-xs text-[#5d7a9a] mt-1">{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#8fa3bf]">
              <span className="text-[#00c896]">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[400px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="w-12 h-12 bg-[#00c896] rounded-xl flex items-center justify-center mb-5">
            <IconChartLine size={22} color="#fff" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
          <p className="text-xs text-[#5d7a9a] mb-6">Welcome back. Enter your credentials.</p>

          {/* ── Inline notifications ── */}
          {verified === "true" && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-400 mb-4 flex items-center gap-2">
              <IconCircleCheck size={14} />
              Email verified successfully. You can now sign in.
            </div>
          )}

          {justRegistered === "true" && (
            <div className="bg-[#00c896]/10 border border-[#00c896]/30 rounded-lg px-3 py-2 text-xs text-[#00c896] mb-4 flex items-center gap-2">
              <IconMail size={14} />
              Account created. Please check your email to verify your account.
            </div>
          )}

          {/* Error — amber for unverified, red for everything else */}
          {error && (
            <div className={`border rounded-lg px-3 py-2 text-xs mb-4 flex items-center gap-2 ${
              error.toLowerCase().includes("verify")
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              <IconMail size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                Email address
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition">
                <IconMail size={15} className="text-[#5d7a9a] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="bg-transparent outline-none text-white text-xs flex-1 placeholder:text-[#5d7a9a]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                Password
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition">
                <IconLock size={15} className="text-[#5d7a9a] shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-transparent outline-none text-white text-xs flex-1 placeholder:text-[#5d7a9a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-[#5d7a9a] hover:text-white transition shrink-0"
                >
                  {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 transition mt-1"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-[11px] text-[#5d7a9a] mt-4">
            No account?{" "}
            <Link to="/register" className="text-[#2e82d8] hover:underline">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  );
}