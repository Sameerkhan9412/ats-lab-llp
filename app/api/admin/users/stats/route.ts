// app/api/admin/users/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { verifyToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const [total, admins, users, labManagers, verified, unverified, thisWeek, thisMonth] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "lab_manager" }),
        User.countDocuments({ isVerified: true }),
        User.countDocuments({ isVerified: false }),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ]);

    return NextResponse.json({
      stats: {
        total,
        admins,
        users,
        labManagers,
        verified,
        unverified,
        thisWeek,
        thisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}