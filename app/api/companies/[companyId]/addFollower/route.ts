import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Matches structure where params is awaited
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("ID is missing", { status: 401 });
    }

    const updatedCompany = await updateCompanyFollowers(companyId, userId);

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function updateCompanyFollowers(companyId: string, userId: string) {
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return await db.company.update({
    where: {
      id: companyId,
    },
    data: {
      followers: {
        push: userId,
      },
    },
  });
}
