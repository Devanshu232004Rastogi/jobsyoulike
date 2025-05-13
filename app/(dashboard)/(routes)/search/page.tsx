import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

// Define types using the Promise structure that Next.js 15 seems to be expecting
type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Resolve the promises to get the actual values
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return {
    title: "Search Jobs",
    description: "Find your dream job with our advanced search",
  };
}

// The main page component with Promise-based props type
export default async function SearchPage({ params, searchParams }: PageProps) {
  // Resolve the searchParams Promise to get the actual values
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={<div className="text-center p-10">Loading search page...</div>}
    >
      <div className="p-6">
        <div className="px-6 pt-6 block md:hidden md:mb-0">
          <SearchContainer />
        </div>

        <div className="pt-6">
          <CategoriesWrapper searchParams={resolvedSearchParams} />
          <JobsWrapper searchParams={resolvedSearchParams} />
        </div>
      </div>
    </Suspense>
  );
}
