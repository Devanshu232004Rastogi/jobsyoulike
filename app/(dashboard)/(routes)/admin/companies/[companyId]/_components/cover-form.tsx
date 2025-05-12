"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
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
import { ImageIcon, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import ImageUpload from "@/components/custom/image-upload";
import { Company } from "@/lib/generated/prisma"; // Adjust this import as needed

interface CoverFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  coverImage: z.string().min(1, "Cover Image is required"),
});

export const CoverForm= ({
  initialData,
  companyId,
}: CoverFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<{ url: string; fileId: string } | null>(
    initialData.coverImage ? { url: initialData.coverImage, fileId: "" } : null
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: initialData?.coverImage || "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (image?.url) {
      form.setValue("coverImage", image.url);
      form.trigger("coverImage");
    }
  }, [image, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Cover Image updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Cover Image
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div>
          {!initialData?.coverImage ? (
            <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-neutral-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                alt="Company Logo"
                fill
                className="w-full h-full object-contain"
                src={initialData.coverImage}
              />
            </div>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="coverImage"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={image}
                      onChange={(val) => setImage(val)}
                      onRemove={() => {
                        setImage(null);
                        form.setValue("coverImage", "");
                        form.trigger("coverImage");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting || !image?.url}
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

export default CoverForm;
