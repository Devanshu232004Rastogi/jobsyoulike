import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = await auth();
    const { companyId } = params;
    const updatedVal = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("ID is missing ", { status: 401 });
    }

    const company = await db.company.update({
      where: {
        id: params.companyId,
        userId, // ensure user can only edit their own company
      },
      data: { ...updatedVal },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
