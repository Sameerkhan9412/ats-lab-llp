"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Beaker,
  Tag,
  IndianRupee,
  Truck,
  CalendarCheck,
  FlaskConical,
  Ruler,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Activity,
  ChevronRight,
  Search,
  Filter,
  Copy,
  CheckCircle2,
  PackagePlus,
  ShoppingCart,
  ArrowUpRight,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  FileText,
  Hash,
  Microscope,
  BarChart3,
  ChevronDown,
  Download,
  Printer,
  MoreHorizontal,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function ProgramDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [program, setProgram] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [expandedParam, setExpandedParam] = useState<string | null>(null);

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch(`/api/admin/pt-programs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgram(data);
        setTimeout(() => setIsLoaded(true), 100);
      });
  }, [id]);

  const showToast = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const copySchemeCode = () => {
    navigator.clipboard.writeText(program.schemeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: program._id,
          programName: program.programName,
          fees: program.fees,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Already in cart", "error");
      } else {
        setAddedToCart(true);
        showToast("Added to cart successfully!", "success");
      }
    } catch {
      showToast("Failed to add to cart", "error");
    }
    setAddingToCart(false);
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s?.includes("accredited") && !s?.includes("non") && !s?.includes("not")) {
      return {
        label: "Accredited",
        icon: ShieldCheck,
        color: "emerald",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      };
    }
    if (s?.includes("non") || s?.includes("not")) {
      return {
        label: "Non-Accredited",
        icon: ShieldAlert,
        color: "amber",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        text: "text-amber-400",
        dot: "bg-amber-400",
      };
    }
    return {
      label: status || "Unknown",
      icon: ShieldQuestion,
      color: "slate",
      bg: "bg-white/[0.05]",
      border: "border-white/[0.08]",
      text: "text-slate-400",
      dot: "bg-slate-400",
    };
  };

  // Filtered parameters
  const filteredParams =
    program?.parameters?.filter((param: any) => {
      const matchSearch =
        param.parameterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.testMethod?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "accredited" &&
          param.accreditationStatus?.toLowerCase().includes("accredited") &&
          !param.accreditationStatus?.toLowerCase().includes("non")) ||
        (filterStatus === "non-accredited" &&
          (param.accreditationStatus?.toLowerCase().includes("non") ||
            param.accreditationStatus?.toLowerCase().includes("not")));

      return matchSearch && matchStatus;
    }) || [];

  // Stats
  const totalParams = program?.parameters?.length || 0;
  const accreditedCount =
    program?.parameters?.filter(
      (p: any) =>
        p.accreditationStatus?.toLowerCase().includes("accredited") &&
        !p.accreditationStatus?.toLowerCase().includes("non")
    ).length || 0;
  const nonAccreditedCount = totalParams - accreditedCount;

  // ─── LOADING STATE ───
  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#00B4D8] animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00B4D8]/20 border-2 border-[#060d19] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-slate-300">Loading program details...</p>
          <p className="text-xs text-slate-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

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

      {/* ─── BREADCRUMB & BACK ─── */}
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
          href="/dashboard/pt-programs"
          className="hover:text-[#00B4D8] transition-colors"
        >
          PT Programs
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300 font-medium truncate max-w-[200px]">
          {program.programName}
        </span>
      </div>

      {/* ─── PROGRAM HEADER CARD ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06]">
        {/* Top gradient accent */}
        <div className="h-[2px] bg-gradient-to-r from-[#0A3D62] via-[#00B4D8] to-[#90E0EF]" />

        {/* Background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#00B4D8]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#0A3D62]/10 blur-3xl" />

        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Left: Program Info */}
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-xl shadow-[#00B4D8]/20 flex-shrink-0">
                <FlaskConical className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                    {program.programName}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Proficiency Testing Program Details & Parameters
                  </p>
                </div>

                {/* Scheme Code Badge */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/15">
                    <Tag className="w-3.5 h-3.5 text-[#00B4D8]" />
                    <span className="text-sm font-mono font-semibold text-[#90E0EF]">
                      {program.schemeCode}
                    </span>
                  </div>
                  <button
                    onClick={copySchemeCode}
                    className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
                    title="Copy scheme code"
                  >
                    {copiedCode ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all duration-200">
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white transition-all duration-200">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>

              <button
                onClick={addToCart}
                disabled={addedToCart || addingToCart}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  addedToCart
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {addingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : addedToCart ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <PackagePlus className="w-4 h-4" />
                )}
                {addingToCart ? "Adding..." : addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* ─── DETAIL CARDS ROW ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {/* Fees */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
              <div className="flex items-center gap-1.5 text-slate-500">
                <IndianRupee className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Program Fee</span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">
                ₹{program.fees?.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-md">
                + applicable GST
              </span>
            </div>

            {/* Dispatch */}
            {program.dispatchDate && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Dispatch Date</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {new Date(program.dispatchDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Last Consent */}
            {program.lastDateOfConsent && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Last Consent</span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {new Date(program.lastDateOfConsent).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Total Parameters */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Parameters</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalParams}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {accreditedCount} accredited
                </span>
                {nonAccreditedCount > 0 && (
                  <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {nonAccreditedCount} non
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PARAMETERS SECTION ─── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Microscope className="w-5 h-5 text-[#00B4D8]" />
              Test Parameters
            </h2>
            <p className="text-xs text-slate-500">
              All testing parameters included in this program
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/60 border border-white/[0.06] p-4">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/15 to-transparent" />

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search parameter name or test method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
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
                { value: "accredited", label: "Accredited" },
                { value: "non-accredited", label: "Non-Accredited" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filterStatus === opt.value
                      ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-semibold">{filteredParams.length}</span> of{" "}
              <span className="text-slate-300 font-semibold">{totalParams}</span> parameters
            </p>
          </div>
        </div>

        {/* ─── PARAMETERS TABLE ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

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
                    Accreditation Status
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-semibold tracking-wider uppercase text-slate-500 w-16">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {filteredParams.map((param: any, index: number) => {
                  const statusConfig = getStatusConfig(param.accreditationStatus);
                  const StatusIcon = statusConfig.icon;
                  const isExpanded = expandedParam === param._id;

                  return (
                    <>
                      <tr
                        key={param._id}
                        onClick={() =>
                          setExpandedParam(isExpanded ? null : param._id)
                        }
                        className="group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      >
                        {/* Serial */}
                        <td className="px-5 py-4">
                          <span className="text-slate-500 font-mono text-xs">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Parameter Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62]/80 to-[#00B4D8]/30 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/5">
                              <Beaker className="w-4 h-4 text-[#90E0EF]" />
                            </div>
                            <div>
                              <span className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 leading-tight block">
                                {param.parameterName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Test Method */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 min-w-[150px]">
                            <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="text-slate-400 text-sm">
                              {param.testMethod}
                            </span>
                          </div>
                        </td>

                        {/* Range */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3D62]/20 border border-[#0A3D62]/20">
                              <BarChart3 className="w-3.5 h-3.5 text-[#00B4D8]" />
                              <span className="text-sm font-mono font-medium text-slate-300">
                                {param.minRange}
                              </span>
                              <span className="text-slate-600 text-xs">—</span>
                              <span className="text-sm font-mono font-medium text-slate-300">
                                {param.maxRange}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Accreditation Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Expand Toggle */}
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
                        <tr key={`${param._id}-expanded`}>
                          <td colSpan={6} className="px-0 py-0">
                            <div className="bg-[#060d19]/40 border-y border-white/[0.04] px-8 py-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Method Detail */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                                      Test Method
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-white leading-relaxed">
                                    {param.testMethod}
                                  </p>
                                </div>

                                {/* Range Detail */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Ruler className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                                      Measurement Range
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-center">
                                      <p className="text-[10px] text-slate-500 uppercase">Min</p>
                                      <p className="text-lg font-bold font-mono text-[#00B4D8]">
                                        {param.minRange}
                                      </p>
                                    </div>
                                    <div className="h-8 w-[1px] bg-white/[0.06]" />
                                    <div className="text-center">
                                      <p className="text-[10px] text-slate-500 uppercase">Max</p>
                                      <p className="text-lg font-bold font-mono text-[#90E0EF]">
                                        {param.maxRange}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Status Detail */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                                      Accreditation
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 rounded-xl ${statusConfig.bg} ${statusConfig.border} border flex items-center justify-center`}
                                    >
                                      <StatusIcon
                                        className={`w-5 h-5 ${statusConfig.text}`}
                                      />
                                    </div>
                                    <div>
                                      <p className={`text-sm font-semibold ${statusConfig.text}`}>
                                        {param.accreditationStatus}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        Certification status
                                      </p>
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

          {/* ─── EMPTY STATE ─── */}
          {filteredParams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Microscope className="w-7 h-7 text-slate-600" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-sm font-semibold text-slate-300">
                  No parameters found
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  {searchQuery
                    ? `No results for "${searchQuery}".`
                    : "No parameters match the selected filter."}
                </p>
              </div>
              {(searchQuery || filterStatus !== "all") && (
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
              )}
            </div>
          )}

          {/* ─── TABLE FOOTER ─── */}
          {filteredParams.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-white/[0.06] gap-3">
              <p className="text-xs text-slate-500">
                <span className="text-slate-300 font-medium">{filteredParams.length}</span>{" "}
                parameters total •{" "}
                <span className="text-emerald-400">{accreditedCount} accredited</span>
                {nonAccreditedCount > 0 && (
                  <>
                    {" "}
                    • <span className="text-amber-400">{nonAccreditedCount} non-accredited</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all">
                  <Download className="w-3 h-3" />
                  Export CSV
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all">
                  <Printer className="w-3 h-3" />
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── BOTTOM CTA ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62]/40 to-[#00B4D8]/10 border border-[#00B4D8]/15 p-6">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#00B4D8]/5 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00B4D8]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Ready to enroll in this program?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add this PT program to your cart and proceed to checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Program Fee
              </p>
              <p className="text-xl font-bold text-white tabular-nums">
                ₹{program.fees?.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              onClick={addToCart}
              disabled={addedToCart || addingToCart}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                addedToCart
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {addingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : addedToCart ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              {addingToCart ? "Adding..." : addedToCart ? "Added to Cart" : "Add to Cart & Checkout"}
              {!addedToCart && !addingToCart && <ArrowUpRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}