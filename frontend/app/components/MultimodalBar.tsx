"use client";

import React, { useState } from "react";
import { Mic, MicOff, ScreenShare, Send, Sparkles, Languages } from "lucide-react";

interface MultimodalBarProps {
  onSendQuery: (query: string, includeScreen: boolean, lang: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isLoading: boolean;
}

export const MultimodalBar: React.FC<MultimodalBarProps> = ({
  onSendQuery,
  isListening,
  onToggleListening,
  isLoading,
}) => {
  const [text, setText] = useState("");
  const [includeScreen, setIncludeScreen] = useState(false);
  const [language, setLanguage] = useState("auto");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendQuery(text, includeScreen, language);
    setText("");
  };

  const handlePreset = (preset: string) => {
    onSendQuery(preset, includeScreen, language);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Quick Prompt Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
        <span className="text-gray-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        <button
          onClick={() => handlePreset("Analyze what is currently open on my screen")}
          className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 transition whitespace-nowrap"
        >
          🔍 Inspect Screen
        </button>
        <button
          onClick={() => handlePreset("Check CPU and memory usage")}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-gray-300 hover:bg-slate-800 transition whitespace-nowrap"
        >
          ⚡ System Stats
        </button>
        <button
          onClick={() => handlePreset("Open Notepad and write project notes")}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-gray-300 hover:bg-slate-800 transition whitespace-nowrap"
        >
          📝 Launch Notepad
        </button>
        <button
          onClick={() => handlePreset("Play synthwave chill music on YouTube")}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-gray-300 hover:bg-slate-800 transition whitespace-nowrap"
        >
          🎵 YouTube Music
        </button>
        <button
          onClick={() => handlePreset("हिंदी में बताओ आज का मौसम और समय")}
          className="px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 transition whitespace-nowrap"
        >
          🇮🇳 हिन्दी मोड़
        </button>
        <button
          onClick={() => handlePreset("আমাকে বাংলায় একটি মজার গল্প শোনাও")}
          className="px-2.5 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition whitespace-nowrap"
        >
          🇧🇩 বাংলা মোড
        </button>
      </div>

      {/* Main Input Controls */}
      <form onSubmit={handleSubmit} className="glass-panel-glow p-2 rounded-2xl flex items-center gap-2">
        {/* Screen Attachment Toggle */}
        <button
          type="button"
          onClick={() => setIncludeScreen(!includeScreen)}
          title="Include active screen snapshot in query context"
          className={`p-3 rounded-xl transition flex items-center gap-1.5 text-xs font-mono ${
            includeScreen
              ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]"
              : "bg-slate-900 text-gray-400 hover:text-cyan-300 border border-slate-800"
          }`}
        >
          <ScreenShare className="w-4 h-4" />
          <span className="hidden sm:inline">{includeScreen ? "VISION ACTIVE" : "VISION OFF"}</span>
        </button>

        {/* Mic Voice Button */}
        <button
          type="button"
          onClick={onToggleListening}
          title="Toggle microphone"
          className={`p-3 rounded-xl transition flex items-center justify-center ${
            isListening
              ? "bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]"
              : "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/80"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Language Selector */}
        <div className="relative flex items-center">
          <Languages className="w-3.5 h-3.5 absolute left-2 text-cyan-400 pointer-events-none" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="pl-7 pr-2 py-2 bg-slate-950 border border-cyan-900/60 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="auto">Auto (Detect)</option>
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Query Input Box */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            includeScreen
              ? "Ask about what's on your screen..."
              : "Ask Vocalis AI or give a voice/system command..."
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:brightness-110 disabled:opacity-40 transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
