// app/(dashboard)/(routes)/search/_components/jobs-wrapper.tsx
import { getJobs } from "@/actions/get-jobs";
import { auth } from "@clerk/nextjs/server";
import { PageContent } from "./page-content";

interface JobsWrapperProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function JobsWrapper({ searchParams }: JobsWrapperProps) {
  // Fetch user ID and jobs
  const { userId } = await auth();
  const jobs = await getJobs({ ...searchParams });

  console.log(`Jobs count: ${jobs.length}`);

  return <PageContent jobs={jobs} userId={userId} />;
}
