"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
  Tag,
  Beaker,
  Save,
  RotateCcw,
  Microscope,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Clock,
  FileText,
  Ruler,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  PackageOpen,
  Activity,
  MoreVertical,
  ExternalLink,
  Info,
} from "lucide-react";

interface Parameter {
  _id?: string;
  parameterName: string;
  testMethod: string;
  minRange: number;
  maxRange: number;
  accreditationStatus: string;
  referenceParameter: string;
}

const ACCREDITATION_OPTIONS = [
  "Accredited",
  "Non-Accredited",
  "Applied for Accreditation",
  "Under Review",
  "Suspended",
];

const STATUS_CONFIG: Record<
  string,
  {
    icon: any;
    bg: string;
    border: string;
    text: string;
    dot: string;
  }
> = {
  Accredited: {
    icon: ShieldCheck,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  "Non-Accredited": {
    icon: ShieldAlert,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  "Applied for Accreditation": {
    icon: Clock,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  "Under Review": {
    icon: Search,
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400",
  },
  Suspended: {
    icon: AlertCircle,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

const getStatusConfig = (status: string) => {
  return (
    STATUS_CONFIG[status] || {
      icon: ShieldQuestion,
      bg: "bg-white/[0.05]",
      border: "border-white/[0.08]",
      text: "text-slate-400",
      dot: "bg-slate-400",
    }
  );
};

export default function ParameterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [programName, setProgramName] = useState("");
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [filteredParams, setFilteredParams] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Parameter>({
    parameterName: "",
    testMethod: "",
    minRange: 0,
    maxRange: 0,
    accreditationStatus: "",
    referenceParameter: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const showToast = (text: string, type: "success" | "error") => {
    setNotificationMessage(text);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const fetchProgram = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pt-programs/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setProgramName(data?.programName || "");
      setParameters(data?.parameters || []);
    } catch {
      showToast("Failed to fetch program data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgram();
    setTimeout(() => setIsLoaded(true), 100);
  }, [id]);

  // Filter + Search
  useEffect(() => {
    let filtered = parameters.filter((p) => {
      const matchSearch =
        p.parameterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.testMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.referenceParameter?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "all" || p.accreditationStatus === filterStatus;

      return matchSearch && matchStatus;
    });

    setFilteredParams(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, parameters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      const url = editingId
        ? `/api/admin/pt-programs/${id}/parameters/${editingId}`
        : `/api/admin/pt-programs/${id}/parameters`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast(
        editingId
          ? "Parameter updated successfully"
          : "Parameter added successfully",
        "success"
      );
      resetForm();
      fetchProgram();
    } catch {
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      parameterName: "",
      testMethod: "",
      minRange: 0,
      maxRange: 0,
      accreditationStatus: "",
      referenceParameter: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const deleteParameter = async (paramId: string) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/pt-programs/${id}/parameters/${paramId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      showToast("Parameter deleted successfully", "success");
      setDeleteConfirm(null);
      fetchProgram();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const editParameter = (param: Parameter) => {
    setForm({
      parameterName: param.parameterName,
      testMethod: param.testMethod,
      minRange: param.minRange,
      maxRange: param.maxRange,
      accreditationStatus: param.accreditationStatus,
      referenceParameter: param.referenceParameter,
    });
    setEditingId(param._id || null);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Stats
  const statusCounts = ACCREDITATION_OPTIONS.reduce(
    (acc, status) => {
      acc[status] = parameters.filter(
        (p) => p.accreditationStatus === status
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // Pagination
  const totalPages = Math.ceil(filteredParams.length / itemsPerPage);
  const paginatedParams = filteredParams.slice(
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
                  Delete Parameter?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This action cannot be undone. The parameter will be permanently
                  removed from this program.
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
                  onClick={() => deleteParameter(deleteConfirm)}
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

      {/* ─── BREADCRUMB ─── */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-300 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <ChevronRight className="w-3 h-3" />
        <Link
          href="/dashboard/admin/pt-programs"
          className="hover:text-[#00B4D8] transition-colors"
        >
          PT Programs
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300 font-medium truncate max-w-[200px]">
          {programName || "Loading..."}
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#00B4D8] font-medium">Parameters</span>
      </div>

      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20">
            <Microscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-0.5">
              Managing Parameters For
            </p>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {programName || "Loading..."}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add, edit, and manage testing parameters for this PT program
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
              Add Parameter
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </>
          )}
        </button>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all duration-500">
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00B4D8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
          <div className="relative">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {parameters.length}
            </p>
          </div>
        </div>

        {/* Per-status counts */}
        {ACCREDITATION_OPTIONS.map((status) => {
          const config = getStatusConfig(status);
          const StatusIcon = config.icon;
          const count = statusCounts[status] || 0;

          return (
            <div
              key={status}
              className="group relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all duration-500 cursor-pointer"
              onClick={() =>
                setFilterStatus(filterStatus === status ? "all" : status)
              }
            >
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate max-w-[100px]">
                    {status}
                  </p>
                  <p className="text-2xl font-bold text-white tabular-nums">
                    {count}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center flex-shrink-0`}
                >
                  <StatusIcon className={`w-4 h-4 ${config.text}`} />
                </div>
              </div>
              {filterStatus === status && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── FORM PANEL ─── */}
      <div
        ref={formRef}
        className={`transition-all duration-500 overflow-hidden ${
          showForm
            ? "max-h-[700px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
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
                    {editingId ? "Edit Parameter" : "Add New Parameter"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId
                      ? "Update the parameter details below"
                      : "Fill in the details to add a new testing parameter"}
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
                {/* Parameter Name */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <Beaker className="w-3 h-3" />
                    Parameter Name
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead (Pb)"
                    value={form.parameterName}
                    onChange={(e) =>
                      setForm({ ...form, parameterName: e.target.value })
                    }
                    required
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Test Method */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <FileText className="w-3 h-3" />
                    Test Method
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IS 3025 Part 47"
                    value={form.testMethod}
                    onChange={(e) =>
                      setForm({ ...form, testMethod: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Min Range */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <BarChart3 className="w-3 h-3" />
                    Min Range
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.minRange || ""}
                    onChange={(e) =>
                      setForm({ ...form, minRange: Number(e.target.value) })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Max Range */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <BarChart3 className="w-3 h-3" />
                    Max Range
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={form.maxRange || ""}
                    onChange={(e) =>
                      setForm({ ...form, maxRange: Number(e.target.value) })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
                </div>

                {/* Accreditation Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    Accreditation Status
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.accreditationStatus}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accreditationStatus: e.target.value,
                        })
                      }
                      required
                      className="appearance-none w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all cursor-pointer"
                    >
                      <option value="" className="bg-[#0d1a2d] text-slate-400">
                        Select Status
                      </option>
                      {ACCREDITATION_OPTIONS.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-[#0d1a2d] text-white"
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Reference Parameter */}
                <div className="lg:col-span-2 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <BookOpen className="w-3 h-3" />
                    Reference Parameter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ISO/IEC 17043"
                    value={form.referenceParameter}
                    onChange={(e) =>
                      setForm({ ...form, referenceParameter: e.target.value })
                    }
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                  />
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
                    ? "Update Parameter"
                    : "Add Parameter"}
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

      {/* ─── SEARCH & FILTER ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-5">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, method, or reference..."
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

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 bg-[#060d19]/40 border border-white/[0.06] rounded-xl p-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                filterStatus === "all"
                  ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              All
            </button>
            {ACCREDITATION_OPTIONS.map((status) => {
              const config = getStatusConfig(status);
              return (
                <button
                  key={status}
                  onClick={() =>
                    setFilterStatus(filterStatus === status ? "all" : status)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    filterStatus === status
                      ? `${config.bg} ${config.text} border ${config.border}`
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-semibold">
              {filteredParams.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-semibold">
              {parameters.length}
            </span>{" "}
            parameters
          </p>
        </div>
      </div>

      {/* ─── TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading && parameters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
            <p className="text-sm text-slate-400">Loading parameters...</p>
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
                    Parameter Name
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Test Method
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Range
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Accreditation
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Reference
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginatedParams.map((param, index) => {
                  const serialNo =
                    (currentPage - 1) * itemsPerPage + index + 1;
                  const config = getStatusConfig(param.accreditationStatus);
                  const StatusIcon = config.icon;

                  return (
                    <tr
                      key={param._id}
                      className="group hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      {/* Serial */}
                      <td className="px-5 py-4">
                        <span className="text-slate-500 font-mono text-xs">
                          {String(serialNo).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Parameter Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                            <Beaker className="w-4 h-4 text-[#90E0EF]" />
                          </div>
                          <span className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300">
                            {param.parameterName}
                          </span>
                        </div>
                      </td>

                      {/* Test Method */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-400 min-w-[120px]">
                          <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          <span className="text-sm">{param.testMethod || "—"}</span>
                        </div>
                      </td>

                      {/* Range */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3D62]/20 border border-[#0A3D62]/20 min-w-[100px]">
                          <BarChart3 className="w-3.5 h-3.5 text-[#00B4D8]" />
                          <span className="text-sm font-mono font-medium text-slate-300">
                            {param.minRange}
                          </span>
                          <span className="text-slate-600 text-xs">—</span>
                          <span className="text-sm font-mono font-medium text-slate-300">
                            {param.maxRange}
                          </span>
                        </div>
                      </td>

                      {/* Accreditation Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bg} ${config.border} ${config.text} border`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {param.accreditationStatus}
                        </span>
                      </td>

                      {/* Reference */}
                      <td className="px-5 py-4">
                        {param.referenceParameter ? (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <BookOpen className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="text-sm">
                              {param.referenceParameter}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-sm">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => editParameter(param)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/8 border border-amber-500/12 hover:bg-amber-500/15 hover:border-amber-500/25 transition-all duration-200"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(param._id!)}
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
        {!loading && parameters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <PackageOpen className="w-9 h-9 text-slate-600" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-slate-300">
                No Parameters Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Start by adding testing parameters to this PT program.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] shadow-lg shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Parameter
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && parameters.length > 0 && filteredParams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <Search className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">
                No results found
              </h3>
              <p className="text-xs text-slate-500">
                No parameters match your search or filter criteria.
              </p>
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
        {filteredParams.length > 0 && (
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
                  filteredParams.length
                )}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-medium">
                {filteredParams.length}
              </span>{" "}
              parameters
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