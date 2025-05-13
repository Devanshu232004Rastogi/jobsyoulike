// app/(dashboard)/(routes)/search/_components/categories-wrapper.tsx
import { db } from "@/lib/db";
import { CategoriesList } from "./categories-list";
import { AppliedFilters } from "./applied-filters";

interface CategoriesWrapperProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function CategoriesWrapper({
  searchParams,
}: CategoriesWrapperProps) {
  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      {/* Categories list */}
      <CategoriesList categories={categories} />

      {/* Applied filters */}
      <AppliedFilters categories={categories} />
    </>
  );
}
