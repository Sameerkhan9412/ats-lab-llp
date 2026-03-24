// app/admin/components/StatsCards.tsx

"use client";

import {
  Users,
  ShoppingCart,
  DollarSign,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalPrograms: number;
  openEnquiries: number;
  openComplaints: number;
  newUsersThisMonth: number;
  ordersThisMonth: number;
}

interface StatsCardsProps {
  stats: StatsData | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersThisMonth || 0} this month`,
      trend: "up",
      icon: Users,
      accent: "from-blue-500 to-blue-400",
      bgAccent: "bg-blue-500/10",
      borderAccent: "border-blue-500/20",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      change: `+${stats?.ordersThisMonth || 0} this month`,
      trend: "up",
      icon: ShoppingCart,
      accent: "from-violet-500 to-violet-400",
      bgAccent: "bg-violet-500/10",
      borderAccent: "border-violet-500/20",
    },
    {
      title: "Revenue",
      value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`,
      change: "All time",
      trend: "up",
      icon: DollarSign,
      accent: "from-emerald-500 to-emerald-400",
      bgAccent: "bg-emerald-500/10",
      borderAccent: "border-emerald-500/20",
    },
    {
      title: "PT Programs",
      value: stats?.totalPrograms || 0,
      change: "Active programs",
      trend: "neutral",
      icon: ClipboardList,
      accent: "from-cyan-500 to-cyan-400",
      bgAccent: "bg-cyan-500/10",
      borderAccent: "border-cyan-500/20",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      change: "Requires action",
      trend: stats?.pendingOrders ? "down" : "neutral",
      icon: ShoppingCart,
      accent: "from-amber-500 to-amber-400",
      bgAccent: "bg-amber-500/10",
      borderAccent: "border-amber-500/20",
    },
    {
      title: "Open Enquiries",
      value: stats?.openEnquiries || 0,
      change: "Awaiting response",
      trend: stats?.openEnquiries ? "down" : "neutral",
      icon: MessageSquare,
      accent: "from-pink-500 to-pink-400",
      bgAccent: "bg-pink-500/10",
      borderAccent: "border-pink-500/20",
    },
    {
      title: "Open Complaints",
      value: stats?.openComplaints || 0,
      change: "Need attention",
      trend: stats?.openComplaints ? "down" : "neutral",
      icon: AlertTriangle,
      accent: "from-red-500 to-red-400",
      bgAccent: "bg-red-500/10",
      borderAccent: "border-red-500/20",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      change: `${Math.round(((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100)}% of total`,
      trend: "up",
      icon: Users,
      accent: "from-teal-500 to-teal-400",
      bgAccent: "bg-teal-500/10",
      borderAccent: "border-teal-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-300"
          >
            {/* Glow effect */}
            <div
              className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl bg-gradient-to-br ${stat.accent}`}
            />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-xl ${stat.bgAccent} border ${stat.borderAccent} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                )}
                {stat.trend === "down" && (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>

              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.title}</p>
              </div>

              <p className="text-[11px] text-slate-500">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}