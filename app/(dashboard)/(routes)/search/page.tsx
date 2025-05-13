import type { Metadata, ResolvingMetadata } from "next";
import { SearchContainer } from "@/components/custom/search-container";
import { CategoriesWrapper } from "./_components/categories-wrapper";
import { JobsWrapper } from "./_components/jobs-wrapper";

// Define the proper types for page props in Next.js 15
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate metadata for the page
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: "Search Jobs",
    description: "Find your dream job with our advanced search",
  };
}

// The main page component now correctly uses the Props type
export default async function SearchPage({ searchParams }: Props) {
  // Await the searchParams Promise to get the actual values
  const resolvedSearchParams = await searchParams;

  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        {/* Categories section */}
        <CategoriesWrapper searchParams={resolvedSearchParams} />

        {/* Applied filters would go here */}

        {/* Jobs section */}
        <JobsWrapper searchParams={resolvedSearchParams} />
      </div>
    </div>
  );
}
