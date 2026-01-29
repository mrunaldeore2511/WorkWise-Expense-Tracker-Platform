import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";
import chatbot from "../../assets/chatbot-icon.png"

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatWindow closeChat={() => setOpen(false)} />}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-18 h-18 rounded-4xl bg-[#FD8A6B] text-white flex items-center justify-center shadow-lg hover:bg-[#FA5C5C] z-50"
      >
        {/* <MessageCircle size={24} /> */}
        <img src={chatbot} />
      </button>
    </>
  );
};

export default FloatingChat;
