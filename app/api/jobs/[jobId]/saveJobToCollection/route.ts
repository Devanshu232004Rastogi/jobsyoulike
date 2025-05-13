import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const updatedData = {
      savedUsers: job.savedUsers ? { push: userId } : [userId],
    };

    // update the job
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: updatedData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_SAVE_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
