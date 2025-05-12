"use client";

import Box from "@/components/custom/box";
import { Job } from "@/lib/generated/prisma";
// import { PageContent } from "@/components/page-content"; // adjust this import based on your actual file
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/app/(dashboard)/(routes)/search/_components/page-content";

interface RecommendedJobsListProps {
  jobs: Job[];
  userId: string | null;
}

export const RecommendedJobsList = ({ jobs, userId }: RecommendedJobsListProps) => {
  return (
    <Box className="flex flex-col items-center justify-center gap-y-4 my-6">
      <h2 className="text-2xl font-semibold tracking-wider font-sans">
        Recommended Jobs
      </h2>

      <div className="w-full">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      <Link href="/search">
        <Button className="h-12 
        text-white
        bg-primary
        rounded-xl border hover:shadow-md hover:border-primary
        hover:bg-transparent hover:text-primary">
          View All Jobs
        </Button>
      </Link>
    </Box>
  );
};
