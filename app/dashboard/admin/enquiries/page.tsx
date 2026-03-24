// app/dashboard/admin/enquiries/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
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
  Clock,
  Loader2,
  CalendarDays,
  User,
  Mail,
  Phone,
  MapPin,
  Send,
  Flag,
  Tag,
  MessageCircle,
  Inbox,
  ArrowUpDown,
  Filter,
  HelpCircle,
  Layers,
  CreditCard,
  Settings,
  FileText,
  Building2,
  Pause,
  Play,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface UserInfo {
  _id: string;
  username: string;
  email: string;
}

interface ProfileInfo {
  participant?: {
    name?: string;
    city?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
}

interface Enquiry {
  _id: string;
  userId: UserInfo;
  subject: string;
  message: string;
  category: "general" | "program" | "payment" | "technical" | "other";
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminResponse?: string;
  respondedBy?: { _id: string; username: string };
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: ProfileInfo;
}

interface Stats {
  total: number;
  status: {
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  category: {
    general: number;
    program: number;
    payment: number;
    technical: number;
    other: number;
  };
  thisWeek: number;
  thisMonth: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Configs
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
  },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400" },
  medium: { label: "Medium", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  high: { label: "High", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  urgent: { label: "Urgent", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
};

const CATEGORY_CONFIG = {
  general: { label: "General", icon: HelpCircle },
  program: { label: "PT Program", icon: Layers },
  payment: { label: "Payment", icon: CreditCard },
  technical: { label: "Technical", icon: Settings },
  other: { label: "Other", icon: FileText },
};

export default function AdminEnquiriesPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals
  const [viewModal, setViewModal] = useState<Enquiry | null>(null);
  const [replyModal, setReplyModal] = useState<Enquiry | null>(null);
  const [deleteModal, setDeleteModal] = useState<Enquiry | null>(null);

  // Form
  const [formData, setFormData] = useState({
    status: "pending",
    priority: "medium",
    adminResponse: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch enquiries
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/admin/enquiries?${params}`, {
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        setEnquiries(result.data);
        setPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/enquiries/stats", { credentials: "include" });
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
    setTimeout(() => setIsLoaded(true), 100);
  }, [fetchEnquiries]);

  // Handle reply/update
  const handleUpdateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal) return;

    setFormLoading(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${replyModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Enquiry updated successfully");
      setReplyModal(null);
      fetchEnquiries();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update enquiry");
    } finally {
      setFormLoading(false);
    }
  };

  // Quick status update
  const handleQuickStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      toast.success(`Status updated to ${status}`);
      fetchEnquiries();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async () => {
    if (!deleteModal) return;

    setFormLoading(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${deleteModal._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      toast.success("Enquiry deleted");
      setDeleteModal(null);
      fetchEnquiries();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete enquiry");
    } finally {
      setFormLoading(false);
    }
  };

  // Open reply modal
  const openReplyModal = (enquiry: Enquiry) => {
    setFormData({
      status: enquiry.status,
      priority: enquiry.priority,
      adminResponse: enquiry.adminResponse || "",
    });
    setReplyModal(enquiry);
  };

  // Format date
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
              Manage Enquiries
            </span>
          </h1>
          <p className="text-sm text-slate-500">View and respond to user enquiries</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchEnquiries();
              fetchStats();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Total", value: stats?.total || 0, icon: Inbox, color: "blue" },
          { label: "Pending", value: stats?.status?.pending || 0, icon: Clock, color: "amber" },
          { label: "In Progress", value: stats?.status?.inProgress || 0, icon: Loader2, color: "blue" },
          { label: "Resolved", value: stats?.status?.resolved || 0, icon: CheckCircle2, color: "emerald" },
          { label: "Urgent", value: stats?.priority?.urgent || 0, icon: AlertTriangle, color: "red" },
          { label: "This Week", value: stats?.thisWeek || 0, icon: CalendarDays, color: "violet" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all"
          >
            <div className="flex flex-col gap-2">
              <stat.icon
                className={`w-4 h-4 ${
                  stat.color === "blue"
                    ? "text-[#00B4D8]"
                    : stat.color === "amber"
                    ? "text-amber-400"
                    : stat.color === "emerald"
                    ? "text-emerald-400"
                    : stat.color === "red"
                    ? "text-red-400"
                    : "text-violet-400"
                }`}
              />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── FILTERS ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 transition-all"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="program">PT Program</option>
              <option value="payment">Payment</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setCategoryFilter("all");
              }}
              className="w-full flex items-center justify-center bg-white/[0.03] text-slate-400 border border-white/[0.06] rounded-xl py-2.5 hover:bg-white/[0.05] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => fetchEnquiries()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white rounded-xl py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ─── TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Inbox className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-400">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    User
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Subject
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Category
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Priority
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {enquiries.map((enquiry) => {
                  const statusConfig = STATUS_CONFIG[enquiry.status];
                  const priorityConfig = PRIORITY_CONFIG[enquiry.priority];
                  const categoryConfig = CATEGORY_CONFIG[enquiry.category];
                  const StatusIcon = statusConfig.icon;
                  const CategoryIcon = categoryConfig.icon;

                  return (
                    <tr
                      key={enquiry._id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#00B4D8]" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {enquiry.profile?.participant?.name || enquiry.userId?.username}
                            </p>
                            <p className="text-[10px] text-slate-500">{enquiry.userId?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-300 truncate max-w-[200px]">
                          {enquiry.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                          <CategoryIcon className="w-3 h-3" />
                          {categoryConfig.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}
                        >
                          {priorityConfig.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                          
                          {/* Quick actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {enquiry.status !== "resolved" && (
                              <button
                                onClick={() => handleQuickStatusUpdate(enquiry._id, "resolved")}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              >
                                Resolve
                              </button>
                            )}
                            {enquiry.status === "pending" && (
                              <button
                                onClick={() => handleQuickStatusUpdate(enquiry._id, "in_progress")}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                              >
                                Start
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-slate-300 text-xs">{formatDate(enquiry.createdAt)}</p>
                        <p className="text-[10px] text-slate-500">{formatTime(enquiry.createdAt)}</p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewModal(enquiry)}
                            className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-[#00B4D8] transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openReplyModal(enquiry)}
                            className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-amber-400 transition-all"
                            title="Reply"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(enquiry)}
                            className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && enquiries.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/[0.05] border border-white/[0.06] disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-white/[0.05] border border-white/[0.06] disabled:opacity-30"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── VIEW MODAL ─── */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d1a2d]">
              <h3 className="text-lg font-semibold text-white">Enquiry Details</h3>
              <button onClick={() => setViewModal(null)} className="p-2 rounded-lg hover:bg-white/[0.05]">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">User Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">
                      {viewModal.profile?.participant?.name || viewModal.userId?.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">{viewModal.userId?.email}</span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Subject</p>
                <p className="text-white font-medium">{viewModal.subject}</p>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Message</p>
                <p className="text-slate-300 whitespace-pre-wrap">{viewModal.message}</p>
              </div>

              {/* Admin Response */}
              {viewModal.adminResponse && (
                <div className="p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wide mb-2">Admin Response</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{viewModal.adminResponse}</p>
                  {viewModal.respondedBy && (
                    <p className="text-[10px] text-slate-500 mt-3">
                      by {viewModal.respondedBy.username} on {formatDate(viewModal.respondedAt!)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setViewModal(null);
                  openReplyModal(viewModal);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/20"
              >
                Reply
              </button>
              <button
                onClick={() => setViewModal(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── REPLY MODAL ─── */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">Reply to Enquiry</h3>
              <button onClick={() => setReplyModal(null)} className="p-2 rounded-lg hover:bg-white/[0.05]">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateEnquiry}>
              <div className="p-6 space-y-4">
                {/* Subject preview */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase">Subject</p>
                  <p className="text-sm text-slate-300 mt-1">{replyModal.subject}</p>
                </div>

                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Response */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Your Response</label>
                  <textarea
                    value={formData.adminResponse}
                    onChange={(e) => setFormData({ ...formData, adminResponse: e.target.value })}
                    rows={5}
                    placeholder="Type your response here..."
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setReplyModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] hover:shadow-lg hover:shadow-[#00B4D8]/20 disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE MODAL ─── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">Delete Enquiry?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                This will permanently delete this enquiry.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEnquiry}
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}