"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/hasnur-chat-page/ChatSidebar";
import ChatWindow from "@/components/hasnur-chat-page/ChatWindow";
import MessageInput from "@/components/hasnur-chat-page/MessageInput";
import { ChatMessage } from "@/types/chat";

export default function HasnurChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/chat/room?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRoomId(data.roomId);
        const mappedMessages = (data.messages || []).map((m: any) => ({
          from: m.sender === "user" ? "user" : "bot",
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(mappedMessages);
      });
  }, [userId]);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Optional simulated bot reply
    setTimeout(async () => {
      const aiText = "Terima kasih! Ini adalah respon otomatis dari Hasnur AI.";
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Tampilkan dulu di UI
      setMessages((prev) => [...prev, { from: "bot", text: aiText, time }]);

      // Kirim ke DB
      try {
        const res = await fetch(`/api/chat/${roomId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "ai",
            content: aiText,
          }),
        });

        if (!res.ok) {
          const errMsg = await res.text();
          console.error("Failed to save AI message:", errMsg);
        }
      } catch (err) {
        console.error("Error saving AI message:", err);
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar />
      <div className="flex flex-col flex-1">
        {roomId ? (
          <>
            <ChatWindow messages={messages} />
            <MessageInput onSend={handleSend} roomId={roomId} />
          </>
        ) : (
          <div className="p-6 text-gray-500">Loading chat room...</div>
        )}
      </div>
    </div>
  );
}
