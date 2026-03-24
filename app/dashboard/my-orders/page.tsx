// app/dashboard/my-orders/page.tsx

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
  IndianRupee,
  Download,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpRight,
  FileText,
  Printer,
  BadgeCheck,
  Timer,
  Ban,
  RefreshCw,
  Sparkles,
  Wallet,
  Package,
  Truck,
  Send,
  MapPinned,
  ClipboardCheck,
  Pause,
  CheckCircle,
  Circle,
  History,
  MapPin,
  Copy,
  Phone,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface OrderItem {
  programId?: string;
  programName: string;
  fees?: number;
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
  updatedBy?: {
    _id: string;
    username: string;
  };
}

interface ShippingInfo {
  trackingId?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  address?: string;
}

interface Order {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt?: string;
  orderStatus?: string;
  paymentStatus: string;
  items: OrderItem[];
  totalAmount?: number;
  subtotal?: number;
  gstAmount?: number;
  shipping?: ShippingInfo;
  statusHistory?: StatusHistoryItem[];
  invoiceUrl?: string;
}

// Order Status Configuration
const ORDER_STATUS_CONFIG: Record<string, any> = {
  placed: {
    label: "Order Placed",
    color: "blue",
    icon: ShoppingBag,
    description: "Your order has been placed successfully",
  },
  confirmed: {
    label: "Confirmed",
    color: "indigo",
    icon: ClipboardCheck,
    description: "Your order has been confirmed",
  },
  processing: {
    label: "Processing",
    color: "violet",
    icon: Timer,
    description: "Your order is being processed",
  },
  dispatched: {
    label: "Dispatched",
    color: "purple",
    icon: Send,
    description: "Your order has been dispatched",
  },
  in_transit: {
    label: "In Transit",
    color: "cyan",
    icon: Truck,
    description: "Your order is on the way",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "amber",
    icon: MapPinned,
    description: "Your order is out for delivery",
  },
  delivered: {
    label: "Delivered",
    color: "emerald",
    icon: CheckCircle2,
    description: "Your order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    icon: Ban,
    description: "Your order has been cancelled",
  },
  on_hold: {
    label: "On Hold",
    color: "orange",
    icon: Pause,
    description: "Your order is on hold",
  },
};

// Order flow for stepper
const ORDER_FLOW = [
  "placed",
  "confirmed",
  "processing",
  "dispatched",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

// Payment Status Config
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

const getOrderStatusConfig = (status: string) => {
  const key = status?.toLowerCase();
  return (
    ORDER_STATUS_CONFIG[key] || {
      label: status || "Unknown",
      icon: AlertCircle,
      color: "slate",
      description: "Status unknown",
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

// Get order status badge
const getOrderStatusBadge = (status: string) => {
  const config = getOrderStatusConfig(status);
  const Icon = config.icon;

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClasses[config.color]}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// Get current step index for stepper
const getCurrentStepIndex = (status: string) => {
  if (status === "cancelled" || status === "on_hold") return -1;
  return ORDER_FLOW.indexOf(status);
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterOrderStatus, setFilterOrderStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState<Order | null>(null);
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
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter + Sort
  useEffect(() => {
    let filtered = orders.filter((o) => {
      const matchSearch =
        o.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some((item) =>
          item.programName?.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        o.shipping?.trackingId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPayment =
        filterPayment === "all" ||
        o.paymentStatus?.toLowerCase() === filterPayment;

      const matchOrderStatus =
        filterOrderStatus === "all" ||
        (o.orderStatus?.toLowerCase() || "placed") === filterOrderStatus;

      return matchSearch && matchPayment && matchOrderStatus;
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
  }, [searchQuery, filterPayment, filterOrderStatus, sortBy, orders]);

  // Stats
  const totalSpent = orders
    .filter((o) => o.paymentStatus?.toLowerCase() === "paid")
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalPrograms = orders.reduce((acc, o) => acc + o.items.length, 0);
  const paidCount = orders.filter(
    (o) => o.paymentStatus?.toLowerCase() === "paid"
  ).length;
  const deliveredCount = orders.filter(
    (o) => o.orderStatus?.toLowerCase() === "delivered"
  ).length;
  const inProgressCount = orders.filter((o) => {
    const status = o.orderStatus?.toLowerCase() || "placed";
    return !["delivered", "cancelled"].includes(status);
  }).length;

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getOrderIdDisplay = (order: Order) => {
    const shortId = order._id.slice(-8).toUpperCase();
    return `#ORD-${shortId}`;
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
              Track and manage your PT program orders
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            label: "In Progress",
            value: inProgressCount,
            icon: Truck,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
          },
          {
            label: "Delivered",
            value: deliveredCount,
            icon: CheckCircle2,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
          },
          {
            label: "Total Spent",
            value: `₹${totalSpent.toLocaleString("en-IN")}`,
            icon: Wallet,
            gradient: "from-cyan-600 to-cyan-400",
            glow: "#22d3ee",
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

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by order ID, program, or tracking..."
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

          {/* Order Status Filter */}
          <select
            value={filterOrderStatus}
            onChange={(e) => setFilterOrderStatus(e.target.value)}
            className="bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

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
          {(filterPayment !== "all" || filterOrderStatus !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterPayment("all");
                setFilterOrderStatus("all");
              }}
              className="ml-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          )}
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
                    Order
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
                    Amount
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-16">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedOrders.map((order, index) => {
                  const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                  const paymentConfig = getPaymentConfig(order.paymentStatus);
                  const orderStatus = order.orderStatus || "placed";
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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                              <Package className="w-4 h-4 text-[#90E0EF]" />
                            </div>
                            <div>
                              <p className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 text-sm">
                                {getOrderIdDisplay(order)}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {order.items.length} program(s)
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-slate-300">{formatDate(order.createdAt)}</p>
                            <p className="text-[10px] text-slate-500">{formatTime(order.createdAt)}</p>
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="px-5 py-4">
                          {getOrderStatusBadge(orderStatus)}
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.border} ${paymentConfig.text} border`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${paymentConfig.dot}`} />
                            {paymentConfig.label}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5 text-[#00B4D8]" />
                            <span className="font-bold text-white tabular-nums">
                              {(order.totalAmount || 0).toLocaleString("en-IN")}
                            </span>
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
                              <div className="space-y-6">
                                {/* Order Progress Stepper */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <Truck className="w-3.5 h-3.5" />
                                      Order Progress
                                    </h4>
                                    {getOrderStatusBadge(orderStatus)}
                                  </div>

                                  {/* Stepper */}
                                  {orderStatus !== "cancelled" && orderStatus !== "on_hold" ? (
                                    <div className="relative mt-6">
                                      <div className="flex items-center justify-between">
                                        {ORDER_FLOW.map((status, idx) => {
                                          const config = ORDER_STATUS_CONFIG[status];
                                          const Icon = config?.icon || Circle;
                                          const currentIndex = getCurrentStepIndex(orderStatus);
                                          const isCompleted = idx <= currentIndex;
                                          const isCurrent = idx === currentIndex;

                                          return (
                                            <div
                                              key={status}
                                              className="flex flex-col items-center relative z-10"
                                            >
                                              <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                  isCompleted
                                                    ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                                                    : "bg-white/[0.05] border-2 border-white/[0.1] text-slate-500"
                                                } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}
                                              >
                                                {isCompleted ? (
                                                  <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                  <Icon className="w-4 h-4" />
                                                )}
                                              </div>
                                              <p
                                                className={`text-[9px] mt-2 text-center max-w-[60px] ${
                                                  isCompleted ? "text-slate-300" : "text-slate-600"
                                                }`}
                                              >
                                                {config?.label}
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>

                                      {/* Progress line */}
                                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/[0.06] -z-0">
                                        <div
                                          className="h-full bg-emerald-500 transition-all duration-500"
                                          style={{
                                            width: `${
                                              (getCurrentStepIndex(orderStatus) /
                                                (ORDER_FLOW.length - 1)) *
                                              100
                                            }%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center py-4">
                                      <div className="flex items-center gap-3">
                                        {orderStatus === "cancelled" ? (
                                          <>
                                            <Ban className="w-8 h-8 text-red-400" />
                                            <div>
                                              <p className="text-red-400 font-medium">Order Cancelled</p>
                                              <p className="text-xs text-slate-500">
                                                This order has been cancelled
                                              </p>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <Pause className="w-8 h-8 text-orange-400" />
                                            <div>
                                              <p className="text-orange-400 font-medium">Order On Hold</p>
                                              <p className="text-xs text-slate-500">
                                                This order is currently on hold
                                              </p>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  {/* Programs List */}
                                  <div className="lg:col-span-2 space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <Beaker className="w-3.5 h-3.5" />
                                      Purchased Programs
                                    </h4>
                                    <div className="space-y-2">
                                      {order.items.map((item: any, i: number) => (
                                        <div
                                          key={i}
                                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/15 flex items-center justify-center">
                                              <span className="text-[10px] font-bold text-[#00B4D8] font-mono">
                                                {String(i + 1).padStart(2, "0")}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium text-white">
                                                {item.programName}
                                              </span>
                                              {item.programId && (
                                                <p className="text-[10px] text-slate-500 font-mono">
                                                  {item.programId}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          {item.fees && (
                                            <div className="flex items-center gap-1">
                                              <IndianRupee className="w-3 h-3 text-[#00B4D8]" />
                                              <span className="text-sm font-semibold text-white tabular-nums">
                                                {item.fees.toLocaleString("en-IN")}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {/* Shipping Info */}
                                    {order.shipping && (order.shipping.trackingId || order.shipping.carrier) && (
                                      <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                          <Truck className="w-3.5 h-3.5" />
                                          Shipping Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          {order.shipping.trackingId && (
                                            <div className="flex items-center gap-2">
                                              <Package className="w-4 h-4 text-slate-500" />
                                              <div>
                                                <p className="text-[10px] text-slate-500">Tracking ID</p>
                                                <div className="flex items-center gap-1.5">
                                                  <p className="text-sm text-slate-300 font-mono">
                                                    {order.shipping.trackingId}
                                                  </p>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      copyToClipboard(order.shipping!.trackingId!);
                                                    }}
                                                    className="p-1 rounded hover:bg-white/10 transition-colors"
                                                  >
                                                    <Copy className="w-3 h-3 text-slate-500 hover:text-[#00B4D8]" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          {order.shipping.carrier && (
                                            <div className="flex items-center gap-2">
                                              <Truck className="w-4 h-4 text-slate-500" />
                                              <div>
                                                <p className="text-[10px] text-slate-500">Carrier</p>
                                                <p className="text-sm text-slate-300">
                                                  {order.shipping.carrier}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                          {order.shipping.estimatedDelivery && (
                                            <div className="flex items-center gap-2">
                                              <CalendarDays className="w-4 h-4 text-slate-500" />
                                              <div>
                                                <p className="text-[10px] text-slate-500">Est. Delivery</p>
                                                <p className="text-sm text-slate-300">
                                                  {formatDate(order.shipping.estimatedDelivery)}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                          {order.shipping.actualDelivery && (
                                            <div className="flex items-center gap-2">
                                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                              <div>
                                                <p className="text-[10px] text-slate-500">Delivered On</p>
                                                <p className="text-sm text-emerald-400">
                                                  {formatDate(order.shipping.actualDelivery)}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Order Summary */}
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5" />
                                      Order Details
                                    </h4>

                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
                                      {order.razorpayOrderId && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-500">Order ID</span>
                                          <span className="text-xs text-slate-300 font-mono">
                                            {order.razorpayOrderId.slice(0, 18)}
                                          </span>
                                        </div>
                                      )}

                                      {order.razorpayPaymentId && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-500">Payment ID</span>
                                          <span className="text-xs text-slate-300 font-mono">
                                            {order.razorpayPaymentId.slice(0, 18)}
                                          </span>
                                        </div>
                                      )}

                                      {order.subtotal && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-500">Subtotal</span>
                                          <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                            ₹{order.subtotal.toLocaleString("en-IN")}
                                          </span>
                                        </div>
                                      )}

                                      {order.gstAmount && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-slate-500">GST (18%)</span>
                                          <span className="text-xs text-slate-300 font-semibold tabular-nums">
                                            ₹{order.gstAmount.toLocaleString("en-IN")}
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
                                                {order.totalAmount.toLocaleString("en-IN")}
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Status History */}
                                    {order.statusHistory && order.statusHistory.length > 0 && (
                                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                          <History className="w-3 h-3" />
                                          Status History
                                        </h5>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                          {order.statusHistory
                                            .slice()
                                            .reverse()
                                            .slice(0, 4)
                                            .map((history, idx) => {
                                              const config =
                                                ORDER_STATUS_CONFIG[history.status] || {};
                                              const Icon = config.icon || Circle;

                                              return (
                                                <div
                                                  key={idx}
                                                  className="flex items-start gap-2 pb-2 border-b border-white/[0.04] last:border-0 last:pb-0"
                                                >
                                                  <Icon className="w-3 h-3 text-slate-400 mt-0.5" />
                                                  <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                      <p className="text-[11px] font-medium text-slate-300">
                                                        {config.label || history.status}
                                                      </p>
                                                      <p className="text-[9px] text-slate-500">
                                                        {formatDate(history.timestamp)}
                                                      </p>
                                                    </div>
                                                    {history.note && (
                                                      <p className="text-[10px] text-slate-500 mt-0.5">
                                                        {history.note}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      {order.invoiceUrl ? (
                                        <a
                                          href={order.invoiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all"
                                        >
                                          <Download className="w-3 h-3" />
                                          Invoice
                                        </a>
                                      ) : (
                                        <button
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all"
                                        >
                                          <Download className="w-3 h-3" />
                                          Invoice
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewModal(order);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Details
                                      </button>
                                    </div>
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
                setFilterOrderStatus("all");
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
                Prev
              </button>

              <span className="px-3 py-1.5 text-xs text-slate-400">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── VIEW ORDER MODAL ─── */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d1a2d] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {getOrderIdDisplay(viewModal)}
                  </h3>
                  <p className="text-xs text-slate-500">Order Details</p>
                </div>
              </div>
              <button
                onClick={() => setViewModal(null)}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Progress */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-white">Order Progress</h4>
                  {getOrderStatusBadge(viewModal.orderStatus || "placed")}
                </div>

                {(viewModal.orderStatus || "placed") !== "cancelled" &&
                (viewModal.orderStatus || "placed") !== "on_hold" ? (
                  <div className="relative mt-4">
                    <div className="flex items-center justify-between">
                      {ORDER_FLOW.map((status, idx) => {
                        const config = ORDER_STATUS_CONFIG[status];
                        const Icon = config?.icon || Circle;
                        const currentIndex = getCurrentStepIndex(viewModal.orderStatus || "placed");
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                          <div key={status} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                                  : "bg-white/[0.05] border-2 border-white/[0.1] text-slate-500"
                              } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            <p
                              className={`text-[10px] mt-2 text-center max-w-[70px] ${
                                isCompleted ? "text-slate-300" : "text-slate-600"
                              }`}
                            >
                              {config?.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress line */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/[0.06] -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${
                            (getCurrentStepIndex(viewModal.orderStatus || "placed") /
                              (ORDER_FLOW.length - 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-6">
                    {viewModal.orderStatus === "cancelled" ? (
                      <div className="flex items-center gap-3">
                        <Ban className="w-10 h-10 text-red-400" />
                        <div>
                          <p className="text-red-400 font-semibold">Order Cancelled</p>
                          <p className="text-xs text-slate-500">This order has been cancelled</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Pause className="w-10 h-10 text-orange-400" />
                        <div>
                          <p className="text-orange-400 font-semibold">Order On Hold</p>
                          <p className="text-xs text-slate-500">This order is currently on hold</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
                    Payment Status
                  </p>
                  {(() => {
                    const paymentConfig = getPaymentConfig(viewModal.paymentStatus);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.border} ${paymentConfig.text} border`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${paymentConfig.dot}`} />
                        {paymentConfig.label}
                      </span>
                    );
                  })()}
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
                    Total Amount
                  </p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5 text-[#00B4D8]" />
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {(viewModal.totalAmount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {viewModal.shipping &&
                (viewModal.shipping.trackingId || viewModal.shipping.carrier) && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Truck className="w-3.5 h-3.5" />
                      Shipping Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {viewModal.shipping.trackingId && (
                        <div>
                          <p className="text-[10px] text-slate-500">Tracking ID</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <p className="text-sm text-slate-300 font-mono">
                              {viewModal.shipping.trackingId}
                            </p>
                            <button
                              onClick={() => copyToClipboard(viewModal.shipping!.trackingId!)}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              <Copy className="w-3 h-3 text-slate-500 hover:text-[#00B4D8]" />
                            </button>
                          </div>
                        </div>
                      )}
                      {viewModal.shipping.carrier && (
                        <div>
                          <p className="text-[10px] text-slate-500">Carrier</p>
                          <p className="text-sm text-slate-300 mt-1">
                            {viewModal.shipping.carrier}
                          </p>
                        </div>
                      )}
                      {viewModal.shipping.estimatedDelivery && (
                        <div>
                          <p className="text-[10px] text-slate-500">Est. Delivery</p>
                          <p className="text-sm text-slate-300 mt-1">
                            {formatDate(viewModal.shipping.estimatedDelivery)}
                          </p>
                        </div>
                      )}
                      {viewModal.shipping.actualDelivery && (
                        <div>
                          <p className="text-[10px] text-slate-500">Delivered On</p>
                          <p className="text-sm text-emerald-400 mt-1">
                            {formatDate(viewModal.shipping.actualDelivery)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Programs */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Beaker className="w-3.5 h-3.5" />
                  Purchased Programs ({viewModal.items.length})
                </h4>
                <div className="space-y-2">
                  {viewModal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.programName}</p>
                          {item.programId && (
                            <p className="text-[10px] text-slate-500 font-mono">{item.programId}</p>
                          )}
                        </div>
                      </div>
                      {item.fees && (
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3 text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                            {item.fees.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Order ID
                  </p>
                  <p className="text-sm text-slate-300 font-mono">
                    {viewModal.razorpayOrderId || "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Payment ID
                  </p>
                  <p className="text-sm text-slate-300 font-mono">
                    {viewModal.razorpayPaymentId || "N/A"}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Order Date
                  </p>
                  <p className="text-sm text-slate-300">
                    {formatDate(viewModal.createdAt)} at {formatTime(viewModal.createdAt)}
                  </p>
                </div>
                {viewModal.updatedAt && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm text-slate-300">
                      {formatDate(viewModal.updatedAt)} at {formatTime(viewModal.updatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Status History */}
              {viewModal.statusHistory && viewModal.statusHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <History className="w-3.5 h-3.5" />
                    Status History
                  </h4>
                  <div className="space-y-3">
                    {viewModal.statusHistory
                      .slice()
                      .reverse()
                      .map((history, idx) => {
                        const config = ORDER_STATUS_CONFIG[history.status] || {};
                        const Icon = config.icon || Circle;

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                              <Icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-300">
                                  {config.label || history.status}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {formatDate(history.timestamp)} at {formatTime(history.timestamp)}
                                </p>
                              </div>
                              {history.note && (
                                <p className="text-xs text-slate-500 mt-1">{history.note}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              {viewModal.invoiceUrl && (
                <a
                  href={viewModal.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </a>
              )}
              <button
                onClick={() => setViewModal(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}