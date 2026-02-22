import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  await Cart.findByIdAndDelete(id);
  return NextResponse.json({ message: "Removed" });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  await connectDB();
  const updated = await Cart.findByIdAndUpdate(
    id,
    { quantity: body.quantity },
    { new: true }
  );

  return NextResponse.json(updated);
}