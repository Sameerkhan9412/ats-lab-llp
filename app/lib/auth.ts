import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

import { connectDB } from "./db";
import User from "@/app/models/User";
import { NextRequest } from "next/server";

export async function getUserFromToken(
  req: NextRequest
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    console.log("i am token",token)
    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };
    console.log("decodeddd",decoded)

    const user = await User.findById(decoded?.userId).select("-password");

    return user;
  } catch {
    return null;
  }
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
