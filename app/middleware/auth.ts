import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../lib/auth";
import { connectDB } from "../lib/db";
import Profile from "../models/Profile";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  const payload = verifyToken(token);
  if (!payload) return NextResponse.redirect(new URL("/login", req.url));

  await connectDB();
  const profile = await Profile.findOne({ userId: payload.userId });

  if (
    !profile?.profileCompleted &&
    !req.nextUrl.pathname.startsWith("/profile")
  ) {
    return NextResponse.redirect(new URL("/profile/update", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/reports/:path*"],
};
