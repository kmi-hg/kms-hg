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
  };
  