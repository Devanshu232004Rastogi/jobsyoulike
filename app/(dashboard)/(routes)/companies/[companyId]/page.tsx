import { getJobs } from "@/actions/get-jobs";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CompanyDetailContentPage } from "./_components/company-detail-content";

interface CompanyDetailPageProps {
  params: {
    companyId: string;
  };
}

const CompanyDetailPage = async ({ params }: CompanyDetailPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
  });

  if (!company) {
    redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      companyId: params.companyId,
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

export default CompanyDetailPage;
