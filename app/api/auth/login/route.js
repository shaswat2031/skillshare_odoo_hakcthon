import { NextResponse } from "next/server";
import { getUserByEmail } from "@/app/lib/data";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed", success: false },
      { status: 500 }
    );
  }
}
