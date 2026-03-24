"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
  Tag,
  Truck,
  CalendarCheck,
  IndianRupee,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Beaker,
  Save,
  RotateCcw,
  ExternalLink,
  Microscope,
  MoreVertical,
  FileText,
  ShieldCheck,
  Clock,
  BarChart3,
  ChevronDown,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpRight,
} from "lucide-react";

interface PTProgram {
  _id?: string;
  programName: string;
  schemeCode: string;
  dispatchDate?: string;
  lastDateOfConsent?: string;
  fees: number;
}

type MessageType = "success" | "error" | null;

export default function PTProgramsPage() {
  const [programs, setPrograms] = useState<PTProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<PTProgram[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "fees" | "date">("name");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const formRef = useRef<HTMLDivElement>(null);

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<MessageType>(null);

  const [form, setForm] = useState<PTProgram>({
    programName: "",
    schemeCode: "",
    dispatchDate: "",
    lastDateOfConsent: "",
    fees: 0,
  });

  const showToast = (text: string, type: MessageType) => {
    setNotificationMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pt-programs");
      const data = await res.json();
      setPrograms(data || []);
    } catch {
      showToast("Failed to fetch programs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Search + Sort
  useEffect(() => {
    let filtered = programs.filter(
      (p) =>
        p.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.schemeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.programName.localeCompare(b.programName);
      if (sortBy === "fees") return a.fees - b.fees;
      if (sortBy === "date")
        return (
          new Date(a.dispatchDate || "").getTime() -
          new Date(b.dispatchDate || "").getTime()
        );
      return 0;
    });

    setFilteredPrograms(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, programs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = editingId
        ? `/api/admin/pt-programs/${editingId}`
        : `/api/admin/pt-programs`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast(
        editingId
          ? "PT Program updated successfully"
          : "PT Program added successfully",
        "success"
      );
      resetForm();
      fetchPrograms();
    } catch {
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pt-programs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("PT Program deleted successfully", "success");
      setDeleteConfirm(null);
      fetchPrograms();
    } catch {
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const editProgram = (prog: PTProgram) => {
    setForm({
      programName: prog.programName,
      schemeCode: prog.schemeCode,
      dispatchDate: prog.dispatchDate?.split("T")[0] || "",
      lastDateOfConsent: prog.lastDateOfConsent?.split("T")[0] || "",
      fees: prog.fees,
    });
    setEditingId(prog._id || null);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const resetForm = () => {
    setForm({
      programName: "",
      schemeCode: "",
      dispatchDate: "",
      lastDateOfConsent: "",
      fees: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getDaysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    return Math.ceil(
      (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = filteredPrograms.slice(
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
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 p-0.5 rounded hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── DELETE CONFIRM MODAL ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#0d1a2d] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/50 via-red-400 to-red-500/50" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-white">
                  Delete PT Program?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This action cannot be undone. All parameters associated with
                  this program will also be removed.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProgram(deleteConfirm)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              PT Programs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage proficiency testing programs and parameters
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
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
              Add New Program
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </>
          )}
        </button>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Programs",
            value: programs.length,
            icon: FlaskConical,
            gradient: "from-[#0A3D62] to-[#00B4D8]",
            glow: "#00B4D8",
          },
          {
            label: "Active Programs",
            value: programs.filter((p) => {
              const d = getDaysUntil(p.lastDateOfConsent);
              return d === null || d > 0;
            }).length,
            icon: CheckCircle2,
            gradient: "from-emerald-600 to-emerald-400",
            glow: "#34d399",
          },
          {
            label: "Expiring Soon",
            value: programs.filter((p) => {
              const d = getDaysUntil(p.lastDateOfConsent);
              return d !== null && d > 0 && d <= 14;
            }).length,
            icon: Clock,
            gradient: "from-amber-600 to-amber-400",
            glow: "#fbbf24",
          },
          {
            label: "Expired",
            value: programs.filter((p) => {
              const d = getDaysUntil(p.lastDateOfConsent);
              return d !== null && d <= 0;
            }).length,
            icon: AlertCircle,
            gradient: "from-red-600 to-red-400",
            glow: "#f87171",
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

      {/* ─── FORM PANEL ─── */}
      <div
        ref={formRef}
        className={`transition-all duration-500 overflow-hidden ${
          showForm
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
          {/* Top accent */}
          <div
            className={`h-[2px] bg-gradient-to-r ${
              editingId
                ? "from-amber-500/50 via-amber-400 to-amber-500/50"
                : "from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]"
            }`}
          />

          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#00B4D8]/5 blur-3xl" />

          <div className="relative p-6 md:p-8">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    editingId
                      ? "bg-amber-500/15 border border-amber-500/20"
                      : "bg-[#00B4D8]/15 border border-[#00B4D8]/20"
                  }`}
                >
                  {editingId ? (
                    <Pencil className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#00B4D8]" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {editingId ? "Edit PT Program" : "Add New PT Program"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId
                      ? "Update the program details below"
                      : "Fill in the details to create a new program"}
                  </p>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Program Name */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Beaker className="w-3 h-3" />
                    Program Name
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="e.g. Metals in Soil"
                    value={form.programName}
                    onChange={(e) =>
                      setForm({ ...form, programName: e.target.value })
                    }
                    required
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Scheme Code */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    Scheme Code
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    placeholder="e.g. PTW/MSOIL/785/2025"
                    value={form.schemeCode}
                    onChange={(e) =>
                      setForm({ ...form, schemeCode: e.target.value })
                    }
                    required
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Dispatch Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Truck className="w-3 h-3" />
                    Dispatch Date
                  </label>
                  <input
                    type="date"
                    value={form.dispatchDate}
                    onChange={(e) =>
                      setForm({ ...form, dispatchDate: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Last Date of Consent */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <CalendarCheck className="w-3 h-3" />
                    Last Date of Consent
                  </label>
                  <input
                    type="date"
                    value={form.lastDateOfConsent}
                    onChange={(e) =>
                      setForm({ ...form, lastDateOfConsent: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Fees */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <IndianRupee className="w-3 h-3" />
                    Program Fees (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.fees || ""}
                      onChange={(e) =>
                        setForm({ ...form, fees: Number(e.target.value) })
                      }
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    editingId
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {loading
                    ? "Processing..."
                    : editingId
                    ? "Update Program"
                    : "Add Program"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── SEARCH & FILTERS ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by program name or scheme code..."
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

          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "fees" | "date")
              }
              className="appearance-none bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="fees">Sort by Fees</option>
              <option value="date">Sort by Date</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">
              {filteredPrograms.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-semibold">
              {programs.length}
            </span>{" "}
            programs
          </p>
        </div>
      </div>

      {/* ─── TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading && programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
            <p className="text-sm text-slate-400">Loading programs...</p>
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
                    Program Name
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Scheme Code
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Dispatch
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Last Consent
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Fees
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedPrograms.map((prog, index) => {
                  const serialNo =
                    (currentPage - 1) * itemsPerPage + index + 1;
                  const daysLeft = getDaysUntil(prog.lastDateOfConsent);
                  const isExpired = daysLeft !== null && daysLeft <= 0;
                  const isUrgent =
                    daysLeft !== null && daysLeft > 0 && daysLeft <= 14;

                  return (
                    <tr
                      key={prog._id}
                      className="group hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      {/* Serial */}
                      <td className="px-5 py-4">
                        <span className="text-slate-500 font-mono text-xs">
                          {String(serialNo).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Program Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                            <Beaker className="w-4 h-4 text-[#90E0EF]" />
                          </div>
                          <span className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300">
                            {prog.programName}
                          </span>
                        </div>
                      </td>

                      {/* Scheme Code */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00B4D8]/8 border border-[#00B4D8]/12 text-[11px] font-mono font-semibold text-[#90E0EF]">
                          <Tag className="w-3 h-3" />
                          {prog.schemeCode}
                        </span>
                      </td>

                      {/* Dispatch Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Truck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          {formatDate(prog.dispatchDate)}
                        </div>
                      </td>

                      {/* Last Consent */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div
                            className={`flex items-center gap-2 ${
                              isExpired
                                ? "text-red-400"
                                : isUrgent
                                ? "text-amber-400"
                                : "text-slate-400"
                            }`}
                          >
                            <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" />
                            {formatDate(prog.lastDateOfConsent)}
                          </div>

                          {isUrgent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/15 text-[10px] font-semibold text-amber-400">
                              <Clock className="w-2.5 h-2.5 animate-pulse" />
                              {daysLeft}d left
                            </span>
                          )}
                          {isExpired && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/15 text-[10px] font-semibold text-red-400">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Expired
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Fees */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-[#00B4D8]" />
                          <span className="text-base font-bold text-white tabular-nums">
                            {prog.fees.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/dashboard/admin/pt-programs/${prog._id}/parameters`}
                            className="group/btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#90E0EF] bg-[#00B4D8]/8 border border-[#00B4D8]/12 hover:bg-[#00B4D8]/15 hover:border-[#00B4D8]/25 transition-all duration-200"
                          >
                            <Microscope className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Params</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </Link>

                          <button
                            onClick={() => editProgram(prog)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/8 border border-amber-500/12 hover:bg-amber-500/15 hover:border-amber-500/25 transition-all duration-200"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(prog._id!)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/8 border border-red-500/12 hover:bg-red-500/15 hover:border-red-500/25 transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Delete</span>
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

        {/* Empty State */}
        {!loading && programs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <PackageOpen className="w-9 h-9 text-slate-600" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-slate-300">
                No PT Programs Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Get started by adding your first proficiency testing program.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Program
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!loading &&
          programs.length > 0 &&
          filteredPrograms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-600" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-slate-300">
                  No results found
                </h3>
                <p className="text-xs text-slate-500">
                  No programs match &quot;{searchQuery}&quot;
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
        {filteredPrograms.length > 0 && (
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
                  filteredPrograms.length
                )}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-medium">
                {filteredPrograms.length}
              </span>{" "}
              programs
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