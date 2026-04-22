import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, model } = await req.json(); // Ab hum UI se model bhi le rahe hain

    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

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

    // ======== GEMINI API LOGIC ========
    if (model === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "Gemini API key missing" }, { status: 500 });

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
    } 
    
    // ======== CHATGPT (OPENAI) API LOGIC ========
    else if (model === 'chatgpt') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-0125", // Aap chahein toh "gpt-4o-mini" bhi use kar sakte hain
          response_format: { type: "json_object" }, // OpenAI ko JSON dene ke liye force karta hai
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this news/topic: ${topic}` }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from ChatGPT');
      const data = await response.json();
      const textOutput = data.choices[0].message.content;
      return NextResponse.json(JSON.parse(textOutput));
    }

    return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
