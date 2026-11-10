"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Link as LinkIcon, X } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  aspectRatio?: "poster" | "backdrop" | "square";
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "https://...",
  aspectRatio = "poster",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || "کێشەیەک لە کاتی ئەپلۆد ڕوویدا");
      }
    } catch {
      setError("هەڵە لە پەیوەندی بە سێرڤەر");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const aspectClass =
    aspectRatio === "poster"
      ? "w-24 aspect-[2/3]"
      : aspectRatio === "backdrop"
      ? "w-40 aspect-video"
      : "w-20 aspect-square";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-muted">
          {label}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-[11px] font-bold text-accent hover:text-white px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-light border border-border transition-all disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-accent" />
          )}
          <span>{uploading ? "ئەپلۆد دەکرێت..." : "ئەپلۆد لە ئامێرەکەت"}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* URL Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-text-dim">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-8 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-y-0 end-0 pe-2.5 flex items-center text-text-dim hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Thumbnail Preview */}
        {value && (
          <div
            className={`relative ${aspectClass} rounded-lg overflow-hidden border border-border bg-surface shrink-0`}
          >
            <Image
              src={value}
              alt="پێشبینین"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
