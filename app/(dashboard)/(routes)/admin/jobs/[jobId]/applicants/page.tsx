import { DataTable } from "@/components/custom/data-table";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApplicantColumns, column } from "./_components/applicants-columns";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { PageProps } from "@/types/page"; // Import the PageProps type

// Use the PageProps type that expects params to be a Promise
const JobApplicantsPage = async ({ params }: PageProps) => {
  // Resolve the params Promise
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

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

  const jobs = await db.job.findMany({
    where: {
      userId: userId as string,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredProfiles =
    profiles &&
    profiles.filter((profile) =>
      profile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId)
    );

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
};

export default JobApplicantsPage;
