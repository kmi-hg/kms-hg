// db/schema/knowledge.ts
import {
  pgTable,
  serial,
  text,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const fieldEnum = pgEnum("field", [
  "Corsec/Corplan",
  "Operation",
  "HCGS",
  "Procurement",
  "Others",
  "Fleet Mgt",
  "FAT",
  "GRCD",
  "Legal & permit",
  "Marketing & Sales",
]);

export const typeEnum = pgEnum("type", ["pdf", "mp3"]);

export const knowledgeTable = pgTable("knowledge_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  field: fieldEnum().notNull(),
  tags: text("tags"),
  type: typeEnum().notNull(),
  path: text("path").notNull(),
  size: doublePrecision("size").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});
