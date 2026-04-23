import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, fileData, fileMimeType } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as Satya AI. Fact-check this: ${message}. 
    Return JSON: {"isReal": "...", "reasoning": "...", "viralKit": {"caption": "...", "hashtags": []}}`;

    let result;
    if (fileData) {
      result = await model.generateContent([
        prompt,
        { inlineData: { data: fileData, mimeType: fileMimeType } }
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    return NextResponse.json(JSON.parse(response.text().replace(/```json|```/g, "")));
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
