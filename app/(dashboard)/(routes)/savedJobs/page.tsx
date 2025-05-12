import { getJobs } from "@/actions/get-jobs";
// import CustomBreadcrumb from "@/components/custom/custom-breadcrumb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageContent } from "../search/_components/page-content";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { SearchContainer } from "@/components/custom/search-container";
import Box from "@/components/custom/box";

interface SearchProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAfter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  };
}

const SavedJobsPage = async ({ searchParams }: SearchProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

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
};

export default SavedJobsPage;
