import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import config from "../config/config";
import { UserData } from "@/types";

export function createToken(user: UserData): string {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.auth.jwtSecret as jwt.Secret,
    {
      expiresIn: config.auth.tokenExpiration as jwt.SignOptions["expiresIn"],
    }
  );
}

// Set authentication cookie in the response
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: config.auth.cookieName,
    value: token,
    httpOnly: true,
    secure: !config.app.isDevelopment,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

// Clear authentication cookie (for logout)
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: config.auth.cookieName,
    value: "",
    httpOnly: true,
    secure: !config.app.isDevelopment,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

// Verify JWT token from cookie
export function verifyAuthToken(request: NextRequest): {
  verified: boolean;
  user?: any;
} {
  try {
    const token = request.cookies.get(config.auth.cookieName)?.value;

    if (!token) {
      return { verified: false };
    }

    const decoded = jwt.verify(token, config.auth.jwtSecret);
    return {
      verified: true,
      user: decoded,
    };
  } catch (error) {
    return { verified: false };
  }
}

// Get current authenticated user (for server components)
export function getCurrentUser(): { authenticated: boolean; user?: any } {
  try {
    const cookieStore = cookies();
    // const token = cookieStore.get(config.auth.cookieName)?.value;
    const token = "fixme"; // TODO: Fix this line

    if (!token) {
      return { authenticated: false };
    }

    const decoded = jwt.verify(token, config.auth.jwtSecret);
    return {
      authenticated: true,
      user: decoded,
    };
  } catch (error) {
    return { authenticated: false };
  }
}

// Authentication middleware for API routes
export async function authMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  const { verified, user } = verifyAuthToken(request);

  if (!verified) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return handler(request, user);
}
