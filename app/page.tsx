"use client";
import { useState } from "react";

export default function SatyaAI() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    let fileBase64 = null;

    if (file) {
      const reader = new FileReader();
      fileBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          fileData: fileBase64,
          fileMimeType: file?.type,
        }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Error aa raha hai bro!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-5 font-sans">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-purple-500 mb-2">Satya AI</h1>
        <p className="text-gray-400 mb-8">Sach kya hai? Let AI find out. 🕵️‍♂️</p>

        <div className="bg-gray-900 p-4 rounded-xl border border-purple-900/50 shadow-2xl">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none"
            placeholder="Kuch pucho ya video upload karo..."
            rows={4}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-4">
            <input type="file" id="file-up" hidden onChange={(e) => setFile(e.target.files![0])} />
            <label htmlFor="file-up" className="cursor-pointer text-purple-400 hover:text-purple-300">
              {file ? "✅ " + file.name : "📎 Attach Video/Image"}
            </label>
            <button 
              onClick={handleAnalysis}
              className="bg-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Checking..." : "Sach Check karo 🔍"}
            </button>
          </div>
        </div>

        {data && (
          <div className="mt-8 bg-gray-900 p-6 rounded-xl text-left border-l-4 border-purple-500 animate-fade-in">
            <p className="text-xl mb-4">{data.response}</p>
            {data.isReal !== "NA" && (
              <div className="mb-4">
                <span className={`px-3 py-1 rounded full font-bold ${data.isReal === 'Yes' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                  Is it Real? {data.isReal}
                </span>
              </div>
            )}
            <p className="text-gray-400 italic mb-4">{data.suggestions}</p>
            <div className="bg-black p-4 rounded-lg">
              <p className="text-purple-400 font-bold"># Viral Kit</p>
              <p className="mt-2">{data.viralKit?.caption}</p>
              <p className="mt-2 text-blue-400">{data.viralKit?.hashtags.join(" ")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
