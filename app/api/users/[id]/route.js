import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/app/lib/data";

export async function GET(request, { params }) {
  try {
    const user = getUserById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Return user without password
    const { password, ...safeUser } = user;

    return NextResponse.json({ user: safeUser, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const updates = await request.json();

    // Remove password from updates for security
    const { password, ...safeUpdates } = updates;

    const updatedUser = updateUser(params.id, safeUpdates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Return user without password
    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json({
      user: safeUser,
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user", success: false },
      { status: 500 }
    );
  }
}
