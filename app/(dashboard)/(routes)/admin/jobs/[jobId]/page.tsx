import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Main component that receives props from Next.js router
export default function Page(props) {
  // Extract jobId from props, regardless of how it's nested
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
import { Building2, File, LayoutDashboard, ListCheck } from "lucide-react";
import { JobPublishActions } from "./_components/jobs-publish-action";
import { Banner } from "@/components/custom/banner";
import { IconBadge } from "@/components/custom/icon-badge";
import TitleForm from "./_components/title-form";
import CategoryForm from "./_components/catgory-form";
import ImageForm from "./_components/image-form";
import ShortDesc from "./_components/short-desc";
import ShiftTiming from "./_components/time-shift";
import HourlyRateForm from "./_components/hourly-rate-form";
import WorkModeForm from "./_components/work-mode-form";
import YearsOfExperienceForm from "./_components/experience-year-form";
import JobDesc from "./_components/job-description";
import TagsForm from "./_components/tags-form";
import CompanyForm from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachment-form";

async function JobDetailsPageContent({ jobId }) {
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
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!job) {
    redirect("/admin/jobs");
    return null;
  }

  // Fetch categories and companies
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  // Calculate completion stats
  const requireFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requireFields.length;
  const completedFields = requireFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requireFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete all fields {completionText}
          </span>
        </div>
        <JobPublishActions
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {!job.isPublished && (
        <Banner
          variant="warning"
          label="This job is unpublished, it won't be visible in job list."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} variant="default" />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>

          <TitleForm initialData={job} jobId={job.id} />
          <ImageForm initialData={job} jobId={job.id} />
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <ShiftTiming initialData={job} jobId={job.id} />
          <HourlyRateForm initialData={job} jobId={job.id} />
          <WorkModeForm initialData={job} jobId={job.id} />
          <YearsOfExperienceForm initialData={job} jobId={job.id} />
          <ShortDesc initialData={job} jobId={job.id} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl text-neutral-700">Job Requirements</h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Details</h2>
            </div>
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700">Job Attachments</h2>
            </div>
            <AttachmentsForm initialData={job} jobId={job.id} />
          </div>
        </div>
      </div>

      {/* Full-width Job Description */}
      <div className="col-span-2 mt-10">
        <JobDesc initialData={job} jobId={job.id} />
      </div>
    </div>
  );
}
