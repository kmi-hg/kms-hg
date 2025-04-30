import { pgTable, serial, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { userTable } from './user'; 
import { knowledgeTable } from './knowledge'; 

export const recentlyOpenedFiles = pgTable('recently_opened_files', {
  id: serial('id').primaryKey(),
  usersId: uuid('users_id').references(() => userTable.id), 
  fileId: integer('file_id').references(() => knowledgeTable.id),
  openedAt: timestamp('opened_at').defaultNow(),
});
