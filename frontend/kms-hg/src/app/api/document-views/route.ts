// src/app/api/document-views/route.ts

import { NextResponse } from "next/server";
import { db } from "../db"; // Import db instance
import { document_views } from "@/db/schema/document-views";
import { eq } from "drizzle-orm";

// POST method handler to log a document view
export async function POST(req: Request) {
  try {
    const { userId, documentId } = await req.json(); // Extract userId and documentId from the request body

    if (!userId || !documentId) {
      return NextResponse.json(
        { error: "userId and documentId are required" },
        { status: 400 }
      );
    }

    // Insert the document view into the database
    await db.insert(document_views).values({
      user_id: userId, // The user ID
      document_id: documentId, // The document ID
      created_at: new Date(), // Timestamp when the document is viewed
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

// GET method handler to fetch views for a specific document
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url); // Parse query parameters
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Missing documentId" },
        { status: 400 }
      );
    }

    // Fetch all views for the given documentId from the database
    const views = await db
      .select()
      .from(document_views)
      .where(eq(document_views.document_id, Number(documentId))); // Filter by userId

    return NextResponse.json(views || []); // Return views or an empty array if no views
  } catch (error) {
    console.error("Error fetching document views:", error);
    return NextResponse.json(
      { error: "Failed to fetch document views" },
      { status: 500 }
    );
  }
}
