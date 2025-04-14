import { pgTable, pgEnum, serial, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const typeEnum = pgEnum('type', ['pdf', 'mp3']);

export const knowledgeTable = pgTable('knowledge_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: typeEnum(),
  path: text('path').notNull(),
  size: doublePrecision('size').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
