import { db } from "@/lib/db";
import { Job } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { has } from "lodash";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  yearsOfExperience?: string;
  workMode?: string;
  shiftTiming?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  yearsOfExperience,
  workMode,
  shiftTiming,
  savedJobs,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    let query: any = {
      where: {
        isPublished: true,
      },
      include: {
        company: true,
        category: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    if (typeof title !== "undefined" || typeof categoryId !== "undefined") {
      query.where = {
        ...(typeof title !== "undefined" && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
        ...(typeof categoryId !== "undefined" && {
          categoryId: {
            equals: categoryId,
          },
        }),
      };
    }

    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0);
          break;

        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;

        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;

        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;

        case "thisMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          startDate.setHours(0, 0, 0, 0);
          break;

        default:
          startDate = new Date(0); // fallback to Unix epoch
      }

      // Include in your Prisma-style query
      query.where.createdAt = {
        gte: startDate,
      };
    }
    let formattedShiftTiming = shiftTiming?.split(",");

    if (formattedShiftTiming && formattedShiftTiming.length > 0) {
      query.where.shiftTiming = {
        in: formattedShiftTiming,
      };
    }
    let formattedWorkingMode = workMode?.split(",");

    if (formattedWorkingMode && formattedWorkingMode.length > 0) {
      query.where.workMode = {
        in: formattedWorkingMode,
      };
    }
    let formattedExperience = yearsOfExperience?.split(",");

    if (formattedExperience && formattedExperience.length > 0) {
      query.where.yearsOfExperience = {
        in: formattedExperience,
      };
    }

    if(savedJobs){
      query.where.savedUsers={
        has:userId,
      }
    }
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.log("[GET_JOBS]:", error);
    return [];
  }
};
