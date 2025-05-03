import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { authenticated, user: authUser } = getCurrentUser();

    if (!authenticated || !authUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch additional user data if needed
    const user = await User.findById(authUser.id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}
