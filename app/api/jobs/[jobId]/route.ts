import { db } from "@/lib/db";
import { client, appwriteConfig } from "@/config/appwrite-config";
import { Storage } from "appwrite";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;
    const updatedVal = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("ID is missing ", { status: 401 });
    }

    const job = await db.job.update({
      where: {
        id: params.jobId,
        userId, // ensure user can only edit their own job
      },
      data: { ...updatedVal },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("ID is missing ", { status: 401 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
      include: {
        attachments: true,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    // Initialize Appwrite storage
    const storage = new Storage(client);

    // Delete job image if it exists
    if (job.imageUrl) {
      try {
        // Extract file ID from the Appwrite URL
        const imageFileIdMatch = job.imageUrl.match(/\/files\/([^/]+)\/view/);
        const imageFileId = imageFileIdMatch ? imageFileIdMatch[1] : null;

        if (imageFileId) {
          await storage.deleteFile(appwriteConfig.storageBucketId, imageFileId);
        }
      } catch (imageError) {
        console.log(`[JOB_IMAGE_DELETE_ERROR]: ${imageError}`);
        // Continue with job deletion even if image deletion fails
      }
    }

    // Delete all attachments from Appwrite storage
    if (job.attachments && job.attachments.length > 0) {
      for (const attachment of job.attachments) {
        try {
          // Extract file ID from the Appwrite URL
          const attachmentFileIdMatch = attachment.url.match(
            /\/files\/([^/]+)\/view/
          );
          const attachmentFileId = attachmentFileIdMatch
            ? attachmentFileIdMatch[1]
            : null;

          if (attachmentFileId) {
            await storage.deleteFile(
              appwriteConfig.storageBucketId,
              attachmentFileId
            );
          }
        } catch (attachmentError) {
          console.log(`[ATTACHMENT_DELETE_ERROR]: ${attachmentError}`);
          // Continue with other attachments deletion
        }
      }
    }

    await db.attachment.deleteMany({
      where: {
        jobId,
      },
    });
    // Delete the job and all related attachments (assuming cascade delete is set up)
    await db.job.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.json({
      message: "Job and associated files deleted successfully",
    });
  } catch (error) {
    console.log(`[JOB_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
