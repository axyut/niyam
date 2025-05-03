import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  clearAuthCookie(response);

  return response;
}
