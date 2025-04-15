// app/api/knowledge/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { knowledgeTable } from '../../../db/schema/knowledge';

export async function GET() {
  const knowledge = await db.select().from(knowledgeTable);
  return NextResponse.json(knowledge);
}
