import { Suspense } from "react";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import Box from "@/components/custom/box";
import { SearchContainer } from "@/components/custom/search-container";

// Main component that receives props from Next.js router
export default function Page(props) {
  // Extract searchParams from props
  const searchParams = props.searchParams || {};

  return (
    <Suspense fallback={<div>Loading saved jobs...</div>}>
      <SavedJobsPageContent searchParams={searchParams} />
    </Suspense>
  );
}

// Separate async server component to handle the data fetching and content rendering
import { getJobs } from "@/actions/get-jobs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageContent } from "../search/_components/page-content";

async function SavedJobsPageContent({ searchParams }) {
  // Auth check
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
    return null;
  }

  // Fetch jobs with savedJobs filter
  const jobs = await getJobs({ ...searchParams, savedJobs: true });

  return (
    <div className="flex-col">
      <div className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadcrumb breadCrumbPage="Saved Jobs" />
      </div>

      <Box className="w-full h-44 bg-purple-600/20 items-center m-auto justify-center">
        <h2 className="font-sans uppercase text-3xl tracking-wider font-bold">
          Saved Jobs
        </h2>
      </Box>

      <div className="px-6 pt-6 md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
}
