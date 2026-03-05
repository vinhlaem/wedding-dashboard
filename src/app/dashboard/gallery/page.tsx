import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Gallery | Wedding Dashboard" };

export default function GalleryPage() {
  return (
    <MediaManager component="gallery" title="Gallery Images" allowMultiple />
  );
}
