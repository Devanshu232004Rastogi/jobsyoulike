import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/custom/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";
import { Suspense } from "react";

// Define the interface according to Next.js PageProps
// The searchParams is correctly typed as its own object
interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    yearsOfExperience?: string;
    workMode?: string;
    shiftTiming?: string;
  };
}

// This is the main component using the correct Next.js page props
export default async function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="p-6">
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="pt-6">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoriesSection />
        </Suspense>

        <AppliedFiltersSection
          categories={await getCategories()}
          searchParams={searchParams}
        />

        <Suspense fallback={<div>Loading jobs...</div>}>
          <JobsSection searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// Separate component to handle category fetching
async function CategoriesSection() {
  const categories = await getCategories();

  return <CategoriesList categories={categories} />;
}

// Helper function to get categories
async function getCategories() {
  return db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

// Component to handle applied filters
function AppliedFiltersSection({
  categories,
  searchParams,
}: {
  categories: any[];
  searchParams: SearchPageProps["searchParams"];
}) {
  return <AppliedFilters categories={categories} />;
}

// Component to handle job fetching and display
async function JobsSection({
  searchParams,
}: {
  searchParams: SearchPageProps["searchParams"];
}) {
  const { userId } = await auth();
  const jobs = await getJobs({ ...searchParams });
  console.log(`Jobs count: ${jobs.length}`);

  return <PageContent jobs={jobs} userId={userId} />;
}
