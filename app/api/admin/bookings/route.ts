// app/api/admin/bookings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";

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
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // ─── BUILD QUERY ───
    const query: any = {};

    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    if (orderStatus && orderStatus !== "all") {
      query.orderStatus = orderStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
    }

    // ─── SEARCH ───
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
        { razorpayOrderId: { $regex: search, $options: "i" } },
        { razorpayPaymentId: { $regex: search, $options: "i" } },
        { "items.programName": { $regex: search, $options: "i" } },
        { "shipping.trackingId": { $regex: search, $options: "i" } },
        { userId: { $in: allUserIds } },
      ];
    }

    // ─── COUNT & FETCH ───
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const orders = await Order.find(query)
      .populate("userId", "username email")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // ─── ENRICH DATA ───
    const enrichedOrders = await Promise.all(
      orders.map(async (order: any) => {
        // Get profile
        let profile = null;
        if (order.userId?._id) {
          profile = await Profile.findOne({ userId: order.userId._id })
            .select("participant.name participant.city participant.address1 contact.phone")
            .lean();
        }

        // Populate statusHistory.updatedBy
        if (order.statusHistory?.length > 0) {
          const updatedByIds = order.statusHistory
            .filter((h: any) => h.updatedBy)
            .map((h: any) => h.updatedBy);

          if (updatedByIds.length > 0) {
            const users = await User.find({ _id: { $in: updatedByIds } })
              .select("_id username")
              .lean();

            const userMap = new Map(
              users.map((u: any) => [u._id.toString(), u])
            );

            order.statusHistory = order.statusHistory.map((h: any) => ({
              ...h,
              updatedBy: h.updatedBy
                ? userMap.get(h.updatedBy.toString()) || null
                : null,
            }));
          }
        }

        return { ...order, profile };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedOrders,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}