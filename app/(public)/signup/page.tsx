"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import img from "@/app/assets/gallary1.png";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    signupFor: "Proficiency Testing",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { username, email, signupFor, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, signupFor }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error("signup failed")
      return setError(data.message || "Signup failed");
    }

    router.push(`/otp?email=${email}`);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#0b1220] text-white">
      {/* ================= LEFT FORM ================= */}
      <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-16">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full 
          bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Create Account
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Register Your Account
        </h1>

        <p className="text-slate-400 mb-10 max-w-md text-sm sm:text-base">
          Register your laboratory or organization to access testing services,
          reports, and compliance programs.
        </p>

        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
          p-6 sm:p-8 shadow-xl max-w-md">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              label="Username"
              placeholder="lab_admin"
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
            />

            <InputField
              label="Email Address"
              placeholder="lab@example.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />

            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Signup For
              </label>
              <select
                name="signupFor"
                value={form.signupFor}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#131b2e]
                border border-slate-700 px-4 py-3 text-sm outline-none
                focus:ring-2 focus:ring-cyan-400"
              >
                <option>Proficiency Testing</option>
                <option>Reference Testing</option>
              </select>
            </div>

            <InputField
              label="Password"
              placeholder="Create password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
            />

            <InputField
              label="Confirm Password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
            />

            {error && (
              <p className="text-sm text-red-400 font-medium">{error}</p>
            )}

            <button
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-gradient-to-r 
              from-cyan-400 to-cyan-500 py-3 font-bold text-[#08121f]
              hover:brightness-110 transition-all shadow-lg disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ================= RIGHT IMAGE ================= */}
      <div className="relative hidden lg:block">
        <Image src={img} alt="Laboratory Environment" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function InputField({
  label,
  placeholder,
  type,
  name,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
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
          focus:ring-2 focus:ring-cyan-400"
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
