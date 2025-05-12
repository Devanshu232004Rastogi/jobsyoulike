"use client";
import { z } from "zod";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Company } from "@/lib/generated/prisma";

interface DescriptionFormProps {
  initialData: Company;
  companyId: string;
}

// Schema only expects description
const formSchema = z.object({
  description: z.string().min(1),
});

export const DescriptionForm = ({ initialData, companyId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Pass only description and sanitize null to empty string
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "", // convert null to empty string
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Description
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p className="text-sm mt-2">{initialData.description || "No description provided."}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g.   All about your company"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="bg-black text-white"
            >
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DescriptionForm;
