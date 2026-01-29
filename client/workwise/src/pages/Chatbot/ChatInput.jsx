import { useState } from "react";
import { useChatStore } from "../../api/chatStore";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage, loading } = useChatStore();

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="py-3 px-2 border-t flex gap-2">
      <input
        className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-[#FA5C5C] text-gray-900 font-semibold px-3 rounded-lg disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
