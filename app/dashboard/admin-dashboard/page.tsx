// app/dashboard/admin/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserPlus,
  ClipboardList,
  FileText,
  Activity,
  BarChart3,
  Shield,
  RefreshCw,
  ExternalLink,
  Package,
  CreditCard,
  UserCheck,
  Settings,
  Bell,
  Filter,
  Download,
  Zap,
  Globe,
  Server,
  Database,
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"activities" | "users" | "orders">("activities");
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Navigate functions
  const handleManageUsers = () => router.push("/dashboard/admin/users");
  const handlePTBookings = () => router.push("/dashboard/admin/bookings");
  const handlePTPrograms = () => router.push("/dashboard/admin/programs");
  const handleAnalytics = () => router.push("/dashboard/admin/analytics");
  const handleResultSubmission = () => router.push("/dashboard/admin/result-submission");

  return (
    <div
      className={`space-y-8 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ─── ADMIN WELCOME HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-red-400">Admin Panel</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">System Online</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back! Here&apos;s an overview of ATAS Laboratories LLP system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              5
            </span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 hover:border-[#00B4D8]/30 transition-all duration-300">
            <Settings className="w-3.5 h-3.5" />
            System Settings
          </button>
        </div>
      </div>

      {/* ─── MAIN STATS CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: "1,284",
            change: "+8.2%",
            changeType: "up",
            subtext: "32 new this week",
            icon: Users,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
          },
          {
            label: "Total Orders",
            value: "856",
            change: "+12.5%",
            changeType: "up",
            subtext: "89 orders this month",
            icon: ShoppingBag,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
          },
          {
            label: "Revenue",
            value: "₹24.5L",
            change: "+18.3%",
            changeType: "up",
            subtext: "₹3.2L this week",
            icon: DollarSign,
            gradient: "from-violet-600 to-violet-400",
            glow: "#a78bfa",
          },
          {
            label: "Active PT Programs",
            value: "42",
            change: "+5",
            changeType: "up",
            subtext: "8 ending soon",
            icon: Activity,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
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
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                        stat.changeType === "up"
                          ? "text-emerald-400/80 bg-emerald-400/10"
                          : "text-red-400/80 bg-red-400/10"
                      }`}
                    >
                      {stat.changeType === "up" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-[10px] text-slate-600">vs last month</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{stat.subtext}</p>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
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

      {/* ─── SECONDARY STATS ROW ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Pending Orders", value: "12", icon: Clock, color: "amber" },
          { label: "Awaiting Results", value: "28", icon: FileText, color: "blue" },
          { label: "Payment Pending", value: "8", icon: CreditCard, color: "red" },
          { label: "Results Published", value: "156", icon: CheckCircle2, color: "emerald" },
          { label: "New Enquiries", value: "7", icon: Mail, color: "violet" },
          { label: "Complaints", value: "3", icon: AlertTriangle, color: "orange" },
        ].map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                <p className="text-xl font-bold text-white">{item.value}</p>
              </div>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110
                  ${item.color === "amber" ? "bg-amber-500/10 text-amber-400" : ""}
                  ${item.color === "blue" ? "bg-[#00B4D8]/10 text-[#00B4D8]" : ""}
                  ${item.color === "red" ? "bg-red-500/10 text-red-400" : ""}
                  ${item.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" : ""}
                  ${item.color === "violet" ? "bg-violet-500/10 text-violet-400" : ""}
                  ${item.color === "orange" ? "bg-orange-500/10 text-orange-400" : ""}
                `}
              >
                <item.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── MAIN CONTENT GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-2">
            {[
              {
                icon: UserPlus,
                label: "Add New User",
                description: "Register new laboratory",
                onClick: handleManageUsers,
                color: "blue",
              },
              {
                icon: ClipboardList,
                label: "Create PT Program",
                description: "Setup new program",
                onClick: handlePTPrograms,
                color: "violet",
              },
              {
                icon: Package,
                label: "Process Bookings",
                description: "12 pending bookings",
                onClick: handlePTBookings,
                color: "emerald",
              },
              {
                icon: UserCheck,
                label: "Review Submissions",
                description: "28 awaiting review",
                onClick: handleResultSubmission,
                color: "amber",
              },
              {
                icon: BarChart3,
                label: "View Analytics",
                description: "Performance metrics",
                onClick: handleAnalytics,
                color: "cyan",
              },
              {
                icon: FileText,
                label: "Generate Reports",
                description: "Export system data",
                onClick: () => {},
                color: "red",
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="group flex items-center w-full gap-3 p-3 rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] hover:border-white/[0.1] hover:bg-[#0d1a2d]/60 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                    ${action.color === "blue" ? "bg-[#00B4D8]/10 text-[#00B4D8] group-hover:bg-[#00B4D8]/20" : ""}
                    ${action.color === "violet" ? "bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20" : ""}
                    ${action.color === "emerald" ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20" : ""}
                    ${action.color === "amber" ? "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20" : ""}
                    ${action.color === "cyan" ? "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20" : ""}
                    ${action.color === "red" ? "bg-red-500/10 text-red-400 group-hover:bg-red-500/20" : ""}
                  `}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{action.description}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* System Status & Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* System Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">System Status</h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Server Status", status: "Online", icon: Server, color: "emerald" },
                { label: "Database", status: "Healthy", icon: Database, color: "emerald" },
                { label: "API Response", status: "45ms", icon: Zap, color: "emerald" },
                { label: "Uptime", status: "99.9%", icon: Globe, color: "emerald" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    <p className="text-[10px] text-slate-500">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-sm font-semibold text-emerald-400">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Weekly Activity Overview</h3>
              <select className="bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-[#00B4D8]/30">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Chart bars */}
            <div className="flex items-end justify-between gap-3 h-40 mb-4">
              {[
                { day: "Mon", orders: 65, submissions: 45 },
                { day: "Tue", orders: 80, submissions: 60 },
                { day: "Wed", orders: 45, submissions: 35 },
                { day: "Thu", orders: 90, submissions: 70 },
                { day: "Fri", orders: 70, submissions: 55 },
                { day: "Sat", orders: 40, submissions: 30 },
                { day: "Sun", orders: 55, submissions: 40 },
              ].map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end h-32">
                    <div
                      className="flex-1 bg-gradient-to-t from-[#00B4D8]/30 to-[#00B4D8]/60 rounded-t-md transition-all duration-500 hover:from-[#00B4D8]/50 hover:to-[#00B4D8]/80"
                      style={{ height: `${data.orders}%` }}
                    />
                    <div
                      className="flex-1 bg-gradient-to-t from-emerald-500/30 to-emerald-400/60 rounded-t-md transition-all duration-500 hover:from-emerald-500/50 hover:to-emerald-400/80"
                      style={{ height: `${data.submissions}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">{data.day}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#00B4D8]/60" />
                <span className="text-xs text-slate-400">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-400/60" />
                <span className="text-xs text-slate-400">Submissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RECENT ACTIVITIES TABLE ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
            <p className="text-xs text-slate-500">
              Latest system activities and user actions
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-2 p-1 bg-[#0d1a2d]/60 rounded-xl border border-white/[0.06]">
            {[
              { id: "activities", label: "All Activities" },
              { id: "users", label: "New Users" },
              { id: "orders", label: "Recent Orders" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4">
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
                placeholder="Search users, orders, programs..."
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
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["User / Lab", "Action", "Program", "Status", "Time", ""].map((h) => (
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
                    user: "ABC Labs Pvt Ltd",
                    email: "abc@labs.com",
                    avatar: "A",
                    action: "Submitted Results",
                    program: "Metals in Soil",
                    code: "PTW/MSOIL/785/2025",
                    status: "Completed",
                    statusColor: "emerald",
                    time: "2 mins ago",
                  },
                  {
                    user: "XYZ Testing Center",
                    email: "xyz@testing.com",
                    avatar: "X",
                    action: "New Order Placed",
                    program: "Water Testing",
                    code: "PTW/WATR/612/2025",
                    status: "Pending Review",
                    statusColor: "amber",
                    time: "15 mins ago",
                  },
                  {
                    user: "Quality Labs",
                    email: "quality@labs.in",
                    avatar: "Q",
                    action: "Payment Received",
                    program: "Food Microbiology",
                    code: "PTW/FMICRO/443/2025",
                    status: "Processing",
                    statusColor: "blue",
                    time: "1 hour ago",
                  },
                  {
                    user: "Metro Diagnostics",
                    email: "metro@diag.com",
                    avatar: "M",
                    action: "Profile Updated",
                    program: "-",
                    code: "-",
                    status: "Info",
                    statusColor: "slate",
                    time: "2 hours ago",
                  },
                  {
                    user: "National Lab Services",
                    email: "nls@services.com",
                    avatar: "N",
                    action: "Result Rejected",
                    program: "Air Quality Testing",
                    code: "PTW/AQT/321/2025",
                    status: "Action Required",
                    statusColor: "red",
                    time: "3 hours ago",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center text-sm font-bold text-[#00B4D8]">
                          {row.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{row.user}</p>
                          <p className="text-[11px] text-slate-500">{row.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-300">{row.action}</td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-slate-200 font-medium">{row.program}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{row.code}</p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                          ${row.statusColor === "amber" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : ""}
                          ${row.statusColor === "emerald" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : ""}
                          ${row.statusColor === "red" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ""}
                          ${row.statusColor === "blue" ? "bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20" : ""}
                          ${row.statusColor === "slate" ? "bg-slate-500/10 text-slate-400 border border-slate-500/20" : ""}
                        `}
                      >
                        {row.statusColor === "amber" && <Clock className="w-3 h-3" />}
                        {row.statusColor === "emerald" && <CheckCircle2 className="w-3 h-3" />}
                        {row.statusColor === "red" && <AlertCircle className="w-3 h-3" />}
                        {row.statusColor === "blue" && <RefreshCw className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500 text-xs">{row.time}</td>

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
              Showing <span className="text-slate-300 font-medium">1 to 5</span> of{" "}
              <span className="text-slate-300 font-medium">248</span> activities
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
              <span className="px-2 text-slate-600">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all">
                50
              </button>

              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all">
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM SECTION: RECENT USERS & PENDING APPROVALS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recently Registered</h2>
            <button
              onClick={handleManageUsers}
              className="text-xs text-[#00B4D8] hover:text-[#90E0EF] font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {[
              { name: "Enviro Test Labs", email: "enviro@testlabs.com", time: "Today, 10:30 AM", status: "pending" },
              { name: "BioAnalytica Pvt Ltd", email: "bio@analytica.in", time: "Today, 08:15 AM", status: "approved" },
              { name: "Precision Labs", email: "info@precision.com", time: "Yesterday", status: "approved" },
              { name: "SafeFood Testing", email: "contact@safefood.co", time: "Yesterday", status: "pending" },
            ].map((user, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/20 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">{user.time}</p>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      user.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {user.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Pending Approvals</h2>
            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg font-medium">
              4 Items
            </span>
          </div>

          <div className="space-y-2">
            {[
              { type: "Result Submission", lab: "ABC Labs", program: "Metals in Water", urgency: "high" },
              { type: "Profile Update", lab: "XYZ Testing", program: "-", urgency: "low" },
              { type: "Payment Verification", lab: "Quality Labs", program: "Food Testing", urgency: "medium" },
              { type: "New Registration", lab: "Metro Diagnostics", program: "-", urgency: "medium" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-full min-h-[40px] rounded-full ${
                      item.urgency === "high"
                        ? "bg-red-400"
                        : item.urgency === "medium"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.type}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.lab} {item.program !== "-" && `• ${item.program}`}
                    </p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] text-xs font-medium border border-[#00B4D8]/20 hover:bg-[#00B4D8]/20 transition-all duration-300">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}