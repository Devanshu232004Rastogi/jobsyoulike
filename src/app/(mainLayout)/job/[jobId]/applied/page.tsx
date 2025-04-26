import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageProps } from "next";

export default async function ApplicationSuccessPage({
  params,
}: PageProps<{ jobId: string }>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const jobPost = await prisma.jobPost.findUnique({
    where: {
      id: params.jobId,
    },
    select: {
      jobTitle: true,
      Company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!jobPost) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <CheckCircle size={64} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
      <p className="text-lg mb-2">
        Your application for <strong>{jobPost.jobTitle}</strong> at{" "}
        <strong>{jobPost.Company.name}</strong> has been successfully submitted.
      </p>
      <p className="text-gray-500 mb-6">
        The employer will review your application and may contact you directly.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/jobs">Browse more jobs</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/applications">View your applications</Link>
        </Button>
      </div>
    </div>
  );
}
