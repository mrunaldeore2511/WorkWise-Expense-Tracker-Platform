import axios from "axios";

export const sendChatMessage = async (question) => {
  const res = await axios.post(
    "http://localhost:4000/api/chat",
    { question },
    { withCredentials: true }
  );
  return res.data;
};
