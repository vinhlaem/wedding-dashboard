"use client";

import RoleImageSlot from "./RoleImageSlot";

export default function VideoManager() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Video Section</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the wedding video and its thumbnail/poster image.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {/* Video file upload → stored in Cloudinary as video resource */}
        <RoleImageSlot
          component="video"
          role="source"
          label="Video File"
          isVideo
        />

        {/* Poster is a normal image shown before the video plays */}
        <RoleImageSlot
          component="video"
          role="poster"
          label="Poster / Thumbnail"
        />
      </div>
    </div>
  );
}
