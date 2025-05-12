"use client";

import { Company, Job } from "@/lib/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/custom/preview";
import { JobsTabContent } from "./jobs-tab-conent";

interface TabContentSectionProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

export const TabContentSection = ({
  userId,
  company,
  jobs,
}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full  border-hidden">
        <TabsList className="bg-transparent rounded-md ">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
          >
            Why Join Us
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none bg-transparent"
          >
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {company.overview ? <Preview value={company.overview} /> : ""}
        </TabsContent>
        <TabsContent value="joinus">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs} /> : ""}
        </TabsContent>
        <TabsContent value="jobs">
            <JobsTabContent        jobs={jobs}  userId={userId}/>
          
        </TabsContent>

      </Tabs>
    </div>
  );
};
