"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarRouteProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarRouteItems = ({ icon: Icon, label, href }: SidebarRouteProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);
    
  const handleClick = () => {
    router.push(href);
  };
  
  return (
   <Fragment  >
     <Button
      onClick={handleClick}
      className={cn(
        "flex border-hidden  rounded-none items-center  gap-x-2 text-neutral-500 text-sm font-[500]  py-5 pr-0 transition-all hover:text-neutral-600 hover:bg-neutral-300/20",
        isActive && "text-blue-700 bg-blue-700/20 hover:bg-blue-700/20 hover:text-blue-700"
      )}
      variant={"outline"}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon 
          size={22} 
          className={cn("text-neutral-500", isActive && "text-blue-700")} 
        />
        {label}
      </div>
      {/* Highlighter color */}
      <div
        className={cn(
          "ml-auto h-9  opacity-0 border-2 border-blue-700 transition-all",
          isActive && "opacity-100"
        )}
      ></div>
    </Button>
   </Fragment>
  );
};

export default SidebarRouteItems;