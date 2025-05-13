import { db } from "@/lib/db";
import { Storage } from "appwrite";
import { client, appwriteConfig } from "@/config/appwrite-config";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type RouteContext = {
  params: { jobId: string; attachmentId: string };
};

export async function DELETE(request: Request, { params }: RouteContext) {
  console.log("[JOB_ATTACHMENT_DELETE] Request received");
  console.log("[JOB_ATTACHMENT_DELETE] Params:", params);

  try {
    const { jobId, attachmentId } = params;
    console.log("[JOB_ATTACHMENT_DELETE] JobID:", jobId);
    console.log("[JOB_ATTACHMENT_DELETE] AttachmentID:", attachmentId);

    // Authentication check
    const { userId } = await auth();
    console.log("[JOB_ATTACHMENT_DELETE] Authenticated user:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!jobId || !attachmentId) {
      return NextResponse.json(
        { error: "Job ID or Attachment ID is missing" },
        { status: 400 }
      );
    }

    // Find the attachment
    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
      include: {
        job: true,
      },
    });

    console.log("[JOB_ATTACHMENT_DELETE] Found attachment:", attachment);

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    // Check if the attachment belongs to the specified job
    if (attachment.jobId !== jobId) {
      return NextResponse.json(
        { error: "Attachment does not belong to the specified job" },
        { status: 403 }
      );
    }

    // Check if the authenticated user has permission to delete this attachment
    // This assumes there's a userId field in your job model
    // Adjust according to your actual data model
    if (attachment.job && attachment.job.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this attachment" },
        { status: 403 }
      );
    }

    // Extract file ID from Appwrite URL if stored in Appwrite
    if (attachment.url) {
      const fileIdMatch = attachment.url.match(/\/files\/([^/]+)\/view/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;
      console.log("[JOB_ATTACHMENT_DELETE] File ID:", fileId);

      // Initialize Appwrite storage
      const storage = new Storage(client);

      // Delete from Appwrite storage if fileId exists
      if (fileId) {
        try {
          await storage.deleteFile(appwriteConfig.storageBucketId, fileId);
          console.log(
            "[JOB_ATTACHMENT_DELETE] File deleted from Appwrite storage"
          );
        } catch (storageError) {
          console.error(
            "[JOB_ATTACHMENT_DELETE] Error deleting file from storage:",
            storageError
          );
          // Continue with database deletion even if file deletion fails
        }
      }
    } else {
      console.log("[JOB_ATTACHMENT_DELETE] No URL found for attachment");
    }

    // Delete from database
    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("[JOB_ATTACHMENT_DELETE] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
