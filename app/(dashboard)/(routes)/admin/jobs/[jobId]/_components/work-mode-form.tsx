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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Job } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import ComboBox from "@/components/ui/combobox"; // <-- Import ComboBox

interface WorkModeFormProps{
  initialData: Job;
  jobId: string;
}


let options=[
  {
    "value":"remote",
    "label":"Remote"
  },
  {
    "value":"hybrid",
    "label":"Hybrid"
  },
  {
    "value":"on-site",
    "label":"On-site"
  }
]
const formSchema = z.object({
  workMode: z.string().min(1, { message: "Title is required" }),
});

export const WorkModeForm= ({ initialData, jobId }: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode|| "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.workMode);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Mode
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.workMode&& "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No Work Mode Select"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Work Mode"
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="bg-black text-white"
              disabled={!isValid || isSubmitting}
              type="submit"
              variant={"outline"}
            >
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default WorkModeForm;
