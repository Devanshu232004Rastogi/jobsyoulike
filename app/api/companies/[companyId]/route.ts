import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const { userId } = await auth();
    const updatedVal = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("ID is missing", { status: 401 });
    }

    const company = await db.company.update({
      where: {
        id: companyId,
        userId, // Only allow the company owner to update
      },
      data: { ...updatedVal },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
