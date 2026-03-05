"use client";

import { useState } from "react";
import { Trash2, GripVertical, Tag } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Media } from "@/types/media";

interface ImageGridProps {
  images: Media[];
  onDelete: (id: string) => void;
  onReorder: (items: Media[]) => void;
  deleting?: string | null;
}

export default function ImageGrid({
  images,
  onDelete,
  onReorder,
  deleting,
}: ImageGridProps) {
  const [items, setItems] = useState<Media[]>(images);

  // Sync when parent updates
  if (images !== items && images.length !== items.length) {
    setItems(images);
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    onReorder(reordered);
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Tag size={40} className="mb-3 opacity-40" />
        <p className="text-sm">No images yet. Upload or import some!</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="media-grid" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-wrap gap-4"
          >
            {items.map((media, index) => (
              <Draggable key={media._id} draggableId={media._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group relative w-44 h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm ${
                      snapshot.isDragging
                        ? "shadow-lg ring-2 ring-rose-400"
                        : ""
                    }`}
                  >
                    <img
                      src={media.imageUrl}
                      alt={`media-${index}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Source badge */}
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        media.source === "google-drive"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {media.source === "google-drive" ? "Drive" : "Upload"}
                    </span>

                    {/* Drag handle */}
                    <div
                      {...provided.dragHandleProps}
                      className="absolute top-2 right-2 bg-black/50 rounded p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical size={14} className="text-white" />
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onDelete(media._id)}
                      disabled={deleting === media._id}
                      className="absolute bottom-2 right-2 bg-red-500 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Order badge */}
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white rounded px-1.5 py-0.5">
                      #{index + 1}
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
