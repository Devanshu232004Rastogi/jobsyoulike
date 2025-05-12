"use client";

import { Banner } from "@/components/custom/banner";
import Box from "@/components/custom/box";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { Preview } from "@/components/custom/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { Button } from "@/components/ui/button";

import {
  AppliedJob,
  Attachment,
  Company,
  Job,
  Resume,
  UserProfile,
} from "@/lib/generated/prisma";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile:
    | (UserProfile & { resumes: Resume[]; appliedJobs: AppliedJob[] })
    | null;
}

export const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
const router = useRouter()
  const onApplied = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/users/${userProfile?.userId}/appliedJobs`,
        jobId 
      );
  
      // send the mail to user
      await axios.post(`/api/thankyou`,{
        fullName:userProfile?.fullName,
        email:userProfile?.email,
      });
      toast.success("Job Applied ,You will receive mail shortly")
  
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong..");
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };
  
  return (
    <>
    {userProfile?.appliedJobs.some(
  (appliedJob) => appliedJob.jobId === jobId
) && (
  <Banner
    variant="success"
    label="Thank you for applying! Your application has been received, and we're reviewing it carefully. We'll be in touch soon with an update."
  />
)}

      <ApplyModal
        isOpen={isOpen}
        onClose={() =>setIsOpen(false) }
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />
      <div className="mt-4">
        <CustomBreadcrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title ?? ""}
        />
      </div>
      {/* Job cover image or section */}
      <div className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt="Job Cover"
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center w-full absolute bg-black/40">
              <h1 className="text-white text-2xl font-semibold">
                {job?.title}
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-neutral-600">
              {job?.title}
            </h2>

            <Link href={`/companies/${job?.company?.id}`}>
              <div className="flex items-center gap-2 mt-1">
                {job?.company?.logo && (
                  <Image
                    alt={job?.company?.name || "Company Logo"}
                    src={job?.company?.logo}
                    width={25}
                    height={25}
                  />
                )}
                <p className="text-muted-foreground text-sm font-semibold">
                  {job?.company?.name}
                </p>
              </div>
            </Link>
          </div>
          <div className="mt-6">
            {userProfile ? (
              <>
                {userProfile.appliedJobs.some(
                  (appliedJob) => appliedJob.jobId === jobId
                ) ? (
                  <Button
                    className="text-sm to-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white hover:shadow-sm"
                    variant={"outline"}
                  >
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    className="text-sm to-purple-700 bg-purple-500 text-white hover:bg-purple-900 hover:shadow-sm"
                    onClick={() =>setIsOpen(true)}
                  >
                    Apply
                  </Button>
                )}
              </>
            ) : (
              <Link href={"/user"}>
                <Button className="text-sm px-8 bg-purple-700 hover:bg-purple-900 hover:shadow-sm">
                  Update profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="font-sans">{job?.short_description}</p>
      </div>

      {job?.description && (
        <div>
          <Preview value={job?.description} />
        </div>
      )}

      {job?.attachments && job?.attachments.length > 0 && (
        <div className="flex-col my-4 items-start justify-start px-4">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <p className="text-sm text-muted-foreground">
            Download the attachments to know more about the job.
          </p>
          <div className="space-y-3 mt-2">
            {job?.attachments.map((item) => (
              <div key={item.id}>
                <Link
                  href={item.url}
                  target="_blank"
                  download
                  className="flex items-center gap-1 text-purple-500"
                >
                  <FileIcon className="w-4 h-4 mr-2" />
                  <p>{item.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
