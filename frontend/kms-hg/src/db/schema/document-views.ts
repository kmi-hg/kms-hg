import { integer, serial, uuid, timestamp, pgTable } from "drizzle-orm/pg-core";

export const document_views = pgTable("document_views", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  document_id: integer("document_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
