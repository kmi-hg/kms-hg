import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Define Role enum
export const roleEnum = pgEnum("role_enum", [
  "KMI",
  "Karyawan"
]);

export const smeTable = pgTable("sme_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nrp: text("nrp").notNull(),
  password: text("pasword").notNull(),
  role: roleEnum("role").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
