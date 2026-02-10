import SidebarClient from "./SidebarClient";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Profile from "@/app/models/Profile";

export default async function SidebarServer() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  const payload = token && verifyToken(token);

  let profileCompleted = false;
  let completionPercent = 0;

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
    <SidebarClient
      profileCompleted={profileCompleted}
      completionPercent={completionPercent}
    />
  );
}
