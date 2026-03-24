// app/api/admin/enquiries/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Enquiry from "@/app/models/Enquiry";
import Profile from "@/app/models/Profile";

type Params = Promise<{ id: string }>;

// ─── GET SINGLE ENQUIRY ───
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

    const enquiry = await Enquiry.findById(id)
      .populate("userId", "username email")
      .populate("respondedBy", "username")
      .lean();

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    // Get profile
    let profile = null;
    if ((enquiry as any).userId?._id) {
      profile = await Profile.findOne({
        userId: (enquiry as any).userId._id,
      }).lean();
    }

    return NextResponse.json({
      success: true,
      data: { ...enquiry, profile },
    });
  } catch (error) {
    console.error("Enquiry fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiry" },
      { status: 500 }
    );
  }
}

// ─── UPDATE ENQUIRY (ADMIN) ───
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
    const { status, priority, adminResponse } = body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (status !== undefined) enquiry.status = status;
    if (priority !== undefined) enquiry.priority = priority;

    // Add admin response
    if (adminResponse !== undefined) {
      enquiry.adminResponse = adminResponse;
      enquiry.respondedBy = admin._id;
      enquiry.respondedAt = new Date();

      // Auto-update status to in_progress if responding
      if (enquiry.status === "pending" && adminResponse.trim()) {
        enquiry.status = "in_progress";
      }
    }

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findById(id)
      .populate("userId", "username email")
      .populate("respondedBy", "username")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Enquiry updated successfully",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("Enquiry update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

// ─── DELETE ENQUIRY ───
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

    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Enquiry delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}