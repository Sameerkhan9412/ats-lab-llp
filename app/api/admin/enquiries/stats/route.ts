// app/api/admin/enquiries/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Enquiry from "@/app/models/Enquiry";

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

    const [
      total,
      pending,
      inProgress,
      resolved,
      closed,
      lowPriority,
      mediumPriority,
      highPriority,
      urgentPriority,
      general,
      program,
      payment,
      technical,
      other,
      thisWeek,
      thisMonth,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "pending" }),
      Enquiry.countDocuments({ status: "in_progress" }),
      Enquiry.countDocuments({ status: "resolved" }),
      Enquiry.countDocuments({ status: "closed" }),
      Enquiry.countDocuments({ priority: "low" }),
      Enquiry.countDocuments({ priority: "medium" }),
      Enquiry.countDocuments({ priority: "high" }),
      Enquiry.countDocuments({ priority: "urgent" }),
      Enquiry.countDocuments({ category: "general" }),
      Enquiry.countDocuments({ category: "program" }),
      Enquiry.countDocuments({ category: "payment" }),
      Enquiry.countDocuments({ category: "technical" }),
      Enquiry.countDocuments({ category: "other" }),
      Enquiry.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Enquiry.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        status: { pending, inProgress, resolved, closed },
        priority: {
          low: lowPriority,
          medium: mediumPriority,
          high: highPriority,
          urgent: urgentPriority,
        },
        category: { general, program, payment, technical, other },
        thisWeek,
        thisMonth,
      },
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}