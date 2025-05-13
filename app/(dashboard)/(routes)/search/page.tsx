import { Suspense } from "react";
// import { SearchPageContent } from "./_components/search-page-content";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    yearsOfExperience: string;
    workMode: string;
    shiftTiming: string;
  };
}

// Main component that receives props from Next.js router
export default function SearchPage({ searchParams }: SearchProps) {
  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchContainer />
        </Suspense>
      </div>

      <div className="pt-6">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoriesListWrapper />
        </Suspense>

        <Suspense fallback={<div>Loading filters...</div>}>
          <AppliedFiltersWrapper searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<div>Loading jobs...</div>}>
          <PageContentWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// Separate component imports to prevent them being loaded in the main component
import { SearchContainer } from "@/components/custom/search-container";

// Wrapper components for async content
const CategoriesListWrapper = async () => {
  const { CategoriesList } = await import("./_components/categories-list");
  const { db } = await import("@/lib/db");

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <CategoriesList categories={categories} />;
};

const AppliedFiltersWrapper = async ({ searchParams }) => {
  const { AppliedFilters } = await import("./_components/applied-filters");
  const { db } = await import("@/lib/db");

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <AppliedFilters categories={categories} />;
};

const PageContentWrapper = async ({ searchParams }) => {
  const { PageContent } = await import("./_components/page-content");
  const { getJobs } = await import("@/actions/get-jobs");
  const { auth } = await import("@clerk/nextjs/server");

  const { userId } = await auth();
  const jobs = await getJobs({ ...searchParams });

  return <PageContent jobs={jobs} userId={userId} />;
};
