// db/schema/expert.ts
import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const sbuEnum = pgEnum("field", [
  "Logistic",
  "Argo Forestry",
  "Energy",
  "Technology & Services",
  "Education",
  "Consumer",
  "Investment",
]);

export const smeTable = pgTable("sme_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  area_of_expertise: text("area_of_expertise").notNull(),
  sbu: sbuEnum().notNull(),
  email: text("email").notNull(),
  bio: text("bio").notNull(),
  profile_url: text("profile_url").notNull(),
});
