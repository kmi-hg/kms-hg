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
        setMessages(data.messages || []);
      })
      .catch((err) => {
        console.error("Failed to load chat room:", err);
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
    setTimeout(() => {
      const botMessage: ChatMessage = {
        from: "bot",
        text: "Terima kasih! Ini adalah respon otomatis dari Hasnur AI.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
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
