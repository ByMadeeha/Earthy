/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, Cpu, Wifi, Cloud, Brain, BarChart3, HelpCircle, 
  ChevronRight, ArrowRightLeft, Info, Server, ShieldCheck, Database
} from "lucide-react";

export default function ArchitectureDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const steps = [
    {
      id: 0,
      title: "1. Home Appliance",
      icon: "🔌",
      sub: "Active Loads",
      desc: "Household electronic appliances (like air conditioners, water heaters, and washing machines) pull electrical currents from wall sockets.",
      details: "Power draws are highly dynamic, fluctuating based on operating cycles, mechanical stresses, and standby (vampire) loads."
    },
    {
      id: 1,
      title: "2. Smart Plug / Sensor",
      icon: "🔌",
      sub: "Microgrid Telemetry",
      desc: "Custom IoT smart plugs equipped with energy metering chips read current, voltage, and real-time active wattage draw 100 times per second.",
      details: "These plugs act as secure local circuit guards, offering over-current protection and microgrid wattage logging."
    },
    {
      id: 2,
      title: "3. Local Wi-Fi Network",
      icon: "📶",
      sub: "Local Access Point",
      desc: "Smart plugs package the electrical metrics into secure JSON packets and stream them across your home's 2.4GHz Wi-Fi router.",
      details: "Utilizes standard WPA3 encryption protocols to safeguard in-home IoT packet transmissions."
    },
    {
      id: 3,
      title: "4. Earthy Local Hub",
      icon: "📟",
      sub: "Edge Gateway",
      desc: "An onsite low-energy bridge (or regional smart meter) aggregates the various room packet streams, debounces high frequency noise, and logs state histories.",
      details: "Performs Edge computing, storing up to 7 days of local logs offline in case of internet interruptions."
    },
    {
      id: 4,
      title: "5. Earthy Cloud Engine",
      icon: "☁️",
      sub: "Secure Sync Core",
      desc: "The Local Hub securely syncs its compressed data frames to Earthy's cloud services using TLS-encrypted HTTPS REST routes.",
      details: "Processes regional utility rate curves, meteorological forecasts, and seasonal variables in real-time."
    },
    {
      id: 5,
      title: "6. Gemini AI Diagnostics",
      icon: "🧠",
      sub: "Linguistic & Structural LLM",
      desc: "Advanced Gemini 3.5 AI models analyze complex historical consumption arrays, isolate standby leakage, and evaluate appliance health signatures.",
      details: "Gemini interprets these patterns and writes structured energy recommendations, carbon-avoidance equivalents, and diagnostic reports."
    },
    {
      id: 6,
      title: "7. Earthy App Dashboard",
      icon: "📊",
      sub: "User Experience Core",
      desc: "The curated energy insights and structured diagnostics are delivered to your screen in a beautiful, calm, fully interactive dashboard.",
      details: "Users can schedule plugs, customize budget boundaries, and communicate with Earthy's conversational AI assistant."
    }
  ];

  return (
    <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl" id="architecture-diagram-section">
      
      {/* Header */}
      <div className="border-b border-emerald-500/10 pb-5 mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-sans font-semibold text-xl text-emerald-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Earthy Smart Architecture
          </h3>
          <p className="text-xs text-sky-200/60 mt-0.5">Traces how device telemetry flows to smart AI outputs</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          TLS 1.3 SECURE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Animated Data Flow SVG */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-900 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden h-[380px]">
          
          {/* Subtle atmosphere background glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Flow Lines and Node points SVG */}
          <svg viewBox="0 0 700 300" className="w-full h-full" id="architecture-flow-svg">
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Glowing Flowing Curved Connections */}
            <path 
              d="M 60 150 Q 150 70 230 150 T 400 150 T 570 150 T 640 150" 
              fill="none" 
              stroke="url(#flow-gradient)" 
              strokeWidth="2.5" 
              strokeDasharray="6,6"
              className="opacity-65"
            >
              <animate attributeName="stroke-dashoffset" values="100;0" dur="15s" repeatCount="indefinite" />
            </path>
            
            {/* Animated current energy particle */}
            <circle r="5" fill="#38bdf8" className="filter drop-shadow-[0_0_6px_#38bdf8]">
              <animateMotion 
                path="M 60 150 Q 150 70 230 150 T 400 150 T 570 150 T 640 150" 
                dur="7s" 
                repeatCount="indefinite" 
              />
            </circle>

            <circle r="4" fill="#10b981" className="filter drop-shadow-[0_0_6px_#10b981]">
              <animateMotion 
                path="M 60 150 Q 150 70 230 150 T 400 150 T 570 150 T 640 150" 
                dur="4s" 
                repeatCount="indefinite" 
              />
            </circle>

            {/* Node Positions on SVG */}
            {/* 1. Appliance */}
            <g onClick={() => setActiveStep(0)} className="cursor-pointer group">
              <circle cx="60" cy="150" r="28" fill="#022c22" stroke={activeStep === 0 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="60" y="156" textAnchor="middle" className="text-lg">🔌</text>
              <text x="60" y="195" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">Load</text>
            </g>

            {/* 2. Smart Plug */}
            <g onClick={() => setActiveStep(1)} className="cursor-pointer group">
              <circle cx="160" cy="110" r="28" fill="#022c22" stroke={activeStep === 1 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="160" y="116" textAnchor="middle" className="text-lg">⚙️</text>
              <text x="160" y="155" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">Sensor</text>
            </g>

            {/* 3. Wi-Fi */}
            <g onClick={() => setActiveStep(2)} className="cursor-pointer group">
              <circle cx="260" cy="150" r="28" fill="#0c4a6e" stroke={activeStep === 2 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="260" y="156" textAnchor="middle" className="text-lg">📶</text>
              <text x="260" y="195" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">WiFi</text>
            </g>

            {/* 4. Local Hub */}
            <g onClick={() => setActiveStep(3)} className="cursor-pointer group">
              <circle cx="360" cy="110" r="28" fill="#022c22" stroke={activeStep === 3 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="360" y="116" textAnchor="middle" className="text-lg">📟</text>
              <text x="360" y="155" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">Hub</text>
            </g>

            {/* 5. Cloud */}
            <g onClick={() => setActiveStep(4)} className="cursor-pointer group">
              <circle cx="460" cy="150" r="28" fill="#0c4a6e" stroke={activeStep === 4 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="460" y="156" textAnchor="middle" className="text-lg">☁️</text>
              <text x="460" y="195" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">Cloud</text>
            </g>

            {/* 6. Gemini Brain */}
            <g onClick={() => setActiveStep(5)} className="cursor-pointer group">
              <circle cx="560" cy="110" r="28" fill="#1e1b4b" stroke={activeStep === 5 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400 filter drop-shadow-[0_0_4px_rgba(139,92,246,0.3)]" />
              <text x="560" y="116" textAnchor="middle" className="text-lg">🧠</text>
              <text x="560" y="155" textAnchor="middle" className="fill-purple-300 font-mono text-[9px]">Gemini</text>
            </g>

            {/* 7. Dashboard */}
            <g onClick={() => setActiveStep(6)} className="cursor-pointer group">
              <circle cx="640" cy="150" r="28" fill="#022c22" stroke={activeStep === 6 ? "#10b981" : "#1e293b"} strokeWidth="2" className="transition-all hover:stroke-emerald-400" />
              <text x="640" y="156" textAnchor="middle" className="text-lg">📊</text>
              <text x="640" y="195" textAnchor="middle" className="fill-sky-200/50 font-mono text-[9px]">Earthy UX</text>
            </g>

          </svg>
          
          <div className="absolute bottom-4 left-4 text-[9px] font-mono text-emerald-400 bg-emerald-950/60 p-1 px-2 rounded border border-emerald-500/10">
            Click nodes to inspect micro-packet states
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Node Information */}
        <div className="lg:col-span-5 h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeStep !== null ? (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 bg-emerald-950/20 border border-emerald-500/15 p-5 rounded-2xl h-full flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block tracking-widest">{steps[activeStep].sub}</span>
                  <h4 className="font-sans font-semibold text-lg text-emerald-100 mt-1 flex items-center gap-2">
                    <span className="text-xl">{steps[activeStep].icon}</span>
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-xs text-sky-100 leading-relaxed mt-3">{steps[activeStep].desc}</p>
                  
                  <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-[11px] leading-normal text-sky-200/60 font-sans flex gap-2">
                    <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{steps[activeStep].details}</span>
                  </div>
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex justify-between items-center border-t border-emerald-500/10 pt-4">
                  <button 
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 disabled:text-slate-700 disabled:pointer-events-none"
                  >
                    ← Previous Node
                  </button>
                  <button 
                    disabled={activeStep === steps.length - 1}
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 disabled:text-slate-700 disabled:pointer-events-none"
                  >
                    Next Node →
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 border border-slate-900 bg-slate-950/20 rounded-2xl p-6">
                <HelpCircle className="w-10 h-10 mb-2 stroke-1 text-emerald-400" />
                <p className="text-xs font-sans">Select any architectural station node on the interactive map to view detailed microcircuit telemetry explanations.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
