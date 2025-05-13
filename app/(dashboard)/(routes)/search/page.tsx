export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/custom/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";
import { Suspense } from "react";

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
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const authResult = await auth();
    const userId = authResult?.userId;

    const jobs = await getJobs({ ...searchParams });

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
  } catch (error) {
    console.error("Error in search page:", error);
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Search</h2>
        <p>
          There was an error loading the search results. Please try again later.
        </p>
      </div>
    );
  }
};

export default SearchPage;
