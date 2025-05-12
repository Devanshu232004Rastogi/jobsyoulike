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

interface YearsOfExperienceFormProps{
  initialData: Job;
  jobId: string;
}


let options=[
  {
    "value":"0",
    "label":"Fresher"
  },
  {
    "value":"2",
    "label":"0-2 years"
  },
  {
    "value":"3",
    "label":"2-4 years"
  },
  {
    "value":"5",
    "label":"5+ years"
  }
]
const formSchema = z.object({
  yearsOfExperience: z.string().min(1),
});

export const YearsOfExperienceForm= ({ initialData, jobId }: YearsOfExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience|| "",
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
    (option) => option.value === initialData.yearsOfExperience);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Years of Expereince
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
            !initialData?.yearsOfExperience&& "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No Field Selected"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Years of Experience"
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

export default YearsOfExperienceForm;
