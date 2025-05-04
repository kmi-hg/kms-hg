import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema/chatbot";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET all messages for a room
export async function GET(
  req: NextRequest,
  context: { params: { roomId: string } }
) {
  try {
    const { roomId } = context.params;

    const data = await db
      .select()
      .from(messages)
      .where(eq(messages.chatRoomId, roomId));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST a new message to a room
export async function POST(req: NextRequest, context: any) {
  const { params } = await context;
  const { roomId } = await params;
  const body = await req.json();

  if (!body.content || !body.sender) {
    return NextResponse.json(
      { error: "Missing sender or content" },
      { status: 400 }
    );
  }

  try {
    const newMessage = {
      id: uuidv4(),
      chatRoomId: roomId,
      sender: body.sender,
      content: body.content,
      source: body.source || null,
    };

    const inserted = await db.insert(messages).values(newMessage).returning();

    return NextResponse.json(inserted[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
