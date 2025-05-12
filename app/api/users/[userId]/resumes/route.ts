import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resume } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth();
    const { userId } = params;

    // Ensure user is authenticated
    if (!authUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure we're operating on the authenticated user's data
    if (authUserId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get request body
    const { resumes } = await req.json();

    // Validate input
    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return new NextResponse("Invalid resume format", { status: 400 });
    }

    const createdResumes: Resume[] = [];

    // Process each resume
    for (const resume of resumes) {
      const { url, name } = resume;
      
      if (!url || !name) {
        continue; // Skip invalid entries
      }

      // Check if resume with the same URL already exists for this user
      const existingResume = await db.resume.findFirst({
        where: {
          userProfileId: userId,
          url,
        },
      });

      if (existingResume) {
        // Skip insertion for duplicates
        console.log(
          `Resume with URL ${url} already exists for user ${userId}`
        );
        continue;
      }

      // Create a new resume
      const newResume = await db.resume.create({
        data: {
          url,
          name,
          userProfileId: userId,
        },
      });

      createdResumes.push(newResume);
    }

    return NextResponse.json(createdResumes);
  } catch (error) {
    console.log(`[RESUME_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


