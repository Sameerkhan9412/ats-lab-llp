// app/api/admin/programs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import PTProgram from "@/app/models/PTProgram";

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

    const query: any = {};

    if (search) {
      query.$or = [
        { programName: { $regex: search, $options: "i" } },
        { schemeCode: { $regex: search, $options: "i" } },
      ];
    }

    const total = await PTProgram.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const programs = await PTProgram.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: programs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Programs fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const data = await req.json();

    const program = new PTProgram(data);
    await program.save();

    return NextResponse.json({
      success: true,
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("Program create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create program" },
      { status: 500 }
    );
  }
}