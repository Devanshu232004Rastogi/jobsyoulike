import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { JobDetailsPageContent } from "./_components/job-detailpage-content";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-jobs";
import { PageContent } from "../_components/page-content";

interface JobDetailsPageProps {
  params: {
    jobId: string;
  };
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
    
  });
  console.log(job)

  if (!job) {
    return redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
      appliedJobs: true, // ✅ add this line
    },
  });
  


  const jobs = await getJobs({});

  const filteredJobs = jobs.filter(
    (j) => j.id !== job?.id && j.categoryId === job?.categoryId
  );
  
  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsPageContent job={job} jobId={job.id} userProfile={profile} />
  
      {filteredJobs && filteredJobs.length > 0 && (
        <>
          <Separator />
          <div className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Related Jobs</h2>
          </div>
  
          <PageContent jobs={filteredJobs} userId={userId} />
        </>
      )}
    </div>
  );
  
};

export default JobDetailsPage;
