import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function GET(req: Request) {
  await connectDB();

  const token = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const user = await User.findById(payload.userId).select(
    "username email signupFor"
  );

  return NextResponse.json({ user });
}
