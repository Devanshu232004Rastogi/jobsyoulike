"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Make sure the path is correct
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
interface CategoryListItemProps {
  label: string;
  value: string;
}

const CategoryListItem = ({ label, value }: CategoryListItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isSelected = currentCategoryId === value;
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 rounded-md transition cursor-pointer hover:shadow-md",
        isSelected && "bg-primary text-white border-primary"
      )}
    >
      {label}
    </Button>
  );
};

export default CategoryListItem;
