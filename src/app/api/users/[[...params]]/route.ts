import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { authMiddleware } from "@/lib/auth";

// GET - Get all users or a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { params?: string[] } }
): Promise<NextResponse> {
  try {
    await dbConnect();

    // Check if we're requesting a specific user by ID
    const userId = params.params?.[0];

    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user,
      });
    }

    // Return all users (with pagination)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create a new user (protected, admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  return authMiddleware(request, async (req, currentUser) => {
    // Check if user has admin role
    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    try {
      await dbConnect();

      const body = await req.json();
      const { name, email, password, role } = body;

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
        role: role || "user",
      });

      await newUser.save();

      return NextResponse.json(
        {
          success: true,
          data: newUser.toJSON(),
          message: "User created successfully",
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error creating user:", error);

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
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }
  });
}

// PATCH - Update a user by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { params?: string[] } }
): Promise<NextResponse> {
  return authMiddleware(request, async (req, currentUser) => {
    try {
      await dbConnect();

      const userId = params.params?.[0];

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "User ID is required" },
          { status: 400 }
        );
      }

      // Only allow users to update their own profile or admins to update any profile
      if (currentUser.id !== userId && currentUser.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      const body = await req.json();
      const { name, email, role } = body;

      // Find user
      const user = await User.findById(userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;

      // Only admins can update roles
      if (role && currentUser.role === "admin") {
        user.role = role;
      }

      await user.save();

      return NextResponse.json({
        success: true,
        data: user.toJSON(),
        message: "User updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating user:", error);

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
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }
  });
}

// DELETE - Delete a user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { params?: string[] } }
): Promise<NextResponse> {
  return authMiddleware(request, async (req, currentUser) => {
    try {
      await dbConnect();

      const userId = params.params?.[0];

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "User ID is required" },
          { status: 400 }
        );
      }

      // Only allow users to delete their own profile or admins to delete any profile
      if (currentUser.id !== userId && currentUser.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Delete user
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete user" },
        { status: 500 }
      );
    }
  });
}
