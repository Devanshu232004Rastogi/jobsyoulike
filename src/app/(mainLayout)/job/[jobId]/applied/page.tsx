// app/jobs/[jobId]/applied/page.tsx

import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ApplicationSuccessPage({
  params,
}: {
  params: { jobId: string };
}) {
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
    <div className="max-w-md mx-auto text-center py-12 space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="text-green-500 size-16" />
      </div>
      <h1 className="text-2xl font-bold">Application Submitted!</h1>
      <p>
        Your application for {jobPost.jobTitle} at {jobPost.Company.name} has
        been successfully submitted.
      </p>
      <p className="text-muted-foreground">
        The employer will review your application and may contact you directly.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Link href="/">
          <Button variant="outline">Browse more jobs</Button>
        </Link>
        <Link href="/dashboard/applications">
          <Button>View your applications</Button>
        </Link>
      </div>
    </div>
  );
}