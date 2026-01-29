import axios from "axios";

export const sendChatMessage = async (question) => {
  const res = await axios.post(
    "https://workwise-expense-tracker-platform-1.onrender.com/chat",
    { question },
    { withCredentials: true }
  );
  return res.data;
};
