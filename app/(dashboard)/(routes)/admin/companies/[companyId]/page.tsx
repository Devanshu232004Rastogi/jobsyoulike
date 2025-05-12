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
import { Suspense } from "react";

// Simplified approach without type annotations
export default function Page(props) {
  // Extract companyId from props, regardless of how it's nested
  const companyId = props.params?.companyId;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyEditPageContent companyId={companyId} />
    </Suspense>
  );
}

// Separate async server component to handle the data fetching and content rendering
async function CompanyEditPageContent({ companyId }: { companyId: string }) {
  // Validation
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(companyId)) {
    redirect("/admin/companies");
    return null;
  }

  // Auth check
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
    return null;
  }

  // Fetch company
  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId,
    },
  });

  if (!company) {
    redirect("/admin/companies");
    return null;
  }

  // Calculate completion stats
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

  // Render UI
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

                <NameForm initialData={company} companyId={companyId} />
                <DescriptionForm initialData={company} companyId={companyId} />
                <ImageForm initialData={company} companyId={companyId} />
                <CoverForm initialData={company} companyId={companyId} />
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
                  companyId={companyId}
                />
                <CompanyCompleteOverview
                  initialData={company}
                  companyId={companyId}
                />
                <JoinUsForm initialData={company} companyId={companyId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
