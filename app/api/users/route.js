import { NextResponse } from "next/server";
import { users } from "@/app/lib/data";

export async function GET() {
  try {
    // Return users without passwords for security
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    return NextResponse.json({ users: safeUsers, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", success: false },
      { status: 500 }
    );
  }
}
