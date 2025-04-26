// app/dashboard/applications/page.tsx
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BuildingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

async function getApplications(userId: string) {
  const applications = await prisma.jobApplication.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      createdAt: true,
      message: true,
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          location: true,
          employmentType: true,
          status: true,
          Company: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
}

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/applications");
  }

  const applications = await getApplications(session.user.id);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-6">
            Start applying for jobs to see them listed here
          </p>
          <Link href="/jobs" className={buttonVariants()}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={application.JobPost.Company.logo}
                    alt={application.JobPost.Company.name}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {application.JobPost.jobTitle}
                      </h3>
                      <p className="text-muted-foreground">
                        {application.JobPost.Company.name}
                      </p>
                    </div>
                    <Badge variant={application.JobPost.status === "ACTIVE" ? "default" : "outline"}>
                      {application.JobPost.status === "ACTIVE" ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BuildingIcon className="size-4" />
                      <span>{application.JobPost.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-4" />
                      <span>
                        Applied on{" "}
                        {application.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {application.message && (
                    <div className="mt-3 text-sm">
                      <p className="font-medium">Your message:</p>
                      <p className="mt-1 text-muted-foreground">{application.message}</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Link 
                      href={`/job/${application.JobPost.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}