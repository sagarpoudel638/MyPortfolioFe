// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { IconChartLine, IconMail, IconArrowLeft } from "@tabler/icons-react";
import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#162741] items-center justify-center p-8">
      <div className="w-full max-w-sm">

        <div className="w-12 h-12 bg-[#00c896] rounded-xl flex items-center justify-center mb-5">
          <IconChartLine size={22} color="#fff" />
        </div>

        {submitted ? (
          // ── Success state ────────────────────────────────────────────────
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
            <p className="text-xs text-[#5d7a9a] mb-6">
              If <span className="text-white">{email}</span> has an account,
              you'll receive a reset link shortly. Check your spam folder if
              you don't see it.
            </p>
            <div className="bg-[#00c896]/10 border border-[#00c896]/30 rounded-lg px-4 py-3 text-xs text-[#00c896] mb-6">
              The link expires in 1 hour.
            </div>
            <Link
              to="/login"
              className="flex items-center gap-2 text-xs text-[#2e82d8] hover:underline"
            >
              <IconArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        ) : (
          // ── Form state ───────────────────────────────────────────────────
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Forgot password?</h2>
            <p className="text-xs text-[#5d7a9a] mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-400 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <Link
              to="/login"
              className="flex items-center gap-2 text-xs text-[#5d7a9a] hover:text-white mt-5 transition"
            >
              <IconArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}