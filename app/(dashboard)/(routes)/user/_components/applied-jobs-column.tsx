"use client";
import { ColumnDef } from "@tanstack/react-table";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  // MoreHorizontal,
  // Pencil,
  Eye,
  ArrowUpDown,
  // ImageIcon,
  // EyeIcon,
} from "lucide-react";
import Link from "next/link";
// import Image from "next/image";

export type AppliedJobsProps = {
  id: string;
  title: string;
  company: string;
  category: string;
  appliedAt: string;
};

export const AppliedJobsColumn: ColumnDef<AppliedJobsProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "company",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Link href={`/search/${id}`}>
          <Button variant={"ghost"} size={"icon"}>
            <Eye className="w-4 h-4"/>
          </Button>
        </Link>
      );
    },
  },
];
