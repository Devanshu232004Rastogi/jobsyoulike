import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
// Already commented out: import { Banner } from "@/components/custom/banner";
import { IconBadge } from "@/components/custom/icon-badge";
import NameForm from "./_components/name-form";
import ImageForm from "./_components/image-form";
import DescriptionForm from "./_components/description-form";
import { CompanySocialContactsForm } from "./_components/social-contact-form";
import CoverForm from "./_components/cover-form";
import CompanyCompleteOverview from "./_components/company-overview";
import JoinUsForm from "./_components/join-us-form";
// @ts-ignore
const CompanyEditPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
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

  // Commented out as unused
  // const categories = await db.category.findMany({
  //   orderBy: { name: "asc" },
  // });

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
  // const isComplete = requireFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      {/* Grid layout for left and right panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} variant={"default"} />
            <h2 className="text-xl text-neutral-700">Customize your company</h2>
          </div>

          <NameForm initialData={company} companyId={company.id} />
          <DescriptionForm initialData={company} companyId={company.id} />
          <ImageForm initialData={company} companyId={company.id} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Network} />
            <h2 className="text-xl">Company SocialContacts</h2>
          </div>
          <CompanySocialContactsForm
            initialData={company}
            companyId={company.id}
          />
          <CoverForm initialData={company} companyId={company.id} />
        </div>
      </div>
      <div className="col-span-2">
        <CompanyCompleteOverview initialData={company} companyId={company.id} />
        <JoinUsForm initialData={company} companyId={company.id} />
      </div>
    </div>
  );
};

export default CompanyEditPage;
