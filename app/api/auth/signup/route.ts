import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { sendOtpMail } from "@/app/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDB(); // ✅ MUST BE FIRST

    const { username, email, password, signupFor } = await req.json();

    if (!username || !email || !password || !signupFor) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      username,
      email,
      password: hashedPassword,
      signupFor,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpMail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
