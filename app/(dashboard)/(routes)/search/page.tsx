import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/custom/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";
import { Suspense } from "react";

// Change the type definition for searchParams
type SearchProps = {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    yearsOfExperience?: string;
    workMode?: string;
    shiftTiming?: string;
  };
};

const SearchPage = async ({ searchParams }: SearchProps) => {
  // No need to await searchParams since it's now a regular object, not a Promise

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = await auth();

  // Pass the searchParams directly to getJobs
  const jobs = await getJobs({ ...searchParams });

  console.log(`Jobs count : ${jobs.length}`);

  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchContainer />
        </Suspense>
      </div>

      <div className="pt-6">
        <CategoriesList categories={categories} />
        <AppliedFilters categories={categories} />
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
};

export default SearchPage;
