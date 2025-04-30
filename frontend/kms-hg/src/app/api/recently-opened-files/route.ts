import { db } from "../db";
import { recentlyOpenedFiles } from "@/db/schema/recently-opened-files";
import { knowledgeTable } from "@/db/schema/knowledge";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // Extract the userId from the query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the recently opened files data for the specified user
    const recentlyOpenedFilesData = await db
      .select()
      .from(recentlyOpenedFiles)
      .where(eq(recentlyOpenedFiles.usersId, userId)); // Filter by userId

    // Fetch the knowledge table data based on fileId
    const knowledgeData = await db
      .select({
        id: knowledgeTable.id,
        name: knowledgeTable.name,
        path: knowledgeTable.path,
        thumbnailPath: knowledgeTable.thumbnailPath,
        size: knowledgeTable.size,
      })
      .from(knowledgeTable);

    // Map over the recently opened files and add knowledge data to each
    const enrichedRecentlyOpenedFiles = recentlyOpenedFilesData.map((file) => {
      const knowledgeFile = knowledgeData.find((k) => k.id === file.fileId);
      return {
        ...file,
        fileName: knowledgeFile?.name,
        fileUrl: knowledgeFile?.path,
        thumbnailPath: knowledgeFile?.thumbnailPath,
        size: knowledgeFile?.size,
      };
    });
    return NextResponse.json(enrichedRecentlyOpenedFiles);
  } catch (error) {
    console.error("Error fetching recently opened files data:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently opened files data." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { fileId, userId } = await req.json();

    if (!fileId || !userId) {
      return NextResponse.json(
        { error: "fileId and userId are required" },
        { status: 400 }
      );
    }

    // Insert into the recently opened files table
    await db.insert(recentlyOpenedFiles).values({
      usersId: userId, // The user ID
      fileId: fileId, // The file ID
      openedAt: new Date(), // The timestamp for when the file was opened
    });

    return NextResponse.json({ message: "File successfully logged" });
  } catch (error) {
    console.error("Error adding to recently opened files:", error);
    return NextResponse.json(
      { error: "Failed to add to recently opened files" },
      { status: 500 }
    );
  }
}
