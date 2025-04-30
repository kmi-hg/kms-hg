import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Define Role enum
export const roleEnum = pgEnum("role_enum", ["KMI", "Karyawan"]);

export const userTable = pgTable("users_table", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  nrp: text("nrp").notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
