import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

export async function POST(req: Request) {
  const { email, otp, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}
