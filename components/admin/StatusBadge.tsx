// app/admin/components/StatusBadge.tsx

"use client";

interface StatusBadgeProps {
  status: string;
  type?: "default" | "payment" | "order" | "user" | "priority";
}

export default function StatusBadge({ status, type = "default" }: StatusBadgeProps) {
  const getStyles = () => {
    // Payment status
    if (type === "payment") {
      switch (status) {
        case "paid":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "pending":
          return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "failed":
          return "bg-red-500/10 text-red-400 border-red-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      }
    }

    // Order/Enquiry/Complaint status
    if (type === "order") {
      switch (status) {
        case "pending":
          return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "in_progress":
        case "investigating":
          return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "resolved":
        case "completed":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "closed":
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        case "rejected":
        case "cancelled":
          return "bg-red-500/10 text-red-400 border-red-500/20";
        case "open":
          return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      }
    }

    // User status
    if (type === "user") {
      switch (status) {
        case "admin":
          return "bg-red-500/10 text-red-400 border-red-500/20";
        case "lab_manager":
          return "bg-violet-500/10 text-violet-400 border-violet-500/20";
        case "user":
          return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "active":
        case "verified":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "inactive":
        case "unverified":
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      }
    }

    // Priority
    if (type === "priority") {
      switch (status) {
        case "low":
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        case "medium":
          return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "high":
          return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "urgent":
        case "critical":
          return "bg-red-500/10 text-red-400 border-red-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      }
    }

    // Default
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  const formatStatus = (s: string) => {
    return s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStyles()}`}
    >
      {formatStatus(status)}
    </span>
  );
}