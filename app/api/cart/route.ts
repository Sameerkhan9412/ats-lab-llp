import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const item = await Cart.create(body);
  return NextResponse.json(item);
}

export async function GET() {
  await connectDB();
  const items = await Cart.find();
  return NextResponse.json(items);
}