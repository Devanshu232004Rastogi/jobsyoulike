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
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Company } from "@/lib/generated/prisma";
// import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { Editor } from "@/components/custom/editor";
import { Preview } from "@/components/custom/preview";
import { cn } from "@/lib/utils";

interface JoinUsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1),
});

export const JoinUsForm = ({ initialData, companyId }: JoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [companyName, setcompanyName] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success(" updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  // Keep original markdown format from AI
  const [originalMarkdown, setOriginalMarkdown] = useState("");
  // Cleaned version for display in editor
  const [cleanedValue, setCleanedValue] = useState("");

  const handlePropmtGeneration = async () => {
    try {
      setIsPrompting(true);

      // Improved prompt to avoid unnecessary text
      const customPrompt = `Write a compelling and professional "Why Join Us" section for ${companyName}. 
      Highlight:
      
      1. The company’s mission, values, and culture
      2. Opportunities for career growth and learning
      3. Work-life balance or employee-centric policies
      4. Industry impact, innovation, or leadership
      5. Benefits or unique perks of working at the company
      
      Avoid using generic or vague phrases. Use a warm, engaging, and inspiring tone to attract top talent. , neither tell like , here is a "Why Join Us" section crafted for for this company, aiming for that compelling, professional, warm, engaging, and inspiring tone no , direct result okay:

--- `;

      const rawResponse = await getGenerativeAIResponse(customPrompt);

      // Store original markdown for copying
      setOriginalMarkdown(rawResponse);

      // Clean for display and form
      const cleaned = rawResponse.replace(/[\*\#]/g, "");
      setCleanedValue(cleaned);

      // Don't set the form value - leave the rich text editor empty
      // User will manually copy and paste if they want to use it
      form.trigger("whyJoinUs");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong generating the whyJoinUs");
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Why Join Us??
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
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.whyJoinUs && "text-neutral-500 italic"
          )}
        >
          {!initialData.whyJoinUs ? (
            "No Description"
          ) : (
            <Preview value={initialData.whyJoinUs} />
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="Reason To Join this company....."
              value={companyName}
              onChange={(e) => setcompanyName(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            <Button
              className="bg-black text-white"
              onClick={handlePropmtGeneration}
              disabled={isPrompting}
            >
              {isPrompting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Note*: Describe your company culture, growth opportunities, and
            employee perks clearly and concisely.
          </p>

          {originalMarkdown && (
            <div className="p-4 bg-white border rounded-md mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">AI Suggested Description</span>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(originalMarkdown);
                    toast.success("Copied markdown to clipboard");
                  }}
                  variant="ghost"
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </Button>
              </div>

              {/* Display clean version in preview */}
              <div className="text-sm text-neutral-700 whitespace-pre-wrap">
                {cleanedValue}
              </div>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="whyJoinUs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
        </>
      )}
    </div>
  );
};

export default JoinUsForm;
