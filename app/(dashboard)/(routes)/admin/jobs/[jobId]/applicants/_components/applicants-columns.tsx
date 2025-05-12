"use client";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  ArrowUpDown,
  ImageIcon,
  EyeIcon,
  File,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CellAction from "./cell-action";

export type ApplicantColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  resume: string;
  resumeName: string;
  appliedAt: string;
};

export const column: ColumnDef<ApplicantColumns>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fullname
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "contact",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell: ({ row }) => {
      const resume = row.original.resume;
      const resumeName = row.original.resumeName;

      return resume ? (
        <Link
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:underline"
        >
          <File className="h-4 w-4 mr-2" />
          {resumeName || "Download"}
        </Link>
      ) : (
        <span className="text-gray-400">No resume</span>
      );
    },
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
      const { id, fullName , email } = row.original;
      return <CellAction email={email} id={id} fullName={fullName} />
    },
  },
];
