// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { signToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  // Find verified user
  const user = await User.findOne({ email: email.toLowerCase(), isVerified: true });
  
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  // ✅ Generate token with role
  const token = signToken(user._id.toString(), user.role || "user");

  const res = NextResponse.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role || "user",
    },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}