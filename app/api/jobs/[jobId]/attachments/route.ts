import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const { attachments } = await request.json();

    if (
      !attachments ||
      !Array.isArray(attachments) ||
      attachments.length === 0
    ) {
      return new NextResponse("Invalid Attachment Format", { status: 400 });
    }

    const createdAttachments: Attachment[] = [];

    for (const attachment of attachments) {
      const { url, name } = attachment;

      // Check if the attachment with the same URL already exists for this jobId
      const existingAttachment = await db.attachment.findFirst({
        where: {
          jobId,
          url,
        },
      });

      if (existingAttachment) {
        // Skip the insertion
        console.log(
          `Attachment with URL ${url} already exists for jobId ${jobId}`
        );
        continue;
      }

      // Create a new attachment
      const createdAttachment = await db.attachment.create({
        data: {
          url,
          name,
          jobId,
        },
      });

      createdAttachments.push(createdAttachment);
    }

    return NextResponse.json(createdAttachments);
  } catch (error) {
    console.log(`[JOB_ATTACHMENT_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}