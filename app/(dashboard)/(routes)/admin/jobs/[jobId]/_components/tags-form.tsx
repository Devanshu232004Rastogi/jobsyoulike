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
import { Divide, Lightbulb, Loader2, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { Job } from "@/lib/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string().min(1)),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const handleTagRemove = (index: number) => {
    setJobTags((prevTags) => {
      const updatedTags = [...prevTags];
      updatedTags.splice(index, 1);

      // Update form value to reflect the change
      form.setValue("tags", updatedTags);
      // Trigger validation
      form.trigger("tags");

      return updatedTags;
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update values.tags with our current jobTags state
      values.tags = jobTags;

      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePropmtGeneration = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a job position");
      return;
    }

    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to
      the job profession "${prompt}". These keywords should encompass
      various aspects of the profession, including skills, responsibilities,
      tools, and technologies commonly associated with it. Aim for a diverse
      set of keywords that accurately represent the breadth of the
      profession. 
      
      VERY IMPORTANT: Format your response as a valid JSON array of strings only.
      For example: ["JavaScript", "React", "Web Development", "UI/UX", "API Integration"]
      
      Return ONLY the JSON array and nothing else. No explanation, no code blocks, just the array.`;
      await getGenerativeAIResponse(customPrompt).then((rawData) => {
        try {
          // Clean up the data - remove any JSON-like formatting but keep the array
          const cleanData = rawData
            .trim()
            .replace(/^json\s*|^```json\s*|^```\s*|```$/g, "") // Remove json markers and code blocks
            .replace(/^[\s\n]*\[[\s\n]*|[\s\n]*\][\s\n]*$/g, (match) =>
              match.includes("[") ? "[" : "]"
            ) // Clean up array brackets but keep them
            .trim();

          const parsedData = JSON.parse(cleanData);

          if (Array.isArray(parsedData)) {
            const newTags = [...jobTags, ...parsedData];
            setJobTags(newTags);
            // Update form value
            form.setValue("tags", newTags);
            // Trigger validation after setting value
            form.trigger("tags");
          } else {
            throw new Error("Response is not an array");
          }
        } catch (parseError) {
          console.error(
            "JSON parsing error:",
            parseError,
            "Raw data:",
            rawData
          );
          toast.error("Failed to parse AI response. Please try again.");
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong generating the description");
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Tags for this job
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
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {jobTags?.length > 0 ? (
            jobTags.map((tag, index) => (
              <div
                key={index}
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
              >
                {tag}
              </div>
            ))
          ) : (
            <p className="text-neutral-500">No tags added yet</p>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="flex items-center gap-2 my-2">
              <input
                type="text"
                placeholder="e.g 'Full Stack Developer'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 rounded-md"
              />

              <Button
                type="button"
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
            <p className="text-sm text-muted-foreground text-left">
              Note: Profession name is just enough to generate the tags
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {jobTags?.length > 0 ? (
                jobTags.map((tag, index) => (
                  <div
                    key={index}
                    className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p>No Tags</p>
              )}
            </div>

            <div className="flex items-center gap-x-2">
              <Button
                disabled={isSubmitting || jobTags.length === 0}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TagsForm;
