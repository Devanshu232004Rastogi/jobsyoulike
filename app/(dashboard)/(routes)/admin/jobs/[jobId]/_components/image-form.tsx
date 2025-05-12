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
import { Job } from "@/lib/generated/prisma";
import Image from "next/image";
import ImageUpload from "@/components/custom/image-upload";

interface ImageFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1),
});

export const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<{ url: string; fileId: string } | null>(null);
  
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const { isSubmitting } = form.formState;

  // Update form value when image changes
  useEffect(() => {
    if (image?.url) {
      form.setValue("imageUrl", image.url);
      form.trigger("imageUrl"); // Trigger validation
    }
  }, [image, form]);

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

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Cover Image
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
          {!initialData?.imageUrl ? (
            <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-neutral-500" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                alt="Cover Image"
                fill
                className="w-full h-full object-cover"
                src={initialData.imageUrl}
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={image}
                      onChange={(val) => {
                        setImage(val);
                      }}
                      onRemove={() => {
                        setImage(null);
                        form.setValue("imageUrl", "");
                        form.trigger("imageUrl");
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