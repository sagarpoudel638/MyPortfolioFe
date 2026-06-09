// src/pages/auth/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IconChartLine, IconCircleCheck, IconCircleX, IconLoader2 } from "@tabler/icons-react";
import client from "../../api/client";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    client
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login?verified=true"), 2500);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Verification failed.";
        setStatus("error");
        setMessage(msg);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#162741] items-center justify-center p-8">
      <div className="w-full max-w-sm text-center">

        <div className="w-14 h-14 bg-[#00c896] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <IconChartLine size={28} color="#fff" />
        </div>

        {status === "verifying" && (
          <>
            <IconLoader2 size={40} className="text-[#2e82d8] animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Verifying your email...</h2>
            <p className="text-xs text-[#5d7a9a]">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <IconCircleCheck size={40} className="text-[#00c896] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Email verified!</h2>
            <p className="text-xs text-[#5d7a9a]">Redirecting you to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <IconCircleX size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">Verification failed</h2>
            <p className="text-xs text-[#5d7a9a] mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#1a6bbc] hover:bg-[#2e82d8] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Back to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}