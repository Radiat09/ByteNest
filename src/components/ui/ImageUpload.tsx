"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X, Images } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "products",
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const singleRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLInputElement>(null);

  const uploadSingle = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/upload?folder=${folder}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.data.url;
  };

  const handleSingleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadSingle(file);
      if (url) {
        onChange([...value, url]);
        toast.success("Image uploaded");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (singleRef.current) singleRef.current.value = "";
    }
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length < files.length) {
      toast.warning(`Only ${remaining} slots remaining, ${files.length - toUpload.length} files skipped`);
    }

    setUploading(true);
    setUploadCount(0);
    const uploaded: string[] = [];

    try {
      for (const file of toUpload) {
        const url = await uploadSingle(file);
        if (url) {
          uploaded.push(url);
          setUploadCount(uploaded.length);
        }
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
      }
    } catch (err: any) {
      // Cleanup: remove already-uploaded images from state on failure
      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        toast.error(
          `Failed after ${uploaded.length}/${toUpload.length} files. ${uploaded.length} uploaded, then error: ${err.message}`
        );
      } else {
        toast.error(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      setUploadCount(0);
      if (multiRef.current) multiRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Image previews */}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-50 group">
            <img src={url} alt="" className="w-full h-full object-contain p-1" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Add buttons */}
        {value.length < maxImages && (
          <>
            {/* Single upload */}
            <button
              type="button"
              onClick={() => singleRef.current?.click()}
              disabled={uploading}
              className={cn(
                "w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[rgb(219,68,68)] hover:text-[rgb(219,68,68)] transition-colors",
                uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <span className="text-[10px]">
                {uploading ? `${uploadCount}/${value.length}` : "One"}
              </span>
            </button>

            {/* Multi upload */}
            <button
              type="button"
              onClick={() => multiRef.current?.click()}
              disabled={uploading}
              className={cn(
                "w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[rgb(219,68,68)] hover:text-[rgb(219,68,68)] transition-colors",
                uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Images className="h-5 w-5" />
              )}
              <span className="text-[10px]">
                {uploading ? `${uploadCount}/${value.length}` : "Multi"}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={singleRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleSingleUpload}
        className="hidden"
      />
      <input
        ref={multiRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleMultiUpload}
        className="hidden"
      />

      <p className="text-xs text-gray-400">
        {value.length}/{maxImages} images — JPEG, PNG, WebP, GIF (max 5MB each)
      </p>
    </div>
  );
}
