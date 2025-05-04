import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatRooms, messages } from "@/db/schema/chatbot";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Check if user already has a room
  const existingRoom = await db
    .select()
    .from(chatRooms)
    .where(eq(chatRooms.userId, userId));

  if (existingRoom.length > 0) {
    const roomId = existingRoom[0].id;
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatRoomId, roomId));

    return NextResponse.json({ roomId, messages: userMessages });
  }

  // If not, create new room
  const newRoomId = uuidv4();
  await db.insert(chatRooms).values({ id: newRoomId, userId });

  return NextResponse.json({ roomId: newRoomId, messages: [] });
}
