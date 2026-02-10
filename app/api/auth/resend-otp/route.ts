import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { sendOtpMail } from "@/app/lib/mail";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB(); // ✅

  const { email } = await req.json();

  const user = await User.findOne({ email, isVerified: false });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpMail(email, otp);

  return NextResponse.json({ message: "OTP resent successfully" });
}
