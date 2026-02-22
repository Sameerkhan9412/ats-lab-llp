import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Cart from "@/app/models/Cart";
import { getUserFromToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { programId, programName, fees } = await req.json();

  if (!programId || !programName || !fees) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const userId = user._id;

  // 🔥 Find user's cart
  let cart = await Cart.findOne({ userId });

  if (cart) {
    // 🔥 Check duplicate
    const alreadyExists = cart.items.some(
      (item: any) => item.programId === programId
    );

    if (alreadyExists) {
      return NextResponse.json(
        { message: "Already added in cart" },
        { status: 400 }
      );
    }

    cart.items.push({ programId, programName, fees });
    await cart.save();
  } else {
    // 🔥 Create new cart for user
    cart = await Cart.create({
      userId,
      items: [{ programId, programName, fees }],
    });
  }

  return NextResponse.json({
    message: "Added to cart successfully",
    cart,
  });
}


export async function GET(req: NextRequest) {
  await connectDB();

  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await Cart.findOne({ userId: user._id });

  return NextResponse.json(cart?.items || []);
}