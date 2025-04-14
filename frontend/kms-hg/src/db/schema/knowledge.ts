import { pgTable, pgEnum, serial, text, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["pdf", "mp3"]);

export const knowledgeTable = pgTable("knowledge_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: typeEnum(),
  field: text("field").notNull(), 
  tags: text("tags"),                
  path: text("path").notNull(),
  thumbnail: text("thumbnail"),       
  size: doublePrecision("size").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});
