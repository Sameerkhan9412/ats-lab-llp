// app/dashboard/admin/users/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Download,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  ArrowUpDown,
  Building2,
  Phone,
  MapPin,
  Clock,
  UserCog,
  Crown,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface UserProfile {
  participant?: {
    name?: string;
    city?: string;
  };
  contact?: {
    phone?: string;
  };
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user" | "lab_manager";
  signupFor: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
}

interface Stats {
  total: number;
  admins: number;
  users: number;
  labManagers: number;
  verified: number;
  unverified: number;
  thisWeek: number;
  thisMonth: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals
  const [viewModal, setViewModal] = useState<UserData | null>(null);
  const [editModal, setEditModal] = useState<UserData | null>(null);
  const [deleteModal, setDeleteModal] = useState<UserData | null>(null);
  const [addModal, setAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    signupFor: "",
    isVerified: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        role: roleFilter,
        verified: verifiedFilter === "all" ? "" : verifiedFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/admin/users?${params}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, roleFilter, verifiedFilter, sortBy, sortOrder]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/users/stats", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
    setTimeout(() => setIsLoaded(true), 100);
  }, [fetchUsers]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
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

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create user");

      toast.success("User created successfully");
      setAddModal(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        signupFor: "",
        isVerified: false,
      });
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;

    setFormLoading(true);

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        signupFor: formData.signupFor,
        isVerified: formData.isVerified,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await fetch(`/api/admin/users/${editModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update user");

      toast.success("User updated successfully");
      setEditModal(null);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteModal) return;

    setFormLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${deleteModal._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      toast.success("User deleted successfully");
      setDeleteModal(null);
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit modal with user data
  const openEditModal = (user: UserData) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      signupFor: user.signupFor || "",
      isVerified: user.isVerified,
    });
    setEditModal(user);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <Crown className="w-3 h-3" />
            Admin
          </span>
        );
      case "lab_manager":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <UserCog className="w-3 h-3" />
            Lab Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
            <User className="w-3 h-3" />
            User
          </span>
        );
    }
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
              Manage Users
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            View, edit, and manage all registered users in the system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              fetchUsers();
              fetchStats();
            }}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#90E0EF] bg-white/[0.03] hover:bg-[#00B4D8]/[0.06] border border-white/[0.06] hover:border-[#00B4D8]/20 transition-all duration-300">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={() => {
              setFormData({
                username: "",
                email: "",
                password: "",
                role: "user",
                signupFor: "",
                isVerified: false,
              });
              setAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#00B4D8] to-[#0A3D62] hover:shadow-lg hover:shadow-[#00B4D8]/20 transition-all duration-300"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add User
          </button>
        </div>
      </div>

      {/* ─── STATS CARDS ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Total Users", value: stats?.total || 0, icon: Users, color: "blue" },
          { label: "Admins", value: stats?.admins || 0, icon: Crown, color: "red" },
          { label: "Users", value: stats?.users || 0, icon: User, color: "cyan" },
          { label: "Lab Managers", value: stats?.labManagers || 0, icon: UserCog, color: "violet" },
          { label: "Verified", value: stats?.verified || 0, icon: CheckCircle2, color: "emerald" },
          { label: "Unverified", value: stats?.unverified || 0, icon: XCircle, color: "amber" },
          { label: "This Week", value: stats?.thisWeek || 0, icon: Calendar, color: "pink" },
          { label: "This Month", value: stats?.thisMonth || 0, icon: Clock, color: "orange" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4 hover:border-white/[0.1] transition-all duration-300 cursor-default"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <stat.icon
                  className={`w-4 h-4 ${
                    stat.color === "blue" ? "text-[#00B4D8]" : ""
                  } ${stat.color === "red" ? "text-red-400" : ""}
                    ${stat.color === "cyan" ? "text-cyan-400" : ""}
                    ${stat.color === "violet" ? "text-violet-400" : ""}
                    ${stat.color === "emerald" ? "text-emerald-400" : ""}
                    ${stat.color === "amber" ? "text-amber-400" : ""}
                    ${stat.color === "pink" ? "text-pink-400" : ""}
                    ${stat.color === "orange" ? "text-orange-400" : ""}
                  `}
                />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── FILTERS & SEARCH ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06] p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="lab_manager">Lab Manager</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            >
              <option value="all">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
              className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="username-asc">Name A-Z</option>
              <option value="username-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
            </select>
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

      {/* ─── USERS TABLE ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1a2d]/40 border border-white/[0.06]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/20 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
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
                    Role
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Lab / Company
                  </th>
                  <th
                    className="px-5 py-4 text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1">
                      Joined
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center text-sm font-bold text-[#00B4D8]">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.username}</p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">{getRoleBadge(user.role)}</td>

                    <td className="px-5 py-4">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-slate-300 text-sm">
                          {user.profile?.participant?.name || "-"}
                        </p>
                        {user.profile?.participant?.city && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.profile.participant.city}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewModal(user)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-[#00B4D8] transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-amber-400 transition-all duration-200"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(user)}
                          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-red-400 transition-all duration-200"
                          title="Delete User"
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
        {!loading && users.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="text-slate-300 font-medium">
                {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="text-slate-300 font-medium">{pagination.total}</span>{" "}
              users
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
                Previous
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
                (_, i) => {
                  let pageNum = i + 1;
                  if (pagination.totalPages > 5) {
                    if (pagination.page > 3) {
                      pageNum = pagination.page - 2 + i;
                    }
                    if (pageNum > pagination.totalPages) return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: pageNum }))
                      }
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        pagination.page === pageNum
                          ? "bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/20"
                          : "text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

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

      {/* ─── VIEW USER MODAL ─── */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">User Details</h3>
              <button
                onClick={() => setViewModal(null)}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Avatar & Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00B4D8]/20 to-[#0A3D62]/20 border border-[#00B4D8]/20 flex items-center justify-center text-2xl font-bold text-[#00B4D8]">
                  {viewModal.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{viewModal.username}</h4>
                  <p className="text-sm text-slate-400">{viewModal.email}</p>
                  <div className="mt-2">{getRoleBadge(viewModal.role)}</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  {viewModal.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400">
                      <XCircle className="w-4 h-4" />
                      Unverified
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Signup For
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {viewModal.signupFor || "-"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {formatDate(viewModal.createdAt)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-slate-300">
                    {formatDate(viewModal.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Profile Info */}
              {viewModal.profile && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-3">
                    Profile Information
                  </p>
                  <div className="space-y-2">
                    {viewModal.profile.participant?.name && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">
                          {viewModal.profile.participant.name}
                        </span>
                      </div>
                    )}
                    {viewModal.profile.participant?.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">
                          {viewModal.profile.participant.city}
                        </span>
                      </div>
                    )}
                    {viewModal.profile.contact?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">
                          {viewModal.profile.contact.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setViewModal(null);
                  openEditModal(viewModal);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                Edit User
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

      {/* ─── ADD/EDIT USER MODAL ─── */}
      {(addModal || editModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4D8]/30 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">
                {editModal ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => {
                  setAddModal(false);
                  setEditModal(null);
                }}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editModal ? handleEditUser : handleAddUser}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Password {editModal ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editModal}
                    className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                    placeholder={editModal ? "••••••••" : "Enter password"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all"
                    >
                      <option value="user">User</option>
                      <option value="lab_manager">Lab Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Signup For
                    </label>
                    <input
                      type="text"
                      value={formData.signupFor}
                      onChange={(e) =>
                        setFormData({ ...formData, signupFor: e.target.value })
                      }
                      className="w-full bg-[#060d19]/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#00B4D8]/30 focus:ring-1 focus:ring-[#00B4D8]/20 transition-all placeholder:text-slate-600"
                      placeholder="e.g., PT Program"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) =>
                        setFormData({ ...formData, isVerified: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00B4D8]"></div>
                  </label>
                  <span className="text-sm text-slate-400">Email Verified</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setAddModal(false);
                    setEditModal(null);
                  }}
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
                  {editModal ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-[#0d1a2d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

            <div className="p-6">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>

              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Delete User?
              </h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">{deleteModal.username}</span>?
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
                  onClick={handleDeleteUser}
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}