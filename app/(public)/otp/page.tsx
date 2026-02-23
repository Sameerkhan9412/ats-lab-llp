"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const params = useSearchParams();
  const email = params.get("email")!;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const handleChange = (value: string, index: number) => {
  if (!/^\d?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // auto focus next
  if (value && index < otp.length - 1) {
    const next = document.getElementById(`otp-${index + 1}`);
    next?.focus();
  }
};


  const handleVerify = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp: otp.join("") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error("verification failed try again")
      return setMessage(data.message)
    };
    toast.success("signup successfully")
    window.location.href = "/dashboard/profile";
  };

  const resendOtp = async () => {
    setMessage("");
    await fetch("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setMessage("OTP sent again to your email");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white px-6"
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-md
        border border-white/10 p-8 shadow-2xl"
      >
        {/* Header */}
        <span
          className="inline-flex items-center gap-2 rounded-full
          bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold
          uppercase tracking-widest text-cyan-400 mb-4"
        >
          OTP Verification
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-3">
          Verify your email
        </h1>

        <p className="text-slate-400 text-sm mb-8">
          We’ve sent a 6-digit verification code to your registered email
          address.
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-3 mb-6">
  {otp.map((v, i) => (
    <input
      key={i}
      id={`otp-${i}`}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={v}
      onChange={(e) => handleChange(e.target.value, i)}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) {
          const prev = document.getElementById(`otp-${i - 1}`);
          prev?.focus();
        }
      }}
      className="w-12 h-12 text-center text-lg font-bold
      bg-[#131b2e] border border-slate-700 rounded-lg
      focus:ring-2 focus:ring-cyan-400 outline-none"
    />
  ))}
</div>


        {/* Verify Button */}
        <button
          className="w-full rounded-lg bg-gradient-to-r
          from-cyan-400 to-cyan-500 py-3 font-bold
          text-[#08121f] hover:brightness-110
          transition shadow-lg"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <button
            className="text-cyan-400 hover:underline font-semibold"
            onClick={resendOtp}
          >
            Resend OTP
          </button>

          <Link
            href="/login"
            className="text-slate-400 hover:text-cyan-400 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
