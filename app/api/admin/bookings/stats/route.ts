// app/api/admin/bookings/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Order from "@/app/models/Order";

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
      paymentPaid,
      paymentPending,
      paymentFailed,
      statusPlaced,
      statusConfirmed,
      statusProcessing,
      statusDispatched,
      statusInTransit,
      statusOutForDelivery,
      statusDelivered,
      statusCancelled,
      statusOnHold,
      thisWeek,
      thisMonth,
      totalRevenueResult,
      thisMonthRevenueResult,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.countDocuments({ paymentStatus: "failed" }),
      Order.countDocuments({ orderStatus: "placed" }),
      Order.countDocuments({ orderStatus: "confirmed" }),
      Order.countDocuments({ orderStatus: "processing" }),
      Order.countDocuments({ orderStatus: "dispatched" }),
      Order.countDocuments({ orderStatus: "in_transit" }),
      Order.countDocuments({ orderStatus: "out_for_delivery" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.countDocuments({ orderStatus: "on_hold" }),
      Order.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Order.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        payment: {
          paid: paymentPaid,
          pending: paymentPending,
          failed: paymentFailed,
        },
        orderStatus: {
          placed: statusPlaced,
          confirmed: statusConfirmed,
          processing: statusProcessing,
          dispatched: statusDispatched,
          inTransit: statusInTransit,
          outForDelivery: statusOutForDelivery,
          delivered: statusDelivered,
          cancelled: statusCancelled,
          onHold: statusOnHold,
        },
        thisWeek,
        thisMonth,
        totalRevenue: totalRevenueResult[0]?.total || 0,
        thisMonthRevenue: thisMonthRevenueResult[0]?.total || 0,
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