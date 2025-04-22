// app/api/expert/route.ts
import { NextResponse } from "next/server";
import { db } from "../db";
import { smeTable } from "@/db/schema/expert";

export async function GET() {
  try {
    const smeData = await db.select().from(smeTable);
    return NextResponse.json(smeData);
  } catch (error) {
    console.error("Error fetching SME data:", error);
    return NextResponse.json({ error: "Failed to fetch SME data." }, { status: 500 });
  }
}
