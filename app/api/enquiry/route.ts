// app/api/enquiry/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import Enquiry from "@/app/models/Enquiry";

// ─── GET USER'S ENQUIRIES ───
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const enquiries = await Enquiry.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .populate("respondedBy", "username")
      .lean();

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Enquiry fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// ─── CREATE NEW ENQUIRY ───
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { subject, message, category, priority } = body;

    // Validation
    if (!subject?.trim()) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    const newEnquiry = await Enquiry.create({
      userId: user._id,
      subject: subject.trim(),
      message: message.trim(),
      category: category || "general",
      priority: priority || "medium",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      data: newEnquiry,
    });
  } catch (error) {
    console.error("Enquiry creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}