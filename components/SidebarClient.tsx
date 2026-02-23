"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import {
  Home,
  UserCog,
  HelpCircle,
  AlertTriangle,
  MapPin,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Lock,
  Zap,
  LogOut,
  Settings,
  Bell,
  Shield,
} from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/logo.jpg";


const links = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  { name: "My Enquiry", href: "/dashboard/enquiry", icon: HelpCircle },
  {
    name: "Raise Complaints",
    href: "/dashboard/complaints",
    icon: AlertTriangle,
  },
  // { name: "Add Locations", href: "/dashboard/locations", icon: MapPin },
  { name: "My Orders", href: "/dashboard/my-orders", icon: ShoppingBag },
  {
    name: "Payment History",
    href: "/dashboard/payment-history",
    icon: CreditCard,
  },
];

export default function SidebarClient({
  profileCompleted,
  completionPercent,
}: {
  profileCompleted: boolean;
  completionPercent: number;
}) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col bg-[#0a1628]/80 backdrop-blur-2xl border-r border-white/[0.06]">
      {/* Logo Section */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          {/* <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
              <Zap className="w-5 h-5 text-white" />

            </div> */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a1628]" />
          </div>
          <Link href="/">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex gap-2 items-center">
              <Image src={logo} alt="ATS Logo" className="w-9 h-9" />
              <div>
              <span>
                ATAS Laboratories LLP
                </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
              Dashboard
            </p>
              </div>
            </h1>
            </Link>
          
          </div>
        {/* </div> */}

      {/* Profile Completion Warning */}
      {!profileCompleted && (
        <div className="mx-4 mb-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0A3D62]/40 to-[#00B4D8]/10 border border-[#00B4D8]/20 p-4">
            {/* Animated shimmer */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,180,216,0.05), transparent)",
                }}
              />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span className="text-xs font-semibold text-[#90E0EF]">
                  Complete Your Profile
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                Unlock all features by completing your profile setup.
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] to-[#90E0EF] transition-all duration-1000 ease-out relative"
                    style={{ width: `${completionPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00B4D8] tabular-nums">
                  {completionPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-6 mb-2">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-600">
          Navigation
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {links.map((l) => {
          const isActive =
            pathname === l.href ||
            (l.href !== "/dashboard" && pathname.startsWith(l.href));

          const disabled =
            !profileCompleted && l.href !== "/dashboard/profile";

          const Icon = l.icon;

          return (
            <div key={l.name} className="relative">
              {disabled ? (
                <button
                  onClick={() =>
                    toast.error(
                      "Please complete your profile to access this module",
                      {
                        style: {
                          background: "#0f172a",
                          color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.2)",
                        },
                        icon: "🔒",
                      }
                    )
                  }
                  onMouseEnter={() => setHoveredLink(l.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 cursor-not-allowed transition-all duration-200 hover:bg-white/[0.02]"
                >
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03]">
                    <Icon className="w-4 h-4" />
                    <Lock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-slate-600" />
                  </div>
                  <span className="flex-1 text-left">{l.name}</span>
                </button>
              ) : (
                <Link
                  href={l.href}
                  onMouseEnter={() => setHoveredLink(l.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {/* Active background */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00B4D8]/15 to-[#0A3D62]/10 border border-[#00B4D8]/20" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#00B4D8] shadow-[0_0_12px_rgba(0,180,216,0.5)]" />
                    </>
                  )}

                  {/* Hover background */}
                  {!isActive && hoveredLink === l.name && (
                    <div className="absolute inset-0 rounded-xl bg-white/[0.03]" />
                  )}

                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#00B4D8]/20 text-[#00B4D8] shadow-[0_0_20px_rgba(0,180,216,0.15)]"
                        : "bg-white/[0.04] group-hover:bg-white/[0.06] text-slate-400 group-hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="relative flex-1">{l.name}</span>

                  {isActive && (
                    <ChevronRight className="relative w-3.5 h-3.5 text-[#00B4D8]/60" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-0.5">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-3" />

        <button className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all duration-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors">
            <Bell className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">Notifications</span>
          <span className="w-5 h-5 rounded-md bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        <button className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all duration-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors">
            <Settings className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">Settings</span>
        </button>

        <button className="group flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/[0.06] group-hover:bg-red-500/[0.1] transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">Log Out</span>
        </button>
      </div>
    </aside>
  );
}