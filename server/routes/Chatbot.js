const express = require("express");
// const { pipeline } = require("@xenova/transformers");
const {GoogleGenerativeAI} =  require("@google/generative-ai")
const router = express.Router();
const siteMap = require("../controllers/sitemap");


let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const cleanText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1")     // italics
    .replace(/`(.*?)`/g, "$1")       // inline code
    .replace(/#+\s?/g, "")           // headings
    .replace(/-\s+/g, "")             // bullets
    .trim();
};


router.post("/chat", async (req, res) => { 
  
  try {
    const { question } = req.body;

    const prompt = `
${siteMap}

User question:
${question}
`;

    const data = await model.generateContent(prompt);
    const finalData = cleanText(data.response.text());

    res.json({
      success: true,
      finalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gemini error",
    });
  }
})

module.exports = router;