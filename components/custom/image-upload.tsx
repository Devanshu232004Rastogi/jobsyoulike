"use client";

import { useState, useEffect } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { Permission, Role, ID, Storage } from "appwrite";
import Image from "next/image";
import { client, appwriteConfig } from "@/config/appwrite-config"; // Adjust if needed

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string; fileId: string }) => void;
  onRemove?: (fileId: string) => void;
  value: { url: string; fileId: string } | null;
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const storage = new Storage(client);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setIsLoading(true);
    setProgress(0);

    try {
      const uploadTask = storage.createFile(
        appwriteConfig.storageBucketId,
        ID.unique(),
        file,
        [Permission.read(Role.any())] // Public access
      );

      const uploadWithProgress = new Promise<{ fileId: string }>(
        (resolve, reject) => {
          const interval = setInterval(() => {
            setProgress((prev) => (prev < 95 ? prev + 5 : prev));
          }, 100);

          uploadTask
            .then((res) => {
              clearInterval(interval);
              setProgress(100);
              resolve({ fileId: res.$id });
            })
            .catch((err) => {
              clearInterval(interval);
              reject(err);
            });
        }
      );

      const { fileId } = await uploadWithProgress;

      // ✅ No `.href` — directly get view URL
      const fileUrl = storage.getFileView(
        appwriteConfig.storageBucketId,
        fileId
      );

      onChange({ url: fileUrl.toString(), fileId });
      console.log("Uploaded:", fileUrl.toString());
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!value || !value.fileId) return;

    try {
      await storage.deleteFile(appwriteConfig.storageBucketId, value.fileId);
      onRemove?.(value.fileId);
      console.log("Deleted:", value.fileId);
    } catch (error) {
      console.error("Deletion error:", error);
    }
  };

  return (
    <div className="relative">
      {value ? (
        <div className="w-full h-60 aspect-video relative rounded-md overflow-hidden">
          <Image
            fill
            className="object-contain"
            alt="Uploaded image"
            src={value.url}
          />
          {onRemove && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700"
              onClick={handleDelete}
              disabled={disabled}
            >
              <Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full h-60 aspect-video rounded-md border border-dashed bg-neutral-50 flex items-center justify-center">
          {isLoading ? (
            <p>{`${progress.toFixed(2)}%`}</p>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-neutral-500">
              <ImagePlus className="w-10 h-10" />
              <p>Upload an image</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                disabled={disabled}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
