CREATE TABLE "knowledge_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"path" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
