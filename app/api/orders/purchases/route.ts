import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { getUserFromToken } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await Order.find({
    userId: user._id,
  }).sort({ createdAt: -1 });

  return NextResponse.json(orders);
}