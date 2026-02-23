"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Send,
  PlusCircle,
  Download,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  PackageCheck,
  ExternalLink,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

export default function DashboardHome() {
  const [companyName, setCompanyName] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        if (data?.profile?.participant?.name) {
          setCompanyName(data.profile.participant.name);
        }
      } catch (err) {
        console.error("Failed to load profile");
      }
    };
    fetchProfile();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleAddPts = () => router.push("/dashboard/admin/pt-programs");
  const handleBuyPT = () => router.push("/dashboard/pt-programs");

  return (
    <div
      className={`space-y-8 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ─── WELCOME HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 font-medium">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {companyName || "Loading..."}
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your PT programs today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              icon: FileText,
              label: "Procedure For Downloading",
            },
            { icon: BookOpen, label: "View User Manual" },
            {
              icon: PackageCheck,
              label: "PT Item Receiving",
            },
          ].map((item) => (
            <button
              key={item.label}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300"
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
              <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>
          ))}

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 hover:border-[#00B4D8]/30 transition-all duration-300">
            <Eye className="w-3.5 h-3.5" />
            View Lab Details
          </button>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: "24",
            change: "+12%",
            icon: ShoppingCart,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
          },
          {
            label: "Active PTs",
            value: "8",
            change: "+3",
            icon: TrendingUp,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
          },
          {
            label: "Pending Results",
            value: "3",
            change: "Due soon",
            icon: Clock,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
          },
          {
            label: "Completed",
            value: "13",
            change: "This year",
            icon: CheckCircle2,
            gradient: "from-violet-600 to-violet-400",
            glow: "#a78bfa",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-500 cursor-default"
          >
            {/* Hover glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
              style={{ backgroundColor: stat.glow + "15" }}
            />

            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                    {stat.change}
                  </span>
                </div>
              </div>

              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                style={{
                  boxShadow: `0 8px 32px ${stat.glow}20`,
                }}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ACTION BUTTONS ─── */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleBuyPT}
          className="group relative flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy New PT
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </button>

        <button className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-sm hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          <Send className="w-4 h-4" />
          Online Submission
        </button>

        <button
          onClick={handleAddPts}
          className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold text-sm hover:bg-violet-500/15 hover:border-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4" />
          Add PTs
        </button>

        <button className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold text-sm hover:bg-amber-500/15 hover:border-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          <Download className="w-4 h-4" />
          My Downloads
        </button>
      </div>

      {/* ─── ORDERS TABLE SECTION ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <p className="text-xs text-slate-500">
              Track and manage your PT program orders
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06] p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3 relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-3 relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders, programs..."
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-2">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white rounded-xl py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all duration-300">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
          {/* Table glow accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {[
                    "S No",
                    "Order ID",
                    "Order Date",
                    "Order Status",
                    "Payment",
                    "PT Programs",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {[
                  {
                    sno: 1,
                    orderId: "19384",
                    date: "12/09/2025",
                    status: "Under Performance Evaluation",
                    statusColor: "amber",
                    payment: "Paid",
                    paymentColor: "emerald",
                    program: "Metals in Soil",
                    code: "PTW/MSOIL/785/2025",
                  },
                  {
                    sno: 2,
                    orderId: "19261",
                    date: "08/07/2025",
                    status: "Results Published",
                    statusColor: "emerald",
                    payment: "Paid",
                    paymentColor: "emerald",
                    program: "Water Testing",
                    code: "PTW/WATR/612/2025",
                  },
                  {
                    sno: 3,
                    orderId: "19102",
                    date: "15/05/2025",
                    status: "Awaiting Submission",
                    statusColor: "red",
                    payment: "Pending",
                    paymentColor: "amber",
                    program: "Food Microbiology",
                    code: "PTW/FMICRO/443/2025",
                  },
                ].map((row) => (
                  <tr
                    key={row.sno}
                    className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <span className="text-slate-500 font-mono text-xs">
                        {String(row.sno).padStart(2, "0")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-white">
                        #{row.orderId}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-400">{row.date}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                        ${
                          row.statusColor === "amber"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : row.statusColor === "emerald"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {row.statusColor === "amber" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {row.statusColor === "emerald" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {row.statusColor === "red" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {row.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
                        ${
                          row.paymentColor === "emerald"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            row.paymentColor === "emerald"
                              ? "bg-emerald-400"
                              : "bg-amber-400 animate-pulse"
                          }`}
                        />
                        {row.payment}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-slate-200 font-medium">
                          {row.program}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {row.code}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-200">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-medium">1 to 3</span> of{" "}
              <span className="text-slate-300 font-medium">3</span> entries
            </p>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all">
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20">
                1
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all">
                2
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all">
                3
              </button>

              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}