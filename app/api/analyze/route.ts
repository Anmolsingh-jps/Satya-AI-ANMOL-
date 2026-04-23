import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, modelType, fileData, fileMimeType } = await req.json();

    // Use Gemini 1.5 Flash (Fast, Free, and Multimodal)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      System: You are "Satya AI", a friendly and honest fact-checker. 
      Instructions:
      1. Detect the user's language and respond ONLY in that language.
      2. If a video/image is provided, analyze it deeply.
      3. Provide: 
         - Fact-Check: Is it real or fake? 
         - Improvement: How to make the content better (hooks/lighting).
         - Viral Kit: 1 viral caption and 10 trending hashtags.
      4. If the user is just chatting, be a helpful AI companion.
      
      Output Format (Strict JSON):
      {
        "response": "General chat response or Fact-check result",
        "isReal": "Yes/No/NA",
        "suggestions": "improvement tips",
        "viralKit": { "caption": "...", "hashtags": ["...", "..."] }
      }

      User Input: ${message}
    `;

    let result;
    if (fileData && fileMimeType) {
      result = await model.generateContent([
        prompt,
        { inlineData: { data: fileData, mimeType: fileMimeType } }
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("Satya AI Error:", error);
    return NextResponse.json({ error: "Bhai, API Key check karo ya file size!" }, { status: 500 });
  }
}
