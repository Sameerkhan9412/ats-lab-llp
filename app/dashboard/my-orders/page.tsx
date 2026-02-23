"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  X,
  CalendarDays,
  CreditCard,
  Receipt,
  Beaker,
  Hash,
  IndianRupee,
  Eye,
  Download,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpRight,
  MoreHorizontal,
  FileText,
  Printer,
  BadgeCheck,
  Timer,
  Ban,
  RefreshCw,
  Sparkles,
  BarChart3,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface OrderItem {
  programName: string;
  fees?: number;
}

interface Order {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
  status?: string;
  paymentStatus: string;
  items: OrderItem[];
  totalAmount?: number;
  subtotal?: number;
  gstAmount?: number;
}

const STATUS_CONFIG: Record<string, any> = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  processing: {
    label: "Processing",
    icon: Timer,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
};

const PAYMENT_CONFIG: Record<string, any> = {
  paid: {
    label: "Paid",
    icon: BadgeCheck,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
};

const getStatusConfig = (status: string) => {
  const key = status?.toLowerCase();
  return (
    STATUS_CONFIG[key] || {
      label: status || "Unknown",
      icon: AlertCircle,
      bg: "bg-white/[0.05]",
      border: "border-white/[0.08]",
      text: "text-slate-400",
      dot: "bg-slate-400",
    }
  );
};

const getPaymentConfig = (status: string) => {
  const key = status?.toLowerCase();
  return (
    PAYMENT_CONFIG[key] || {
      label: status || "Unknown",
      icon: AlertCircle,
      bg: "bg-white/[0.05]",
      border: "border-white/[0.08]",
      text: "text-slate-400",
      dot: "bg-slate-400",
    }
  );
};

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders/purchases");
      const data = await res.json();
      setOrders(data || []);
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter + Sort
  useEffect(() => {
    let filtered = orders.filter((o) => {
      const matchSearch =
        o.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some((item) =>
          item.programName?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchPayment =
        filterPayment === "all" ||
        o.paymentStatus?.toLowerCase() === filterPayment;

      return matchSearch && matchPayment;
    });

    filtered.sort((a, b) => {
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "amount")
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterPayment, sortBy, orders]);

  // Stats
  const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalPrograms = orders.reduce((acc, o) => acc + o.items.length, 0);
  const paidCount = orders.filter(
    (o) => o.paymentStatus?.toLowerCase() === "paid"
  ).length;
  const pendingCount = orders.filter(
    (o) =>
      o.paymentStatus?.toLowerCase() === "pending" ||
      o.paymentStatus?.toLowerCase() !== "paid"
  ).length;

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`space-y-8 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View and track your purchased PT programs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <Link
            href="/dashboard/pt-programs"
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Buy New PT
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: Receipt,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
          },
          {
            label: "Total Programs",
            value: totalPrograms,
            icon: Beaker,
            gradient: "from-violet-600 to-violet-400",
            glow: "#a78bfa",
          },
          {
            label: "Paid Orders",
            value: paidCount,
            icon: BadgeCheck,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
          },
          {
            label: "Total Spent",
            value: `₹${totalSpent.toLocaleString("en-IN")}`,
            icon: Wallet,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
            isAmount: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-500"
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
              style={{ backgroundColor: stat.glow + "15" }}
            />
            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className={`font-bold tracking-tight text-white tabular-nums ${
                    stat.isAmount ? "text-xl" : "text-3xl"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                style={{ boxShadow: `0 8px 24px ${stat.glow}20` }}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── SEARCH & FILTERS ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by order ID or program name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1.5 bg-[#060d19]/40 border border-white/[0.06] rounded-xl p-1">
            {[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterPayment(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  filterPayment === opt.value
                    ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="appearance-none bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all cursor-pointer"
            >
              <option value="date">Newest First</option>
              <option value="amount">Highest Amount</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-semibold">
              {orders.length}
            </span>{" "}
            orders
          </p>
        </div>
      </div>

      {/* ─── TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
            <p className="text-sm text-slate-400">Loading your orders...</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-12">
                    #
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Order ID
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Order Status
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Payment
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Programs
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-16">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedOrders.map((order, index) => {
                  const serialNo =
                    (currentPage - 1) * itemsPerPage + index + 1;
                  const statusConfig = getStatusConfig(
                    order.status || "Completed"
                  );
                  const paymentConfig = getPaymentConfig(order.paymentStatus);
                  const StatusIcon = statusConfig.icon;
                  const PaymentIcon = paymentConfig.icon;
                  const isExpanded = expandedOrder === order._id;

                  return (
                    <>
                      <tr
                        key={order._id}
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order._id)
                        }
                        className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      >
                        {/* Serial */}
                        <td className="px-5 py-4">
                          <span className="text-slate-500 font-mono text-xs">
                            {String(serialNo).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[160px]">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                              <Receipt className="w-4 h-4 text-[#90E0EF]" />
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 text-xs font-mono">
                                {order.razorpayOrderId?.slice(0, 20) || "—"}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {formatTime(order.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.border} ${paymentConfig.text} border`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${paymentConfig.dot}`}
                            />
                            {paymentConfig.label}
                          </span>
                        </td>

                        {/* Programs */}
                        <td className="px-5 py-4">
                          <div className="min-w-[180px]">
                            {order.items.length === 1 ? (
                              <div className="flex items-center gap-2">
                                <Beaker className="w-3.5 h-3.5 text-[#00B4D8] flex-shrink-0" />
                                <span className="text-sm text-slate-300 font-medium">
                                  {order.items[0].programName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Beaker className="w-3.5 h-3.5 text-[#00B4D8] flex-shrink-0" />
                                <span className="text-sm text-slate-300 font-medium">
                                  {order.items[0].programName}
                                </span>
                                {order.items.length > 1 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#00B4D8]/10 border border-[#00B4D8]/15 text-[#90E0EF] font-semibold">
                                    +{order.items.length - 1} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Expand toggle */}
                        <td className="px-5 py-4 text-center">
                          <button
                            className={`p-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-300 ${
                              isExpanded ? "bg-white/[0.05]" : ""
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-[#00B4D8]" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>

                      {/* ─── EXPANDED DETAILS ROW ─── */}
                      {isExpanded && (
                        <tr key={`${order._id}-details`}>
                          <td colSpan={7} className="px-0 py-0">
                            <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Programs List */}
                                <div className="lg:col-span-2 space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Beaker className="w-3.5 h-3.5" />
                                    Purchased Programs
                                  </h4>
                                  <div className="space-y-2">
                                    {order.items.map(
                                      (item: any, i: number) => (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/15 flex items-center justify-center">
                                              <span className="text-[10px] font-bold text-[#00B4D8] font-mono">
                                                {String(i + 1).padStart(
                                                  2,
                                                  "0"
                                                )}
                                              </span>
                                            </div>
                                            <span className="text-sm font-medium text-white">
                                              {item.programName}
                                            </span>
                                          </div>
                                          {item.fees && (
                                            <div className="flex items-center gap-1">
                                              <IndianRupee className="w-3 h-3 text-[#00B4D8]" />
                                              <span className="text-sm font-semibold text-white tabular-nums">
                                                {item.fees.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" />
                                    Order Details
                                  </h4>

                                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                                    {order.razorpayPaymentId && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                          Payment ID
                                        </span>
                                        <span className="text-xs text-slate-300 font-mono">
                                          {order.razorpayPaymentId.slice(0, 18)}
                                        </span>
                                      </div>
                                    )}

                                    {order.subtotal && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                          Subtotal
                                        </span>
                                        <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                          ₹
                                          {order.subtotal.toLocaleString(
                                            "en-IN"
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {order.gstAmount && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                          GST (18%)
                                        </span>
                                        <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                          ₹
                                          {order.gstAmount.toLocaleString(
                                            "en-IN"
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {order.totalAmount && (
                                      <>
                                        <div className="h-[1px] bg-white/[0.06]" />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-400 font-semibold">
                                            Total
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <IndianRupee className="w-3.5 h-3.5 text-[#00B4D8]" />
                                            <span className="text-base font-bold text-white tabular-nums">
                                              {order.totalAmount.toLocaleString(
                                                "en-IN"
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all">
                                      <Download className="w-3 h-3" />
                                      Invoice
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all">
                                      <Printer className="w-3 h-3" />
                                      Print
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <PackageOpen className="w-9 h-9 text-slate-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#060d19] border border-white/[0.06] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-slate-500" />
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-slate-300">
                No Orders Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Your purchased PT programs will appear here. Browse our catalog
                to get started.
              </p>
            </div>
            <Link
              href="/dashboard/pt-programs"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Browse PT Programs
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Search className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">
                No results found
              </h3>
              <p className="text-xs text-slate-500">
                No orders match your search or filter criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterPayment("all");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-white/[0.06] gap-4">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-300 font-medium">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredOrders.length
                )}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-medium">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20 shadow-sm shadow-[#00B4D8]/10"
                        : "text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}