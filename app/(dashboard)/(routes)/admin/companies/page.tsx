import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { columns, CompanyColumns } from "./_components/column";
import { format } from "date-fns";
import { DataTable } from "@/components/custom/data-table";

export default async function CompanyOverview() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    logo: company.logo ? company.logo : "",
    createdAt: company.createdAt
      ? format(company.createdAt, "MMMM dd, yyyy")
      : "N/A",
  }));
  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/companies/create"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className=" bg-black text-white hover:bg-primary border-1 border-black hover:text-white "
          >
            <Plus className="w-5 h-5 mr-2" /> New Company
          </Button>
        </Link>
      </div>

      {/* datatable gonna come here  */}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={formattedCompanies}
          searchKey="name"
        />
      </div>
    </div>
  );
}
