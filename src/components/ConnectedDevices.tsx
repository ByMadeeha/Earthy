/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Tv, Wind, Lightbulb, Laptop, Power, ShieldCheck, 
  RotateCw, Plus, Check, Settings, Trash2, Sliders, Play, TrendingUp,
  Snowflake, Flame
} from "lucide-react";
import { SmartDevice } from "../types";

interface ConnectedDevicesProps {
  devices: SmartDevice[];
  onToggleDevice: (id: string) => void;
  onModifyLoad: (id: string, power: number) => void;
  onAddDevice?: (newDevice: Omit<SmartDevice, 'id'>) => void;
}

export default function ConnectedDevices({ devices, onToggleDevice, onModifyLoad, onAddDevice }: ConnectedDevicesProps) {
  const [filter, setFilter] = useState<'all' | 'on' | 'off'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newDevName, setNewDevName] = useState("");
  const [newDevRoom, setNewDevRoom] = useState("kitchen");
  const [newDevType, setNewDevType] = useState<SmartDevice['type']>("other");
  const [newDevPower, setNewDevPower] = useState(150);

  const getDeviceIcon = (type: SmartDevice['type'], status: boolean) => {
    const activeColor = status ? "text-emerald-400" : "text-slate-500";
    switch (type) {
      case 'refrigerator': return <Snowflake className={`w-5 h-5 ${activeColor}`} />;
      case 'ac': return <Wind className={`w-5 h-5 ${activeColor}`} />;
      case 'tv': return <Tv className={`w-5 h-5 ${activeColor}`} />;
      case 'laptop': return <Laptop className={`w-5 h-5 ${activeColor}`} />;
      case 'lights': return <Lightbulb className={`w-5 h-5 ${activeColor}`} />;
      case 'washing_machine': return <RotateCw className={`w-5 h-5 ${activeColor} ${status ? 'animate-spin' : ''}`} style={{ animationDuration: status ? '3s' : '0s' }} />;
      case 'water_heater': return <Flame className={`w-5 h-5 ${activeColor}`} />;
      case 'fan': return <Wind className={`w-5 h-5 ${activeColor} animate-spin`} style={{ animationDuration: status ? '3s' : '0s' }} />;
      default: return <Power className={`w-5 h-5 ${activeColor}`} />;
    }
  };

  const filteredDevices = devices.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'on') return d.status;
    return !d.status;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;

    if (onAddDevice) {
      onAddDevice({
        name: newDevName,
        room: newDevRoom,
        type: newDevType,
        powerUsage: newDevPower,
        dailyKwh: Math.round((newDevPower * 6 / 1000) * 100) / 100, // assume 6h active/day average
        monthlyKwh: Math.round((newDevPower * 6 * 30 / 1000) * 10) / 10,
        status: true,
        efficiencyScore: 85
      });
    }

    setNewDevName("");
    setIsAdding(false);
  };

  return (
    <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl" id="connected-devices-panel">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5 mb-6">
        <div>
          <h3 className="font-sans font-semibold text-xl text-emerald-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected Devices
          </h3>
          <p className="text-xs text-sky-200/60 mt-0.5">Control live Smart Plug states and regulate microgrids</p>
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex bg-emerald-950/40 border border-emerald-500/15 p-1 rounded-xl">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${filter === 'all' ? 'bg-emerald-500/25 text-emerald-300 font-medium' : 'text-sky-200/50 hover:text-sky-200'}`}
            >
              All ({devices.length})
            </button>
            <button 
              onClick={() => setFilter('on')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${filter === 'on' ? 'bg-emerald-500/25 text-emerald-300 font-medium' : 'text-sky-200/50 hover:text-sky-200'}`}
            >
              On ({devices.filter(d => d.status).length})
            </button>
            <button 
              onClick={() => setFilter('off')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${filter === 'off' ? 'bg-emerald-500/25 text-emerald-300 font-medium' : 'text-sky-200/50 hover:text-sky-200'}`}
            >
              Off ({devices.filter(d => !d.status).length})
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 hover:text-emerald-200 rounded-xl text-xs font-medium font-sans transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Plug
          </button>
        </div>
      </div>

      {/* Add Device Pop-down Form */}
      {isAdding && (
        <motion.form
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          onSubmit={handleAddSubmit}
          className="bg-emerald-950/20 border border-emerald-400/20 rounded-2xl p-4 mb-6 overflow-hidden space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block mb-1">Device Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dyson Air Purifier" 
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block mb-1">Room Placement</label>
              <select 
                value={newDevRoom}
                onChange={(e) => setNewDevRoom(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
              >
                <option value="kitchen">Kitchen</option>
                <option value="living_room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="bathroom">Bathroom</option>
                <option value="garage">Garage</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block mb-1">Appliance Type</label>
              <select 
                value={newDevType}
                onChange={(e) => setNewDevType(e.target.value as SmartDevice['type'])}
                className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
              >
                <option value="lights">Lighting</option>
                <option value="ac">Air Conditioner</option>
                <option value="tv">Television</option>
                <option value="laptop">Workstation/Laptop</option>
                <option value="fan">Fan</option>
                <option value="refrigerator">Refrigerator</option>
                <option value="washing_machine">Washing Machine</option>
                <option value="water_heater">Water Heater</option>
                <option value="other">General Smart Plug</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block mb-1">Active Draw (Watts)</label>
              <input 
                type="number" 
                value={newDevPower}
                onChange={(e) => setNewDevPower(Math.max(1, parseInt(e.target.value) || 10))}
                className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-xl text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-xl text-xs transition-all"
            >
              Deploy Device
            </button>
          </div>
        </motion.form>
      )}

      {/* Device Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredDevices.map((device) => {
          return (
            <motion.div
              layout
              key={device.id}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
                device.status 
                  ? "bg-gradient-to-br from-emerald-950/30 to-slate-950/50 border-emerald-500/25 hover:border-emerald-400/40 shadow-emerald-950/10 shadow-lg" 
                  : "bg-slate-950/25 border-slate-900 hover:border-slate-800"
              }`}
            >
              {/* Status glowing bubble behind card */}
              {device.status && (
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-400/5 blur-xl pointer-events-none group-hover:bg-emerald-400/10 transition-all duration-300" />
              )}

              <div className="space-y-4">
                {/* Header with Icon, Name, and Room */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      device.status 
                        ? "bg-emerald-500/10 border-emerald-400/30" 
                        : "bg-slate-900/60 border-slate-800"
                    }`}>
                      {getDeviceIcon(device.type, device.status)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-100 group-hover:text-emerald-300 transition-colors">{device.name}</h4>
                      <span className="text-[9px] uppercase tracking-wider font-mono text-sky-200/50">{device.room.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* On/Off Switch */}
                  <button
                    onClick={() => onToggleDevice(device.id)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative ${
                      device.status ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform flex items-center justify-center ${
                      device.status ? "translate-x-5" : "translate-x-0"
                    }`}>
                      <Power className={`w-3 h-3 ${device.status ? "text-emerald-400" : "text-slate-500"}`} />
                    </div>
                  </button>
                </div>

                {/* Live power display slider and stats */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-sky-200/50 font-mono">Real-time Draw</span>
                    <span className={`text-base font-mono font-semibold ${device.status ? 'text-sky-300' : 'text-slate-500'}`}>
                      {device.status ? `${device.powerUsage} W` : "Inactive"}
                    </span>
                  </div>

                  {device.status && (
                    <div className="space-y-1">
                      <input 
                        type="range" 
                        min={Math.max(5, Math.round(device.powerUsage * 0.3))} 
                        max={Math.round(device.powerUsage * 1.8)}
                        value={device.powerUsage} 
                        onChange={(e) => onModifyLoad(device.id, parseInt(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer h-1 rounded-lg bg-emerald-950"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-sky-200/30">
                        <span>Eco Mode</span>
                        <span>Performance</span>
                      </div>
                    </div>
                  )}

                  {/* Stats columns */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-900/40 pt-2 text-[10px] font-mono">
                    <div>
                      <span className="text-sky-200/30 block">Daily</span>
                      <span className={`font-semibold ${device.status ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {device.dailyKwh.toFixed(2)} kWh
                      </span>
                    </div>
                    <div>
                      <span className="text-sky-200/30 block">Eco Rating</span>
                      <span className={`font-bold ${
                        device.efficiencyScore >= 85 
                          ? 'text-emerald-400' 
                          : device.efficiencyScore >= 70 
                          ? 'text-amber-400' 
                          : 'text-rose-400'
                      }`}>
                        {device.efficiencyScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco Badge Indicator */}
              {device.status && device.efficiencyScore >= 90 && (
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-2 py-1 flex items-center gap-1 text-[9px] text-emerald-400 font-mono self-start">
                  <ShieldCheck className="w-3 h-3" />
                  Optimal Carbon Flow
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredDevices.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-slate-900/10 rounded-2xl border border-dashed border-slate-900">
            <Power className="w-8 h-8 mb-2 stroke-1" />
            <p className="text-xs font-sans">No matching smart devices found in this filter state.</p>
          </div>
        )}
      </div>

    </div>
  );
}
