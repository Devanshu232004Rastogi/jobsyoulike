"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Company name can't be empty" }),
});

const CompanyCreatePage = () => {
  // const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/companies", values);

      router.push(`/admin/companies/${response.data.id}`);

      // Show success toast
      toast.success("Company Profile Created");
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error((error as Error)?.message);
    }
  }

  const { isSubmitting, isValid } = form.formState;

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your Company Profile</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your Company? Don&apos;t worry, you can change
          this later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g ... Samsung"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Name of This Company </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/admin/jobs"}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="bg-black text-white hover:bg-primary border-1 border-black hover:text-white"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanyCreatePage;
