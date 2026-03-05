/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback } from "react";
import { HardDrive } from "lucide-react";

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface GoogleDrivePickerProps {
  onFilesSelected: (
    files: { id: string; name: string; accessToken: string }[],
  ) => void;
  disabled?: boolean;
}

export default function GoogleDrivePicker({
  onFilesSelected,
  disabled,
}: GoogleDrivePickerProps) {
  const openPicker = useCallback(async () => {
    // Load the Google Identity Services library
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });

    await loadScript("https://accounts.google.com/gsi/client");
    await loadScript("https://apis.google.com/js/api.js");

    // Initialise gapi picker
    window.gapi.load("picker", () => {
      // Request an OAuth token for Drive scope
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        callback: (tokenResponse: any) => {
          const accessToken: string = tokenResponse.access_token;

          const picker = new window.google.picker.PickerBuilder()
            .addView(window.google.picker.ViewId.DOCS_IMAGES)
            .setOAuthToken(accessToken)
            .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY!)
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .setCallback((data: any) => {
              if (data.action === window.google.picker.Action.PICKED) {
                const selected = data.docs.map((doc: any) => ({
                  id: doc.id,
                  name: doc.name,
                  accessToken,
                }));
                onFilesSelected(selected);
              }
            })
            .build();

          picker.setVisible(true);
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    });
  }, [onFilesSelected]);

  return (
    <button
      type="button"
      onClick={openPicker}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      <HardDrive size={16} />
      Import from Google Drive
    </button>
  );
}
