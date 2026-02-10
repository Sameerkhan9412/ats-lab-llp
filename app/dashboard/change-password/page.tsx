"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#020617] px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Change Password</h1>
          <p className="text-sm text-slate-400">
            Update your account password securely
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-xl shadow-xl p-6 md:p-8">

          <div className="space-y-5">

            {/* CURRENT PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={show ? "text" : "password"}
                  className="w-full rounded-lg border px-10 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={show ? "text" : "password"}
                  className="w-full rounded-lg border px-10 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Create new password"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Minimum 8 characters, at least 1 number & 1 special character
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={show ? "text" : "password"}
                  className="w-full rounded-lg border px-10 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Re-enter new password"
                />

                {/* TOGGLE */}
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                className="
                  w-full sm:w-auto
                  rounded-lg bg-teal-500 px-6 py-2.5
                  text-sm font-semibold text-black
                  hover:bg-teal-400 transition
                "
              >
                Update Password
              </button>

              <button
                type="button"
                className="
                  w-full sm:w-auto
                  rounded-lg border border-slate-300
                  px-6 py-2.5 text-sm font-semibold
                  text-slate-700 hover:bg-slate-100
                "
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
