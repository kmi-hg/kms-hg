import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatRooms, messages } from "@/db/schema/chatbot";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { userTable } from "@/db/schema/user";

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

export async function POST() {
  const userId = uuidv4();
  const roomId = uuidv4();

  await db.insert(userTable).values({
    id: userId,
    name: "Guest User",
    nrp: `GUEST-${userId.slice(0, 6)}`,
    password: "defaultpassword", // atau hash kosong
    role: "Karyawan", // atau "KMI" sesuai enum
  });

  await db.insert(chatRooms).values({
    id: roomId,
    userId,
    title: "Chat Baru",
  });

  return NextResponse.json({ userId, roomId });
}
