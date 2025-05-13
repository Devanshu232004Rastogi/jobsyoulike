import { Suspense } from "react";
import { SearchContainer } from "@/components/custom/search-container";

// The main page component that receives props from Next.js
export default function SearchPage(props) {
  // Extract searchParams from props without typing it
  const searchParams = props.searchParams || {};
  
  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        {/* Use Suspense for all data-dependent components */}
        <Suspense fallback={<div>Loading categories...</div>}>
          <SearchPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// Separate component that handles all data fetching
import { getJobs } from "@/actions/get-jobs";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

// This async component handles all data fetching
async function SearchPageContent({ searchParams }) {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    }
  });

  const { userId } = await auth();
  const jobs = await getJobs({ ...searchParams });
  
  console.log(`Jobs count : ${jobs.length}`);

  return (
    <>
      {/* categories */}
      <CategoriesList categories={categories} />
      
      {/* applied filters */}
      <AppliedFilters categories={categories} />
      
      {/* Page content */}
      <PageContent jobs={jobs} userId={userId} />
    </>
  );
}