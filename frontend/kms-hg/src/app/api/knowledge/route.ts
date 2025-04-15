// app/api/knowledge/route.ts
import { NextResponse } from 'next/server';
import { knowledgeTable } from '../../../db/schema/knowledge';
import { db } from './db';

export async function GET() {
  const knowledge = await db.select().from(knowledgeTable);
  return NextResponse.json(knowledge);
}
