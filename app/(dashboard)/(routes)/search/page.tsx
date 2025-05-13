// app/(dashboard)/(routes)/search/page.tsx
import { Suspense } from "react";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

// Define proper types for the props
interface SearchPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

// The main page component that receives props from Next.js
export default function SearchPage({ searchParams = {} }: SearchPageProps) {
  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        {/* Suspense boundary for category data */}
        <Suspense
          fallback={
            <div className="text-center py-4">Loading categories...</div>
          }
        >
          <CategoriesWrapper searchParams={searchParams} />
        </Suspense>

        {/* Applied filters would go here */}

        {/* Suspense boundary for job data */}
        <Suspense
          fallback={<div className="text-center py-10">Loading jobs...</div>}
        >
          <JobsWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
