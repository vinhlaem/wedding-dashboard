import MediaManager from "@/components/MediaManager";

export const metadata = { title: "Footer | Wedding Dashboard" };

export default function FooterPage() {
  return (
    <MediaManager
      component="footer"
      title="Footer Background"
      allowMultiple={false}
    />
  );
}
