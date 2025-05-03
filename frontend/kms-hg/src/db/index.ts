import "dotenv/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { knowledgeTable } from "./schema/knowledge";
import { userTable } from "./schema/user";

const connectionString = process.env.DATABASE_URL;

const combinedSchema = {
  knowledgeTable,
  userTable,
};

const drizzleClient = drizzle(
  postgres(connectionString!, {
    prepare: false,
  }),
  {
    schema: combinedSchema
  }
);

declare global {
  const database: PostgresJsDatabase<typeof combinedSchema>;
}

const globalForDB = globalThis as typeof globalThis & {
  database?: PostgresJsDatabase<typeof combinedSchema>;
};

export const db = globalForDB.database ?? drizzleClient;

if (process.env.NODE_ENV !== "production") {
  globalForDB.database = db;
}
