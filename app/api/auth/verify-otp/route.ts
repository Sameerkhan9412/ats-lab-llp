import { NextResponse } from "next/server";
import { signToken } from "@/app/lib/auth";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB(); // ✅ MUST

  const { email, otp } = await req.json();

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return NextResponse.json(
      { message: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = signToken(user._id.toString());

  const res = NextResponse.json({ message: "Account verified" });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
