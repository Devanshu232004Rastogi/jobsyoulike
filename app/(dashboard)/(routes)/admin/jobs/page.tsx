import {
  columns,
  JobsColumns,
} from "@/app/(dashboard)/(routes)/admin/jobs/_components/column";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
export default async function JobsPageOverview() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company:true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company? job.company.name :"",
    isPublished: job.isPublished,
    category: job.category ? job.category?.name : "N/A",
    createdAt: job.createdAt ? format(job.createdAt, "MMMM dd, yyyy") : "N/A",

  }));
  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className=" bg-black text-white hover:bg-primary border-1 border-black hover:text-white "
          >
            <Plus className="w-5 h-5 mr-2" /> New Job
          </Button>
        </Link>
      </div>

      {/* datatable gonna come here  */}

      <div className="mt-6">
        <DataTable columns={columns} data={formattedJobs} searchKey="title" />
      </div>
    </div>
  );
}
