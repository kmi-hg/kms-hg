import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const departmentEnum = pgEnum("department_enum", [
  "Committee Nomination & Human Capital",
  "Department Accounting & Tax",
  "Department Agronomy",
  "Department Business Solution",
  "Department Finance",
  "Department General Services",
  "Department HC Operations",
  "Department HCGS Development",
  "Department HRGS",
  "Department Human Capital",
  "Department Infrastructure & Sys Adm",
  "Department Legal & Corcomm",
  "Department Planning & Permit",
  "Department Procurement (Holding)",
  "Department Risk Management",
  "Department Technical Maintenance",
  "Directorate Finance & Administration",
  "Division Agribusiness",
  "Division Corporate Secretary",
  "Division Operations",
  "Operation Office Presdir",
  "Section General Admin",
  "Section Operation",
  "SHE",
]);

export const entitasEnum = pgEnum("entitas_enum", [
  "PT BPP",
  "PT BP",
  "PT CDI",
  "PT EBL",
  "PT HCK",
  "PT HCT",
  "PT HGI",
  "PT HIS",
  "PT HIT",
  "PT HJT",
  "PT PP",
  "PT SRP",
]);

export const expertiseEnum = pgEnum("expertise_enum", [
  "Corporate Communication",
  "Engineer",
  "Finance",
  "HC",
  "IT",
  "Legal",
  "Marketing & Sales",
  "Operation",
  "Procurement",
  "QC",
  "Risk Management",
  "SHE",
]);

export const coreCompetencyEnum = pgEnum("core_competency_enum", [
  "Integrity",
  "Stakeholders Orientation",
  "Organizational Commitment",
  "Teamwork",
  "Achievement Orientation",
  "Transformational Leadership",
  "Problem Solving & Decisive Judgement",
  "Planning & Organizing",
  "Developing Other",
  "Business Acumen",
  "Continuous Improvement",
  "Communication",
]);

// SME Table
export const smeTable = pgTable("sme_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  department: departmentEnum("department").notNull(),
  entitas: entitasEnum("entitas").notNull(),
  area_of_expertise: expertiseEnum("area_of_expertise").notNull(),
  core_competency: coreCompetencyEnum("core_competency").array().notNull(),
  bio: text("bio").notNull(),
  profile_url: text("profile_url"),
});
