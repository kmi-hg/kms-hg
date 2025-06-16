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

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      from: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add the user message first
    setMessages((prev) => [...prev, userMessage]);

    try {
      // First, call the AI backend to get the response
      const aiResponse = await fetch(`/api/chat/${roomId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const aiData = await aiResponse.json();
      const aiText = aiData.answer; // Expect the response to contain 'answer'

      console.log("AI response:", aiText);

      // Then, show the AI response in the UI
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: aiText, time }, // Add AI message here
      ]);

      // Finally, store the AI response in the database
      await fetch(`/api/chat/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "ai",
          content: aiText,
        }),
      });
    } catch (err) {
      console.error("Error handling message:", err);
    }
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
