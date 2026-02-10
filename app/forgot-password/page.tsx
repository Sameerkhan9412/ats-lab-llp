"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendOtp = async () => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white">
      <div className="bg-white/5 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        {!sent ? (
          <>
            <input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131b2e] p-3 rounded-lg mb-4"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-cyan-500 py-3 rounded-lg font-bold text-black"
            >
              Send OTP
            </button>
          </>
        ) : (
          <p className="text-green-400">
            OTP sent to your email. Check inbox.
          </p>
        )}
      </div>
    </div>
  );
}
