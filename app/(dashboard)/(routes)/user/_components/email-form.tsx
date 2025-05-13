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
import { Pencil, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Box from "@/components/custom/box";
import { Button } from "@/components/ui/button";

interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const EmailForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
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
      email: initialData?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-lg mt-2 flex items-center gap-2",
            initialData?.email && "text-neutral-500 italic"
          )}
        >
          <Mail className="w-4 h-4 mr-2" />
          {initialData?.email ? initialData.email : "No email"}
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter your email"
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
