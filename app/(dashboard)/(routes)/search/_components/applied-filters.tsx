"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/lib/generated/prisma";
import {  useSearchParams } from "next/navigation";
import React from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

export const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
  // const pathname = usePathname();
  // const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = Object.fromEntries(searchParams.entries());

  const shiftTimingParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "shiftTiming")
  );

  const workingModesPatams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "workMode")
  );

  const experienceParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "experience")
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (searchParams.size === 0) return null;

  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        {shiftTimingParams &&
          Object.entries(shiftTimingParams).map(([key, value], index) => (
            <div key={`shift-${key}-${index}`}>
              {value.split(",").map((item) => (
                <Button
                  variant="outline"
                  type="button"
                  key={item}
                  className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
                >
                  {item}
                </Button>
              ))}
            </div>
          ))}

        {workingModesPatams &&
          Object.entries(workingModesPatams).map(([key, value], index) => (
            <React.Fragment key={`work-${key}-${index}`}>
              {value.split(",").map((item) => (
                <Button
                  variant="outline"
                  type="button"
                  key={item}
                  className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
                >
                  {item}
                </Button>
              ))}
            </React.Fragment>
          ))}

        {experienceParams &&
          Object.entries(experienceParams).map(([key, value], index) => (
            <React.Fragment key={`exp-${key}-${index}`}>
              {value.split(",").map((item) => (
                <Button
                  variant="outline"
                  type="button"
                  key={item}
                  className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
                >
                  {item}
                </Button>
              ))}
            </React.Fragment>
          ))}

        {searchParams.get("categoryId") && (
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50"
          >
            {getCategoryName(searchParams.get("categoryId")!)}
          </Button>
        )}
      </div>

      {searchParams.get("title") && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-3xl text-muted-foreground">
            You searched for: <span className="font-bold text-neutral-900 capitalize">{searchParams.get("title")}</span>
          </h2>
        </div>
      )}
    </>
  );
};