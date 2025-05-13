import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/custom/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

// Remove the custom interface and use Next.js's built-in page props pattern
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse the search parameters
  const title = searchParams.title as string;
  const categoryId = searchParams.categoryId as string;
  const createdAtFilter = searchParams.createdAtFilter as string;
  const yearsOfExperience = searchParams.yearsOfExperience as string;
  const workMode = searchParams.workMode as string;
  const shiftTiming = searchParams.shiftTiming as string;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = await auth();
  const jobs = await getJobs({
    title,
    categoryId,
    createdAtFilter,
    yearsOfExperience,
    workMode,
    shiftTiming,
  });

  console.log(`Jobs count : ${jobs.length}`);

  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        {/* categories */}
        <CategoriesList categories={categories} />

        {/* applied filters */}
        <AppliedFilters categories={categories} />

        {/* Page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
}
