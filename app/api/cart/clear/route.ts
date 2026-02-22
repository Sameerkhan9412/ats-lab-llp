import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";

export async function DELETE() {
  await connectDB();
  await Cart.deleteMany({});
  return NextResponse.json({ message: "Cart cleared" });
}