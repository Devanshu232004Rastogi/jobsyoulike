import { Category } from "@/lib/generated/prisma";
import CategoryListItem from "./category-list-items"; // Update path as needed

interface CategoriesListProps {
  categories: Category[];
}

export const  CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mx-2 ">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
};
