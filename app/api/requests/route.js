import { NextResponse } from "next/server";
import {
  createSkillRequest,
  updateSkillRequest,
  getSkillRequestsByUserId,
  skillRequests,
  getUserById,
  generateGoogleMeetLink,
} from "@/app/lib/data";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const userRequests = getSkillRequestsByUserId(userId);
      return NextResponse.json({ requests: userRequests, success: true });
    }

    return NextResponse.json({ requests: skillRequests, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch requests", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json();

    const { fromUserId, toUserId, offeredSkill, wantedSkill, message } =
      requestData;

    if (!fromUserId || !toUserId || !offeredSkill || !wantedSkill) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const newRequest = createSkillRequest({
      fromUserId: parseInt(fromUserId),
      toUserId: parseInt(toUserId),
      offeredSkill,
      wantedSkill,
      message: message || "",
      status: "pending",
    });

    return NextResponse.json({
      request: newRequest,
      success: true,
      message: "Request created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create request", success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required", success: false },
        { status: 400 }
      );
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status", success: false },
        { status: 400 }
      );
    }

    // Get the request first to access user details
    const currentRequest = skillRequests.find(
      (req) => req.id === parseInt(requestId)
    );
    if (!currentRequest) {
      return NextResponse.json(
        { error: "Request not found", success: false },
        { status: 404 }
      );
    }

    let updateData = { status };

    // If accepting the request, generate Google Meet link
    if (status === "accepted") {
      const fromUser = getUserById(currentRequest.fromUserId);
      const toUser = getUserById(currentRequest.toUserId);

      if (fromUser && toUser) {
        const meetingDetails = generateGoogleMeetLink(
          fromUser,
          toUser,
          currentRequest.offeredSkill,
          currentRequest.wantedSkill
        );

        updateData = {
          ...updateData,
          googleMeetLink: meetingDetails.meetLink,
          meetingTitle: meetingDetails.meetingTitle,
          scheduledFor: meetingDetails.scheduledFor,
          meetingInstructions: meetingDetails.instructions,
        };
      }
    }

    const updatedRequest = updateSkillRequest(requestId, updateData);

    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Request not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      request: updatedRequest,
      success: true,
      message:
        status === "accepted" && updatedRequest.googleMeetLink
          ? "Request accepted! Google Meet link generated successfully."
          : "Request updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update request", success: false },
      { status: 500 }
    );
  }
}
