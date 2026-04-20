import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Slide | Wedding Dashboard" };

export default function SlidePage() {
  return <MediaManager component="slide" title="Slide Images" allowMultiple />;
}
