/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, Utensils as KitchenIcon, Bed, Flame, Car, 
  Sparkles, CheckCircle, AlertTriangle, Lightbulb, Zap, Info, ShieldAlert,
  Bath, Home, Leaf
} from "lucide-react";
import { SmartDevice, Room } from "../types";

interface SmartHomeMapProps {
  devices: SmartDevice[];
  rooms: Room[];
  onRoomSelect?: (roomName: string) => void;
}

export default function SmartHomeMap({ devices, rooms, onRoomSelect }: SmartHomeMapProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>("living_room");

  // Calculate active metrics per room based on device state
  const getRoomMetrics = (roomId: string) => {
    const roomDevices = devices.filter(d => d.room.toLowerCase() === roomId.toLowerCase());
    const activePower = roomDevices.reduce((sum, d) => sum + (d.status ? d.powerUsage : 0), 0);
    const totalDailyKwh = roomDevices.reduce((sum, d) => sum + d.dailyKwh, 0);
    const activeCount = roomDevices.filter(d => d.status).length;
    const totalCount = roomDevices.length;
    const avgEfficiency = roomDevices.length 
      ? Math.round(roomDevices.reduce((sum, d) => sum + d.efficiencyScore, 0) / roomDevices.length)
      : 100;
    
    // Carbon impact is proportional to daily kWh (roughly 0.385 kg CO2 per kWh)
    const carbonImpact = Math.round(totalDailyKwh * 0.385 * 10) / 10;

    return {
      activePower,
      totalDailyKwh,
      activeCount,
      totalCount,
      avgEfficiency,
      carbonImpact
    };
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const selectedMetrics = selectedRoom ? getRoomMetrics(selectedRoom.id) : null;
  const selectedRoomDevices = selectedRoom 
    ? devices.filter(d => d.room.toLowerCase() === selectedRoom.id.toLowerCase())
    : [];

  // Helper to render room icons
  const getRoomIcon = (roomId: string) => {
    switch (roomId) {
      case "kitchen": return <KitchenIcon className="w-5 h-5 text-emerald-400" />;
      case "living_room": return <Tv className="w-5 h-5 text-sky-400" />;
      case "bedroom": return <Bed className="w-5 h-5 text-teal-400" />;
      case "bathroom": return <Bath className="w-5 h-5 text-cyan-400" />;
      case "garage": return <Car className="w-5 h-5 text-amber-400" />;
      default: return <Home className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="earthy-smart-home">
      
      {/* LEFT: Stunning Interactive Floorplan SVG */}
      <div className="lg:col-span-7 bg-emerald-950/25 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
        
        {/* Abstract Earth Atmosphere Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-sans font-medium text-lg text-emerald-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              Living Digital Home Model
            </h3>
            <p className="text-xs text-sky-200/70 font-mono mt-0.5">Click any region to view diagnostic currents</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ECO ACTIVE
            </span>
          </div>
        </div>

        {/* Home Floorplan Vector Map */}
        <div className="relative aspect-video w-full max-w-full mx-auto bg-slate-950/40 rounded-2xl border border-slate-800 p-4">
          <svg viewBox="0 0 800 450" className="w-full h-full select-none" id="floorplan-svg">
            <defs>
              {/* Gradients */}
              <linearGradient id="ocean-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="forest-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="active-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>
              
              {/* Glow Filter */}
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Energy flow lines traversing the walls */}
            <path 
              d="M 50 225 L 350 225 L 350 50 L 550 50 L 550 225 L 750 225 L 750 400 L 50 400 Z" 
              fill="none" 
              stroke="#047857" 
              strokeWidth="1.5" 
              strokeDasharray="8,8"
              className="opacity-40"
            />
            
            {/* Animated current dots moving across paths */}
            <circle r="4" fill="#34d399" className="filter drop-shadow-[0_0_4px_#34d399]">
              <animateMotion 
                path="M 50 225 L 350 225 L 350 50 L 550 50 L 550 225 L 750 225 L 750 400 L 50 400 Z" 
                dur="12s" 
                repeatCount="indefinite" 
              />
            </circle>
            
            <circle r="3" fill="#38bdf8" className="filter drop-shadow-[0_0_4px_#38bdf8]">
              <animateMotion 
                path="M 750 400 L 50 400 L 50 225 L 350 225 L 350 50 Z" 
                dur="8s" 
                repeatCount="indefinite" 
              />
            </circle>

            {/* ROOMS GEOMETRIES */}

            {/* 1. KITCHEN (Top Center) */}
            <g 
              onClick={() => setSelectedRoomId("kitchen")}
              className="cursor-pointer group transition-all duration-300"
            >
              <rect 
                x="350" y="50" width="200" height="175" 
                rx="12"
                fill={selectedRoomId === "kitchen" ? "url(#forest-glow)" : "rgba(15, 23, 42, 0.4)"}
                stroke={selectedRoomId === "kitchen" ? "#10b981" : "#1e293b"}
                strokeWidth={selectedRoomId === "kitchen" ? "2.5" : "1.5"}
                className="group-hover:stroke-emerald-400/80 transition-all"
              />
              {/* Room Power Glow */}
              {getRoomMetrics("kitchen").activePower > 0 && (
                <rect 
                  x="360" y="60" width="180" height="155" rx="8"
                  fill="url(#active-pulse-grad)" className="opacity-40 animate-pulse pointer-events-none"
                />
              )}
              <text x="450" y="110" textAnchor="middle" className="fill-emerald-100 font-sans font-medium text-sm">Kitchen</text>
              <text x="450" y="140" textAnchor="middle" className="fill-sky-300 font-mono text-xs font-semibold">
                {getRoomMetrics("kitchen").activePower} W active
              </text>
              <text x="450" y="165" textAnchor="middle" className="fill-emerald-400 font-mono text-[10px]">
                {getRoomMetrics("kitchen").activeCount}/{getRoomMetrics("kitchen").totalCount} Devices On
              </text>
            </g>

            {/* 2. LIVING ROOM (Left Wing) */}
            <g 
              onClick={() => setSelectedRoomId("living_room")}
              className="cursor-pointer group transition-all duration-300"
            >
              <rect 
                x="50" y="150" width="300" height="250" 
                rx="12"
                fill={selectedRoomId === "living_room" ? "url(#forest-glow)" : "rgba(15, 23, 42, 0.4)"}
                stroke={selectedRoomId === "living_room" ? "#10b981" : "#1e293b"}
                strokeWidth={selectedRoomId === "living_room" ? "2.5" : "1.5"}
                className="group-hover:stroke-emerald-400/80 transition-all"
              />
              {getRoomMetrics("living_room").activePower > 0 && (
                <rect 
                  x="60" y="160" width="280" height="230" rx="8"
                  fill="url(#active-pulse-grad)" className="opacity-40 animate-pulse pointer-events-none"
                />
              )}
              <text x="200" y="240" textAnchor="middle" className="fill-sky-100 font-sans font-medium text-sm">Living Room</text>
              <text x="200" y="270" textAnchor="middle" className="fill-sky-300 font-mono text-xs font-semibold">
                {getRoomMetrics("living_room").activePower} W active
              </text>
              <text x="200" y="295" textAnchor="middle" className="fill-emerald-400 font-mono text-[10px]">
                {getRoomMetrics("living_room").activeCount}/{getRoomMetrics("living_room").totalCount} Devices On
              </text>
            </g>

            {/* 3. BEDROOM (Right Wing Top) */}
            <g 
              onClick={() => setSelectedRoomId("bedroom")}
              className="cursor-pointer group transition-all duration-300"
            >
              <rect 
                x="550" y="150" width="200" height="140" 
                rx="12"
                fill={selectedRoomId === "bedroom" ? "url(#forest-glow)" : "rgba(15, 23, 42, 0.4)"}
                stroke={selectedRoomId === "bedroom" ? "#10b981" : "#1e293b"}
                strokeWidth={selectedRoomId === "bedroom" ? "2.5" : "1.5"}
                className="group-hover:stroke-emerald-400/80 transition-all"
              />
              {getRoomMetrics("bedroom").activePower > 0 && (
                <rect 
                  x="560" y="160" width="180" height="120" rx="8"
                  fill="url(#active-pulse-grad)" className="opacity-40 animate-pulse pointer-events-none"
                />
              )}
              <text x="650" y="200" textAnchor="middle" className="fill-teal-100 font-sans font-medium text-sm">Bedroom</text>
              <text x="650" y="225" textAnchor="middle" className="fill-sky-300 font-mono text-xs font-semibold">
                {getRoomMetrics("bedroom").activePower} W active
              </text>
              <text x="650" y="245" textAnchor="middle" className="fill-emerald-400 font-mono text-[10px]">
                {getRoomMetrics("bedroom").activeCount}/{getRoomMetrics("bedroom").totalCount} Devices On
              </text>
            </g>

            {/* 4. BATHROOM (Right Wing Middle) */}
            <g 
              onClick={() => setSelectedRoomId("bathroom")}
              className="cursor-pointer group transition-all duration-300"
            >
              <rect 
                x="550" y="290" width="200" height="110" 
                rx="12"
                fill={selectedRoomId === "bathroom" ? "url(#forest-glow)" : "rgba(15, 23, 42, 0.4)"}
                stroke={selectedRoomId === "bathroom" ? "#10b981" : "#1e293b"}
                strokeWidth={selectedRoomId === "bathroom" ? "2.5" : "1.5"}
                className="group-hover:stroke-emerald-400/80 transition-all"
              />
              {getRoomMetrics("bathroom").activePower > 0 && (
                <rect 
                  x="560" y="300" width="180" height="90" rx="8"
                  fill="url(#active-pulse-grad)" className="opacity-40 animate-pulse pointer-events-none"
                />
              )}
              <text x="650" y="335" textAnchor="middle" className="fill-cyan-100 font-sans font-medium text-sm">Bathroom</text>
              <text x="650" y="355" textAnchor="middle" className="fill-sky-300 font-mono text-xs font-semibold">
                {getRoomMetrics("bathroom").activePower} W active
              </text>
            </g>

            {/* 5. GARAGE (Lower Floor/Annex - represented by bottom boundary) */}
            <g 
              onClick={() => setSelectedRoomId("garage")}
              className="cursor-pointer group transition-all duration-300"
            >
              <rect 
                x="350" y="225" width="200" height="175" 
                rx="12"
                fill={selectedRoomId === "garage" ? "url(#forest-glow)" : "rgba(15, 23, 42, 0.4)"}
                stroke={selectedRoomId === "garage" ? "#10b981" : "#1e293b"}
                strokeWidth={selectedRoomId === "garage" ? "2.5" : "1.5"}
                className="group-hover:stroke-emerald-400/80 transition-all"
              />
              {getRoomMetrics("garage").activePower > 0 && (
                <rect 
                  x="360" y="235" width="180" height="155" rx="8"
                  fill="url(#active-pulse-grad)" className="opacity-40 animate-pulse pointer-events-none"
                />
              )}
              <text x="450" y="295" textAnchor="middle" className="fill-amber-100 font-sans font-medium text-sm">Garage</text>
              <text x="450" y="325" textAnchor="middle" className="fill-sky-300 font-mono text-xs font-semibold">
                {getRoomMetrics("garage").activePower} W active
              </text>
              <text x="450" y="350" textAnchor="middle" className="fill-emerald-400 font-mono text-[10px]">
                {getRoomMetrics("garage").activeCount}/{getRoomMetrics("garage").totalCount} Devices On
              </text>
            </g>

          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-[11px] font-mono text-sky-200/60 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/10">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500 rounded" /> Click to Inspect</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500/40 rounded-full animate-ping" /> Glowing = Energy Flowing</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-dashed border-t border-dashed border-emerald-400/50" /> Grid Channels</span>
        </div>
      </div>

      {/* RIGHT: Detailed Room Energy Diagnostics Panel */}
      <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950/40 to-slate-950/60 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative">
        <AnimatePresence mode="wait">
          {selectedRoom && selectedMetrics ? (
            <motion.div
              key={selectedRoom.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Header with Icon & Name */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
                    {getRoomIcon(selectedRoom.id)}
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xl text-emerald-100">{selectedRoom.name}</h3>
                    <p className="text-xs text-emerald-300/70 italic">{selectedRoom.description}</p>
                  </div>
                </div>
                
                {/* Active Indicator Badge */}
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                  selectedMetrics.activePower > 0 
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse" 
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}>
                  {selectedMetrics.activePower > 0 ? "FLOWING" : "IDLE"}
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-950/35 border border-emerald-500/10 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60 block">Live Power draw</span>
                  <span className="text-2xl font-mono font-bold text-sky-300 mt-1 block">{selectedMetrics.activePower} <span className="text-sm font-sans font-light">W</span></span>
                </div>
                
                <div className="bg-emerald-950/35 border border-emerald-500/10 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60 block">CO₂ Carbon impact</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">
                    {selectedMetrics.carbonImpact} <span className="text-sm font-sans font-light">kg</span>
                  </span>
                </div>

                <div className="bg-emerald-950/35 border border-emerald-500/10 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60 block">Daily projection</span>
                  <span className="text-xl font-mono font-semibold text-emerald-100 mt-1 block">
                    {selectedMetrics.totalDailyKwh.toFixed(2)} <span className="text-xs font-sans font-light text-sky-200/70">kWh</span>
                  </span>
                </div>

                <div className="bg-emerald-950/35 border border-emerald-500/10 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60 block">Efficacy Score</span>
                  <span className={`text-xl font-mono font-bold mt-1 block ${
                    selectedMetrics.avgEfficiency >= 85 
                      ? "text-emerald-400" 
                      : selectedMetrics.avgEfficiency >= 70 
                      ? "text-amber-400" 
                      : "text-rose-400"
                  }`}>
                    {selectedMetrics.avgEfficiency}%
                  </span>
                </div>
              </div>

              {/* Devices in this Room list */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300/75">Active Room Circuit</h4>
                <div className="max-h-36 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-emerald-800">
                  {selectedRoomDevices.map((device) => (
                    <div 
                      key={device.id} 
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        device.status 
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-100" 
                          : "bg-slate-950/20 border-slate-900 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${device.status ? "bg-emerald-400 animate-pulse" : "bg-slate-700"}`} />
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span>{device.status ? `${device.powerUsage} W` : "OFF"}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-[10px] text-emerald-400 border border-emerald-500/20">
                          {device.efficiencyScore}% eco
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedRoomDevices.length === 0 && (
                    <p className="text-xs text-sky-200/55 italic text-center py-4">No smart appliances paired to this quadrant.</p>
                  )}
                </div>
              </div>

              {/* Room recommendations */}
              <div className="bg-sky-950/20 border border-sky-500/20 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-sky-400/10 pointer-events-none">
                  <Sparkles className="w-16 h-16" />
                </div>
                <h4 className="text-xs font-bold text-sky-300 flex items-center gap-1.5 mb-2 uppercase tracking-wide font-mono">
                  <Sparkles className="w-4 h-4" />
                  Earthy AI Spatial Insights
                </h4>
                <ul className="space-y-2">
                  {selectedRoom.suggestions.map((sug, idx) => (
                    <li key={idx} className="text-xs text-sky-100/90 leading-relaxed flex items-start gap-2">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-emerald-300/40">
              <Info className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-sm font-sans">Select any room on the floorplan map to load live energy flows & AI recommendations.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
