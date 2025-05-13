import { Suspense } from "react";

// Main component that receives props from Next.js router
export default function Page(props) {
  // Extract jobId from props
  const jobId = props.params?.jobId;

  return (
    <Suspense fallback={<div>Loading job details...</div>}>
      <JobDetailsPageContent jobId={jobId} />
    </Suspense>
  );
}

// Separate async server component to handle the data fetching and content rendering
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobDetailsPageContent as JobDetailsContent } from "./_components/job-detailpage-content";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-jobs";
import { PageContent } from "../_components/page-content";

async function JobDetailsPageContent({ jobId }) {
  // Validation
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    redirect("/search");
    return null;
  }

  // Auth check
  const { userId } = await auth();

  // Fetch job data
  const job = await db.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
    return null;
  }

  // Fetch user profile
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
      appliedJobs: true,
    },
  });

  // Fetch related jobs
  const jobs = await getJobs({});
  const filteredJobs = jobs.filter(
    (j) => j.id !== job?.id && j.categoryId === job?.categoryId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsContent job={job} jobId={job.id} userProfile={profile} />

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
}
