import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "./lib/auth";
import appConfig from "./config/config"; // ✅ Renamed to avoid conflict

// Define which paths require authentication
const protectedPaths = ["/dashboard", "/profile", "/settings"];

// Define which paths are only for guests
const guestPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { verified, user } = verifyAuthToken(request);

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!verified) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (guestPaths.some((path) => pathname.startsWith(path))) {
    if (verified) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// ✅ Required export for Next.js middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|api).*)",
  ],
};
