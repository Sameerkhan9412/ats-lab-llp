"use client";

import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  Send,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  CalendarDays,
  Clock,
  FileText,
  Beaker,
  Upload,
  FileUp,
  FileCheck,
  Trash2,
  Info,
  ArrowUpRight,
  Plus,
  RotateCcw,
  Inbox,
  MessageCircle,
  Eye,
  CircleDot,
  PenLine,
  Shield,
  ShieldAlert,
  Hash,
  MoreHorizontal,
  PackageOpen,
  Ban,
  XCircle,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";

interface Complaint {
  _id: string;
  type: "general" | "pt";
  ptProgram?: string;
  description: string;
  hasEvidence: boolean;
  evidenceFile?: string;
  status?: string;
  reply?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, any> = {
  open: {
    label: "Open",
    icon: AlertCircle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400 animate-pulse",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
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
    icon: Ban,
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

const getStatusConfig = (status?: string) => {
  const key = status?.toLowerCase()?.replace(/\s+/g, "-") || "open";
  return (
    STATUS_CONFIG[key] || {
      label: status || "Open",
      icon: AlertCircle,
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      dot: "bg-amber-400 animate-pulse",
    }
  );
};

export default function RaiseComplaint() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // PT Programs list (fetched)
  const [ptPrograms, setPtPrograms] = useState<{ _id: string; programName: string }[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    type: "general" as "general" | "pt",
    ptProgram: "",
    description: "",
    hasEvidence: false,
    evidenceFile: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const showToast = (text: string, type: "success" | "error") => {
    setNotificationMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  useEffect(() => {
    fetchComplaints();
    fetchPTPrograms();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Search + Filter
  useEffect(() => {
    let filtered = complaints.filter((c) => {
      const matchSearch =
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ptProgram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "all" ||
        (c.status?.toLowerCase()?.replace(/\s+/g, "-") || "open") === filterStatus;

      return matchSearch && matchStatus;
    });

    setFilteredComplaints(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/complaints", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data || []);
      }
    } catch {
      console.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchPTPrograms = async () => {
    try {
      const res = await fetch("/api/admin/pt-programs");
      if (res.ok) {
        const data = await res.json();
        setPtPrograms(data || []);
      }
    } catch {
      console.error("Failed to fetch PT programs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      showToast("Please describe your complaint", "error");
      return;
    }

    if (formData.type === "pt" && !formData.ptProgram) {
      showToast("Please select a PT Program", "error");
      return;
    }

    if (formData.hasEvidence && !formData.evidenceFile) {
      showToast("Please upload supporting evidence", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("type", formData.type);
      payload.append("description", formData.description);
      payload.append("hasEvidence", String(formData.hasEvidence));
      if (formData.ptProgram) payload.append("ptProgram", formData.ptProgram);
      if (formData.evidenceFile) payload.append("evidence", formData.evidenceFile);

      const res = await fetch("/api/complaints", {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      if (!res.ok) throw new Error();

      showToast("Complaint submitted successfully!", "success");
      resetForm();
      setShowForm(false);
      fetchComplaints();
    } catch {
      showToast("Failed to submit complaint. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "general",
      ptProgram: "",
      description: "",
      hasEvidence: false,
      evidenceFile: null,
    });
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
  const totalComplaints = complaints.length;
  const openCount = complaints.filter(
    (c) => !c.status || c.status.toLowerCase() === "open"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "in-progress" || c.status?.toLowerCase() === "in progress"
  ).length;

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <button onClick={() => setShowNotification(false)} className="ml-2 p-0.5 rounded hover:bg-white/10">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/80 to-[#0A3D62] flex items-center justify-center shadow-xl shadow-red-500/10">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Raise Complaints
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit complaints and track their resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showForm
                ? "bg-white/[0.05] text-slate-300 border border-white/[0.08] hover:bg-white/[0.08]"
                : "bg-gradient-to-r from-red-500/80 to-[#0A3D62] text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {showForm ? (
              <><X className="w-4 h-4" />Close Form</>
            ) : (
              <>
                <Plus className="w-4 h-4" />New Complaint
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalComplaints, icon: Shield, gradient: "from-[#0A3D62] to-[#00B4D8]", glow: "#00B4D8" },
          { label: "Open", value: openCount, icon: AlertCircle, gradient: "from-amber-600 to-amber-400", glow: "#fbbf24" },
          { label: "In Progress", value: inProgressCount, icon: Clock, gradient: "from-blue-600 to-blue-400", glow: "#60a5fa" },
          { label: "Resolved", value: resolvedCount, icon: CheckCircle2, gradient: "from-emerald-600 to-emerald-400", glow: "#34d399" },
        ].map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-500">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" style={{ backgroundColor: stat.glow + "15" }} />
            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight text-white tabular-nums">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`} style={{ boxShadow: `0 8px 24px ${stat.glow}20` }}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── COMPLAINT FORM ─── */}
      <div className={`transition-all duration-500 overflow-hidden ${showForm ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
          <div className="h-[2px] bg-gradient-to-r from-red-500/40 via-[#00B4D8] to-red-500/40" />
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#00B4D8]/5 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Submit a Complaint</h2>
                  <p className="text-xs text-slate-500">Provide details about your issue</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ─ Nature of Complaint ─ */}
              <div className="space-y-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 text-slate-500" />
                  Nature of Complaint
                  <span className="text-red-400 text-[10px]">*</span>
                </label>

                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "general" as const, label: "General Complaint", icon: MessageCircle, desc: "Service, quality, or general issues" },
                    { value: "pt" as const, label: "PT Program Related", icon: Beaker, desc: "Issues with specific PT programs" },
                  ].map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = formData.type === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, type: opt.value, ptProgram: "" }))}
                        className={`group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 flex-1 min-w-[220px] ${
                          isSelected
                            ? "bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30"
                            : "bg-white/[0.02] border-2 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4 text-[#00B4D8]" />
                          </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isSelected ? "bg-[#00B4D8]/20 text-[#00B4D8]" : "bg-white/[0.04] text-slate-500"
                        }`}>
                          <OptIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isSelected ? "text-[#90E0EF]" : "text-slate-300"}`}>{opt.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ─ PT Program Selection ─ */}
              {formData.type === "pt" && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Beaker className="w-3 h-3 text-slate-500" />
                    Select PT Program
                    <span className="text-red-400 text-[10px]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.ptProgram}
                      onChange={(e) => setFormData((p) => ({ ...p, ptProgram: e.target.value }))}
                      className="appearance-none w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all cursor-pointer"
                    >
                      <option value="" className="bg-[#0d1a2d] text-slate-400">Select PT Program</option>
                      {ptPrograms.map((prog) => (
                        <option key={prog._id} value={prog.programName} className="bg-[#0d1a2d] text-white">
                          {prog.programName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* ─ Description ─ */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <FileText className="w-3 h-3 text-slate-500" />
                  Description
                  <span className="text-red-400 text-[10px]">*</span>
                  {formData.description.trim() && <CheckCircle2 className="w-3 h-3 text-emerald-500/50 ml-auto" />}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the issue in detail — what happened, when, and what you expected..."
                  rows={5}
                  className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 hover:border-white/[0.1] transition-all resize-none"
                />
                {formData.description.length > 0 && (
                  <p className="text-[10px] text-slate-600 text-right tabular-nums">{formData.description.length} characters</p>
                )}
              </div>

              {/* ─ Evidence Toggle ─ */}
              <div className="space-y-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <Upload className="w-3 h-3 text-slate-500" />
                  Supporting Evidence
                  <span className="text-red-400 text-[10px]">*</span>
                </label>

                <div className="flex gap-3">
                  {[
                    { value: true, label: "Yes, I have evidence" },
                    { value: false, label: "No evidence to attach" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, hasEvidence: opt.value, evidenceFile: opt.value ? p.evidenceFile : null }))}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.hasEvidence === opt.value
                          ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                          : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.05]"
                      }`}
                    >
                      <CircleDot className={`w-4 h-4 ${formData.hasEvidence === opt.value ? "text-[#00B4D8]" : "text-slate-600"}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* ─ File Upload ─ */}
                {formData.hasEvidence && (
                  <div className="mt-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setFormData((p) => ({ ...p, evidenceFile: e.target.files?.[0] || null }))}
                    />

                    {formData.evidenceFile ? (
                      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.03] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                              <FileCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-emerald-400 truncate max-w-[200px]">{formData.evidenceFile.name}</p>
                              <p className="text-[11px] text-slate-500">{(formData.evidenceFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-400 transition-all">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => setFormData((p) => ({ ...p, evidenceFile: null }))} className="p-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 hover:bg-red-500/10 text-red-400 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full relative overflow-hidden rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] hover:border-[#00B4D8]/20 hover:bg-[#00B4D8]/[0.02] transition-all duration-300 p-6 flex flex-col items-center gap-3 cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                          <FileUp className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-300">Click to upload evidence</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Screenshots, documents, or photos</p>
                        </div>
                        <p className="text-[10px] text-slate-600">PDF, JPG, PNG, DOC • Max 10MB</p>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ─ Form Actions ─ */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/80 to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Submitting..." : "Submit Complaint"}
                  {!submitting && <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                </button>

                <button type="button" onClick={resetForm} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all">
                  <RotateCcw className="w-4 h-4" />Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── COMPLAINT HISTORY ─── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#00B4D8]" />Complaint History
          </h2>
          <p className="text-xs text-slate-500">Track the status of your submitted complaints</p>
        </div>

        {/* Search + Filter */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/15 to-transparent" />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search complaints..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10"><X className="w-3.5 h-3.5 text-slate-400" /></button>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[#060d19]/40 border border-white/[0.06] rounded-xl p-1 overflow-x-auto scrollbar-none">
              {[
                { value: "all", label: "All" },
                { value: "open", label: "Open" },
                { value: "in-progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "closed", label: "Closed" },
              ].map((opt) => (
                <button key={opt.value} onClick={() => setFilterStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterStatus === opt.value
                      ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs text-slate-500">
              Showing <span className="text-slate-300 font-semibold">{filteredComplaints.length}</span> of{" "}
              <span className="text-slate-300 font-semibold">{complaints.length}</span> complaints
            </p>
          </div>
        </div>

        {/* ─── TABLE ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
              <p className="text-sm text-slate-400">Loading complaints...</p>
            </div>
          )}

          {!loading && filteredComplaints.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-12">#</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Type</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Description</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Date</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Evidence</th>
                    <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">Status</th>
                    <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-14"><span className="sr-only">Expand</span></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {paginatedComplaints.map((complaint, index) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    const statusConfig = getStatusConfig(complaint.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedComplaint === complaint._id;

                    return (
                      <>
                        <tr key={complaint._id} onClick={() => setExpandedComplaint(isExpanded ? null : complaint._id)}
                          className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer">

                          <td className="px-5 py-4"><span className="text-slate-500 font-mono text-xs">{String(serialNo).padStart(2, "0")}</span></td>

                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              complaint.type === "pt"
                                ? "bg-violet-500/10 border border-violet-500/20 text-violet-400"
                                : "bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#90E0EF]"
                            }`}>
                              {complaint.type === "pt" ? <Beaker className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                              {complaint.type === "pt" ? "PT Program" : "General"}
                            </span>
                            {complaint.ptProgram && (
                              <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[140px]">{complaint.ptProgram}</p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-400 truncate max-w-[250px]">{complaint.description}</p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs">{formatDate(complaint.createdAt)}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 ml-5">{formatTime(complaint.createdAt)}</p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {complaint.hasEvidence ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/15 text-[10px] font-semibold text-emerald-400">
                                <FileCheck className="w-3 h-3" />Attached
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600">None</span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                              {statusConfig.label}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <button className={`p-1.5 rounded-lg hover:bg-white/[0.05] transition-all duration-300 ${isExpanded ? "bg-white/[0.05]" : ""}`}>
                              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#00B4D8]" : ""}`} />
                            </button>
                          </td>
                        </tr>

                        {/* Expanded */}
                        {isExpanded && (
                          <tr key={`${complaint._id}-expanded`}>
                            <td colSpan={7} className="px-0 py-0">
                              <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5" />Full Description
                                    </h4>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                                    </div>
                                    {complaint.hasEvidence && complaint.evidenceFile && (
                                      <a href={complaint.evidenceFile} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/8 border border-[#00B4D8]/12 hover:bg-[#00B4D8]/15 transition-all">
                                        <Eye className="w-3.5 h-3.5" />View Evidence
                                      </a>
                                    )}
                                  </div>

                                  <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                                      <DetailRow label="Type" value={complaint.type === "pt" ? "PT Program" : "General"} />
                                      {complaint.ptProgram && <DetailRow label="Program" value={complaint.ptProgram} />}
                                      <DetailRow label="Submitted" value={`${formatDate(complaint.createdAt)} at ${formatTime(complaint.createdAt)}`} />
                                      <DetailRow label="Status" value={statusConfig.label} />
                                    </div>

                                    {complaint.reply ? (
                                      <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                                          <CheckCircle2 className="w-3.5 h-3.5" />Admin Response
                                        </h4>
                                        <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{complaint.reply}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                        <p className="text-xs text-slate-400">Your complaint is being reviewed. We&apos;ll respond soon.</p>
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

          {/* Empty */}
          {!loading && complaints.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 space-y-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"><PackageOpen className="w-9 h-9 text-slate-600" /></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#060d19] border border-white/[0.06] flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-slate-500" /></div>
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="text-base font-semibold text-slate-300">No Complaints Filed</h3>
                <p className="text-sm text-slate-500 max-w-sm">You haven&apos;t submitted any complaints yet.</p>
              </div>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500/80 to-[#0A3D62] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <PenLine className="w-4 h-4" />File First Complaint
                </button>
              )}
            </div>
          )}

          {/* No results */}
          {!loading && complaints.length > 0 && filteredComplaints.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center"><Search className="w-7 h-7 text-slate-600" /></div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-slate-300">No results found</h3>
                <p className="text-xs text-slate-500">No complaints match your criteria.</p>
              </div>
              <button onClick={() => { setSearchQuery(""); setFilterStatus("all"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all">
                <X className="w-3 h-3" />Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredComplaints.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-white/[0.06] gap-4">
              <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300 font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="text-slate-300 font-medium">{Math.min(currentPage * itemsPerPage, filteredComplaints.length)}</span> of{" "}
                <span className="text-slate-300 font-medium">{filteredComplaints.length}</span>
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5" />Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      currentPage === page ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20" : "text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]"
                    }`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Next<ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── HELP ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 to-[#00B4D8]/10 border border-white/[0.06] p-6">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#00B4D8]/5 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-[#00B4D8]" />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">Need immediate help?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              For urgent issues, email <a href="mailto:complaints@ptworld.com" className="text-[#00B4D8] hover:text-[#90E0EF] font-medium">complaints@ptworld.com</a> or
              call <a href="tel:+919876543210" className="text-[#00B4D8] hover:text-[#90E0EF] font-medium">+91 98765 43210</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HELPER ─── */
function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-300 text-right">{value}</span>
    </div>
  );
}