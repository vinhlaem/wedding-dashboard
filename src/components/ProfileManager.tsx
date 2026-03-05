"use client";

import RoleImageSlot from "./RoleImageSlot";

export default function ProfileManager() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Profile Images</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload the bride and groom photos shown in the couple section.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <RoleImageSlot component="profile" role="wife" label="Bride (Wife)" />
        <RoleImageSlot
          component="profile"
          role="husband"
          label="Groom (Husband)"
        />
      </div>
    </div>
  );
}
