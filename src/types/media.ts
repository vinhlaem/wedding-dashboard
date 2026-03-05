export type MediaComponent =
  | "banner"
  | "gallery"
  | "program"
  | "video"
  | "timeline"
  | "profile"
  | "quote";

export type MediaSource = "upload" | "google-drive";
export type MediaType = "image" | "video";

export interface Media {
  _id: string;
  component: MediaComponent;
  imageUrl: string;
  cloudinaryPublicId: string;
  order: number;
  source: MediaSource;
  role: string | null;
  mediaType: MediaType;
  createdAt: string;
  updatedAt: string;
}
