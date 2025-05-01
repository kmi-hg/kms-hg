import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

// Define SBU enum
export const sbuEnum = pgEnum("sbu_enum", [
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
  email: text("email").notNull(),
  bio: text("bio").notNull(),
  sbu: sbuEnum("sbu").notNull(),
  area_of_expertise: text("area_of_expertise").notNull(),
  profile_url: text("profile_url"),
});
