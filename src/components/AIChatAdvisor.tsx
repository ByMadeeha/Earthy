/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Send, Sparkles, X, RefreshCw, 
  Leaf, Info, Compass, ShieldAlert, Cpu
} from "lucide-react";
import { SmartDevice } from "../types";

interface AIChatAdvisorProps {
  devices: SmartDevice[];
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function AIChatAdvisor({ devices, onClose }: AIChatAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: 'assistant',
      text: "Hello! I am **Earthy**, your smart home sustainability co-pilot.\n\nI have loaded your active smart plug configurations. Ask me anything, or tap one of the quick assessments below to optimize your energy flows!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: "Analyze standby leakage", query: "Can you scan my currently active devices and point out potential standby power leakage?" },
    { label: "Kitchen assessment", query: "Evaluate my Kitchen devices. What are the best sustainability upgrades for my cooking area?" },
    { label: "Optimum AC schedule", query: "My AC consumes a lot of power. Help me design an eco-friendly heating/cooling scheduler." },
    { label: "Reduce my carbon footprint", query: "Give me the top three high-impact habits to lower my home's CO2 emission rate today." }
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map history to server schema
      const history = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history,
          deviceContext: devices
        })
      });

      if (!response.ok) {
        throw new Error("Failed to consult Earthy core.");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        text: data.reply
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          text: "**Earthy AI Core is momentarily offline.** \n\nI am running on a backup solar capacitor, which currently only supports simulation mode. Please ensure your `GEMINI_API_KEY` is fully declared in your Secrets panel, or try asking about AC and refrigerator adjustments!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col h-[580px] overflow-hidden" id="earthy-ai-chat-card">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950/80 px-6 py-4 border-b border-emerald-500/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shadow-inner">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h4 className="font-sans font-semibold text-sm text-emerald-100 flex items-center gap-1.5">
              Earthy Energy Advisor
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            </h4>
            <span className="text-[10px] text-sky-200/50 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Gemini 3.5 Core Connected
            </span>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-emerald-300 p-1 bg-slate-900/40 hover:bg-emerald-950/20 border border-slate-800 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-800">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={m.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-emerald-500/20 border border-emerald-400/20 text-emerald-100' 
                  : 'bg-emerald-950/15 border border-emerald-500/5 text-sky-100/90 shadow-sm'
              }`}>
                {/* Formatted Text rendering */}
                <div className="prose prose-invert prose-xs">
                  {m.text.split("\n").map((line, idx) => {
                    // Quick parsing of bold text e.g. **text**
                    let lineWithBolds: React.ReactNode = line;
                    if (line.includes("**")) {
                      const parts = line.split("**");
                      lineWithBolds = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-emerald-300 font-semibold">{part}</strong> : part);
                    }
                    return <p key={idx} className="mb-1.5 last:mb-0">{lineWithBolds}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-emerald-950/10 border border-emerald-500/5 rounded-2xl p-4 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[10px] font-mono text-sky-200/50 uppercase ml-1">Earthy thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Presets Grid (visible when only initial message exists) */}
      {messages.length === 1 && (
        <div className="px-6 pb-2 shrink-0">
          <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400 block mb-2">Suggested Consultations</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.query)}
                className="p-2.5 text-left rounded-xl bg-slate-900/60 border border-slate-900 hover:border-emerald-500/20 text-[11px] text-sky-200/70 hover:text-emerald-300 hover:bg-emerald-950/10 transition-all font-sans"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-slate-950/60 border-t border-slate-900 flex gap-3 shrink-0"
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Consult Earthy AI on microgrid efficiency..."
          className="flex-1 bg-slate-900 border border-emerald-500/10 rounded-2xl px-4 py-2.5 text-xs text-emerald-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-400/40 transition-all"
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 text-slate-950 hover:text-slate-900 disabled:text-slate-700 font-medium rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
