import { DataTable } from "@/components/custom/data-table";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Main component that receives props from Next.js router
export default function Page(props) {
  // Extract jobId from props, regardless of how it's nested
  const jobId = props.params?.jobId;
  
  return (
    <Suspense fallback={<div>Loading applicants...</div>}>
      <JobApplicantsPageContent jobId={jobId} />
    </Suspense>
  );
}
// Separate async server component to handle the data fetching and content rendering
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ApplicantColumns, column } from "./_components/applicants-columns";

async function JobApplicantsPageContent({ jobId }) {
  // Validation
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    redirect("/admin/jobs");
    return null;
  }

  // Auth check
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
    return null;
  }

  // Fetch job data
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
    return null;
  }

  // Fetch user profiles
  let profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
      appliedJobs: true,
    },
  });

  // Filter profiles for the specific job
  const filteredProfiles = profiles.filter((profile) =>
    profile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId)
  );

  // Format profiles for the data table
  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map(
    (profile) => ({
      id: profile.userId,
      fullName: profile.fullName ? profile.fullName : "",
      email: profile.email ? profile.email : "",
      contact: profile.contact ? profile.contact : "",
      appliedAt: profile.appliedJobs.find((job) => job.jobId === jobId)
        ?.appliedAt
        ? new Date(
            profile.appliedJobs.find((job) => job.jobId === jobId)?.appliedAt ??
              ""
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
      resume:
        profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ??
        "",
      resumeName:
        profile.resumes.find((res) => res.id === profile.activeResumeId)
          ?.name ?? "",
    })
  );

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center ">
      <div>
        <CustomBreadcrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: `${job ? job.title : ""}` },
          ]}
        />
      </div>

      <div className="mt-6 w-full">
        <DataTable
          columns={column}
          data={formattedProfiles}
          searchKey="fullName"
        />
      </div>
    </div>
  );
}