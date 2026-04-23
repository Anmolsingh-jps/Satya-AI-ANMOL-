const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// Model Clients Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { message, modelType, fileData, fileMimeType } = req.body;

        let aiResponse = "";

        // Common Prompt Logic
        const prompt = `Act as "Satya AI". Analyze this content:
        1. Fact-Check: Is it real or fake? Provide reasoning.
        2. Improvement: Suggest hooks, lighting, and editing.
        3. Viral Kit: 1 viral caption and 10 trending hashtags.
        Respond ONLY in JSON format: 
        {"isReal": "Yes/No/Partial", "reasoning": "...", "suggestions": "...", "viralKit": {"caption": "...", "hashtags": "..."}}
        Content: ${message}`;

        if (modelType === "gemini") {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using Flash for Video/Image
            
            if (fileData) {
                // Multimodal Request (Video/Image)
                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: fileData, mimeType: fileMimeType } }
                ]);
                aiResponse = result.response.text();
            } else {
                const result = await model.generateContent(prompt);
                aiResponse = result.response.text();
            }
        } 
        else if (modelType === "gpt") {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
            });
            aiResponse = response.choices[0].message.content;
        }

        // JSON Cleaning (AI sometimes adds backticks)
        const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
        res.status(200).json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Satya AI Error:", error);
        res.status(500).json({ error: "Oops! Something went wrong. Check API Keys or File size." });
    }
}
