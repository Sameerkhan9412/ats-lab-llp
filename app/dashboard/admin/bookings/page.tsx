// app/dashboard/admin/bookings/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  ArrowUpDown,
  Phone,
  MapPin,
  Clock,
  Loader2,
  CalendarDays,
  IndianRupee,
  CreditCard,
  Package,
  FileText,
  User,
  Mail,
  ExternalLink,
  Copy,
  TrendingUp,
  Receipt,
  Truck,
  PackageCheck,
  Timer,
  CheckCircle,
  Circle,
  Send,
  MapPinned,
  ClipboardCheck,
  Ban,
  Pause,
  History,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface OrderItem {
  programId: string;
  programName: string;
  fees: number;
}

interface UserInfo {
  _id: string;
  username: string;
  email: string;
}

interface ProfileInfo {
  participant?: {
    name?: string;
    city?: string;
    address1?: string;
  };
  contact?: {
    phone?: string;
  };
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note: string;
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

interface OrderData {
  _id: string;
  userId: UserInfo;
  items: OrderItem[];
  totalAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: "paid" | "pending" | "failed";
  orderStatus:
    | "placed"
    | "confirmed"
    | "processing"
    | "dispatched"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "on_hold";
  statusHistory?: StatusHistoryItem[];
  shipping?: ShippingInfo;
  invoiceUrl?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  profile: ProfileInfo | null;
}

interface Stats {
  total: number;
  payment: {
    paid: number;
    pending: number;
    failed: number;
  };
  orderStatus: {
    placed: number;
    confirmed: number;
    processing: number;
    dispatched: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    onHold: number;
  };
  thisWeek: number;
  thisMonth: number;
  totalRevenue: number;
  thisMonthRevenue: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Order Status Configuration
const ORDER_STATUS_CONFIG = {
  placed: {
    label: "Order Placed",
    color: "blue",
    icon: ShoppingBag,
    description: "Order has been placed successfully",
  },
  confirmed: {
    label: "Confirmed",
    color: "indigo",
    icon: ClipboardCheck,
    description: "Order has been confirmed",
  },
  processing: {
    label: "Processing",
    color: "violet",
    icon: Timer,
    description: "Order is being processed",
  },
  dispatched: {
    label: "Dispatched",
    color: "purple",
    icon: Send,
    description: "Order has been dispatched",
  },
  in_transit: {
    label: "In Transit",
    color: "cyan",
    icon: Truck,
    description: "Order is on the way",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "amber",
    icon: MapPinned,
    description: "Order is out for delivery",
  },
  delivered: {
    label: "Delivered",
    color: "emerald",
    icon: PackageCheck,
    description: "Order has been delivered",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    icon: Ban,
    description: "Order has been cancelled",
  },
  on_hold: {
    label: "On Hold",
    color: "orange",
    icon: Pause,
    description: "Order is on hold",
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

export default function AdminBookingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals
  const [viewModal, setViewModal] = useState<OrderData | null>(null);
  const [editModal, setEditModal] = useState<OrderData | null>(null);
  const [deleteModal, setDeleteModal] = useState<OrderData | null>(null);
  const [statusModal, setStatusModal] = useState<OrderData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    paymentStatus: "pending",
    orderStatus: "placed",
    statusNote: "",
    invoiceUrl: "",
    adminNotes: "",
    shipping: {
      trackingId: "",
      carrier: "",
      estimatedDelivery: "",
    },
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        paymentStatus: paymentStatusFilter,
        orderStatus: orderStatusFilter,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/admin/bookings?${params}`, {
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch orders");
      }

      setOrders(result.data);
      setPagination({
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchQuery,
    paymentStatusFilter,
    orderStatusFilter,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  ]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/bookings/stats", {
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch stats");
      }

      setStats(result.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
    setTimeout(() => setIsLoaded(true), 100);
  }, [fetchOrders]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchOrders();
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Handle update order
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;

    setFormLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${editModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentStatus: formData.paymentStatus,
          orderStatus: formData.orderStatus,
          statusNote: formData.statusNote,
          invoiceUrl: formData.invoiceUrl,
          adminNotes: formData.adminNotes,
          shipping: formData.shipping,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update order");
      }

      toast.success(result.message || "Order updated successfully");
      setEditModal(null);
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setFormLoading(false);
    }
  };

  // Quick status update (payment)
  const handleQuickPaymentStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      toast.success(`Payment status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // Quick order status update
  const handleQuickOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderStatus: newStatus,
          statusNote: `Status updated to ${newStatus}`,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // Update status with modal
  const handleStatusModalUpdate = async () => {
    if (!statusModal) return;

    setFormLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${statusModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderStatus: formData.orderStatus,
          statusNote: formData.statusNote,
          shipping: formData.shipping,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      toast.success(result.message || "Order status updated successfully");
      setStatusModal(null);
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!deleteModal) return;

    setFormLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${deleteModal._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete order");
      }

      toast.success(result.message || "Order deleted successfully");
      setDeleteModal(null);
      fetchOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order");
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit modal with order data
  const openEditModal = (order: OrderData) => {
    setFormData({
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus || "placed",
      statusNote: "",
      invoiceUrl: order.invoiceUrl || "",
      adminNotes: order.adminNotes || "",
      shipping: {
        trackingId: order.shipping?.trackingId || "",
        carrier: order.shipping?.carrier || "",
        estimatedDelivery: order.shipping?.estimatedDelivery
          ? new Date(order.shipping.estimatedDelivery).toISOString().split("T")[0]
          : "",
      },
    });
    setEditModal(order);
  };

  // Open status modal
  const openStatusModal = (order: OrderData) => {
    setFormData({
      ...formData,
      orderStatus: order.orderStatus || "placed",
      statusNote: "",
      shipping: {
        trackingId: order.shipping?.trackingId || "",
        carrier: order.shipping?.carrier || "",
        estimatedDelivery: order.shipping?.estimatedDelivery
          ? new Date(order.shipping.estimatedDelivery).toISOString().split("T")[0]
          : "",
      },
    });
    setStatusModal(order);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Get order status badge
  const getOrderStatusBadge = (status: string) => {
    const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
    if (!config) return null;

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

  // Generate Order ID display
  const getOrderIdDisplay = (order: OrderData) => {
    const shortId = order._id.slice(-8).toUpperCase();
    return `#ORD-${shortId}`;
  };

  // Get current step index for stepper
  const getCurrentStepIndex = (status: string) => {
    if (status === "cancelled" || status === "on_hold") return -1;
    return ORDER_FLOW.indexOf(status);
  };

  return (
    <div
      className={`space-y-6 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-red-400">Admin Panel</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              PT Bookings
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Manage all PT program orders, track shipments, and update statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              fetchOrders();
              fetchStats();
            }}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <Receipt className="w-3.5 h-3.5" />
            Report
          </button>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="space-y-4">
        {/* Payment & Revenue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            {
              label: "Total Orders",
              value: stats?.total || 0,
              icon: ShoppingBag,
              color: "blue",
            },
            {
              label: "Paid",
              value: stats?.payment?.paid || 0,
              icon: CheckCircle2,
              color: "emerald",
            },
            {
              label: "Pending Payment",
              value: stats?.payment?.pending || 0,
              icon: Clock,
              color: "amber",
            },
            {
              label: "Failed",
              value: stats?.payment?.failed || 0,
              icon: XCircle,
              color: "red",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(stats?.totalRevenue || 0),
              icon: IndianRupee,
              color: "cyan",
              isLarge: true,
            },
            {
              label: "This Month",
              value: formatCurrency(stats?.thisMonthRevenue || 0),
              icon: TrendingUp,
              color: "violet",
              isLarge: true,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all duration-300 cursor-default"
            >
              <div className="flex flex-col gap-2">
                <stat.icon
                  className={`w-4 h-4 ${
                    stat.color === "blue" ? "text-[#00B4D8]" : ""
                  } ${stat.color === "red" ? "text-red-400" : ""}
                    ${stat.color === "cyan" ? "text-cyan-400" : ""}
                    ${stat.color === "violet" ? "text-violet-400" : ""}
                    ${stat.color === "emerald" ? "text-emerald-400" : ""}
                    ${stat.color === "amber" ? "text-amber-400" : ""}
                  `}
                />
                <p
                  className={`${stat.isLarge ? "text-lg" : "text-2xl"} font-bold text-white`}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Status Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {[
            { key: "placed", label: "Placed", value: stats?.orderStatus?.placed || 0 },
            { key: "confirmed", label: "Confirmed", value: stats?.orderStatus?.confirmed || 0 },
            { key: "processing", label: "Processing", value: stats?.orderStatus?.processing || 0 },
            { key: "dispatched", label: "Dispatched", value: stats?.orderStatus?.dispatched || 0 },
            { key: "in_transit", label: "In Transit", value: stats?.orderStatus?.inTransit || 0 },
            { key: "out_for_delivery", label: "Out for Delivery", value: stats?.orderStatus?.outForDelivery || 0 },
            { key: "delivered", label: "Delivered", value: stats?.orderStatus?.delivered || 0 },
            { key: "cancelled", label: "Cancelled", value: stats?.orderStatus?.cancelled || 0 },
            { key: "on_hold", label: "On Hold", value: stats?.orderStatus?.onHold || 0 },
          ].map((stat) => {
            const config = ORDER_STATUS_CONFIG[stat.key as keyof typeof ORDER_STATUS_CONFIG];
            const Icon = config?.icon || Package;

            return (
              <button
                key={stat.key}
                onClick={() => {
                  setOrderStatusFilter(stat.key === orderStatusFilter ? "all" : stat.key);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                  orderStatusFilter === stat.key
                    ? "bg-[#00B4D8]/10 border-[#00B4D8]/30"
                    : "bg-[#0d1a2d]/40 border-white/[0.06] hover:border-white/[0.1]"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wide text-center">
                    {stat.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── FILTERS & SEARCH ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order, user, tracking..."
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={orderStatusFilter}
              onChange={(e) => {
                setOrderStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            >
              <option value="all">All Status</option>
              {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            />
          </div>

          <div className="md:col-span-1">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setPaymentStatusFilter("all");
                setOrderStatusFilter("all");
                setStartDate("");
                setEndDate("");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full flex items-center justify-center gap-2 bg-white/[0.03] text-slate-400 border border-white/[0.06] rounded-xl py-2.5 text-sm font-medium hover:bg-white/[0.05] hover:text-slate-200 transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white rounded-xl py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* ─── ORDERS TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Order
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Customer
                  </th>
                  <th
                    className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort("totalAmount")}
                  >
                    <span className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Payment
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Order Status
                  </th>
                  <th
                    className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="group hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#00B4D8]" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {getOrderIdDisplay(order)}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {order.items.length} item(s)
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-200">
                          {order.profile?.participant?.name ||
                            order.userId?.username ||
                            "N/A"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {order.userId?.email || "N/A"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-white">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        {getPaymentStatusBadge(order.paymentStatus)}

                        {/* Quick payment status buttons */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {order.paymentStatus !== "paid" && (
                            <button
                              onClick={() =>
                                handleQuickPaymentStatusUpdate(order._id, "paid")
                              }
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        {getOrderStatusBadge(order.orderStatus || "placed")}

                        {/* Quick order status update */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openStatusModal(order)}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8]/20 transition-all"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-300">{formatDate(order.createdAt)}</p>
                      <p className="text-[11px] text-slate-500">
                        {formatTime(order.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewModal(order)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-[#00B4D8] transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-amber-400 transition-all duration-200"
                          title="Edit Order"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(order)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-red-400 transition-all duration-200"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-medium">
                {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="text-slate-300 font-medium">{pagination.total}</span>{" "}
              orders
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              <span className="px-3 py-1.5 text-xs text-slate-400">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              {/* Order Status Timeline */}
              {viewModal.orderStatus && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white">Order Progress</p>
                    {getOrderStatusBadge(viewModal.orderStatus)}
                  </div>

                  {/* Stepper */}
                  {viewModal.orderStatus !== "cancelled" &&
                  viewModal.orderStatus !== "on_hold" ? (
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        {ORDER_FLOW.map((status, index) => {
                          const config =
                            ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];
                          const Icon = config?.icon || Circle;
                          const currentIndex = getCurrentStepIndex(viewModal.orderStatus);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;

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
                              (getCurrentStepIndex(viewModal.orderStatus) /
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
                        {viewModal.orderStatus === "cancelled" ? (
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
              )}

              {/* Status & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Payment Status
                  </p>
                  {getPaymentStatusBadge(viewModal.paymentStatus)}
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(viewModal.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Shipping Info */}
              {viewModal.shipping && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">
                    Shipping Information
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {viewModal.shipping.trackingId && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-[10px] text-slate-500">Tracking ID</p>
                          <p className="text-sm text-slate-300">
                            {viewModal.shipping.trackingId}
                          </p>
                        </div>
                      </div>
                    )}
                    {viewModal.shipping.carrier && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-[10px] text-slate-500">Carrier</p>
                          <p className="text-sm text-slate-300">
                            {viewModal.shipping.carrier}
                          </p>
                        </div>
                      </div>
                    )}
                    {viewModal.shipping.estimatedDelivery && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-[10px] text-slate-500">Est. Delivery</p>
                          <p className="text-sm text-slate-300">
                            {formatDate(viewModal.shipping.estimatedDelivery)}
                          </p>
                        </div>
                      </div>
                    )}
                    {viewModal.shipping.actualDelivery && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-[10px] text-slate-500">Delivered On</p>
                          <p className="text-sm text-emerald-400">
                            {formatDate(viewModal.shipping.actualDelivery)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">
                  Customer Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">
                      {viewModal.profile?.participant?.name ||
                        viewModal.userId?.username ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">
                      {viewModal.userId?.email || "N/A"}
                    </span>
                  </div>
                  {viewModal.profile?.contact?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">
                        {viewModal.profile.contact.phone}
                      </span>
                    </div>
                  )}
                  {viewModal.profile?.participant?.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300">
                        {viewModal.profile.participant.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PT Programs */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">
                  PT Programs ({viewModal.items.length})
                </p>
                <div className="space-y-2">
                  {viewModal.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.programName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {item.programId}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(item.fees)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Razorpay Order ID
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-slate-300 truncate">
                      {viewModal.razorpayOrderId || "N/A"}
                    </p>
                    {viewModal.razorpayOrderId && (
                      <button
                        onClick={() => copyToClipboard(viewModal.razorpayOrderId)}
                        className="text-slate-500 hover:text-[#00B4D8] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Razorpay Payment ID
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-slate-300 truncate">
                      {viewModal.razorpayPaymentId || "N/A"}
                    </p>
                    {viewModal.razorpayPaymentId && (
                      <button
                        onClick={() => copyToClipboard(viewModal.razorpayPaymentId)}
                        className="text-slate-500 hover:text-[#00B4D8] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status History */}
              {viewModal.statusHistory && viewModal.statusHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-slate-500" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      Status History
                    </p>
                  </div>
                  <div className="space-y-3">
                    {viewModal.statusHistory
                      .slice()
                      .reverse()
                      .map((history, index) => {
                        const config =
                          ORDER_STATUS_CONFIG[
                            history.status as keyof typeof ORDER_STATUS_CONFIG
                          ];
                        const Icon = config?.icon || Circle;

                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                              <Icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-300">
                                  {config?.label || history.status}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {formatDate(history.timestamp)} at{" "}
                                  {formatTime(history.timestamp)}
                                </p>
                              </div>
                              {history.note && (
                                <p className="text-xs text-slate-500 mt-1">
                                  {history.note}
                                </p>
                              )}
                              {history.updatedBy && (
                                <p className="text-[10px] text-slate-600 mt-1">
                                  by {history.updatedBy.username}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Order Date
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {formatDate(viewModal.createdAt)} at {formatTime(viewModal.createdAt)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {formatDate(viewModal.updatedAt)} at {formatTime(viewModal.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Invoice URL */}
              {viewModal.invoiceUrl && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">
                    Invoice
                  </p>
                  <a
                    href={viewModal.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#00B4D8] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Invoice
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setViewModal(null);
                  openStatusModal(viewModal);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/20 transition-all"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setViewModal(null);
                  openEditModal(viewModal);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                Edit Order
              </button>
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

      {/* ─── UPDATE STATUS MODAL ─── */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-semibold text-white">Update Order Status</h3>
                <p className="text-xs text-slate-500">{getOrderIdDisplay(statusModal)}</p>
              </div>
              <button
                onClick={() => setStatusModal(null)}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Current Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-sm text-slate-400">Current Status:</span>
                {getOrderStatusBadge(statusModal.orderStatus || "placed")}
              </div>

              {/* New Status */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  New Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = formData.orderStatus === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, orderStatus: key })
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-[#00B4D8]/10 border-[#00B4D8]/30 text-[#00B4D8]"
                            : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.1] hover:text-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Note */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Status Note (Optional)
                </label>
                <input
                  type="text"
                  value={formData.statusNote}
                  onChange={(e) =>
                    setFormData({ ...formData, statusNote: e.target.value })
                  }
                  placeholder="e.g., Dispatched via BlueDart"
                  className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Shipping Details */}
              {["dispatched", "in_transit", "out_for_delivery"].includes(
                formData.orderStatus
              ) && (
                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.trackingId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping: {
                              ...formData.shipping,
                              trackingId: e.target.value,
                            },
                          })
                        }
                        placeholder="Enter tracking ID"
                        className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Carrier
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.carrier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping: {
                              ...formData.shipping,
                              carrier: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., BlueDart, DTDC"
                        className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.shipping.estimatedDelivery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            ...formData.shipping,
                            estimatedDelivery: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusModalUpdate}
                disabled={formLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all disabled:opacity-50"
              >
                {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT ORDER MODAL ─── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">
                Edit Order {getOrderIdDisplay(editModal)}
              </h3>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateOrder}>
              <div className="p-6 space-y-4">
                {/* Order Info */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {editModal.profile?.participant?.name ||
                          editModal.userId?.username}
                      </p>
                      <p className="text-xs text-slate-500">{editModal.userId?.email}</p>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(editModal.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Order Status */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Order Status
                  </label>
                  <select
                    value={formData.orderStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, orderStatus: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  >
                    {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Status Update Note
                  </label>
                  <input
                    type="text"
                    value={formData.statusNote}
                    onChange={(e) =>
                      setFormData({ ...formData, statusNote: e.target.value })
                    }
                    placeholder="Note for this status update"
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Shipping Details */}
                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Tracking ID
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.trackingId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping: {
                              ...formData.shipping,
                              trackingId: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Carrier
                      </label>
                      <input
                        type="text"
                        value={formData.shipping.carrier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping: {
                              ...formData.shipping,
                              carrier: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      value={formData.shipping.estimatedDelivery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            ...formData.shipping,
                            estimatedDelivery: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Invoice URL */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Invoice URL
                  </label>
                  <input
                    type="url"
                    value={formData.invoiceUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceUrl: e.target.value })
                    }
                    placeholder="https://example.com/invoice.pdf"
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Admin Notes (Internal)
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, adminNotes: e.target.value })
                    }
                    rows={3}
                    placeholder="Add internal notes about this order..."
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600 resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

            <div className="p-6">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>

              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Delete Order?
              </h3>
              <p className="text-sm text-slate-400 text-center mb-2">
                Are you sure you want to delete order{" "}
                <span className="text-white font-medium">
                  {getOrderIdDisplay(deleteModal)}
                </span>
                ?
              </p>
              <p className="text-xs text-red-400 text-center mb-6">
                This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}