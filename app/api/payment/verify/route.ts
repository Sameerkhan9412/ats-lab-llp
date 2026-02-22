import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import Cart from "@/app/models/Cart";
import { getUserFromToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  // 🔥 1️⃣ Verify Signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 400 }
    );
  }

  await connectDB();

  // 🔥 2️⃣ Get logged in user
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔥 3️⃣ Get cart from DB
  const cart = await Cart.findOne({ userId: user._id });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { message: "Cart is empty" },
      { status: 400 }
    );
  }

  // 🔥 4️⃣ Calculate total from DB (NOT frontend)
  const totalAmount = cart.items.reduce(
    (acc: number, item: any) => acc + item.fees,
    0
  );

  // 🔥 5️⃣ Create Order
  const order = await Order.create({
    userId: user._id,
    items: cart.items,
    totalAmount,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: "paid",
  });

  // 🔥 6️⃣ Clear Cart
  cart.items = [];
  await cart.save();

  return NextResponse.json({
    success: true,
    order,
  });
}