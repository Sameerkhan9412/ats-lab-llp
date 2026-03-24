// app/api/admin/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import Profile from "@/app/models/Profile";
import { verifyToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

// ─── GET ALL USERS ───
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Verify admin access
    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const verified = searchParams.get("verified") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    if (verified === "true") {
      query.isVerified = true;
    } else if (verified === "false") {
      query.isVerified = false;
    }

    // Count total documents
    const total = await User.countDocuments(query);

    // Fetch users with pagination
    const users = await User.find(query)
      .select("-password -otp -otpExpiry")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Fetch profile data for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user: any) => {
        const profile = await Profile.findOne({ userId: user._id })
          .select("participant.name participant.city contact.phone")
          .lean();

        return {
          ...user,
          profile: profile || null,
        };
      })
    );

    return NextResponse.json({
      users: usersWithProfiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ─── CREATE NEW USER (Admin) ───
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify admin access
    const token = (await cookies()).get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, password, role, signupFor, isVerified } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      signupFor: signupFor || "",
      isVerified: isVerified || false,
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}