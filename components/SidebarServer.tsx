// components/SidebarServer.tsx

import SidebarClient from "./SidebarClient";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Profile from "@/app/models/Profile";
import User from "@/app/models/User";

export default async function SidebarServer() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  const payload = token && verifyToken(token);

  let profileCompleted = false;
  let completionPercent = 0;
  let userRole: "admin" | "user" | "lab_manager" = "user";

  if (payload) {
    // ✅ Get role from token first (faster)
    if (payload.role) {
      userRole = payload.role;
    } else {
      // Fallback: fetch from database (for old tokens)
      const user = await User.findById(payload.userId).select("role");
      userRole = (user?.role as "admin" | "user" | "lab_manager") || "user";
    }

    // Fetch profile completion
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
    <SidebarClient
      profileCompleted={profileCompleted}
      completionPercent={completionPercent}
      userRole={userRole}
    />
  );
}