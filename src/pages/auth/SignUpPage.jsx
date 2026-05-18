// src/pages/auth/SignUpPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconChartLine, IconMail, IconLock, IconEye, IconEyeOff,
  IconUser, IconWorld, IconCurrencyDollar, IconChartPie,
  IconEyeCheck, IconDownload, IconCircleCheck,
} from "@tabler/icons-react";
import { register } from "../../api/auth";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/login?registered=true");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "text-red-400", width: "w-1/4" };
    if (p.length < 8) return { label: "Fair", color: "text-amber-400", width: "w-2/4" };
    if (p.length < 12) return { label: "Good", color: "text-[#00c896]", width: "w-3/4" };
    return { label: "Strong", color: "text-[#00c896]", width: "w-full" };
  };

  const strength = passwordStrength();

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
      <div className="w-full md:w-[420px] flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-sm py-6">

          <div className="w-12 h-12 bg-[#00c896] rounded-xl flex items-center justify-center mb-5">
            <IconChartLine size={22} color="#fff" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
          <p className="text-xs text-[#5d7a9a] mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2e82d8] hover:underline">Sign in</Link>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-400 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                Full name
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition">
                <IconUser size={15} className="text-[#5d7a9a] shrink-0" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-transparent outline-none text-white text-xs flex-1 placeholder:text-[#5d7a9a]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                Email address
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition">
                <IconMail size={15} className="text-[#5d7a9a] shrink-0" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
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

              {/* Password strength */}
              {strength && (
                <div className="mt-1.5">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-1 rounded-full transition-all duration-300 ${strength.width} ${
                      strength.label === "Weak" ? "bg-red-400" :
                      strength.label === "Fair" ? "bg-amber-400" : "bg-[#00c896]"
                    }`} />
                  </div>
                  <p className={`text-[10px] mt-1 ${strength.color}`}>{strength.label} password</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                Confirm password
              </label>
              <div className={`flex items-center gap-2 bg-white/5 border rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition ${
                form.confirm && form.confirm !== form.password
                  ? "border-red-500/50"
                  : form.confirm && form.confirm === form.password
                  ? "border-emerald-500/50"
                  : "border-white/10"
              }`}>
                <IconLock size={15} className="text-[#5d7a9a] shrink-0" />
                <input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="bg-transparent outline-none text-white text-xs flex-1 placeholder:text-[#5d7a9a]"
                />
                <div className="flex items-center gap-1 shrink-0">
                  {form.confirm && form.confirm === form.password && (
                    <IconCircleCheck size={14} className="text-emerald-400" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="text-[#5d7a9a] hover:text-white transition"
                  >
                    {showConfirm ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 transition mt-1"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-[10px] text-[#5d7a9a] mt-5">
            By creating an account you agree to our terms. A verification email will be sent to confirm your address.
          </p>

        </div>
      </div>

    </div>
  );
}