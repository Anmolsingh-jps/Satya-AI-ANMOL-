'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Share2, TrendingUp, AlertTriangle, CheckCircle, HelpCircle, Bot, Sparkles } from 'lucide-react';

export default function SatyaAI() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt'>('gemini'); // NAYA: Model State
  const resultRef = useRef<HTMLDivElement>(null);

  const trendingTopics = [
    "AI is taking over all coding jobs",
    "Drinking hot water cures everything",
    "New Rs 1000 note launching tomorrow",
  ];

  useEffect(() => {
    const saved = localStorage.getItem('satya_last_result');
    if (saved) setResult(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleCheck = async (searchTopic = topic) => {
    if (!searchTopic.trim()) return;
    setLoading(true); setError(''); setResult(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchTopic, model: selectedModel }) // NAYA: Model bheja ja raha hai
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      setResult(data);
      localStorage.setItem('satya_last_result', JSON.stringify(data));
    } catch (err) {
      setError("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard! 🔥");
  };

  const getBadgeStyle = (status: string) => {
    if (status.toLowerCase().includes('real')) return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', icon: <CheckCircle size={18} /> };
    if (status.toLowerCase().includes('fake')) return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', icon: <AlertTriangle size={18} /> };
    return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', icon: <HelpCircle size={18} /> };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-center py-2 text-sm font-semibold tracking-wide shadow-lg">
        Upgrade to Pro ₹99 🚀 (coming soon)
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            Satya AI
          </h1>
          <p className="text-gray-400 text-lg">Sach kya hai? Let AI find out. 🕵️‍♂️</p>
        </div>

        {/* NAYA: Model Selection Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => setSelectedModel('gemini')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${selectedModel === 'gemini' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Sparkles size={16} /> Gemini
            </button>
            <button
              onClick={() => setSelectedModel('chatgpt')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${selectedModel === 'chatgpt' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Bot size={16} /> ChatGPT
            </button>
          </div>
        </div>

        <div className="relative mb-8 group">
          <div className={`absolute -inset-1 rounded-3xl blur opacity-25 transition-colors duration-500 ${selectedModel === 'gemini' ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-green-400'}`}></div>
          <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`Paste news here... (Using ${selectedModel === 'gemini' ? 'Gemini 1.5' : 'ChatGPT'})`}
              className="w-full bg-transparent p-4 text-white placeholder-gray-500 focus:outline-none resize-none h-32 text-lg"
            />
            <div className="flex justify-between items-center p-2 mt-2 border-t border-white/5">
              <span className="text-xs text-gray-500 opacity-50 px-2">Powered by {selectedModel === 'gemini' ? 'Google' : 'OpenAI'} 🔥</span>
              <button
                onClick={() => handleCheck()}
                disabled={loading || !topic}
                className={`text-white px-6 py-3 rounded-xl font-medium transition-all disabled:bg-gray-800 ${selectedModel === 'gemini' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {loading ? 'Analyzing...' : 'Sach Check karo 🔍'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {trendingTopics.map((t, idx) => (
            <button key={idx} onClick={() => { setTopic(t); handleCheck(t); }} className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 transition-all">
              <TrendingUp size={14} className={selectedModel === 'gemini' ? "text-purple-400" : "text-blue-400"} /> {t}
            </button>
          ))}
        </div>

        {loading && <div className={`text-center animate-pulse py-12 ${selectedModel === 'gemini' ? 'text-purple-400' : 'text-blue-400'}`}>Cross-checking facts via {selectedModel === 'gemini' ? 'Gemini' : 'ChatGPT'}...</div>}
        {error && <div className="text-red-400 text-center mb-8 bg-red-900/20 py-4 rounded-2xl">{error}</div>}

        {result && !loading && (
          <div ref={resultRef} className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold border ${getBadgeStyle(result.realityCheck.status).bg} ${getBadgeStyle(result.realityCheck.status).text} ${getBadgeStyle(result.realityCheck.status).border}`}>
                  {getBadgeStyle(result.realityCheck.status).icon}
                  {result.realityCheck.status.toUpperCase()}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-blue-300">Kya Scene Hai?</h2>
              <p className="text-gray-200 leading-relaxed text-lg mb-6">{result.explanation}</p>
              <div className={`bg-black/30 rounded-2xl p-4 border-l-4 ${selectedModel === 'gemini' ? 'border-purple-500' : 'border-blue-500'}`}>
                <h3 className={`text-sm font-bold mb-1 uppercase tracking-wider ${selectedModel === 'gemini' ? 'text-purple-400' : 'text-blue-400'}`}>Deep Insight 🧠</h3>
                <p className="text-gray-300 italic">{result.deepInsight}</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-green-400">Group Chat Breakdown 💬</h2>
              <div className="space-y-4 bg-[#0f0f15] p-4 rounded-2xl border border-white/5">
                {result.conversation.split('\n').map((line: string, idx: number) => {
                  if (!line.trim()) return null;
                  const isPerson1 = line.toLowerCase().includes('1:');
                  return (
                    <div key={idx} className={`flex ${isPerson1 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${isPerson1 ? 'bg-gray-800 text-gray-200 rounded-bl-none' : (selectedModel === 'gemini' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-blue-600 text-white rounded-br-none')}`}>
                        {line.split(':').slice(1).join(':').trim() || line}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-orange-400">Viral Captions 📸</h2>
              <div className="space-y-3">
                {result.captions.map((cap: string, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-300 pr-4">{cap}</p>
                    <button onClick={() => copyToClipboard(cap)} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-lg"><Copy size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
