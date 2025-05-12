"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // or your toast setup
import { useRouter } from "next/navigation";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishActions = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/jobs/${jobId}/unpublish`);

        toast.success(`Job Unpublished`);
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);

        toast.success(`Job Published`);
      }
      router.refresh();
      // Optionally refresh the page or router.push to updated view
    } catch (error) {
      toast.error("Something went wrong while updating the job.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job deleted successfully.");
      // Optionally redirect after deletion
      router.refresh();
      return router.push("/admin/jobs")
    } catch (error) {
      toast.error("Failed to delete the job.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled || isLoading}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash onClick={onDelete} className="w-4 h-4" />
      </Button>
    </div>
  );
};
