import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { signToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB(); // ✅

  const { email, password } = await req.json();

  const user = await User.findOne({ email, isVerified: true });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const token = signToken(user._id.toString());

  const res = NextResponse.json({ message: "Login successful" });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
