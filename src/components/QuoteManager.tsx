"use client";

import RoleImageSlot from "./RoleImageSlot";

export default function QuoteManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Quote Images</h2>
        <p className="text-sm text-gray-500 mt-1">
          Two decorative images embedded inline within the quote text.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <RoleImageSlot component="quote" role="image1" label="Quote Image 1" />
        <RoleImageSlot component="quote" role="image2" label="Quote Image 2" />
      </div>
    </div>
  );
}
