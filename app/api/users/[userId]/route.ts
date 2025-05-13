import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await request.json();

    // Validate input data
    if (!values || Object.keys(values).length === 0) {
      return new NextResponse("No update values provided", { status: 400 });
    }

    // Find the user profile
    const existingProfile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    let userProfile;

    if (existingProfile) {
      // Update existing profile
      userProfile = await db.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...values,
          updatedAt: new Date(), // Explicitly update the timestamp
        },
      });

      console.log(`[USER_PROFILE_UPDATED] Profile updated for user: ${userId}`);
    } else {
      // Create new profile if doesn't exist
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });

      console.log(
        `[USER_PROFILE_CREATED] New profile created for user: ${userId}`
      );
    }

    return NextResponse.json({
      success: true,
      profile: userProfile,
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
    });
  } catch (error) {
    console.log(`[USER_PROFILE_PATCH_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
