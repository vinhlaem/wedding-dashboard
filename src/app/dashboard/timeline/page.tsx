import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Timeline | Wedding Dashboard" };

export default function TimelinePage() {
  return (
    <MediaManager component="timeline" title="Timeline Images" allowMultiple />
  );
}
