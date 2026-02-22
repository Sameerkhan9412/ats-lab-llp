import { connectDB } from "@/app/lib/db";
import PTProgram from "@/app/models/PTProgram";
import { NextRequest, NextResponse } from "next/server";

// ✅ UPDATE PARAMETER
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string; paramId: string }> }
) {
  try {
    const { id, paramId } = await context.params;

    await connectDB();
    const body = await req.json();

    const program = await PTProgram.findById(id);

    if (!program) {
      return NextResponse.json(
        { message: "PT Program not found" },
        { status: 404 }
      );
    }

    const param = program.parameters.id(paramId);

    if (!param) {
      return NextResponse.json(
        { message: "Parameter not found" },
        { status: 404 }
      );
    }

    Object.assign(param, body);

    await program.save();

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}


// ✅ DELETE PARAMETER
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; paramId: string }> }
) {
  try {
    const { id, paramId } = await context.params;

    await connectDB();

    const program = await PTProgram.findById(id);

    if (!program) {
      return NextResponse.json(
        { message: "PT Program not found" },
        { status: 404 }
      );
    }

    const param = program.parameters.id(paramId);

    if (!param) {
      return NextResponse.json(
        { message: "Parameter not found" },
        { status: 404 }
      );
    }

    param.deleteOne(); // ✅ Correct way in Mongoose subdoc

    await program.save();

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}