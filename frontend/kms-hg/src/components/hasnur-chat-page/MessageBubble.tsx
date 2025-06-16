import { ChatMessage } from "@/types/chat";

interface Props {
  message: ChatMessage;
}

const MessageBubble = ({ message }: Props) => {
  const isUser = message.from === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow text-base ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p>{message.text}</p>
        <div className="text-xs text-right mt-1 text-gray-400">
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
