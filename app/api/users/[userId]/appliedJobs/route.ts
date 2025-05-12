
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { string } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    const jobId = await req.text();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }
    
    let profile = await db.userProfile.findUnique({
        where: {
            userId :userId as string,
        },
    });
    
    if (!profile) {
      return new NextResponse("User profile not found", { status: 401 });
    }
   
    const updatedProfile = await db.userProfile.update({
        where: {  userId },
        data: {
          appliedJobs: {
            create: {
              jobId,
            },
          },
        },
      });
  
      return NextResponse.json(updatedProfile);
    } catch (error) {
      console.log("Error applying for job:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }