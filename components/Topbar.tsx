"use client";

export default function Topbar() {
  return (
    <header className="h-16 px-6 border-b border-white/10
      flex items-center justify-between bg-[#0b1220]">
      
      <p className="text-sm text-slate-300">
        Welcome <span className="font-semibold text-white">
          WINMET TECHNOLOGIES PVT LTD
        </span>
      </p>

      <button
        className="px-4 py-2 rounded-lg bg-red-500/10
        text-red-400 text-sm font-semibold hover:bg-red-500/20"
      >
        Log Out
      </button>
    </header>
  );
}
