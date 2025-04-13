import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// import * as schema from './schema'; // <-- if you're using Drizzle's schema definitions

const queryClient = postgres(process.env.DATABASE_URL!); // make sure .env is loaded

// export const db = drizzle(queryClient, { schema });
