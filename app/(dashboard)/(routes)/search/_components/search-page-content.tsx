"use client";

import { useSearchParams } from "next/navigation";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./categories-wrapper";
import { JobsWrapper } from "./jobs-wrapper";

type SearchPageContentProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export function SearchPageContent({
  params,
  searchParams,
}: SearchPageContentProps) {
  // You can access both the passed searchParams and the hook-based ones
  const searchParamsHook = useSearchParams();

  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        <CategoriesWrapper searchParams={searchParams} />
        <JobsWrapper searchParams={searchParams} />
      </div>
    </div>
  );
}
