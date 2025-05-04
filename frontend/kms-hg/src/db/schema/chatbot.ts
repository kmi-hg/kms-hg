import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./user";

// New chat_rooms table
export const chatRooms = pgTable("chat_rooms", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => userTable.id),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // New messages table
  export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    chatRoomId: uuid("chat_room_id").references(() => chatRooms.id),
    sender: text("sender"), // values: 'user' or 'ai'
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    source: text("source"), // optional: Bedrock doc info
  });