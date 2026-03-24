// app/admin/components/AdminSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/logo.jpg";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "PT Programs",
    href: "/admin/programs",
    icon: ClipboardList,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Enquiries",
    href: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    name: "Complaints",
    href: "/admin/complaints",
    icon: AlertTriangle,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  adminUser: {
    username: string;
    email: string;
  };
}

export default function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col bg-[#0a1628]/90 backdrop-blur-2xl border-r border-white/[0.06]">
      {/* Logo Section */}
      <div className="px-6 py-6">
        <Link href="/admin">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="ATAS Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                ATAS Laboratories LLP
              </h1>
              <p className="text-[10px] text-red-400 font-semibold tracking-widest uppercase">
                Admin Panel
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Admin Badge */}
      <div className="mx-4 mb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {adminUser.username || "Admin"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {adminUser.email}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-2">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-red-400/70">
          Management
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {adminLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          const Icon = link.icon;

          return (
            <div key={link.name} className="relative">
              <Link
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {/* Active background */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/15 to-orange-500/10 border border-red-500/20" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
                  </>
                )}

                {/* Hover background */}
                {!isActive && hoveredLink === link.name && (
                  <div className="absolute inset-0 rounded-xl bg-white/[0.03]" />
                )}

                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                      : "bg-white/[0.04] group-hover:bg-white/[0.06] text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="relative flex-1">{link.name}</span>

                {isActive && (
                  <ChevronRight className="relative w-3.5 h-3.5 text-red-500/60" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-0.5">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-3" />

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">User Dashboard</span>
        </Link>

        {/* Notifications */}
        <button className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all duration-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors">
            <Bell className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">Notifications</span>
          <span className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center">
            5
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/[0.06] group-hover:bg-red-500/[0.1] transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">Log Out</span>
        </button>
      </div>
    </aside>
  );
}