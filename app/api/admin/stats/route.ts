// app/api/admin/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import User from "@/app/models/User";
import Order from "@/app/models/Order";
import PTProgram from "@/app/models/PTProgram";
import Enquiry from "@/app/models/Enquiry";
import Complaint from "@/app/models/Complaint";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Verify admin
    const user = await getUserFromToken(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all stats in parallel
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalOrders,
      pendingOrders,
      ordersThisMonth,
      totalRevenue,
      totalPrograms,
      openEnquiries,
      openComplaints,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      PTProgram.countDocuments(),
      Enquiry.countDocuments({ status: { $in: ["pending", "in_progress"] } }),
      Complaint.countDocuments({ status: { $in: ["open", "investigating"] } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        totalOrders,
        pendingOrders,
        ordersThisMonth,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPrograms,
        openEnquiries,
        openComplaints,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}