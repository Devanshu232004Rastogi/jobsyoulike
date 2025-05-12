import { db } from "@/lib/db";
import { Storage } from "appwrite";
import { client, appwriteConfig } from "@/config/appwrite-config";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string, resumeId: string } }
) {
  console.log("[RESUME_DELETE] Request received");
  console.log("[RESUME_DELETE] Params:", params);
  
  try {
    const { userId, resumeId } = params;
    console.log("[RESUME_DELETE] UserID from params:", userId);
    console.log("[RESUME_DELETE] ResumeID from params:", resumeId);
    
    // Authentication check
    const { userId: authenticatedUserId } = await auth();
    console.log("[RESUME_DELETE] Authenticated user:", authenticatedUserId);
    
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (authenticatedUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the resume
    const resume = await db.resume.findUnique({
      where: { id: resumeId },
    });
    
    console.log("[RESUME_DELETE] Found resume:", resume);
    
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    
    // Extract file ID from Appwrite URL
    if (resume.url) {
      const fileIdMatch = resume.url.match(/\/files\/([^/]+)\/view/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;
      console.log("[RESUME_DELETE] File ID:", fileId);
      
      // Initialize Appwrite storage
      const storage = new Storage(client);
      
      // Delete from Appwrite storage if fileId exists
      if (fileId) {
        await storage.deleteFile(
          appwriteConfig.storageBucketId,
          fileId
        );
      }
    } else {
      console.log("[RESUME_DELETE] No URL found for resume");
    }
    
    // Delete from database
    await db.resume.delete({
      where: {
        id: resumeId,
      },
    });
    
    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("[RESUME_DELETE] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}