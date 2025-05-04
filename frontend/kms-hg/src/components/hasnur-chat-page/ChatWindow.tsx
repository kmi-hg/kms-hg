"use client";

import { ChatMessage } from "@/types/chat";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
}

const ChatWindow = ({ messages }: Props) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
