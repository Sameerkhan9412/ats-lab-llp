// app/api/admin/enquiries/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Enquiry from "@/app/models/Enquiry";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";

// ─── GET ALL ENQUIRIES (ADMIN) ───
export async function GET(req: NextRequest) {
  try {
    await connectDB();

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
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const priority = searchParams.get("priority") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (priority && priority !== "all") {
      query.priority = priority;
    }

    // Search
    if (search) {
      const users = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const profiles = await Profile.find({
        "participant.name": { $regex: search, $options: "i" },
      }).select("userId");

      const allUserIds = [
        ...new Set([
          ...users.map((u) => u._id),
          ...profiles.map((p) => p.userId),
        ]),
      ];

      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { userId: { $in: allUserIds } },
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const enquiries = await Enquiry.find(query)
      .populate("userId", "username email")
      .populate("respondedBy", "username")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Enrich with profile data
    const enrichedEnquiries = await Promise.all(
      enquiries.map(async (enquiry: any) => {
        let profile = null;
        if (enquiry.userId?._id) {
          profile = await Profile.findOne({ userId: enquiry.userId._id })
            .select("participant.name participant.city contact.phone contact.email")
            .lean();
        }
        return { ...enquiry, profile };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedEnquiries,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error("Enquiries fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}