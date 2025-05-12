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
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Linkedin, Globe, Mail } from "lucide-react"; // icons
import toast from "react-hot-toast";
import Link from "next/link";

interface CompanySocialContactsFormProps {
  initialData: {
    mail: string | null;
    website: string | null;
    linkedIn: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state: string | null;
    zipcode: string | null;
  };
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "Email is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  linkedIn: z.string().min(1, { message: "LinkedIn is required" }),
  address_line_1: z.string().min(1, { message: "Address Line 1 is required" }),
  address_line_2: z.string().min(1, { message: "Address Line 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
});

export const CompanySocialContactsForm = ({ 
  initialData, 
  companyId 
}: CompanySocialContactsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData.mail ?? "",
      website: initialData.website ?? "",
      linkedIn: initialData.linkedIn ?? "",
      address_line_1: initialData.address_line_1 ?? "",
      address_line_2: initialData.address_line_2 ?? "",
      city: initialData.city ?? "",
      state: initialData.state ?? "",
      zipcode: initialData.zipcode ?? "",
    },
    
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company socials updated");
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
        Company Socials
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
        <div className="text-sm mt-2 space-y-2">
          {initialData.mail && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-neutral-500" />
              <span>{initialData.mail}</span>
            </div>
          )}
          
          {initialData.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-neutral-500" />
              <Link href={initialData.website} className="text-blue-600 hover:underline">
                {initialData.website}
              </Link>
            </div>
          )}
          
          {initialData.linkedIn && (
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-neutral-500" />
              <Link href={initialData.linkedIn} className="text-blue-600 hover:underline">
                {initialData.linkedIn}
              </Link>
            </div>
          )}
          
          {initialData.address_line_1 && (
            <div className="mt-2">
              <p>{initialData.address_line_1}</p>
              {initialData.address_line_2 && <p>{initialData.address_line_2}</p>}
              <p>
                {initialData.city}, {initialData.state} {initialData.zipcode}
              </p>
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
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. sample@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. company.live"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. www.linkedIn.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. Street 3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                     <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. Division 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Sivakasi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Tamil Nadu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 626130"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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

export default CompanySocialContactsForm;