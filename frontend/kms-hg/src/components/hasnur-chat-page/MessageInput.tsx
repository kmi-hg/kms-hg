"use client";

import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  roomId: string;
}

const MessageInput = ({ onSend, roomId }: Props) => {
  const [text, setText] = useState("");

  const handleSend = async (text: string) => {
    if (!roomId || !text.trim()) {
      console.warn("Cannot send message. Room ID or text is empty.");
      return;
    }

    try {
      const res = await fetch(`/api/chat/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user",
          content: text,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to send:", err);
        return;
      }

      onSend(text);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex items-center border-t px-4 py-3 bg-white">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 text-lg text-black focus:outline-none"
        placeholder="Message to Hasnur AI..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend(text);
          }
        }}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
        onClick={() => handleSend(text)}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
