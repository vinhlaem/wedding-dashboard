import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Banner | Wedding Dashboard" };

export default function BannerPage() {
  return (
    <MediaManager
      component="banner"
      title="Banner Image"
      allowMultiple={false}
    />
  );
}
