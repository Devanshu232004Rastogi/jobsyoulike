"use client";

import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import Box from "@/components/custom/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  Currency,
  CurrencyIcon,
  DollarSign,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import { BookmarkCheck } from "lucide-react"; // Icon
import { Company, Job } from "@/lib/generated/prisma";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}
const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];

const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & { company: Company | null };
  const company = typeJob.company;

  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedByUser = userId && job.savedUsers?.includes(userId);
  const router = useRouter();

  const SavedUsersIcon = BookmarkCheck;
  const onClickSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`);
        toast.success("Job Removed");
      } else {
        await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`);
        toast.success("Job Saved");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`Error : ${(error as Error).message}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  const getExperienceLabel = (value: string) => {
    const experience = experienceData.find((exp) => exp.value === value);
    return experience ? experience.label : "NA";
  };
  return (
    <motion.div layout>
      <Card>
        <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">
          {/* Saved user icon */}
          <Box>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>

            <Button variant="ghost" size="icon">
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div onClick={onClickSaveJob}>
                  <SavedUsersIcon
                    className={cn(
                      "w-4 h-4",
                      isSavedByUser
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>

          {/* Company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden flex-shrink-0">
              {company?.logo && (
                <Image
                  alt={company?.name}
                  src={company?.logo}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full min-w-0">
              {" "}
              {/* This min-w-0 is crucial */}
              <p className="truncate text-stone-700 font-semibold text-base w-full">
                {job.title}
              </p>
              <Link
                href={`/companies/${company?.id}`}
                className="text-xs text-purple-500 w-full truncate block"
              >
                {company?.name}
              </Link>
            </div>
          </Box>

          {/* job details  */}

          <Box className="">
            {job.shiftTiming && (
              <div className="text-xs text-muted-foreground flex  items-center">
                <BriefcaseBusiness
                  className={formattedString(job.shiftTiming)}
                />
                {formattedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Layers className={formattedString(job.workMode)} />
                {formattedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <DollarSign className={formattedString(job.hourlyRate)} />
                {`${formattedString(job.hourlyRate)} $/hr`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Network className={formattedString(job.yearsOfExperience)} />
                {formattedString(getExperienceLabel(job.yearsOfExperience))}
              </div>
            )}
          </Box>

          {job.short_description && (
            <CardDescription className="text-xs ">
              {truncate(job?.short_description, {
                length: 200,
                omission: "....",
              })}
            </CardDescription>
          )}

          {job.tags.length > 0 && (
            <Box className="flex-wrap  justify-normal gap-3 ">
              {job.tags.slice(0, 6).map((tag, i) => (
                <div
                  key={i}
                  className="bg-gray-200  text-xs rounded-sm px-2 py-[2px] font-semibold text-neutral-500"
                >
                  {tag}
                </div>
              ))}
            </Box>
          )}
          <Box className="gap-2 mt-auto">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
                variant="outline"
              >
                Details
              </Button>
            </Link>

            <Button
              className="w-full border-purple-500 text-white bg-purple-500 hover:bg-transparent hover:text-purple-600"
              variant="outline"
              onClick={onClickSaveJob}
            >
              {isSavedByUser ? "Saved" : "Save For Later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;
