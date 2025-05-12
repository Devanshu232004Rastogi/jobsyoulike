'use server';
import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-pro-exp-03-25",
});
const generationConfig = {
  responseMimeType: "text/plain",
};
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
async function getGenerativeAIResponse(prompt: string) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not set. Set your GEMINI_API_KEY environment variable.");
  }
  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    // Remove all markdown formatting characters
    const cleanedText = responseText
      .trim()
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\*/g, "")   // Remove italics
      .replace(/```/g, "")  // Remove code blocks
      .replace(/#/g, "")    // Remove headings
      .replace(/\[(.*?)\]\(.*?\)/g, "$1"); // Convert links to plain text
    return cleanedText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
export default getGenerativeAIResponse;