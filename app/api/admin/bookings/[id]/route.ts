// app/api/admin/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const { id } = await params;

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const order = await Order.findById(id)
      .populate("userId", "username email")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Get profile
    let profile = null;
    if ((order as any).userId?._id) {
      profile = await Profile.findOne({
        userId: (order as any).userId._id,
      }).lean();
    }

    // Populate statusHistory.updatedBy
    if ((order as any).statusHistory?.length > 0) {
      const updatedByIds = (order as any).statusHistory
        .filter((h: any) => h.updatedBy)
        .map((h: any) => h.updatedBy);

      if (updatedByIds.length > 0) {
        const users = await User.find({ _id: { $in: updatedByIds } })
          .select("_id username")
          .lean();

        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        (order as any).statusHistory = (order as any).statusHistory.map(
          (h: any) => ({
            ...h,
            updatedBy: h.updatedBy
              ? userMap.get(h.updatedBy.toString()) || null
              : null,
          })
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: { ...order, profile },
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const { id } = await params;

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { paymentStatus, orderStatus, statusNote, invoiceUrl, adminNotes, shipping } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update basic fields
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
    if (invoiceUrl !== undefined) order.invoiceUrl = invoiceUrl;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    // Update shipping
    if (shipping) {
      order.shipping = { ...(order.shipping || {}), ...shipping };
    }

    // Update order status with history
    if (orderStatus !== undefined && orderStatus !== order.orderStatus) {
      if (!order.statusHistory) order.statusHistory = [];

      order.statusHistory.push({
        status: orderStatus,
        timestamp: new Date(),
        note: statusNote || "",
        updatedBy: admin._id,
      });

      order.orderStatus = orderStatus;

      // Auto-actions
      if (orderStatus === "delivered") {
        if (!order.shipping) order.shipping = {};
        order.shipping.actualDelivery = new Date();
      }

      if (orderStatus === "cancelled") {
        order.cancelledAt = new Date();
        order.cancelledBy = admin._id;
        if (statusNote) order.cancellationReason = statusNote;
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    await connectDB();
    const { id } = await params;

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Order delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}