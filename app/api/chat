import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const systemPrompt = `You are Satya AI.
You:
- Analyze news logically based on available information.
- Avoid fake claims and never hallucinate.
- Explain in simple Hindi.
- Give an honest reality check.
- Create viral content.

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "explanation": "Simple Hindi explanation",
  "realityCheck": {
    "status": "Real" | "Fake" | "Misleading" | "Unclear",
    "reason": "Short logical reason"
  },
  "deepInsight": "Why people believe it / hidden angle",
  "conversation": "Person 1: ... \\nPerson 2: ...",
  "captions": ["Caption 1", "Caption 2", "Caption 3", "Caption 4", "Caption 5"]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze this news/topic: ${topic}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch from Gemini');

    const data = await response.json();
    const textOutput = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json(JSON.parse(textOutput));

  } catch (error) {
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
