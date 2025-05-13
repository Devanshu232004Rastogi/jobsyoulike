import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resume } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const { userId: authenticatedUserId } = await auth();

    // Ensure user is authenticated
    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure we're operating on the authenticated user's data
    if (authenticatedUserId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get request body
    const body = await request.json();
    const { resumes } = body;

    // Validate input
    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return new NextResponse("Invalid resume format", { status: 400 });
    }

    const createdResumes: Resume[] = [];
    const skippedResumes: { url: string; reason: string }[] = [];

    // Process each resume
    for (const resume of resumes) {
      const { url, name } = resume;

      if (!url || !name) {
        skippedResumes.push({
          url: url || "unknown",
          reason: "Missing required fields (url or name)",
        });
        continue;
      }

      // Check if resume with the same URL already exists for this user
      const existingResume = await db.resume.findFirst({
        where: {
          userProfileId: userId,
          url,
        },
      });

      if (existingResume) {
        skippedResumes.push({
          url,
          reason: "Resume with this URL already exists",
        });
        continue;
      }

      try {
        // Create a new resume
        const newResume = await db.resume.create({
          data: {
            url,
            name,
            userProfileId: userId,
          },
        });

        createdResumes.push(newResume);
      } catch (createError) {
        console.log(`[RESUME_CREATE_ERROR]: ${createError}`);
        skippedResumes.push({
          url,
          reason: "Database error during creation",
        });
      }
    }

    return NextResponse.json({
      success: true,
      created: createdResumes,
      skipped: skippedResumes.length > 0 ? skippedResumes : undefined,
      message: `Created ${createdResumes.length} resumes, skipped ${skippedResumes.length} resumes`,
    });
  } catch (error) {
    console.log(`[RESUME_POST_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
