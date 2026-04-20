export type SlideType = "banner" | "two" | "three" | "four";

export interface Slide {
  _id: string;
  type: SlideType;
  images: string[];
  caption?: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
