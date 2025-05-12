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

interface ImageFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  logo: z.string().min(1, "Logo is required"),
});

export const ImageForm= ({
  initialData,
  companyId,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<{ url: string; fileId: string } | null>(
    initialData.logo ? { url: initialData.logo, fileId: "" } : null
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: initialData?.logo || "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (image?.url) {
      form.setValue("logo", image.url);
      form.trigger("logo");
    }
  }, [image, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Logo updated");
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
        Company Logo
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
          {!initialData?.logo ? (
            <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-neutral-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                alt="Company Logo"
                fill
                className="w-full h-full object-contain"
                src={initialData.logo}
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
              name="logo"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={image}
                      onChange={(val) => setImage(val)}
                      onRemove={() => {
                        setImage(null);
                        form.setValue("logo", "");
                        form.trigger("logo");
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

export default ImageForm;
