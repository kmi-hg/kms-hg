// src/app/api/document-views/route.ts

import { NextResponse } from "next/server";
import { db } from "../db"; 
import { document_views } from "@/db/schema/document-views";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId, documentId } = await req.json(); 

    if (!userId || !documentId) {
      return NextResponse.json(
        { error: "userId and documentId are required" },
        { status: 400 }
      );
    }

    await db.insert(document_views).values({
      user_id: userId, 
      document_id: documentId, 
      created_at: new Date(), 
    });

    return NextResponse.json({ message: "Document view successfully logged" });
  } catch (error) {
    console.error("Error adding document view:", error);
    return NextResponse.json(
      { error: "Failed to log document view" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url); 
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Missing documentId" },
        { status: 400 }
      );
    }

    const views = await db
      .select()
      .from(document_views)
      .where(eq(document_views.document_id, Number(documentId))); 

    return NextResponse.json(views || []); 
  } catch (error) {
    console.error("Error fetching document views:", error);
    return NextResponse.json(
      { error: "Failed to fetch document views" },
      { status: 500 }
    );
  }
}
