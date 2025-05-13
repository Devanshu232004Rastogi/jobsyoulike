import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Using the Promise-based params type that works with your Next.js version
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    // Fetch the company first
    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Remove the userId from the followers array
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: {
          set: company.followers.filter((id: string) => id !== userId),
        },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[REMOVE_FOLLOWER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
