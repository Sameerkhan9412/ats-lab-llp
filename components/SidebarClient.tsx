"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const links = [
  { name: "Home", href: "/dashboard" },
  { name: "Update Profile", href: "/dashboard/profile" },
  { name: "My Enquiry", href: "/dashboard/enquiry" },
  { name: "Raise Complaints", href: "/dashboard/complaints" },
  { name: "Add Locations", href: "/dashboard/locations" },
  { name: "My Orders", href: "/dashboard/my-orders" },
  { name: "Payment History", href: "/dashboard/payment-history" },
];

export default function SidebarClient({
  profileCompleted,
  completionPercent,
}: {
  profileCompleted: boolean;
  completionPercent: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="col-span-2 bg-[#0f172a] border-r border-white/10 p-6">
      {!profileCompleted && (
        <div className="mb-4">
          <p className="text-xs text-red-400 mb-2">
            Complete your profile to unlock features
          </p>

          <div className="h-2 bg-white/10 rounded-full">
            <div
              className="h-2 bg-cyan-400 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      )}

      <nav className="space-y-1">
        {links.map((l) => {
          const isActive =
            pathname === l.href ||
            (l.href !== "/dashboard" && pathname.startsWith(l.href));

          const disabled =
            !profileCompleted && l.href !== "/dashboard/profile";

          return (
            <div key={l.name}>
              {disabled ? (
                <button
                  onClick={() =>
                    toast.error(
                      "Please complete your profile to access this module"
                    )
                  }
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed"
                >
                  {l.name}
                </button>
              ) : (
                <Link
                  href={l.href}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                        : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400"
                    }
                  `}
                >
                  {l.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
