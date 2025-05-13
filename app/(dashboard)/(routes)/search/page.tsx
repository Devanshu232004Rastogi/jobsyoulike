// @ts-nocheck
import { Suspense } from "react";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

export default function SearchPage({ searchParams }) {
  return (
    <Suspense
      fallback={<div className="text-center p-10">Loading search page...</div>}
    >
      <div className="p-6">
        <div className="px-6 pt-6 block md:hidden md:mb-0">
          <SearchContainer />
        </div>

        <div className="pt-6">
          <CategoriesWrapper searchParams={searchParams} />
          <JobsWrapper searchParams={searchParams} />
        </div>
      </div>
    </Suspense>
  );
}
