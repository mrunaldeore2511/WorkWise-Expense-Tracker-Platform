import { create } from "zustand";
import { sendChatMessage } from "./chatApi";
export const useChatStore = create((set) => ({
  messages: [],
  loading: false,

  sendMessage: async (question) => {
    set((state) => ({
      messages: [...state.messages, { role: "user", text: question }],
      loading: true,
    }));

    try {
      const res = await sendChatMessage(question);
      set((state) => ({
        messages: [...state.messages, { role: "bot", text: res.finalData }],
        loading: false,
      }));
    } catch {
      set((state) => ({
        messages: [...state.messages, { role: "bot", text: "Error" }],
        loading: false,
      }));
    }
  },

  clearChat: () => set({ messages: [] })
}));
