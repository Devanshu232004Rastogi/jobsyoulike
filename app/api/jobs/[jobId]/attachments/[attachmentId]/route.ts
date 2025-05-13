import { client, appwriteConfig } from "@/config/appwrite-config";
import { Storage } from "appwrite";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ jobId: string; attachmentId: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { jobId, attachmentId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    });

    if (!attachment || attachment.jobId !== jobId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Extract file ID from the Appwrite URL
    // Assuming URL format like: https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view
    const fileIdMatch = attachment.url.match(/\/files\/([^/]+)\/view/);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;

    if (!fileId) {
      return new NextResponse("Invalid file URL format", { status: 400 });
    }

    // Initialize Appwrite storage
    const storage = new Storage(client);

    // Delete from Appwrite storage
    await storage.deleteFile(appwriteConfig.storageBucketId, fileId);

    // Delete from MongoDB
    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    return NextResponse.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.log(`[ATTACHMENT_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
