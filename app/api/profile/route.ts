// app/api/profile/route.ts (GET)
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Profile from "@/app/models/Profile";

export async function GET() {
  await connectDB();
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ profile: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ profile: null });

  const profile = await Profile.findOne({ userId: payload.userId });

  // required fields (example – adjust as needed)
  const requiredFields = [
    profile?.participant?.name,
    profile?.participant?.address1,
    profile?.participant?.city,
    profile?.participant?.pincode,
    profile?.contact?.name,
    profile?.contact?.email,
  ];

  const filled = requiredFields.filter(Boolean).length;
  const percent = Math.round((filled / requiredFields.length) * 100);

  return NextResponse.json({
    profile,
    profileCompleted: percent === 100,
    completionPercent: percent,
  });
}


export async function POST(req: Request) {
  await connectDB();
  const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;


  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const allowedKeys = [
    "participant",
    "billing",
    "shipping",
    "contact",
    "other",
    "disciplines",
  ];

  const payloadData: any = {};
  for (const key of allowedKeys) {
    if (data[key] !== undefined) payloadData[key] = data[key];
  }

  const profile = await Profile.findOneAndUpdate(
    { userId: payload.userId },
    {
      $set: {
        ...payloadData,
        profileCompleted: true,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  return NextResponse.json({
    message: "Profile updated successfully",
    profile,
  });
}
