// app/api/admin/programs/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getUserFromToken } from "@/app/lib/auth";
import PTProgram from "@/app/models/PTProgram";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const program = await PTProgram.findById(params.id).lean();

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Program fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const updates = await req.json();

    const program = await PTProgram.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    console.error("Program update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update program" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const program = await PTProgram.findByIdAndDelete(params.id);

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Program delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete program" },
      { status: 500 }
    );
  }
}