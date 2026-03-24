// app/lib/auth.ts

import jwt from "jsonwebtoken";
import { connectDB } from "./db";
import User from "@/app/models/User";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

// Token payload interface
interface TokenPayload {
  userId: string;
  role?: "admin" | "user" | "lab_manager";
}

/**
 * Get user from JWT token in cookies
 */
export async function getUserFromToken(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    console.log("Token:", token ? "exists" : "not found");

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.userId).select("-password -otp");

    return user;
  } catch (error) {
    console.error("getUserFromToken error:", error);
    return null;
  }
}

/**
 * ✅ Sign JWT token with userId and role
 */
export function signToken(
  userId: string,
  role: "admin" | "user" | "lab_manager" = "user"
): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}