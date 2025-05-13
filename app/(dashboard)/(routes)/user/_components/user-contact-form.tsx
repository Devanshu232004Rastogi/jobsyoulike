"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@/lib/generated/prisma";
import axios from "axios";
import { Phone, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Box from "@/components/custom/box";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  contact: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .regex(/^[0-9]+$/, { message: "Contact number must contain only digits" }),
});

export const ContactForm = ({ initialData, userId }: ContactFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: initialData?.contact || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/user/${userId}`, values);
      toast.success("Saved Successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const cancelEditing = () => {
    form.reset({
      contact: initialData?.contact || "",
    });
    setIsEditing(false);
  };

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-lg mt-2 flex items-center gap-2",
            initialData?.contact && "text-neutral-500 italic"
          )}
        >
          <Phone className="w-4 h-4 mr-2" />
          {initialData?.contact ? initialData.contact : "No contact number"}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter contact number"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              <Button
                type="button"
                onClick={cancelEditing}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isEditing && (
        <Button onClick={toggleEditing} variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}
    </Box>
  );
};
