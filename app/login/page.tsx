"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import img1 from "@/app/assets/gallary3.png";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Email and password are required");
    }

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔥 IMPORTANT
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error("login failed")
      return setError(data.message || "Login failed");
    }

    // ✅ login success
    router.push("/dashboard/profile");
    toast.success("login successfully")
  };
  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 
      bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white"
    >
      {/* ================= LEFT ================= */}
      <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        {/* Badge */}
        <span
          className="mb-4 inline-flex w-fit items-center gap-2 
          rounded-full bg-cyan-500/10 px-4 py-1.5 
          text-xs font-semibold uppercase tracking-widest text-cyan-400"
        >
          Welcome Back
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Sign in to your account
        </h1>

        <p className="text-slate-400 mb-10 max-w-md text-sm sm:text-base">
          Secure access to laboratory services, reports, and proficiency
          testing.
        </p>

        {/* Card */}
        <div
          className="rounded-2xl bg-white/5 backdrop-blur-md 
          border border-white/10 p-6 sm:p-8 shadow-xl max-w-md"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <InputField
              label="Email Address"
              type="email"
              placeholder="lab@example.com"
               name="email"
              value={form.email}
              onChange={handleChange}
            />

            {/* Password */}
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            {/* Actions */}
            <div className="flex justify-end text-sm">
              <Link href="/forgot-password" className="text-cyan-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="text-sm text-red-400 font-medium">{error}</p>
            )}


            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r 
              from-cyan-400 to-cyan-500 py-3 font-bold text-[#08121f]
              hover:brightness-110 transition-all shadow-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Footer */}
            <p className="text-sm text-slate-400 text-center">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ================= RIGHT IMAGE ================= */}
      <div className="relative hidden lg:block">
        <Image
          src={img1}
          alt="Laboratory Environment"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0 
          bg-gradient-to-t from-black/70 via-black/40 to-black/20"
        />

        {/* Overlay Text */}
        <div className="absolute bottom-12 left-12 max-w-sm">
          <h3 className="text-2xl font-bold mb-2">
            Trusted Laboratory Platform
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Designed for compliance, accuracy, and operational excellence.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT FIELD ================= */

function InputField({
 label,
  type,
  placeholder,
  name,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label
        className="block mb-2 text-xs font-semibold 
        uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full rounded-lg bg-[#131b2e]
          border border-slate-700 px-4 py-3 pr-12 text-sm outline-none
          focus:ring-2 focus:ring-cyan-400 transition"
        />

        {isPassword && (
          <button
             type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 
            text-slate-400 hover:text-cyan-400 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
