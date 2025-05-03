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

export type ExpertItem = {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  expertise: string;
  department: string;
  position: string;
  entitas: string;
  core_competency: string[];
  bio: string;
};
