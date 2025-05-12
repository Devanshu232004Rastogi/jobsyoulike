"use client";
import React from "react";
import {
  Bookmark,
  Building2,
  Compass,
  Home,
  List,
  Search,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import SidebarRouteItems from "./sidebar-route-items";
import { Separator } from "../ui/separator";
import { DateFilter } from "./date-filter";
import { CheckBoxContainer } from "./checkbox-container";
import qs from "query-string";

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: Building2,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Anlaytics",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Search,
    label: "Search",
    href: "/search",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user",
  },
  {
    icon: Bookmark,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
];

const shiftTimingsData = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

const workingModesData = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "office", label: "Office" },
];

const experienceData = [
  { value: "0", label: "Fresher" },
  { value: "2", label: "0-2 years" },
  { value: "3", label: "2-4 years" },
  { value: "5", label: "5+ years" },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");
  const routes = isAdminPage ? adminRoutes : guestRoutes;

  const handleShiftTimingChange = (shiftTimings: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      shiftTiming: shiftTimings,
    };
    const url = qs.stringifyUrl(
      { url: pathname, query: updatedQueryParams },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  const handleWorkingMode = (workingMode: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      workMode: workingMode,
    };
    const url = qs.stringifyUrl(
      { url: pathname, query: updatedQueryParams },
      { skipNull: true, skipEmptyString: true, arrayFormat: "comma" }
    );
    router.push(url);
  };

  const handleExperience = (experience: any[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experience,
    };
    const url = qs.stringifyUrl(
      { url: pathname, query: updatedQueryParams },
      { skipNull: true, skipEmptyString: true, arrayFormat: "comma" }
    );
    router.push(url);
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && !isAdminPage && (
        <>
          {/* Date Filter */}
          <div className="mt-2">
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Filters
              </h2>
              <DateFilter />
            </div>
          </div>

          {/* Working Schedule */}
          <div className="mt-2">
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Working Schedule
              </h2>
              <CheckBoxContainer
                data={shiftTimingsData}
                onChange={handleShiftTimingChange}
              />
            </div>
          </div>

          {/* Working Mode */}
          <div className="mt-2">
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Working Mode
              </h2>
              <CheckBoxContainer
                data={workingModesData}
                onChange={handleWorkingMode}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="mt-2">
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">
                Experience
              </h2>
              <CheckBoxContainer
                data={experienceData}
                onChange={handleExperience}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
