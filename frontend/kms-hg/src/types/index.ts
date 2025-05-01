// types/index.ts

export type KnowledgeItem = {
  id: number;
  name: string;
  type: "pdf" | "mp3";
  path: string;
  size: number;
  uploadedAt: string;
  field: string;
  tags?: string;
  thumbnailPath?: string;
  clickRate?: number; // Added clickRate property
};

export type SMEItem = {
  id: number;
  name: string;
  email: string;
  profile_url: string; // URL to profile image
  area_of_expertise: string;
  sbu: string;
  bio: string;
  createdAt?: string; // Optional, for upload timestamp
};
