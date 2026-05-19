// src/pages/auth/ResetPasswordPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  IconChartLine, IconLock, IconEye, IconEyeOff,
  IconCircleCheck, IconArrowLeft,
} from "@tabler/icons-react";
import { resetPassword } from "../../api/auth";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get("token");

  const [form, setForm]           = useState({ password: "", confirm: "" });
  const [showPassword, setShow]   = useState(false);
  const [showConfirm, setShowC]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState(null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)  return { label: "Weak",   color: "text-red-400",    width: "w-1/4",  bar: "bg-red-400"    };
    if (p.length < 8)  return { label: "Fair",   color: "text-amber-400",  width: "w-2/4",  bar: "bg-amber-400"  };
    if (p.length < 12) return { label: "Good",   color: "text-[#00c896]",  width: "w-3/4",  bar: "bg-[#00c896]"  };
    return               { label: "Strong", color: "text-[#00c896]",  width: "w-full", bar: "bg-[#00c896]"  };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

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
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login?reset=true"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen bg-[#162741] items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-[#00c896] rounded-xl flex items-center justify-center mx-auto mb-5">
            <IconChartLine size={22} color="#fff" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Invalid link</h2>
          <p className="text-xs text-[#5d7a9a] mb-5">
            This reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-xs text-[#2e82d8] hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#162741] items-center justify-center p-8">
      <div className="w-full max-w-sm">

        <div className="w-12 h-12 bg-[#00c896] rounded-xl flex items-center justify-center mb-5">
          <IconChartLine size={22} color="#fff" />
        </div>

        {success ? (
          <div className="text-center">
            <IconCircleCheck size={40} className="text-[#00c896] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Password reset!</h2>
            <p className="text-xs text-[#5d7a9a]">
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-1">Set new password</h2>
            <p className="text-xs text-[#5d7a9a] mb-6">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-400 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* New password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                  New Password
                </label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-[#2e82d8] transition">
                  <IconLock size={15} className="text-[#5d7a9a] shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="bg-transparent outline-none text-white text-xs flex-1 placeholder:text-[#5d7a9a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((p) => !p)}
                    className="text-[#5d7a9a] hover:text-white transition shrink-0"
                  >
                    {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>

                {strength && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-1 rounded-full transition-all duration-300 ${strength.width} ${strength.bar}`} />
                    </div>
                    <p className={`text-[10px] mt-1 ${strength.color}`}>{strength.label} password</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#8fa3bf] uppercase tracking-wide">
                  Confirm Password
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
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => set("confirm", e.target.value)}
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
                      onClick={() => setShowC((p) => !p)}
                      className="text-[#5d7a9a] hover:text-white transition"
                    >
                      {showConfirm ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a6bbc] hover:bg-[#2e82d8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg py-2.5 transition mt-1"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

            </form>

            <Link
              to="/login"
              className="flex items-center gap-2 text-xs text-[#5d7a9a] hover:text-white mt-5 transition"
            >
              <IconArrowLeft size={14} />
              Back to login
            </Link>
          </>
        )}

      </div>
    </div>
  );
}