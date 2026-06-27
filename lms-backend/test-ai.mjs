import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: "What is React?",
});

console.log(response.text);
