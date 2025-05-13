import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("ID is missing", { status: 401 });
    }

    const company = await db.company.findUnique({
      where: {
        id: params.companyId,
      },
    });

    // Correct syntax for updating an array in Prisma
    const updatedData = {
      followers: {
        push: userId,
      },
    };

    const updatedCompany = await db.company.update({
      where: {
        id: params.companyId,
        userId, // ensure user can only edit their own company
      },
      data: updatedData,
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
