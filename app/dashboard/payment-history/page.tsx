"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
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
  IndianRupee,
  Download,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpRight,
  RefreshCw,
  BadgeCheck,
  Ban,
  Hash,
  FileText,
  Printer,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  ArrowUpLeft,
  BarChart3,
  Eye,
  Copy,
  MoreHorizontal,
} from "lucide-react";

interface Order {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  totalAmount: number;
  subtotal?: number;
  gstAmount?: number;
  paymentStatus: string;
  createdAt: string;
  invoiceUrl?: string;
  items?: { programName: string; fees?: number }[];
}

const PAYMENT_CONFIG: Record<string, any> = {
  paid: {
    label: "Paid",
    icon: BadgeCheck,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400",
    gradientFrom: "from-violet-500",
    gradientTo: "to-violet-600",
  },
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
      gradientFrom: "from-slate-500",
      gradientTo: "to-slate-600",
    }
  );
};

export default function PaymentHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data || []);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // Filter + Sort
  useEffect(() => {
    let filtered = orders.filter((o) => {
      const matchSearch =
        o.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "all" ||
        o.paymentStatus?.toLowerCase() === filterStatus;

      return matchSearch && matchStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "amount") return (b.totalAmount || 0) - (a.totalAmount || 0);
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy, orders]);

  // Stats
  const totalPaid = orders
    .filter((o) => o.paymentStatus?.toLowerCase() === "paid")
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalPending = orders
    .filter((o) => o.paymentStatus?.toLowerCase() === "pending")
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const paidCount = orders.filter(
    (o) => o.paymentStatus?.toLowerCase() === "paid"
  ).length;
  const lastPaymentDate = orders.length
    ? new Date(
        Math.max(...orders.map((o) => new Date(o.createdAt).getTime()))
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Payment History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track all your transactions and download invoices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all duration-200">
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Paid",
            value: `₹${totalPaid.toLocaleString("en-IN")}`,
            icon: TrendingUp,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
            isAmount: true,
            sub: `${paidCount} successful payments`,
          },
          {
            label: "Pending Amount",
            value: `₹${totalPending.toLocaleString("en-IN")}`,
            icon: Clock,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
            isAmount: true,
            sub: "Awaiting confirmation",
          },
          {
            label: "Total Transactions",
            value: orders.length,
            icon: Receipt,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
            isAmount: false,
            sub: "All time",
          },
          {
            label: "Last Payment",
            value: lastPaymentDate,
            icon: CalendarDays,
            gradient: "from-violet-600 to-violet-400",
            glow: "#a78bfa",
            isAmount: false,
            sub: "Most recent",
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
                  className={`font-bold tracking-tight text-white ${
                    stat.isAmount ? "text-xl tabular-nums" : "text-2xl"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500">{stat.sub}</p>
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
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Order ID or Payment ID..."
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

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#060d19]/40 border border-white/[0.06] rounded-xl p-1">
            {[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  filterStatus === opt.value
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
            <span className="text-slate-300 font-semibold">{filteredOrders.length}</span> of{" "}
            <span className="text-slate-300 font-semibold">{orders.length}</span> transactions
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
            <p className="text-sm text-slate-400">Loading payment history...</p>
          </div>
        )}

        {/* Table Content */}
        {!loading && filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-12">
                    #
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Transaction
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Date & Time
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Invoice
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-14">
                    <span className="sr-only">Expand</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedOrders.map((order, index) => {
                  const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                  const config = getPaymentConfig(order.paymentStatus);
                  const PaymentIcon = config.icon;
                  const isExpanded = expandedOrder === order._id;
                  const isPaid = order.paymentStatus?.toLowerCase() === "paid";

                  return (
                    <>
                      <tr
                        key={order._id}
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      >
                        {/* Serial */}
                        <td className="px-5 py-4">
                          <span className="text-slate-500 font-mono text-xs">
                            {String(serialNo).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Transaction IDs */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                                isPaid
                                  ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20"
                                  : "bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/20 border border-white/[0.06]"
                              }`}
                            >
                              {isPaid ? (
                                <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-[#90E0EF]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 text-xs font-mono truncate max-w-[160px]">
                                  {order.razorpayOrderId || "—"}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(order.razorpayOrderId, order._id + "-order");
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all"
                                >
                                  {copiedId === order._id + "-order" ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-slate-500" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[160px]">
                                Pay: {order.razorpayPaymentId || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <CalendarDays className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="text-sm">{formatDate(order.createdAt)}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 ml-5">
                              {formatTime(order.createdAt)}
                            </p>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <IndianRupee className="w-4 h-4 text-[#00B4D8]" />
                            <span className="text-lg font-bold text-white tabular-nums">
                              {(order.totalAmount || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bg} ${config.border} ${config.text} border`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                          </span>
                        </td>

                        {/* Invoice */}
                        <td className="px-5 py-4 text-center">
                          {order.invoiceUrl ? (
                            <a
                              href={order.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group/dl inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/8 border border-[#00B4D8]/12 hover:bg-[#00B4D8]/15 hover:border-[#00B4D8]/25 transition-all duration-200"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Invoice</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover/dl:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </td>

                        {/* Expand */}
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

                      {/* ─── EXPANDED ROW ─── */}
                      {isExpanded && (
                        <tr key={`${order._id}-expanded`}>
                          <td colSpan={7} className="px-0 py-0">
                            <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Transaction Details */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Transaction Details
                                  </h4>

                                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                                    <DetailRow
                                      label="Order ID"
                                      value={order.razorpayOrderId}
                                      mono
                                      copyable
                                      id={order._id + "-exp-order"}
                                      copiedId={copiedId}
                                      onCopy={copyToClipboard}
                                    />
                                    <DetailRow
                                      label="Payment ID"
                                      value={order.razorpayPaymentId}
                                      mono
                                      copyable
                                      id={order._id + "-exp-pay"}
                                      copiedId={copiedId}
                                      onCopy={copyToClipboard}
                                    />
                                    <DetailRow
                                      label="Date"
                                      value={`${formatDate(order.createdAt)} at ${formatTime(
                                        order.createdAt
                                      )}`}
                                    />
                                    <DetailRow label="Status" value={config.label} color={config.text} />
                                  </div>
                                </div>

                                {/* Amount Breakdown */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    Amount Breakdown
                                  </h4>

                                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                                    {order.subtotal != null && (
                                      <div className="flex justify-between">
                                        <span className="text-xs text-slate-500">Subtotal</span>
                                        <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                          ₹{order.subtotal.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    )}
                                    {order.gstAmount != null && (
                                      <div className="flex justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs text-slate-500">GST</span>
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/15 text-amber-400 font-semibold">
                                            18%
                                          </span>
                                        </div>
                                        <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                          ₹{order.gstAmount.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    )}

                                    <div className="h-[1px] bg-white/[0.06]" />

                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-slate-400 font-semibold">Total</span>
                                      <div className="flex items-center gap-1">
                                        <IndianRupee className="w-4 h-4 text-[#00B4D8]" />
                                        <span className="text-xl font-bold text-white tabular-nums">
                                          {(order.totalAmount || 0).toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Programs & Actions */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" />
                                    Programs & Actions
                                  </h4>

                                  {order.items && order.items.length > 0 && (
                                    <div className="space-y-2">
                                      {order.items.map((item, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-[#00B4D8]/10 flex items-center justify-center">
                                              <span className="text-[9px] font-bold text-[#00B4D8] font-mono">
                                                {String(i + 1).padStart(2, "0")}
                                              </span>
                                            </div>
                                            <span className="text-xs font-medium text-slate-300 truncate max-w-[120px]">
                                              {item.programName}
                                            </span>
                                          </div>
                                          {item.fees && (
                                            <span className="text-xs text-slate-400 font-mono">
                                              ₹{item.fees.toLocaleString("en-IN")}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-1">
                                    {order.invoiceUrl ? (
                                      <a
                                        href={order.invoiceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/15 hover:bg-[#00B4D8]/15 transition-all"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        Download Invoice
                                      </a>
                                    ) : (
                                      <button
                                        disabled
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 bg-white/[0.02] border border-white/[0.04] cursor-not-allowed"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        No Invoice
                                      </button>
                                    )}
                                    <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all">
                                      <Printer className="w-3.5 h-3.5" />
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
                <Wallet className="w-4 h-4 text-slate-500" />
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-slate-300">No Payment History</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Your payment transactions will appear here once you make your first purchase.
              </p>
            </div>
            <Link
              href="/dashboard/pt-programs"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Browse PT Programs
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </Link>
          </div>
        )}

        {/* No Results */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Search className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">No results found</h3>
              <p className="text-xs text-slate-500">No transactions match your criteria.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
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
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-medium">{filteredOrders.length}</span>{" "}
              transactions
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

/* ─── DETAIL ROW HELPER ─── */
function DetailRow({
  label,
  value,
  mono,
  color,
  copyable,
  id,
  copiedId,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
  copyable?: boolean;
  id?: string;
  copiedId?: string | null;
  onCopy?: (text: string, id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`text-xs truncate max-w-[140px] ${
            color || "text-slate-300"
          } ${mono ? "font-mono" : ""} font-medium`}
        >
          {value || "—"}
        </span>
        {copyable && value && onCopy && id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(value, id);
            }}
            className="p-0.5 rounded hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {copiedId === id ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-slate-500 hover:text-slate-300" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}