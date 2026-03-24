// app/admin/components/SearchFilter.tsx

"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronDown, RefreshCw, Download } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  onExport?: () => void;
  loading?: boolean;
}

export default function SearchFilter({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilter,
  onRefresh,
  onExport,
  loading = false,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    if (!value) delete newFilters[key];
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    onSearch("");
    onFilter({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1a2d]/60 border border-white/[0.06] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                showFilters
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-[#0d1a2d]/60 text-slate-300 border border-white/[0.06] hover:border-white/[0.1]"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {Object.keys(activeFilters).length}
                </span>
              )}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1a2d]/60 border border-white/[0.06] text-sm font-medium text-slate-300 hover:border-white/[0.1] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06]">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-xs text-slate-400">{filter.label}</label>
              <select
                value={activeFilters[filter.key] || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#0d1a2d] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}