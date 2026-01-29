import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";
import { X } from "lucide-react";

const ChatWindow = ({ closeChat }) => {
  return (
    <div className="fixed bottom-24 right-6 w-82 h-105 bg-[#FCF6D9] rounded-xl border border-gray-800 z-50 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-semibold text-sm">WiseBot</span>
        <button onClick={closeChat}>
          <X size={18} />
        </button>
      </div>

      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
