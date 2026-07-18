/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Settings, Bell, DollarSign, Activity, Lock, 
  ShieldCheck, Info, Compass, Globe, Sliders
} from "lucide-react";
import { EarthySettings } from "../types";

interface SettingsPanelProps {
  settings: EarthySettings;
  onUpdateSettings: (updater: Partial<EarthySettings>) => void;
}

export default function SettingsPanel({ settings, onUpdateSettings }: SettingsPanelProps) {
  return (
    <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl" id="settings-panel">
      
      {/* Header */}
      <div className="border-b border-emerald-500/10 pb-5 mb-6">
        <h3 className="font-sans font-semibold text-xl text-emerald-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          Earthy Regional Settings
        </h3>
        <p className="text-xs text-sky-200/60 mt-0.5">Customize currency formats, regulatory utility rate curves, and telemetry rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Localities & Currency */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300">Utility Settings & Units</h4>
          </div>

          {/* Currency selection */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">Regional Currency</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Select your local billing currency</span>
              </div>
              <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs font-mono">
                {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => onUpdateSettings({ currency: curr })}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      settings.currency === curr 
                        ? 'bg-emerald-500/25 text-emerald-300 font-semibold' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '£'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Energy metrics units */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">Energy Metrics Unit</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Define your measurement standard</span>
              </div>
              <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs font-mono">
                {(['kWh', 'MJ'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => onUpdateSettings({ energyUnit: unit })}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      settings.energyUnit === unit 
                        ? 'bg-emerald-500/25 text-emerald-300 font-semibold' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Rate Slider */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">Electricity Rate per kWh</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Regulated provider charge rate</span>
              </div>
              <span className="text-sm font-mono font-bold text-sky-300">
                {settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '£'}
                {settings.regionalRate.toFixed(2)}<span className="text-[10px] text-slate-500 font-normal">/kWh</span>
              </span>
            </div>
            
            <input 
              type="range"
              min="0.05"
              max="0.45"
              step="0.01"
              value={settings.regionalRate}
              onChange={(e) => onUpdateSettings({ regionalRate: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1 bg-emerald-950 rounded-lg"
            />
            
            <div className="flex justify-between text-[8px] font-mono text-sky-200/30">
              <span>Eco Off-Peak ($0.05)</span>
              <span>Crisis Peak ($0.45)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Notifications & Privacy */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300">Privacy & Theme Settings</h4>
          </div>

          {/* Theme Selector */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">White Mode Theme</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Toggle light backgrounds for high daylight contrast</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative ${
                  !settings.darkMode ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  !settings.darkMode ? "translate-x-5 bg-white" : "translate-x-0 bg-slate-950"
                }`} />
              </button>
            </div>
          </div>

          {/* Alert Toggles */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">Smart Leak Notifications</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Alert if standby devices run indefinitely</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative ${
                  settings.notificationsEnabled ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                  settings.notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-semibold text-emerald-100 block">Anonymized Eco telemetry share</label>
                <span className="text-[10px] text-sky-200/50 block font-mono mt-0.5">Contribute micro-logs to global stats</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ privacyConsent: !settings.privacyConsent })}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none relative ${
                  settings.privacyConsent ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                  settings.privacyConsent ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>

          {/* Data security banner */}
          <div className="p-4 bg-sky-950/20 border border-sky-500/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-sky-200/60 font-sans">
              <span className="font-semibold text-emerald-300 block">Earthy Security Assurance</span>
              Earthy uses AES-256 local edge database encryption keys. None of your real-time room currents or spatial device details can ever be viewed or shared without your explicit consent.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
