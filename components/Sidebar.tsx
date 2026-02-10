import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Profile from "@/app/models/Profile";

const links = [
  { name: "Home", href: "/dashboard" },
  { name: "Update Profile", href: "/dashboard/profile" },
  { name: "My Enquiry", href: "/dashboard/enquiry" },
  { name: "Raise Complaints", href: "/dashboard/complaints" },
];

export default async function SidebarServer() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  const payload = token && verifyToken(token);

  let completionPercent = 0;
  let profileCompleted = false;

  if (payload) {
    const profile = await Profile.findOne({ userId: payload.userId });

    const required = [
      profile?.participant?.name,
      profile?.participant?.address1,
      profile?.participant?.city,
      profile?.contact?.email,
    ];

    completionPercent = Math.round(
      (required.filter(Boolean).length / required.length) * 100
    );

    profileCompleted = completionPercent === 100;
  }

  return (
    <aside className="col-span-2 bg-[#0f172a] p-6 border-r border-white/10">
      {!profileCompleted && (
        <div className="mb-4">
          <p className="text-xs text-red-400 mb-2">
            Complete profile to unlock features
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
          const disabled = !profileCompleted && l.href !== "/dashboard/profile";

          return (
            <Link
              key={l.name}
              href={disabled ? "/dashboard/profile" : l.href}
              className={`block px-4 py-2 rounded-lg text-sm
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-cyan-500/10 text-slate-300"
                }
              `}
            >
              {l.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
