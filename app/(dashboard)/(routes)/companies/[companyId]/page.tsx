// import { getJobs } from "@/actions/get-jobs";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CompanyDetailContentPage } from "./_components/company-detail-content";

import { Suspense } from "react";

// Main component that receives props from Next.js router
export default function Page(props) {
  // Extract jobId from props, regardless of how it's nested
  const companyId = props.params?.companyId;

  return (
    <Suspense fallback={<div>Loading company details...</div>}>
      <CompanyDetailPage companyId={companyId} />
    </Suspense>
  );
}

const CompanyDetailPage = async ({ companyId }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="ml-4 mt-4 mb-4 flex items-center justify-start gap-2">
        <CustomBreadcrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company?.name !== undefined ? company.name : ""}
        />
      </div>
      {/* Add more UI for company details or jobs here */}

      {company?.coverImage && (
        <div className="relative flex items-center justify-center overflow-hidden h-80 -z-10">
          <Image
            src={company.coverImage}
            alt={company.name}
            fill
            className="object-cover h-full w-full"
          />
        </div>
      )}

      {/* company related detals */}

      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId} />
    </div>
  );
};
