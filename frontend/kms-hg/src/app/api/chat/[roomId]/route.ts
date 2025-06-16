import { db } from "@/db";
import { messages } from "@/db/schema/chatbot";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const { roomId } = await context.params; // Ensure this is awaited
  const body = await req.json();

  // Log the body content to see what’s being passed
  console.log("Received body:", body);

  if (!body.content || !body.sender) {
    return NextResponse.json(
      { error: "Missing sender or content" },
      { status: 400 }
    );
  }

  try {
    const newMessage = {
      chatRoomId: roomId,
      sender: body.sender,
      content: body.content, // This will now be the AI's response (string)
      source: body.source || null,
    };

    // Insert the new message into the database
    await db.insert(messages).values(newMessage);

    return NextResponse.json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
