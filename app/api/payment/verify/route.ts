import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/app/lib/db";
// import Order from "@/app/models/Order";
// import Cart from "@/app/models/Cart";
import { getUserFromToken } from "@/app/lib/auth";
import { generateInvoice } from "@/lib/lib/generateInvoice";
import Cart from "@/app/models/Cart";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  // 1️⃣ Verify Signature
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

  // 2️⃣ Get user
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 3️⃣ Get cart
  const cart = await Cart.findOne({ userId: user._id });
  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { message: "Cart is empty" },
      { status: 400 }
    );
  }

  // 4️⃣ Calculate total
  const subtotal = cart.items.reduce(
    (acc: number, item: any) => acc + item.fees,
    0
  );

  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  // 5️⃣ Create Order
  const order = await Order.create({
    userId: user._id,
    items: cart.items,
    subtotal,
    gstAmount,
    totalAmount,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: "paid",
    orderStatus: "placed",
  });

  // 6️⃣ Generate Invoice
  const invoiceUrl = await generateInvoice(order);

  // 7️⃣ Save invoice
  order.invoiceUrl = invoiceUrl;
  order.invoiceNumber = `INV-${Date.now()}`;
  await order.save();

  // 8️⃣ Clear Cart
  cart.items = [];
  await cart.save();

  return NextResponse.json({
    success: true,
    order,
  });
}