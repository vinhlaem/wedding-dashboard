/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { slidesApi } from "@/services/slidesService";
import { mediaApi } from "@/services/mediaService";
import { SlideType } from "@/types/slide";
import ImageGrid from "./ImageGrid";

export default function SlideManager() {
  const qc = useQueryClient();

  const { data: slides = [], refetch: refetchSlides } = useQuery({
    queryKey: ["slides"],
    queryFn: () => slidesApi.getAll(),
  });

  // fetch all media so user can pick from gallery or slide uploads
  const { data: media = [] } = useQuery({
    queryKey: ["media", "all"],
    queryFn: () => mediaApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => slidesApi.create(payload),
    onSuccess: () => {
      toast.success("Slide created");
      qc.invalidateQueries({ queryKey: ["slides"] });
    },
    onError: () => toast.error("Failed to create slide"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => slidesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slides"] }),
  });

  // New slide form state
  const [type, setType] = useState<SlideType>("three");
  const [selected, setSelected] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const requiredCountMap: Record<SlideType, number> = {
    banner: 1,
    two: 2,
    three: 3,
    four: 4,
  };
  const requiredCount = requiredCountMap[type];

  const handleCreate = async () => {
    if (selected.length !== requiredCount)
      return toast.error(`Please select ${requiredCount} image(s)`);
    try {
      await createMutation.mutateAsync({
        type,
        images: selected,
        caption: caption || undefined,
      });
      setSelected([]);
      setCaption("");
    } catch {}
  };

  const toggleSelect = (url: string) => {
    setSelected((s) => {
      if (s.includes(url)) return s.filter((x) => x !== url);
      if (s.length >= requiredCount) return s; // don't allow more than required
      return [...s, url];
    });
  };

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = requiredCount - selected.length;
    const toUpload = Array.from(files).slice(0, remaining);
    try {
      const uploaded = await Promise.all(
        toUpload.map((f) => mediaApi.upload(f, "slide", 0)),
      );
      // add uploaded urls to selected (respect limit)
      setSelected((s) => {
        const urls = uploaded.map((u) => u.imageUrl);
        const merged = [...s, ...urls].slice(0, requiredCount);
        return merged;
      });
      // refresh media list
      qc.invalidateQueries({ queryKey: ["media", "all"] });
      toast.success(`${uploaded.length} uploaded`);
    } catch (e) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Create Slide
        </h3>
        <div className="flex gap-4 flex-wrap items-center mb-4">
          <label className="text-sm text-gray-800">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SlideType)}
            className="border rounded px-2 py-1 border-gray-700 text-gray-800"
          >
            <option value="banner">Banner</option>
            <option value="two">Two</option>
            <option value="three">Three</option>
            <option value="four">Four</option>
          </select>
          <label className="text-sm text-gray-800">Caption</label>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border rounded px-2 py-1 flex-1 border-gray-700 text-gray-800"
            placeholder="Optional caption"
          />
        </div>

        <div className="flex gap-3 items-center">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 border rounded text-sm text-gray-800 border-gray-700 transition-colors"
            type="button"
          >
            Upload & Select
          </button>

          <div className="text-sm text-gray-600">
            Required: {requiredCount} image(s)
          </div>

          <button
            onClick={handleCreate}
            disabled={selected.length !== requiredCount}
            className={`px-4 py-2 rounded text-white ${selected.length === requiredCount ? "bg-fuchsia-500" : "bg-gray-300 cursor-not-allowed"}`}
          >
            Create Slide
          </button>

          <button
            onClick={() => {
              setSelected([]);
              setCaption("");
            }}
            className="px-4 py-2 border rounded"
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Gallery picker: choose images from uploaded media */}
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Pick Images from Gallery
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Click thumbnails to select (you need {requiredCount} images for this
          type)
        </p>
        <div className="grid grid-cols-6 gap-3">
          {media.length === 0 && (
            <div className="text-sm text-gray-500 col-span-6">
              No uploaded images yet
            </div>
          )}
          {media.map((m: any) => (
            <button
              key={m._id}
              onClick={() => toggleSelect(m.imageUrl)}
              type="button"
              className={`relative rounded overflow-hidden border ${selected.includes(m.imageUrl) ? "ring-2 ring-fuchsia-400" : "border-transparent"}`}
              style={{ height: 72 }}
            >
              <img
                src={m.imageUrl}
                alt="thumb"
                className="w-full h-full object-cover"
              />
              {selected.includes(m.imageUrl) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-fuchsia-500/70 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Existing Slides
        </h3>
        <div className="space-y-4">
          {slides.length === 0 && (
            <p className="text-sm text-gray-500">No slides yet</p>
          )}
          {slides.map((s: any) => (
            <div key={s._id} className="flex items-center gap-4">
              <div className="w-40 h-24 rounded overflow-hidden border">
                <img src={s.images[0]} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {s.type}
                </div>
                {s.caption && (
                  <div className="text-xs text-gray-800">{s.caption}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteMutation.mutate(s._id)}
                  className="text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
