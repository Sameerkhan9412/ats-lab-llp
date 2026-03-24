// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Verify admin
    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const verified = searchParams.get("verified") || "";

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (verified) {
      query.isVerified = verified === "true";
    }

    // Get total count
    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get users with pagination
    const users = await User.find(query)
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get profiles for these users
    const userIds = users.map((u) => u._id);
    const profiles = await Profile.find({ userId: { $in: userIds } })
      .select("userId participant.name contact.mobile profileCompleted")
      .lean();

    // Merge user data with profile data
    const usersWithProfiles = users.map((user) => {
      const profile = profiles.find(
        (p) => p.userId.toString() === user._id.toString()
      );
      return {
        ...user,
        profile: profile || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}