"use client";

import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  uploading?: boolean;
}

export default function UploadDropzone({
  onFilesSelected,
  multiple = true,
  uploading = false,
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!valid.length) return;
      setPreview(valid.map((f) => URL.createObjectURL(f)));
      onFilesSelected(valid);
    },
    [onFilesSelected],
  );

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
          dragging
            ? "border-rose-400 bg-rose-50"
            : "border-gray-200 hover:border-rose-300"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Upload className="text-gray-400" size={32} />
        <p className="text-sm text-gray-600 font-medium">
          Drag & drop {multiple ? "images" : "an image"} here
        </p>
        <p className="text-xs text-gray-400">
          or click to browse (JPG, PNG, WebP)
        </p>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {preview.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {preview.map((src, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white"
                onClick={() => setPreview((p) => p.filter((_, j) => j !== i))}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
