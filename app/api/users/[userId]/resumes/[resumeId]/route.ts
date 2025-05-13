import { db } from "@/lib/db";
import { client, appwriteConfig } from "@/config/appwrite-config";
import { Storage } from "appwrite";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ userId: string; resumeId: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { userId, resumeId } = await context.params;
    const { userId: authenticatedUserId } = await auth();

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (authenticatedUserId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!resumeId) {
      return new NextResponse("Resume ID is missing", { status: 400 });
    }

    // Find the resume
    const resume = await db.resume.findUnique({
      where: {
        id: resumeId, // Ensure the resume belongs to the authenticated user
      },
    });

    if (!resume) {
      return new NextResponse("Resume Not Found", { status: 404 });
    }
    if (!resume || userId !== authenticatedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Initialize Appwrite storage
    const storage = new Storage(client);

    // Delete resume file if it exists
    if (resume.url) {
      try {
        // Extract file ID from the Appwrite URL
        const fileIdMatch = resume.url.match(/\/files\/([^/]+)\/view/);
        const fileId = fileIdMatch ? fileIdMatch[1] : null;

        if (fileId) {
          await storage.deleteFile(appwriteConfig.storageBucketId, fileId);
        }
      } catch (fileError) {
        console.log(`[RESUME_FILE_DELETE_ERROR]: ${fileError}`);
        // Continue with resume deletion even if file deletion fails
      }
    }

    // Delete the resume from the database
    await db.resume.delete({
      where: {
        id: resumeId,
      },
    });

    return NextResponse.json({
      message: "Resume and associated file deleted successfully",
    });
  } catch (error) {
    console.log(`[RESUME_DELETE_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
