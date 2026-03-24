import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/lib/auth";
import toast from "react-hot-toast";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log('i am token',token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = verifyToken(token);

    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (decoded.role !== "admin") {
        console.log("hi hi hi")
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};