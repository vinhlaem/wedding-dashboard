"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Upload, Trash2, HardDrive, RefreshCw } from "lucide-react";

import { mediaApi } from "@/services/mediaService";
import { Media, MediaComponent } from "@/types/media";
import GoogleDrivePicker from "./GoogleDrivePicker";

interface RoleImageSlotProps {
  component: MediaComponent;
  role: string;
  label: string;
  /** Show a video file input instead of image */
  isVideo?: boolean;
}

export default function RoleImageSlot({
  component,
  role,
  label,
  isVideo = false,
}: RoleImageSlotProps) {
  const queryClient = useQueryClient();
  const queryKey = ["media", component, role];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: items = [], isLoading } = useQuery<Media[]>({
    queryKey,
    queryFn: () => mediaApi.getAll(component, role),
  });

  // Take the first item as the active media for this role
  const current = items[0] ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // If there's an existing record for this role, delete it first
      if (current) await mediaApi.delete(current._id);
      await mediaApi.upload(
        file,
        component,
        0,
        role,
        isVideo ? "video" : "image",
      );
      toast.success(`${label} updated`);
      invalidate();
    } catch {
      toast.error(`Failed to upload ${label}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // ── Drive import ──────────────────────────────────────────────────────────
  const handleDriveImport = async (
    files: { id: string; name: string; accessToken: string }[],
  ) => {
    const f = files[0];
    if (!f) return;
    setUploading(true);
    try {
      if (current) await mediaApi.delete(current._id);
      await mediaApi.importFromDrive(f.id, f.accessToken, component, 0, role);
      toast.success(`${label} imported from Drive`);
      invalidate();
    } catch {
      toast.error(`Failed to import ${label}`);
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => {
      toast.success(`${label} removed`);
      invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Label header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {current && (
          <span className="text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">
            Active
          </span>
        )}
      </div>

      {/* Preview */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
        {isLoading ? (
          <RefreshCw className="animate-spin text-gray-300" size={28} />
        ) : current ? (
          isVideo ? (
            <video
              src={current.imageUrl}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={current.imageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <Upload size={32} />
            <p className="text-xs">No {label.toLowerCase()} yet</p>
          </div>
        )}

        {/* Delete overlay */}
        {current && (
          <button
            onClick={() => deleteMutation.mutate(current._id)}
            disabled={deleteMutation.isPending}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow disabled:opacity-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? "Uploading…" : `Upload ${label}`}
        </button>

        {!isVideo && (
          <GoogleDrivePicker
            onFilesSelected={handleDriveImport}
            disabled={uploading}
          />
        )}
      </div>
    </div>
  );
}
