import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: "AIzaSyDSzOpetApJw5SebjNV7s9Vh70bKxOFNy0"});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

main();