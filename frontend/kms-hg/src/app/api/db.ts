// lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db';

const queryClient = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(queryClient, { schema });
