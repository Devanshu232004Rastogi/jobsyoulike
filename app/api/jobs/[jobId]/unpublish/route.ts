import { db } from "@/lib/db";
import { client, appwriteConfig } from "@/config/appwrite-config";
import { Storage } from "appwrite";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const { userId } = await auth();
    const updatedVal = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.update({
      where: {
        id: jobId,
        userId, // ensure user can only edit their own job
      },
      data: { ...updatedVal },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
