import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/custom/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    yearsOfExperience: string;
    workMode: string;
    shiftTiming: string;
  };
}


const SearchPage = async ({ searchParams }: SearchProps) => {
  const categories = await db.category.findMany({
    orderBy :{
      name: "asc",
    }
  })

  const {userId} = await auth();
  const jobs = await getJobs({...searchParams})
console.log(`Jobs count : ${jobs.length}`)
  return <div className="p-6">
  
  <div className=" px-6 pt-6 block md:hidden md:mb-0 ">

    <SearchContainer/>
  </div>

  <div className="pt-6">
    {/* catgories */}

<CategoriesList  categories={categories}/>
    {/* applied filters */}
<AppliedFilters categories={categories}/>

    {/* Page content */}
<PageContent jobs={jobs} userId={userId}/>
  </div>
  </div>;
};

export default SearchPage;
