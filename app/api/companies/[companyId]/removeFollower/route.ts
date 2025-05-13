import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ companyId: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { companyId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}
