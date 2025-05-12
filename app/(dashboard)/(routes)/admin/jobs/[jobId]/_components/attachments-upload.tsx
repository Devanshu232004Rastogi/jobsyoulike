"use client";

import { useState, useEffect } from "react";
import { File, FilePlus, X } from "lucide-react";
import { Permission, Role, ID, Storage } from "appwrite";
import { client, appwriteConfig } from "@/config/appwrite-config";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";



interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const storage = new Storage(client);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    
    if (!files.length) return;
    
    setIsLoading(true);
    setProgress(0);
    
    // array to store newly uploaded urls
    const newUrls: { url: string; name: string }[] = [];
    
    // counter to keep track of the uploaded files
    let completedFiles = 0;
    
    for (const file of files) {
      try {
        const fileId = ID.unique();
        `${Date.now()}-${file.name}`;
        
        const uploadTask = storage.createFile(
          appwriteConfig.storageBucketId,
          fileId,
          file,
          [Permission.read(Role.any())] // Public access
        );
        
        const uploadWithProgress = new Promise<string>((resolve, reject) => {
          const interval = setInterval(() => {
            setProgress((prev) => (prev < 95 ? prev + 5 : prev));
          }, 100);
          
          uploadTask
            .then(() => {
              clearInterval(interval);
              setProgress(100);
              resolve(fileId);
            })
            .catch((err) => {
              clearInterval(interval);
              reject(err);
            });
        });
        
        const uploadedFileId = await uploadWithProgress;
        
        // Get file URL
        const fileUrl = storage.getFileView(
          appwriteConfig.storageBucketId, 
          uploadedFileId
        ).toString();
        
        // Add to new URLs array
        newUrls.push({ url: fileUrl, name: file.name });
        
        // Increase counter
        completedFiles++;
        
        // Check if all files are uploaded
        if (completedFiles === files.length) {
          setIsLoading(false);
          onChange([...value, ...newUrls]);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload file");
        setIsLoading(false);
      }
    }
  };
  
  const onDelete = ({ url, name }: { url: string; name: string }) => {
    try {
      // Extract file ID from URL
      // This assumes the URL format from Appwrite includes the file ID
      const fileIdMatch = url.match(/\/files\/([^/]+)\/view/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;
      
      if (fileId) {
        storage.deleteFile(appwriteConfig.storageBucketId, fileId).then(() => {
          toast.success("Attachment Removed");
        });
      }
      
      // Update state by removing the file
      const newValue = value.filter(data => data.name !== name);
      onChange(newValue);
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div>
      <div className="w-full p-2 flex items-center justify-end">
        {isLoading ? (
          <>
            <p>{`${progress.toFixed(2)}%`}</p>
          </>
        ) : (
          <>
            <label>
              <div className="flex gap-2 items-center justify-center cursor-pointer">
                <FilePlus className="w-3 h-3 mr-2" />
                <p>Add a file</p>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
                multiple
                className="w-0 h-0"
                onChange={onUpload}
                disabled={disabled}
              />
            </label>
          </>
        )}
      </div>
      
      <div className="flex-col">
        {value && value.length > 0 ? (
          <div className="space-y-2">
            {value.map((item) => (
              <div
                key={item.url}
                className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center"
              >
                <File className="w-4 h-4 mr-2" />
                <p className="text-xs w-full truncate">{item.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  onClick={() => onDelete(item)}
                  type="button"
                >
                  <X className="w-4 h4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p>No attachments</p>
        )}
      </div>
    </div>
  );
};