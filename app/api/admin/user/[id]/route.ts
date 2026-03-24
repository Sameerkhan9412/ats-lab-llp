// app/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";
import { verifyToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

// Define params type
type Params = Promise<{ id: string }>;

// ─── GET SINGLE USER ───
export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Await params first
    const { id } = await params;

    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(id)
      .select("-password -otp -otpExpiry")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await Profile.findOne({ userId: id }).lean();

    return NextResponse.json({
      user: {
        ...user,
        profile: profile || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ─── UPDATE USER ───
export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Await params first
    const { id } = await params;

    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, role, isVerified, signupFor, password } = body;

    // Build update object
    const updateData: any = {};

    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (role !== undefined) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (signupFor !== undefined) updateData.signupFor = signupFor;

    // If password is being updated, hash it
    if (password) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password -otp -otpExpiry");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ─── DELETE USER ───
export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Await params first
    const { id } = await params;

    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent self-deletion
    if (payload.userId === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also delete associated profile
    await Profile.findOneAndDelete({ userId: id });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}