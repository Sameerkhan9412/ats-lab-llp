// app/admin/components/AdminHeader.tsx

"use client";

import { useState } from "react";
import { Search, Bell, Settings, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  adminUser: {
    username: string;
    email: string;
  };
}

export default function AdminHeader({ adminUser }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, orders, programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1a2d]/60 border border-white/[0.06] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 mr-4 px-4 py-2 rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06]">
            <div className="text-center">
              <p className="text-xs text-slate-500">Today's Orders</p>
              <p className="text-sm font-bold text-white">12</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-slate-500">New Users</p>
              <p className="text-sm font-bold text-emerald-400">+5</p>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-sm font-bold text-amber-400">3</p>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-[#0d1a2d]/60 border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.1] transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white">
              5
            </span>
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl bg-[#0d1a2d]/60 border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.1] transition-all">
            <Settings className="w-5 h-5" />
          </button>

          {/* Admin Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {adminUser.username?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}