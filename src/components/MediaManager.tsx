"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RefreshCw, Upload as UploadIcon } from "lucide-react";

import { mediaApi } from "@/services/mediaService";
import { Media, MediaComponent } from "@/types/media";
import UploadDropzone from "./UploadDropzone";
import GoogleDrivePicker from "./GoogleDrivePicker";
import ImageGrid from "./ImageGrid";

interface MediaManagerProps {
  component: MediaComponent;
  title: string;
  allowMultiple?: boolean;
}

export default function MediaManager({
  component,
  title,
  allowMultiple = true,
}: MediaManagerProps) {
  const queryClient = useQueryClient();
  const queryKey = ["media", component];
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: images = [],
    isLoading,
    refetch,
  } = useQuery<Media[]>({
    queryKey,
    queryFn: () => mediaApi.getAll(component),
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success("Image deleted");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to delete image"),
    onSettled: () => setDeletingId(null),
  });

  // ── Reorder ───────────────────────────────────────────────────────────────
  const reorderMutation = useMutation({
    mutationFn: (items: Media[]) =>
      mediaApi.reorder(items.map((m, i) => ({ id: m._id, order: i }))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => toast.error("Failed to save order"),
  });

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async (files: File[]) => {
    setUploading(true);
    const nextOrder = images.length;
    try {
      await Promise.all(
        files.map((file, i) => mediaApi.upload(file, component, nextOrder + i)),
      );
      toast.success(`${files.length} image(s) uploaded`);
      queryClient.invalidateQueries({ queryKey });
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ── Google Drive import ───────────────────────────────────────────────────
  const handleDriveImport = async (
    files: { id: string; name: string; accessToken: string }[],
  ) => {
    setUploading(true);
    const nextOrder = images.length;
    try {
      await Promise.all(
        files.map((f, i) =>
          mediaApi.importFromDrive(
            f.id,
            f.accessToken,
            component,
            nextOrder + i,
          ),
        ),
      );
      toast.success(`${files.length} image(s) imported from Drive`);
      queryClient.invalidateQueries({ queryKey });
    } catch {
      toast.error("Google Drive import failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {images.length} image{images.length !== 1 ? "s" : ""} · Drag to
            reorder
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <UploadIcon size={15} />
          Add Images
        </h3>

        <UploadDropzone
          onFilesSelected={handleUpload}
          multiple={allowMultiple}
          uploading={uploading}
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <GoogleDrivePicker
          onFilesSelected={handleDriveImport}
          disabled={uploading}
        />

        {uploading && (
          <p className="text-xs text-gray-500 animate-pulse">
            Uploading, please wait…
          </p>
        )}
      </div>

      {/* Image grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Current Images
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <ImageGrid
            images={images}
            onDelete={(id) => deleteMutation.mutate(id)}
            onReorder={(reordered) => reorderMutation.mutate(reordered)}
            deleting={deletingId}
          />
        )}
      </div>
    </div>
  );
}
