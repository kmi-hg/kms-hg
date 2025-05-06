// db/schema/expert.ts

import { pgTable, serial, varchar, text, pgEnum } from "drizzle-orm/pg-core";


export const DepartmentEnum = pgEnum("department_enum", [
  "Department Human Capital",
  "Committee Nomination & Human Capital",
  "Department Procurement (Holding)",
  "Division Corporate Secretary",
  "Department Risk Management",
  "Department HC Operations",
  "Department Accounting & Tax",
  "Department Finance",
  "Department Legal & Corcomm",
  "Department HCGS Development",
  "Department Infrastructure & Sys Adm",
  "Direktorat Finance & Administration",
  "Division Operations",
  "Operation Office Presdir",
  "Division Agribusiness",
  "Department Agronomy",
  "Section General Admin",
  "Section Operation",
  "Department Human Capital",
  "Department General Services",
  "SHE",
  "Department Technical Maintenance",
  "Department Business Solution",
  "Departement Planning & Permit", 
  "Department HRGS",
]);

export const EntitasEnum = pgEnum("entitas_enum", [
  "PT CDI",
  "PT HCT",
  "PT HGI",
  "PT HIS",
  "PT HIT",
  "PT SRP",
  "PT HCK",
  "PT BPP",
  "PT EBL",
]);

export const ExpertiseEnum = pgEnum("expertise_enum", [
  "Marketing & Sales",
  "HC",
  "Procurement",
  "Legal",
  "Risk Management",
  "Finance",
  "Corporate Communication",
  "IT",
  "Engineer",
  "Operation",
  "SHE",
]);

export const CoreCompetencyEnum = pgEnum("core_competency_enum", [
  "Integrity",
  "Stakeholders Orientation",
  "Organizational Commitment",
  "Teamwork",
  "Achievement Orientation",
  "Transformational Leadership",
  "Problem Solving & Decisive Judgement",
  "Planning & Organizing",
  "Developing Others",
  "Business Acumen",
  "Continuous Improvement",
  "Communication",
]);

export const expertTable = pgTable("expert_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  profile_url: varchar("profile_url", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  department: DepartmentEnum("department").notNull(),
  entitas: EntitasEnum("entitas").notNull(),
  expertise: ExpertiseEnum("expertise").notNull(),
  core_competency: CoreCompetencyEnum("core_competency").array().notNull(),
  bio: text("bio").notNull(),
});
