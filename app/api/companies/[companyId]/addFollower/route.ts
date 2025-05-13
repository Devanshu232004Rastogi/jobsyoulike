import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// The correct type signature for Next.js 13+ dynamic route handlers
export async function PATCH(
  request: Request,
  context: { params: { companyId: string } }
) {
  try {
    const { userId } = await auth();
    const { companyId } = context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!companyId) {
      return new NextResponse("ID is missing", { status: 401 });
    }

    // Use a separate async function to handle DB operations
    const updatedCompany = await updateCompanyFollowers(companyId, userId);

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Separate async function for database operations
async function updateCompanyFollowers(companyId: string, userId: string) {
  // First check if the company exists
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Update the company's followers
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
