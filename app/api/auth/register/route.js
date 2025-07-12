import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/app/lib/data";

export async function POST(request) {
  try {
    const userData = await request.json();
    const {
      name,
      email,
      password,
      location,
      profilePhoto,
      skillsOffered,
      skillsWanted,
      availability,
      profile,
    } = userData;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required", success: false },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered", success: false },
        { status: 409 }
      );
    }

    // Create the user
    const newUser = createUser({
      name,
      email,
      password,
      location: location || "",
      profilePhoto: profilePhoto || "/placeholder-avatar.svg",
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      availability: availability || "weekends",
      profile: profile || "public",
      rating: 0,
    });

    // Remove password before sending response
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      user: safeUser,
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", success: false },
      { status: 500 }
    );
  }
}
