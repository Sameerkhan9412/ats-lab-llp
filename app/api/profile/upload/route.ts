import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Profile from "@/app/models/Profile";
import multer from "multer";
import path from "path";
import fs from "fs";

// ----------------------
// Ensure upload directory exists
// ----------------------
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ----------------------
// Multer config
// ----------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueName}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ----------------------
// Helper to run multer in App Router
// ----------------------
function runMiddleware(req: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, {} as any, (result: any) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

// ----------------------
// POST handler
// ----------------------
export async function POST(req: NextRequest) {
  await connectDB();
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Convert NextRequest → Node request
  const nodeReq = Object.assign(req, {
    headers: Object.fromEntries(req.headers.entries()),
  });

  await runMiddleware(
    nodeReq,
    upload.fields([
      { name: "gstCertificate", maxCount: 1 },
      { name: "accreditationCertificate", maxCount: 1 },
    ])
  );

  const files: any = (nodeReq as any).files;

  const uploads: any = {};

  if (files?.gstCertificate) {
    uploads.gstCertificate =
      "/uploads/" + files.gstCertificate[0].filename;
  }

  if (files?.accreditationCertificate) {
    uploads.accreditationCertificate =
      "/uploads/" + files.accreditationCertificate[0].filename;
  }

  const profile = await Profile.findOneAndUpdate(
    { userId: payload.userId },
    { $set: { uploads } },
    { new: true }
  );

  return NextResponse.json({
    message: "Files uploaded successfully",
    uploads,
    profile,
  });
}
