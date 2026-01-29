import { useChatStore } from "../../api/chatStore";
import { useEffect, useRef } from "react";

const ChatMessages = () => {
  const { messages, loading } = useChatStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[75%] p-2 rounded-lg ${
            msg.role === "user"
              ? "ml-auto bg-[#FD8A6B] text-gray-800"
              : "mr-auto bg-[#FEC288] text-gray-800"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {loading && (
        <div className="mr-auto bg-[#FEC288] p-2 rounded-lg">
          Typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
