import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    // Generate token
    const token = createToken(newUser.toJSON());

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: newUser.toJSON(),
      },
      message: "Registration successful",
    });

    // Set authentication cookie
    setAuthCookie(response, token);

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
