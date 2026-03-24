// app/api/admin/complaints/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Complaint from "@/app/models/Complaint";

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
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const total = await Complaint.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const complaints = await Complaint.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Complaints fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}