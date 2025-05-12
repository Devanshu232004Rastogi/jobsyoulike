import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, ListCheck, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/custom/icon-badge";
import NameForm from "./_components/name-form";
import ImageForm from "./_components/image-form";
import DescriptionForm from "./_components/description-form";
import { CompanySocialContactsForm } from "./_components/social-contact-form";
import CoverForm from "./_components/cover-form";
import CompanyCompleteOverview from "./_components/company-overview";
import JoinUsForm from "./_components/join-us-form";

// Define the correct type for the page props according to Next.js App Router
interface CompanyEditPageProps {
  params: {
    companyId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// The correct way to define a page component in Next.js App Router
const CompanyEditPage = async ({ params }: CompanyEditPageProps) => {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const requireFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.linkedIn,
    company.website,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requireFields.length;
  const completedFields = requireFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div>
      <div className="flex items-center gap-x-2 mb-8">
        <Link
          href="/admin/companies"
          className="flex items-center text-sm hover:opacity-75 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Company Setup</h2>
            <span className="text-sm text-slate-500">
              Complete all fields {completionText}
            </span>
          </div>

          {/* Grid layout for left and right panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={ListCheck} />
                  <h2 className="text-xl">Customize your company</h2>
                </div>

                <NameForm initialData={company} companyId={params.companyId} />
                <DescriptionForm
                  initialData={company}
                  companyId={params.companyId}
                />
                <ImageForm initialData={company} companyId={params.companyId} />
                <CoverForm initialData={company} companyId={params.companyId} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={Network} />
                  <h2 className="text-xl">Company SocialContacts</h2>
                </div>

                <CompanySocialContactsForm
                  initialData={company}
                  companyId={params.companyId}
                />
                <CompanyCompleteOverview
                  initialData={company}
                  companyId={params.companyId}
                />
                <JoinUsForm
                  initialData={company}
                  companyId={params.companyId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
