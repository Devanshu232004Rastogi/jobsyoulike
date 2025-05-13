// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// const updateProfileSchema = z
//   .object({
//     fullName: z.string().min(1).max(100).optional(),
//     email: z.string().email().optional(),
//     contact: z
//       .string()
//       .min(10, "Contact must be at least 10 digits")
//       .regex(/^\d+$/, "Contact must contain only digits")
//       .optional(),
//   })
 
//   .refine(
//     (data) => {
//       // Ensure at least one field is provided
//       return data.fullName !== undefined || data.email !== undefined || data.contact !== undefined;
//     },
//     {
//       message: "At least one field must be provided",
//     }
//   );

// export async function PATCH(
//   req: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const { userId } = await auth();

//     // Ensure the authenticated user matches the requested user profile
//     if (!userId || userId !== params.userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Validate the request body
//     const body = await req.json();
//     const validationResult = updateProfileSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { error: "Invalid data", details: validationResult.error.format() },
//         { status: 400 }
//       );
//     }

//     const values = validationResult.data;

//     // Find or create user profile
//     const profile = await db.userProfile.findUnique({
//       where: { userId },
//     });

//     let userProfile;

//     if (profile) {
//       userProfile = await db.userProfile.update({
//         where: { userId },
//         data: { ...values },
//       });
//     } else {
//       userProfile = await db.userProfile.create({
//         data: {
//           userId,
//           ...values,
//         },
//       });
//     }

//     return NextResponse.json(userProfile);
//   } catch (error) {
//     console.error(`[PROFILE_PATCH]: ${error}`);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    const values = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    let profile = await db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    let userProfile;

    if (profile) {
      userProfile = await db.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...values,
        },
      });
    } else {
      userProfile = await db.userProfile.create({
        data: {
          userId,
          ...values,
        },
      });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
