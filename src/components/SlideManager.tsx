/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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

  const { data: media = [] } = useQuery({
    queryKey: ["media", "slide"],
    queryFn: () => mediaApi.getAll("slide"),
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

  const toggleSelect = (url: string) => {
    setSelected((s) =>
      s.includes(url) ? s.filter((x) => x !== url) : [...s, url],
    );
  };

  const handleCreate = async () => {
    if (selected.length === 0) return toast.error("Select at least one image");
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

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4">Create Slide</h3>
        <div className="flex gap-4 flex-wrap items-center mb-4">
          <label className="text-sm">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SlideType)}
            className="border rounded px-2 py-1"
          >
            <option value="banner">Banner</option>
            <option value="two">Two</option>
            <option value="three">Three</option>
            <option value="four">Four</option>
          </select>
          <label className="text-sm">Caption</label>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Optional caption"
          />
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Pick uploaded images for this slide (click thumbnails to select)
        </p>
        <div className="mb-4">
          <div className="grid grid-cols-6 gap-3">
            {media.map((m: any) => (
              <button
                key={m._id}
                onClick={() => toggleSelect(m.imageUrl)}
                className={`relative rounded overflow-hidden border ${selected.includes(m.imageUrl) ? "ring-2 ring-fuchsia-400" : "border-transparent"}`}
                style={{ height: 72 }}
                type="button"
              >
                <img
                  src={m.imageUrl}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-fuchsia-500 text-white rounded"
          >
            Create Slide
          </button>
          <button
            onClick={() => {
              setSelected([]);
              setCaption("");
            }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4">Existing Slides</h3>
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
                <div className="text-sm font-medium">{s.type}</div>
                {s.caption && (
                  <div className="text-xs text-gray-500">{s.caption}</div>
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
