import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import PTProgram from "@/app/models/PTProgram";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const program = await PTProgram.create(body);
  return NextResponse.json(program);
}

export async function GET() {
  await connectDB();
  const programs = await PTProgram.find().sort({ createdAt: -1 });
  return NextResponse.json(programs);
}