import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

type Props = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: "Search Jobs",
    description: "Find your dream job with our advanced search",
  };
}

export default function SearchPage({ params, searchParams }: Props) {
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
