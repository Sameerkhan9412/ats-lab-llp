"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  Tag,
  Truck,
  CalendarCheck,
  PackagePlus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Beaker,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  X,
  Loader2,
  ShoppingBag,
  Eye,
  Sparkles,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

interface PTProgram {
  _id: string;
  programName: string;
  schemeCode: string;
  dispatchDate: string;
  lastDateOfConsent: string;
  fees: number;
}

export default function PTProgramsListing() {
  const [programs, setPrograms] = useState<PTProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<PTProgram[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "fees" | "date">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetch("/api/admin/pt-programs")
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data);
        setFilteredPrograms(data);
      });
    fetchCartCount();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

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
        return new Date(a.dispatchDate).getTime() - new Date(b.dispatchDate).getTime();
      return 0;
    });

    setFilteredPrograms(filtered);
    setCurrentPage(1);
  }, [searchQuery, sortBy, programs]);

  const fetchCartCount = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCartCount(data.length || 0);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const addToCart = async (program: PTProgram) => {
    setAddingToCart(program._id);
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
        setAddingToCart(null);
        return;
      }
      setAddedItems((prev) => new Set(prev).add(program._id));
      showToast("Added to cart successfully!", "success");
      fetchCartCount();
    } catch {
      showToast("Failed to add to cart", "error");
    }
    setAddingToCart(null);
  };

  const getDaysUntil = (dateStr: string) => {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
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
          <button onClick={() => setShowNotification(false)} className="ml-2 p-0.5 rounded hover:bg-white/10">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── HEADER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0A3D62] flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
              <Beaker className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                PT Programs
              </h1>
              <p className="text-xs text-slate-500">
                Browse and enroll in proficiency testing programs
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/checkout"
          className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 w-5 h-5 flex items-center justify-center bg-red-500 text-[10px] font-bold rounded-full ring-2 ring-[#0A3D62]">
                {cartCount}
              </span>
            )}
          </div>
          <span>View Cart</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
        </Link>
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
              onChange={(e) => setSortBy(e.target.value as "name" | "fees" | "date")}
              className="appearance-none bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-11 pr-10 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="fees">Sort by Fees</option>
              <option value="date">Sort by Dispatch</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all duration-300">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-300 font-semibold">{filteredPrograms.length}</span> of{" "}
            <span className="text-slate-300 font-semibold">{programs.length}</span> programs
          </p>
        </div>
      </div>

      {/* ─── TABLE ─── */}
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
                  Program Name
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                  Scheme Code
                </th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                  Dispatch Date
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
                const daysUntilConsent = getDaysUntil(prog.lastDateOfConsent);
                const isUrgent = daysUntilConsent <= 7 && daysUntilConsent > 0;
                const isExpired = daysUntilConsent <= 0;
                const isAdded = addedItems.has(prog._id);
                const isAdding = addingToCart === prog._id;
                const serialNo = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <tr
                    key={prog._id}
                    className="group hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    {/* S.No */}
                    <td className="px-5 py-4">
                      <span className="text-slate-500 font-mono text-xs">
                        {String(serialNo).padStart(2, "0")}
                      </span>
                    </td>

                    {/* Program Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0A3D62] to-[#00B4D8]/40 flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00B4D8]/10">
                          <Beaker className="w-4 h-4 text-[#90E0EF]" />
                        </div>
                        <span className="font-semibold text-white group-hover:text-[#90E0EF] transition-colors duration-300 leading-tight">
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
                        <span>
                          {new Date(prog.dispatchDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
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
                          <span>
                            {new Date(prog.lastDateOfConsent).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {isUrgent && !isExpired && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/15 text-[10px] font-semibold text-amber-400">
                            <Clock className="w-2.5 h-2.5 animate-pulse" />
                            {daysUntilConsent}d left
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
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/dashboard/pt-programs/${prog._id}`}
                          className="group/btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:text-white hover:border-white/[0.12] transition-all duration-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Parameters</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                        </Link>

                        <button
                          onClick={() => addToCart(prog)}
                          disabled={isAdded || isAdding || isExpired}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                            isAdded
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                              : isExpired
                              ? "bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed"
                              : "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20 hover:bg-[#00B4D8]/25 hover:border-[#00B4D8]/30 hover:shadow-md hover:shadow-[#00B4D8]/10 active:scale-95"
                          }`}
                        >
                          {isAdding ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : isAdded ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <PackagePlus className="w-3.5 h-3.5" />
                          )}
                          <span className="hidden xl:inline">
                            {isAdding ? "Adding..." : isAdded ? "Added" : isExpired ? "Expired" : "Add to Cart"}
                          </span>
                          <span className="xl:hidden">
                            {isAdding ? "..." : isAdded ? "✓" : isExpired ? "—" : "Add"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── EMPTY STATE INSIDE TABLE ─── */}
        {filteredPrograms.length === 0 && isLoaded && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">No programs found</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : "No PT programs available at the moment."}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/20 hover:bg-[#00B4D8]/15 transition-all"
              >
                <X className="w-3 h-3" />
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* ─── PAGINATION ─── */}
        {filteredPrograms.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-white/[0.06] gap-4">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-300 font-medium">
                {Math.min(currentPage * itemsPerPage, filteredPrograms.length)}
              </span>{" "}
              of{" "}
              <span className="text-slate-300 font-medium">{filteredPrograms.length}</span> programs
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

      {/* ─── STICKY CART BAR ─── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-[280px] right-0 z-40">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />
          <div className="bg-[#0a1628]/90 backdrop-blur-xl border-t border-white/[0.06] px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00B4D8]/15 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-[#00B4D8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {cartCount} {cartCount === 1 ? "program" : "programs"} in cart
                  </p>
                  <p className="text-[11px] text-slate-500">Ready for checkout</p>
                </div>
              </div>

              <Link
                href="/dashboard/checkout"
                className="group flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] text-white font-semibold text-sm shadow-lg shadow-[#00B4D8]/20 hover:shadow-[#00B4D8]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                Proceed to Checkout
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}