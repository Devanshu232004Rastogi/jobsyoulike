"use client";

import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SearchContainer } from "./search-container";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");
  return (
    <>
    {
      isSearchPage && (
        <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
          <SearchContainer/>
        </div>
      )
    }
      <div className="flex gap-x-2 ml-auto ">
        {isAdminPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button variant={"outline"} size={"sm"} className="border-primary border-2">
              <LogOut />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/admin/jobs"}>
            <Button variant={"outline"} size={"sm"} className="border-primary border-2">
              <LogOut />
              Admin Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
