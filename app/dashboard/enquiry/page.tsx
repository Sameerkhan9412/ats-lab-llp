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
  UserCog,
  Building2,
  Mail,
  Smartphone,
  FileText,
  Clock,
  ArrowUpRight,
  PackageOpen,
  Eye,
  ChevronDown,
  MoreHorizontal,
  MessageCircle,
  Inbox,
  PenLine,
  Hash,
  Plus,
  RotateCcw,
  ExternalLink,
  Info,
} from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  mobile: string;
  message: string;
  createdAt: string;
  status?: string;
  reply?: string;
}

export default function ContactUsPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEnquiry, setExpandedEnquiry] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    mobile: "",
    message: "",
  });

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchProfile();
    fetchEnquiries();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = enquiries.filter(
      (e) =>
        e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEnquiries(filtered);
    setCurrentPage(1);
  }, [searchQuery, enquiries]);

  const showToast = (text: string, type: "success" | "error") => {
    setNotificationMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  // ─── FETCH PROFILE & PREFILL ───
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      const data = await res.json();
      if (data?.profile) {
        const p = data.profile;
        setFormData((prev) => ({
          ...prev,
          name: p.contact?.name || "",
          companyName: p.participant?.name || "",
          email: p.contact?.email || "",
          mobile: p.contact?.mobile || "",
        }));
      }
    } catch {
      console.error("Failed to fetch profile");
    }
  };

  // ─── FETCH ENQUIRIES ───
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiry", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data || []);
      }
    } catch {
      console.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  // ─── SUBMIT ENQUIRY ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (!formData.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email", "error");
      return;
    }
    if (!formData.mobile.trim()) {
      showToast("Mobile number is required", "error");
      return;
    }
    if (!formData.message.trim()) {
      showToast("Please write a message", "error");
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

      if (!res.ok) throw new Error();

      showToast("Enquiry submitted successfully!", "success");
      setFormData((prev) => ({ ...prev, message: "" }));
      setShowForm(false);
      fetchEnquiries();
    } catch {
      showToast("Failed to submit enquiry. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const getStatusConfig = (status?: string) => {
    const s = status?.toLowerCase();
    if (s === "resolved" || s === "replied") {
      return {
        label: "Resolved",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
        icon: CheckCircle2,
      };
    }
    if (s === "in-progress" || s === "reviewing") {
      return {
        label: "In Progress",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        dot: "bg-blue-400",
        icon: Clock,
      };
    }
    return {
      label: "Pending",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      dot: "bg-amber-400 animate-pulse",
      icon: Clock,
    };
  };

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalEnquiries = enquiries.length;
  const pendingCount = enquiries.filter(
    (e) =>
      !e.status ||
      e.status.toLowerCase() === "pending" ||
      e.status.toLowerCase() === "open"
  ).length;
  const resolvedCount = enquiries.filter(
    (e) =>
      e.status?.toLowerCase() === "resolved" ||
      e.status?.toLowerCase() === "replied"
  ).length;

  return (
    <div
      className={`space-y-8 transition-all duration-700 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* ─── TOAST ─── */}
      <div
        className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${
          showNotification
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-8 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl ${
            notificationType === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {notificationType === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{notificationMessage}</p>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 p-0.5 rounded hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              My Enquiry
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
            <RotateCcw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showForm
                ? "bg-white/[0.05] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08]"
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Enquiries",
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

      {/* ─── CONTACT FORM ─── */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          showForm
            ? "max-h-[800px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
          <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]" />
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#00B4D8]/5 blur-3xl" />

          <div className="relative p-6 md:p-8">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Submit New Enquiry
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your details have been pre-filled from your profile
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <FormInput
                  icon={UserCog}
                  label="Your Name"
                  required
                  value={formData.name}
                  onChange={(v) => handleChange("name", v)}
                  placeholder="Full name"
                />

                {/* Company */}
                <FormInput
                  icon={Building2}
                  label="Company Name"
                  required
                  value={formData.companyName}
                  onChange={(v) => handleChange("companyName", v)}
                  placeholder="Organization / Lab name"
                />

                {/* Email */}
                <FormInput
                  icon={Mail}
                  label="Email Address"
                  required
                  value={formData.email}
                  onChange={(v) => handleChange("email", v)}
                  placeholder="email@example.com"
                  type="email"
                />

                {/* Mobile */}
                <FormInput
                  icon={Smartphone}
                  label="Mobile Number"
                  required
                  value={formData.mobile}
                  onChange={(v) => handleChange("mobile", v)}
                  placeholder="+91 XXXXX XXXXX"
                  maxLength={13}
                />

                {/* Message */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <MessageCircle className="w-3 h-3 text-slate-500" />
                    Message
                    <span className="text-red-400 text-[10px]">*</span>
                    {formData.message.trim() && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />
                    )}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Describe your query, concern, or feedback in detail..."
                    rows={4}
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all resize-none"
                  />
                  {formData.message.length > 0 && (
                    <p className="text-[10px] text-slate-600 text-right tabular-nums">
                      {formData.message.length} characters
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                  {!submitting && (
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("message", "")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── ENQUIRY HISTORY ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#00B4D8]" />
              Enquiry History
            </h2>
            <p className="text-xs text-slate-500">
              Track the status of your submitted queries
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/15 to-transparent" />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, company, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
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
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-semibold">
                {filteredEnquiries.length}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-semibold">
                {enquiries.length}
              </span>{" "}
              enquiries
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
              <p className="text-sm text-slate-400">
                Loading enquiry history...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && filteredEnquiries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-12">
                      #
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                      Name & Company
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                      Contact
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                      Message
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                      Date
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-14">
                      <span className="sr-only">Expand</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {paginatedEnquiries.map((enquiry, index) => {
                    const serialNo =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    const statusConfig = getStatusConfig(enquiry.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedEnquiry === enquiry._id;

                    return (
                      <>
                        <tr
                          key={enquiry._id}
                          onClick={() =>
                            setExpandedEnquiry(
                              isExpanded ? null : enquiry._id
                            )
                          }
                          className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                        >
                          {/* Serial */}
                          <td className="px-5 py-4">
                            <span className="text-slate-500 font-mono text-xs">
                              {String(serialNo).padStart(2, "0")}
                            </span>
                          </td>

                          {/* Name & Company */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3 min-w-[160px]">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                                <UserCog className="w-4 h-4 text-[#90E0EF]" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 text-sm truncate max-w-[160px]">
                                  {enquiry.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
                                  {enquiry.companyName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <div className="space-y-1 min-w-[140px]">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                <span className="text-xs truncate max-w-[130px]">
                                  {enquiry.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Smartphone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                <span className="text-xs">
                                  {enquiry.mobile}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Message Preview */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-400 truncate max-w-[200px]">
                              {enquiry.message}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <CalendarDays className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                <span className="text-xs">
                                  {formatDate(enquiry.createdAt)}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 ml-5">
                                {formatTime(enquiry.createdAt)}
                              </p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                              />
                              {statusConfig.label}
                            </span>
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
                                  isExpanded
                                    ? "rotate-180 text-[#00B4D8]"
                                    : ""
                                }`}
                              />
                            </button>
                          </td>
                        </tr>

                        {/* ─── EXPANDED ROW ─── */}
                        {isExpanded && (
                          <tr key={`${enquiry._id}-expanded`}>
                            <td colSpan={7} className="px-0 py-0">
                              <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Full Message */}
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      Full Message
                                    </h4>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {enquiry.message}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Details & Reply */}
                                  <div className="space-y-4">
                                    {/* Contact Details */}
                                    <div className="space-y-3">
                                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <UserCog className="w-3.5 h-3.5" />
                                        Sender Details
                                      </h4>
                                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                                        <DetailRow
                                          label="Name"
                                          value={enquiry.name}
                                        />
                                        <DetailRow
                                          label="Company"
                                          value={enquiry.companyName}
                                        />
                                        <DetailRow
                                          label="Email"
                                          value={enquiry.email}
                                        />
                                        <DetailRow
                                          label="Mobile"
                                          value={enquiry.mobile}
                                        />
                                        <DetailRow
                                          label="Submitted"
                                          value={`${formatDate(
                                            enquiry.createdAt
                                          )} at ${formatTime(
                                            enquiry.createdAt
                                          )}`}
                                        />
                                      </div>
                                    </div>

                                    {/* Reply (if any) */}
                                    {enquiry.reply && (
                                      <div className="space-y-3">
                                        <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          Admin Reply
                                        </h4>
                                        <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {enquiry.reply}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* No reply yet */}
                                    {!enquiry.reply && (
                                      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                        <p className="text-xs text-slate-400">
                                          Awaiting response from our team.
                                          We&apos;ll get back to you soon.
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

          {/* Empty State */}
          {!loading && enquiries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 space-y-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Inbox className="w-9 h-9 text-slate-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#060d19] border border-white/[0.06] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="text-base font-semibold text-slate-300">
                  No Enquiries Yet
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Submit your first enquiry using the form above. Our team will
                  respond promptly.
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <PenLine className="w-4 h-4" />
                  Submit First Enquiry
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </button>
              )}
            </div>
          )}

          {/* No Search Results */}
          {!loading &&
            enquiries.length > 0 &&
            filteredEnquiries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Search className="w-7 h-7 text-slate-600" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-semibold text-slate-300">
                    No results found
                  </h3>
                  <p className="text-xs text-slate-500">
                    No enquiries match &quot;{searchQuery}&quot;
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all"
                >
                  <X className="w-3 h-3" />
                  Clear Search
                </button>
              </div>
            )}

          {/* Pagination */}
          {!loading && filteredEnquiries.length > 0 && (
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
                    filteredEnquiries.length
                  )}
                </span>{" "}
                of{" "}
                <span className="text-slate-300 font-medium">
                  {filteredEnquiries.length}
                </span>{" "}
                enquiries
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

      {/* ─── HELP NOTE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62]/30 to-[#00B4D8]/10 border border-[#00B4D8]/15 p-6">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#00B4D8]/5 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-[#00B4D8]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-300 font-medium">
              Need urgent assistance?
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              For critical issues, you can reach us directly at{" "}
              <a
                href="mailto:support@ptworld.com"
                className="text-[#00B4D8] hover:text-[#90E0EF] font-medium"
              >
                support@ptworld.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+919876543210"
                className="text-[#00B4D8] hover:text-[#90E0EF] font-medium"
              >
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */

function FormInput({
  icon: Icon,
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  icon: any;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  const isFilled = value?.trim()?.length > 0;

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="w-3 h-3 text-slate-500" />
        {label}
        {required && <span className="text-red-400 text-[10px]">*</span>}
        {isFilled && (
          <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-300 text-right">{value}</span>
    </div>
  );
}