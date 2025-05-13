import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

// Define types using PageProps interface
export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// Use the actual types that work with Next.js 15
type Props = {
  params: { [key: string]: string };
  searchParams: SearchParams;
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

// Use Suspense boundary for useSearchParams() hook usage
export default function SearchPage(props: any) {
  // Use any type for props and then safely extract what we need
  const { searchParams = {} } = props;

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
