// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { UserProfile, Resume } from "@/lib/generated/prisma";
// import axios from "axios";
// import { File, Loader2, Pencil, Upload, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useRef } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import * as z from "zod";

// interface UserResumeFormProps {
//   initialData: (UserProfile & { resumes: Resume[] }) | null;
//   userId: string;
// }

// const formSchema = z.object({
//   resumes: z.array(z.object({ url: z.string(), name: z.string() })),
// });

// export const UserResumeForm = ({
//   initialData,
//   userId,
// }: UserResumeFormProps) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadingProgress, setUploadingProgress] = useState<{
//     [key: string]: number;
//   }>({});
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     defaultValues: {
//       resumes: initialData?.resumes || [],
//     },
//   });

//   const { isSubmitting } = form.formState;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       // The files are already uploaded at this point, we just need to save the references
//       await axios.post(`/api/user/${userId}/resumes`, values);
//       toast.success("Resume saved successfully");
//       toggleEditing();
//       router.refresh();
//     } catch (error) {
//       console.log((error as Error)?.message);
//       toast.error("Something went wrong");
//     }
//   };

//   const toggleEditing = () => setIsEditing((current) => !current);

//   const onDelete = async (resume: Resume) => {
//     try {
//       setDeletingId(resume.id);
//       await axios.delete(`/api/user/${userId}/resumes/${resume.id}`);
//       toast.success("Resume removed");
//       router.refresh();
//     } catch (error) {
//       console.log((error as Error)?.message);
//       toast.error("Something went wrong");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     setIsUploading(true);
//     const currentResumes = [...form.getValues().resumes];

//     try {
//       // Upload each file directly to the resume API
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const fileName = file.name;

//         // Setup tracking for this file
//         setUploadingProgress((prev) => ({ ...prev, [fileName]: 0 }));

//         const formData = new FormData();
//         formData.append("file", file);

//         // Upload directly to resumes endpoint
//         const response = await axios.post(
//           `/api/user/${userId}/resumes/upload`,
//           formData,
//           {
//             onUploadProgress: (progressEvent) => {
//               if (progressEvent.total) {
//                 const percentCompleted = Math.round(
//                   (progressEvent.loaded * 100) / progressEvent.total
//                 );
//                 setUploadingProgress((prev) => ({
//                   ...prev,
//                   [fileName]: percentCompleted,
//                 }));
//               }
//             },
//           }
//         );

//         // Add the uploaded file to our form state
//         currentResumes.push({
//           url: response.data.url,
//           name: fileName,
//         });

//         // Clear progress for this file
//         setUploadingProgress((prev) => {
//           const newProgress = { ...prev };
//           delete newProgress[fileName];
//           return newProgress;
//         });
//       }

//       // Update form value with all resumes
//       form.setValue("resumes", currentResumes);
//       setIsUploading(false);
//       toast.success(`${files.length} file(s) uploaded`);
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       toast.error("Failed to upload files");
//       setIsUploading(false);
//     }
//   };

//   const handleAddFileClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="mt-6 border flex-1 w-full rounded-md p-4">
//       <div className="font-medium flex items-center justify-between">
//         Your Resume
//         {!isEditing ? (
//           <Button onClick={toggleEditing} variant="ghost">
//             <Pencil className="w-4 h-4 mr-2" />
//             Edit
//           </Button>
//         ) : (
//           <Button onClick={toggleEditing} variant="ghost">
//             Cancel
//           </Button>
//         )}
//       </div>

//       {/* Display the resumes if not editing */}
//       {!isEditing && (
//         <div className="space-y-2 mt-4">
//           {initialData?.resumes && initialData.resumes.length > 0 ? (
//             initialData.resumes.map((item) => (
//               <div
//                 key={item.id}
//                 className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center"
//               >
//                 <File className="w-4 h-4 mr-2" />
//                 <p className="text-xs w-full truncate">{item.name}</p>
//                 <a
//                   href={item.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="ml-auto mr-2 text-purple-700 hover:text-purple-900"
//                 >

//                 </a>
//                 {deletingId === item.id ? (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="p-1"
//                     type="button"
//                   >
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="p-1"
//                     onClick={() => onDelete(item)}
//                     type="button"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="flex items-center justify-center py-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-2"
//                 onClick={toggleEditing}
//               >
//                 <Upload className="w-4 h-4" />
//                 Add files
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* On editing mode display the input */}
//       {isEditing && (
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <div className="mt-4">
//               <div
//                 className="border-2 border-dashed rounded-md p-8 bg-purple-50 cursor-pointer flex flex-col items-center justify-center"
//                 onClick={handleAddFileClick}
//               >
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileUpload}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx"
//                   multiple
//                 />
//                 <Upload className="h-6 w-6 text-gray-500 mb-2" />
//                 <p className="text-sm text-gray-500 text-center">
//                   {isUploading ? (
//                     <span className="flex items-center">
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Uploading...
//                     </span>
//                   ) : (
//                     <span>Click to add files</span>
//                   )}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   You can select multiple files
//                 </p>
//               </div>

//               {/* Display files being added */}
//               <div className="space-y-2 mt-4">
//                 {form.getValues().resumes.map((item, index) => (
//                   <div
//                     key={index}
//                     className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center"
//                   >
//                     <File className="w-4 h-4 mr-2" />
//                     <p className="text-xs w-full truncate">{item.name}</p>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="p-1"
//                       type="button"
//                       onClick={() => {
//                         const currentResumes = [...form.getValues().resumes];
//                         currentResumes.splice(index, 1);
//                         form.setValue("resumes", currentResumes);
//                       }}
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4 flex justify-start">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting || isUploading}
//                   variant="outline"
//                   className="border-2 border-purple-500"
//                 >
//                   {isSubmitting && (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   )}
//                   Save
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       )}
//     </div>
//   );
// };

"use client";

// import { AttachmentsUploads } from "@/";
// import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
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
import { Job, Attachment, UserProfile, Resume } from "@/lib/generated/prisma";
import axios from "axios";
import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { AttachmentsUploads } from "../../admin/jobs/[jobId]/_components/attachments-upload";

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resume[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.object({ url: z.string(), name: z.string() }).array(),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  // Assuming initialData is available and has type of any
  const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData.resumes.map((resume: any) => {
        if (
          typeof resume === "object" &&
          resume !== null &&
          "url" in resume &&
          "name" in resume
        ) {
          return { url: resume.url, name: resume.name };
        }
        return { url: "", name: "" }; // Provide default values if the shape is incorrect
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values, userId);
    try {
      const response = await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  // const onDelete = async (resume: Resume) => {
  //   try {
  //     setDeletingId(resume.id);
  //     if (initialData?.activeResumeId === resume.id) {
  //       toast.error("Can't Delete the active resume");
  //       return;
  //     }
  //     await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
  //     toast.success("Resume Removed");
  //     router.refresh();
  //   } catch (error) {
  //     console.log((error as Error)?.message);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setDeletingId(null);
  //   }
  // };
  const onDelete = async (resume: Resume) => {
    try {
      console.log(resume.id)
      setDeletingId(resume.id);
      
      // Check if this is the active resume
      if (initialData?.activeResumeId === resume.id) {
        toast.error("Can't delete the active resume");
        return;
      }
      
      console.log("Deleting resume with id:", resume.id);
      console.log("User ID:", userId);
      console.log("API endpoint:", `/api/users/${userId}/resumes/${resume.id}`);
      
      // Make the DELETE request
      const response = await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      
      console.log("Delete response:", response.data);
      toast.success("Resume removed");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      console.error("Error message:", (error as Error)?.message);
      console.error("Response data:", (error as any)?.response?.data);
      console.error("Response status:", (error as any)?.response?.status);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };
  const setActiveResumeId = async (resumeId: string) => {
    setIsActiveResumeId(resumeId);
    const response = await axios.patch(`/api/users/${userId}`, {
      activeResumeId: resumeId,
    });
    toast.success("Resume Activated");
    router.refresh();
    try {
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border flex-1 w-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resume
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {/* display the attachments if not editing */}
      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2">
              <div
                key={item.url}
                className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center col-span-10"
              >
                <File className="w-4 h-4 mr-2 " />
                <p className="text-xs w-full truncate">{item.name}</p>
                {deletingId === item.id && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="p-1"
                    type="button"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                )}
                {deletingId !== item.id && (
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="p-1"
                    onClick={() => {
                      onDelete(item);
                    }}
                    type="button"
                  >
                    <X className="w-4 h4" />
                  </Button>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-start gap-2">
                {isActiveResumeId === item.id ? (
                  <>
                    <div className="flex items-center justify-center w-full">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "flex items-center justify-center",
                        initialData.activeResumeId === item.id
                          ? "text-emerald-500"
                          : "text-red-500"
                      )}
                      onClick={() => setActiveResumeId(item.id)}
                    >
                      <p>
                        {initialData.activeResumeId === item.id
                          ? "Live"
                          : "Activate"}
                      </p>

                      {initialData.activeResumeId === item.id ? (
                        <ShieldCheck className="w-4 h-4 ml-2" />
                      ) : (
                        <ShieldX className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* on editing mode display the input */}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => {
                        if (resumes) {
                          onSubmit({ resumes });
                        }
                      }}
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
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
