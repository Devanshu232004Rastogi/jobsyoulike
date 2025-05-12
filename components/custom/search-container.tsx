"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from  "query-string"
import ShiftTiming from "@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/time-shift";
export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const createdAtFilter = searchParams.get("createdAtFilter");
  const currentShiftTiming = searchParams.get("shiftTiming");
  const currentWorkMode = searchParams.get("workMode");
  const [value, setValue] = useState(currentTitle || "");
const debounceValue = useDebounce(value)


useEffect((
)=>{
    const url  = qs .stringifyUrl({
url : pathname,
query:{
    title:debounceValue,
    categoryId : currentCategoryId,
    createdAtFilter:createdAtFilter,
    shiftTiming:currentShiftTiming,
    workMode : currentWorkMode,

}},{
skipNull:true,
skipEmptyString:true,

}
    )
router.push(url)
},[
    debounceValue , currentCategoryId , router  , pathname , currentShiftTiming , currentWorkMode ,createdAtFilter
]) 
  return (
    <div className="flex items-center gap-x-2 relative flex-1 ">
      <Search className=" h-4 w-4 text-neutral-600 absolute  left-3" />
      <Input
        placeholder="Search for a job using job-title"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 rounded-lg bg-blue-50/80 focus-visible:"
      />

      {value && (
        <Button
          variant={"ghost"}
          size={"icon"}
          type="button"
          onClick={() => setValue("")}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
