// app/dashboard/enquiry/page.tsx

"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  CalendarDays,
  Clock,
  ArrowUpRight,
  Eye,
  ChevronDown,
  Inbox,
  PenLine,
  Plus,
  RotateCcw,
  Info,
  Tag,
  Flag,
  MessageCircle,
  FileText,
  AlertTriangle,
  HelpCircle,
  CreditCard,
  Settings,
  Layers,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Pause,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface Enquiry {
  _id: string;
  subject: string;
  message: string;
  category: "general" | "program" | "payment" | "technical" | "other";
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminResponse?: string;
  respondedBy?: {
    _id: string;
    username: string;
  };
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Config
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
};

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
  },
  medium: {
    label: "Medium",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  high: {
    label: "High",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
  },
};

const CATEGORY_CONFIG = {
  general: { label: "General", icon: HelpCircle, color: "blue" },
  program: { label: "PT Program", icon: Layers, color: "violet" },
  payment: { label: "Payment", icon: CreditCard, color: "emerald" },
  technical: { label: "Technical", icon: Settings, color: "orange" },
  other: { label: "Other", icon: FileText, color: "slate" },
};

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<Enquiry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form fields
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "general",
    priority: "medium",
  });

  useEffect(() => {
    fetchEnquiries();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Filter
  useEffect(() => {
    let filtered = enquiries.filter((e) => {
      const matchSearch =
        e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.message?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || e.status === statusFilter;

      return matchSearch && matchStatus;
    });

    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, enquiries]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiry", { credentials: "include" });
      const result = await res.json();

      if (result.success) {
        setEnquiries(result.data || []);
      }
    } catch {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Message is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success("Enquiry submitted successfully!");
      setFormData({ subject: "", message: "", category: "general", priority: "medium" });
      setShowForm(false);
      fetchEnquiries();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit enquiry");
    } finally {
      setSubmitting(false);
    }
  };

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

  // Stats
  const totalEnquiries = enquiries.length;
  const pendingCount = enquiries.filter((e) => e.status === "pending").length;
  const inProgressCount = enquiries.filter((e) => e.status === "in_progress").length;
  const resolvedCount = enquiries.filter((e) => e.status === "resolved").length;

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              My Enquiries
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit queries and track your support requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showForm
                ? "bg-white/[0.05] text-slate-300 border border-white/[0.08]"
                : "bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                New Enquiry
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: totalEnquiries,
            icon: Inbox,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
          },
          {
            label: "In Progress",
            value: inProgressCount,
            icon: Loader2,
            gradient: "from-blue-600 to-blue-400",
            glow: "#3b82f6",
          },
          {
            label: "Resolved",
            value: resolvedCount,
            icon: CheckCircle2,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
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
                <p className="text-3xl font-bold tracking-tight text-white tabular-nums">
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

      {/* ─── SUBMIT FORM ─── */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          showForm ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
          <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Submit New Enquiry</h2>
                  <p className="text-xs text-slate-500">
                    Fill in the details below to submit your query
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <FileText className="w-3 h-3 text-slate-500" />
                  Subject
                  <span className="text-red-400 text-[10px]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your query"
                  className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Tag className="w-3 h-3 text-slate-500" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="program">PT Program Related</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Flag className="w-3 h-3 text-slate-500" />
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <MessageCircle className="w-3 h-3 text-slate-500" />
                  Message
                  <span className="text-red-400 text-[10px]">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your query in detail..."
                  rows={5}
                  className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ subject: "", message: "", category: "general", priority: "medium" })
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── FILTERS ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by subject or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#060d19]/40 border border-white/[0.06] rounded-xl p-1">
            {["all", "pending", "in_progress", "resolved", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "in_progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">{filteredEnquiries.length}</span> of{" "}
            <span className="text-slate-300 font-semibold">{enquiries.length}</span> enquiries
          </p>
        </div>
      </div>

      {/* ─── ENQUIRIES TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
            <p className="text-sm text-slate-400">Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Inbox className="w-9 h-9 text-slate-600" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-slate-300">No Enquiries Found</h3>
              <p className="text-sm text-slate-500">
                {enquiries.length === 0
                  ? "Submit your first enquiry to get started"
                  : "No enquiries match your search"}
              </p>
            </div>
            {enquiries.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20"
              >
                <PenLine className="w-4 h-4" />
                Submit First Enquiry
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-12">
                    #
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
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-14">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedEnquiries.map((enquiry, index) => {
                  const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                  const statusConfig = STATUS_CONFIG[enquiry.status];
                  const priorityConfig = PRIORITY_CONFIG[enquiry.priority];
                  const categoryConfig = CATEGORY_CONFIG[enquiry.category];
                  const StatusIcon = statusConfig.icon;
                  const CategoryIcon = categoryConfig.icon;
                  const isExpanded = expandedEnquiry === enquiry._id;

                  return (
                    <>
                      <tr
                        key={enquiry._id}
                        onClick={() => setExpandedEnquiry(isExpanded ? null : enquiry._id)}
                        className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      >
                        <td className="px-5 py-4">
                          <span className="text-slate-500 font-mono text-xs">
                            {String(serialNo).padStart(2, "0")}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-[#90E0EF]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors truncate max-w-[200px]">
                                {enquiry.subject}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                {enquiry.message.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-${categoryConfig.color}-500/10 text-${categoryConfig.color}-400 border border-${categoryConfig.color}-500/20`}
                          >
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
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <p className="text-slate-300 text-xs">{formatDate(enquiry.createdAt)}</p>
                            <p className="text-[10px] text-slate-500">{formatTime(enquiry.createdAt)}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            className={`p-1.5 rounded-lg hover:bg-white/[0.05] transition-all ${
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

                      {/* Expanded Row */}
                      {isExpanded && (
                        <tr key={`${enquiry._id}-expanded`}>
                          <td colSpan={7} className="px-0 py-0">
                            <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Message */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    Your Message
                                  </h4>
                                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                      {enquiry.message}
                                    </p>
                                  </div>
                                </div>

                                {/* Response */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Admin Response
                                  </h4>
                                  {enquiry.adminResponse ? (
                                    <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {enquiry.adminResponse}
                                      </p>
                                      {enquiry.respondedBy && enquiry.respondedAt && (
                                        <p className="text-[10px] text-slate-500 mt-3 pt-3 border-t border-white/[0.04]">
                                          Responded by {enquiry.respondedBy.username} on{" "}
                                          {formatDate(enquiry.respondedAt)}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                                      <Clock className="w-4 h-4 text-amber-400" />
                                      <p className="text-xs text-slate-400">
                                        Awaiting response from our team
                                      </p>
                                    </div>
                                  )}
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

        {/* Pagination */}
        {!loading && filteredEnquiries.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── HELP NOTE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62]/30 to-[#00B4D8]/10 border border-[#00B4D8]/15 p-6">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-[#00B4D8]" />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">Need urgent assistance?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact us at{" "}
              <a href="mailto:support@ataslabs.com" className="text-[#00B4D8] hover:text-[#90E0EF]">
                support@ataslabs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}