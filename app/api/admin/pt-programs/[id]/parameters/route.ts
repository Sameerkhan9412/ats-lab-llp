import { connectDB } from "@/app/lib/db";
import PTProgram from "@/app/models/PTProgram";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();
  const body = await req.json();

  const program = await PTProgram.findById(id);

  if (!program) {
    return NextResponse.json(
      { message: "Program not found" },
      { status: 404 }
    );
  }

  program.parameters.push(body);
  await program.save();

  return NextResponse.json(program);
}