import "dotenv/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/knowledge";

const connectionString = process.env.DATABASE_URL;

const drizzleClient = drizzle(
  postgres(connectionString!, {
    prepare: false,
  }),
  { schema },
);

declare global {
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

const globalForDB = globalThis as typeof globalThis & {
  database?: PostgresJsDatabase<typeof schema>;
};

export const db = globalForDB.database ?? drizzleClient;

if (process.env.NODE_ENV !== "production") {
  globalForDB.database = db;
}
