
import { connectDB } from "@/app/lib/db";
import PTProgram from "@/app/models/PTProgram";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ unwrap params

    await connectDB();

    const body = await req.json();

    const updated = await PTProgram.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
    const { id } = await context.params; // ✅ unwrap params

  await PTProgram.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ context is defined here

  await connectDB();

  const program = await PTProgram.findById(id);

  if (!program) {
    return NextResponse.json(
      { message: "Program not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(program);
}