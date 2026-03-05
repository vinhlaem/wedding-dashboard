import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Wedding Program | Wedding Dashboard" };

export default function ProgramPage() {
  return (
    <MediaManager
      component="program"
      title="Wedding Program Images"
      allowMultiple
    />
  );
}
