/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, ShieldCheck, Leaf, Compass, Target, BarChart, 
  Settings, Brain, Info, HelpCircle, Activity, Play, 
  Wind, MessageSquare, AlertTriangle, Sparkles, CheckCircle, Clock,
  Globe, Home, Moon
} from "lucide-react";

import { SmartDevice, Room, AIInsight, ApplianceHealth, SustainabilityGoal, EcoAchievement, EarthySettings } from "./types";
import SmartHomeMap from "./components/SmartHomeMap";
import ConnectedDevices from "./components/ConnectedDevices";
import AIInsightsPanel from "./components/AIInsightsPanel";
import EnergyAnalytics from "./components/EnergyAnalytics";
import ArchitectureDiagram from "./components/ArchitectureDiagram";
import AIChatAdvisor from "./components/AIChatAdvisor";
import GoalsAndAchievements from "./components/GoalsAndAchievements";
import SettingsPanel from "./components/SettingsPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'home' | 'plugs' | 'insights' | 'analytics' | 'goals' | 'architecture' | 'settings'>('dashboard');
  const [thermostatTemp, setThermostatTemp] = useState(23); // AC Temperature
  const [activePreset, setActivePreset] = useState<'custom' | 'eco' | 'performance' | 'sleep'>('custom');
  const [showFloatingChat, setShowFloatingChat] = useState(false);

  // ----------------------------------------------------
  // Initial Datasets
  // ----------------------------------------------------

  // 1. Devices
  const [devices, setDevices] = useState<SmartDevice[]>([
    { id: "dev_1", name: "Living Room AC", room: "living_room", powerUsage: 1150, dailyKwh: 4.6, monthlyKwh: 138, status: true, efficiencyScore: 88, type: "ac" },
    { id: "dev_2", name: "Inverter Refrigerator", room: "kitchen", powerUsage: 140, dailyKwh: 1.12, monthlyKwh: 33.6, status: true, efficiencyScore: 92, type: "refrigerator" },
    { id: "dev_3", name: "Smart OLED TV", room: "living_room", powerUsage: 90, dailyKwh: 0.36, monthlyKwh: 10.8, status: true, efficiencyScore: 89, type: "tv" },
    { id: "dev_4", name: "Developer Workstation", room: "bedroom", powerUsage: 120, dailyKwh: 0.48, monthlyKwh: 14.4, status: true, efficiencyScore: 94, type: "laptop" },
    { id: "dev_5", name: "Bedroom Ambient LED", room: "bedroom", powerUsage: 35, dailyKwh: 0.14, monthlyKwh: 4.2, status: true, efficiencyScore: 96, type: "lights" },
    { id: "dev_6", name: "Kitchen Ceiling Halo", room: "kitchen", powerUsage: 50, dailyKwh: 0.2, monthlyKwh: 6.0, status: false, efficiencyScore: 90, type: "lights" },
    { id: "dev_7", name: "Washing Machine", room: "garage", powerUsage: 620, dailyKwh: 1.24, monthlyKwh: 37.2, status: false, efficiencyScore: 78, type: "washing_machine" },
    { id: "dev_8", name: "Electric Water Heater", room: "bathroom", powerUsage: 2100, dailyKwh: 4.2, monthlyKwh: 126.0, status: true, efficiencyScore: 68, type: "water_heater" },
    { id: "dev_9", name: "Standing Cooling Fan", room: "bedroom", powerUsage: 45, dailyKwh: 0.18, monthlyKwh: 5.4, status: false, efficiencyScore: 90, type: "fan" }
  ]);

  // 2. Rooms
  const [rooms] = useState<Room[]>([
    { id: "kitchen", name: "Kitchen", description: "Culinary energy center with thermal demands", deviceIds: ["dev_2", "dev_6"], baseKwh: 2.2, carbonImpact: 12.4, suggestions: ["Maintaining refrigerator ventilation saves roughly $3.50/mo.", "Defrost the freezer periodically to ensure uninhibited heat exchanges."] },
    { id: "living_room", name: "Living Room", description: "Core entertainment & climate buffer area", deviceIds: ["dev_1", "dev_3"], baseKwh: 4.5, carbonImpact: 22.1, suggestions: ["AC inverter currents work 12% less when curtains are drawn.", "Put gaming console bricks on smart schedules to kill vampire draw."] },
    { id: "bedroom", name: "Bedroom", description: "Quiet personal quadrant and desk workstation", deviceIds: ["dev_4", "dev_5", "dev_9"], baseKwh: 1.1, carbonImpact: 5.8, suggestions: ["Schedule bedroom fans to toggle off automatically upon sunrise.", "Utilize natural daylight for workstations whenever possible."] },
    { id: "bathroom", name: "Bathroom", description: "Hydro-thermal zone with active water heating", deviceIds: ["dev_8"], baseKwh: 4.8, carbonImpact: 25.4, suggestions: ["Program the water heater to run only during morning shower intervals.", "Verify tank jacket elements are fully insulated."] },
    { id: "garage", name: "Garage", description: "Utility workspace, laundry, and charger hub", deviceIds: ["dev_7"], baseKwh: 2.0, carbonImpact: 10.2, suggestions: ["Run heavy laundry cycles during off-peak weekend windows.", "Set smart plug triggers to stop EV chargers when batteries peak."] }
  ]);

  // 3. AI Insights
  const [insights] = useState<AIInsight[]>([
    { id: "ins_1", title: "Active Standby Leak Detected", description: "Your Bedroom Workstation and Living Room console stack pull a persistent 18W phantom load while in standby.", whyItMatters: "Standby vampire loads make up 10% of standard home waste.", environmentalImpact: "Emits 4.8kg of needless CO₂ into the atmosphere each month.", suggestedAction: "Use Earthy's Standby Schedule to kill smart plug currents between 1:00 AM and 6:00 AM.", estimatedSavings: 3.20, category: "standby" },
    { id: "ins_2", title: "AC Thermal Efficiency Margin", description: "Increasing your active Living Room thermostat from 21°C to 23°C reduces the inverter compressor workload by 14%.", whyItMatters: "Every single degree lower on cooling adds roughly 8% to thermal costs.", environmentalImpact: "Reduces net home carbon output by 12.1kg CO₂.", suggestedAction: "Set the thermostat to the Climate Guard preset on humid days.", estimatedSavings: 11.50, category: "efficiency" },
    { id: "ins_3", title: "Water Heater Run-time Cycle", description: "Your bathroom water heater runs for 5.2 hours persistently, indicating thermal loss or long inactive hot periods.", whyItMatters: "Continuous standby heating wastes major amounts of electricity.", environmentalImpact: "Generates an extra 22kg CO₂ emissions per billing cycle.", suggestedAction: "Limit cycles to off-peak morning and evening routines.", estimatedSavings: 15.10, category: "savings" }
  ]);

  // 4. Appliance Health Logs
  const [healthLogs] = useState<ApplianceHealth[]>([
    { id: "hl_1", applianceName: "Inverter Refrigerator", issue: "Slightly prolonged cooling cycles. Condenser coils may have dust insulation.", severity: "low", recommendation: "Examine refrigerator ventilation and clean condenser coils. Ensures uninhibited thermal flow.", estimatedSavings: 2.10, detectedAt: "2026-07-15", status: "monitoring" },
    { id: "hl_2", applianceName: "Electric Water Heater", issue: "Abnormal heating element power surge during ignition cycles.", severity: "medium", recommendation: "Inspect tank elements for scale accumulation. Flashing scale blocks heating efficiency.", estimatedSavings: 6.80, detectedAt: "2026-07-16", status: "action_required" }
  ]);

  // 5. Goals
  const [goals, setGoals] = useState<SustainabilityGoal[]>([
    { id: "goal_1", title: "Stay below monthly budget", targetValue: 75, currentValue: 54, unit: "USD", category: "budget", daysLeft: 12, status: "active" },
    { id: "goal_2", title: "Lower home carbon footprint", targetValue: 160, currentValue: 112, unit: "kg CO2", category: "carbon", daysLeft: 18, status: "active" },
    { id: "goal_3", title: "Reduce standby vampire load", targetValue: 15, currentValue: 12, unit: "W", category: "standby", daysLeft: 25, status: "active" }
  ]);

  // 6. Achievements
  const [achievements] = useState<EcoAchievement[]>([
    { id: "ach_1", title: "Energy Saver", description: "Keep active household draw below 400W for 3 consecutive days.", iconName: "saver", unlocked: true, unlockedAt: "2026-07-12", progressMax: 3, progressCurrent: 3 },
    { id: "ach_2", title: "Carbon Hero", description: "Maintain a monthly carbon footprint below 120 kg CO₂.", iconName: "hero", unlocked: true, unlockedAt: "2026-07-14", progressMax: 1, progressCurrent: 1 },
    { id: "ach_3", title: "Smart Home", description: "Register 8 distinct smart energy plugs into Earthy Hub.", iconName: "home", unlocked: true, unlockedAt: "2026-07-17", progressMax: 8, progressCurrent: 8 },
    { id: "ach_4", title: "Eco Explorer", description: "Initiate 3 diagnostic AI Smart Audits.", iconName: "explorer", unlocked: false, progressMax: 3, progressCurrent: 2 },
    { id: "ach_5", title: "Green Champion", description: "Keep household budget under 50 USD for a full month.", iconName: "champion", unlocked: false, progressMax: 1, progressCurrent: 0 }
  ]);

  // 7. Settings State
  const [settings, setSettings] = useState<EarthySettings>({
    darkMode: true,
    notificationsEnabled: true,
    connectedDevicesCount: 9,
    energyUnit: "kWh",
    currency: "USD",
    regionalRate: 0.15, // $0.15 per kWh
    privacyConsent: true
  });

  // ----------------------------------------------------
  // Dynamic Calculation Engine
  // ----------------------------------------------------

  const stats = useMemo(() => {
    let activePower = 0;
    let totalDailyKwh = 0;
    let totalMonthlyKwh = 0;

    devices.forEach(d => {
      if (d.status) {
        // Adjust AC draw based on thermostat temp! (23°C is standard. -10% per °C higher, +10% per °C lower)
        let actualPower = d.powerUsage;
        if (d.type === 'ac') {
          const tempDiff = thermostatTemp - 23;
          actualPower = Math.round(d.powerUsage * (1 - tempDiff * 0.08));
        }
        
        activePower += actualPower;
        
        // Calculate daily/monthly kWh proportionally
        const ratio = actualPower / d.powerUsage;
        totalDailyKwh += d.dailyKwh * ratio;
        totalMonthlyKwh += d.monthlyKwh * ratio;
      } else {
        // Appliance standby pulls
        if (d.type === 'refrigerator') {
          activePower += 15; // idle cooling
          totalDailyKwh += 0.36;
          totalMonthlyKwh += 10.8;
        } else if (d.type === 'tv' || d.type === 'laptop') {
          activePower += 2; // vampire
          totalDailyKwh += 0.05;
          totalMonthlyKwh += 1.5;
        }
      }
    });

    // Cost calculations
    const dailyCost = totalDailyKwh * settings.regionalRate;
    const monthlyCost = totalMonthlyKwh * settings.regionalRate;
    const estimatedBill = monthlyCost * 1.05; // standard grid tax
    
    // Carbon Footprint: Roughly 0.385 kg CO2 per kWh
    const carbonFootprint = Math.round(totalMonthlyKwh * 0.385);
    
    // Base saved energy (simulated relative to standard baseline)
    const inactiveCount = devices.filter(d => !d.status).length;
    const energySavedKwh = inactiveCount * 1.45 + (thermostatTemp > 23 ? (thermostatTemp - 23) * 1.8 : 0) + 12.4;

    // AI Sustainability score calculations
    let score = 88;
    const acOn = devices.find(d => d.type === 'ac')?.status;
    if (acOn) {
      if (thermostatTemp < 22) score -= 12;
      else if (thermostatTemp > 24) score += 6;
    }
    const heavyLoads = devices.filter(d => d.status && (d.type === 'water_heater' || d.type === 'washing_machine')).length;
    score -= heavyLoads * 8;
    
    // Bonus for eco mode and general turned off states
    score += inactiveCount * 2;
    score = Math.max(45, Math.min(100, Math.round(score)));

    return {
      currentPower: activePower,
      dailyCost,
      monthlyCost,
      carbonFootprint,
      energySavedKwh,
      estimatedBill,
      aiSustainabilityScore: score
    };
  }, [devices, settings.regionalRate, thermostatTemp]);

  // ----------------------------------------------------
  // Interactive Functions
  // ----------------------------------------------------

  const handleToggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: !d.status } : d));
    setActivePreset('custom');
  };

  const handleModifyLoad = (id: string, power: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const ratio = power / d.powerUsage;
        return {
          ...d,
          powerUsage: power,
          dailyKwh: Math.round(d.dailyKwh * ratio * 100) / 100,
          monthlyKwh: Math.round(d.monthlyKwh * ratio * 10) / 10
        };
      }
      return d;
    }));
  };

  const handleAddDevice = (newDev: Omit<SmartDevice, 'id'>) => {
    const id = `dev_${devices.length + 1}`;
    setDevices(prev => [...prev, { ...newDev, id }]);
  };

  const handleUpdateSettings = (updater: Partial<EarthySettings>) => {
    setSettings(prev => ({ ...prev, ...updater }));
  };

  const handleAddGoal = (newGoal: Omit<SustainabilityGoal, 'id' | 'currentValue'>) => {
    const id = `goal_${goals.length + 1}`;
    setGoals(prev => [...prev, { ...newGoal, id, currentValue: 0 }]);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Map presets to devices states
  const applyPreset = (preset: typeof activePreset) => {
    setActivePreset(preset);
    if (preset === 'eco') {
      setThermostatTemp(25); // Eco Thermostat
      setDevices(prev => prev.map(d => {
        // Shut off water heater and washer, turn off lights
        if (d.type === 'water_heater' || d.type === 'washing_machine' || d.type === 'lights' || d.type === 'fan') {
          return { ...d, status: false };
        }
        return d;
      }));
    } else if (preset === 'performance') {
      setThermostatTemp(20); // Peak cooling
      setDevices(prev => prev.map(d => {
        if (d.type === 'water_heater' || d.type === 'refrigerator' || d.type === 'ac') {
          return { ...d, status: true };
        }
        return d;
      }));
    } else if (preset === 'sleep') {
      setThermostatTemp(26); // Warm sleep schedule
      setDevices(prev => prev.map(d => {
        if (d.type !== 'refrigerator' && d.type !== 'ac') {
          return { ...d, status: false }; // kill everything else
        }
        return d;
      }));
    }
  };

  const getCurrencySymbol = () => {
    if (settings.currency === 'EUR') return '€';
    if (settings.currency === 'GBP') return '£';
    return '$';
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-slate-950 text-emerald-100' : 'bg-slate-50 text-slate-900 white-mode'} flex flex-col font-sans relative overflow-hidden transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-200`}>
      
      {/* GLOBAL MOOD ATMOSPHERE: Flowing orbital sky background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/40 via-emerald-950/20 to-slate-950 pointer-events-none" />
      <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-slow-spin" />
      <div className="absolute -bottom-[40%] -right-[30%] w-[90%] h-[90%] rounded-full bg-sky-500/5 blur-[140px] pointer-events-none animate-reverse-slow-spin" />

      {/* HEADER BAR */}
      <header className="border-b border-emerald-500/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/65" id="earthy-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 p-0.5 flex items-center justify-center shadow-lg relative group">
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md group-hover:blur-lg transition-all" />
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-bold text-lg text-emerald-400">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <h1 className="font-sans font-bold text-xl tracking-tight text-emerald-500">Earthy</h1>
              </div>
              <p className="text-[10px] text-emerald-300/60 uppercase tracking-widest font-mono mt-0.5">your earthly impact</p>
            </div>
          </div>

          {/* Quick Metrics HUD */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            
            <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-sky-200/50 uppercase text-[9px] tracking-wider">LIVE DRAW:</span>
              <span className="font-bold text-sky-300 text-sm">{stats.currentPower} W</span>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
              <span className="text-sky-200/50 uppercase text-[9px] tracking-wider">MONTH CO₂:</span>
              <span className="font-bold text-emerald-300 text-sm">{stats.carbonFootprint} kg</span>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-inner">
              <span className="text-sky-200/50 uppercase text-[9px] tracking-wider">SUSTAINABILITY:</span>
              <span className={`font-bold text-sm ${
                stats.aiSustainabilityScore >= 80 ? "text-emerald-400" : stats.aiSustainabilityScore >= 65 ? "text-amber-400" : "text-rose-400"
              }`}>
                {stats.aiSustainabilityScore}/100
              </span>
            </div>

            {/* Quick Theme Toggle switch */}
            <button
              onClick={() => handleUpdateSettings({ darkMode: !settings.darkMode })}
              className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-400/35 hover:bg-emerald-500/25 rounded-xl flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-sans font-semibold transition-all shadow-md text-[11px]"
              title={settings.darkMode ? "Toggle White Mode" : "Toggle Dark Mode"}
            >
              {settings.darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8 relative z-10">
        
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2.5 border-b border-emerald-500/5 pb-4 overflow-x-auto scrollbar-thin" id="main-navigation">
          {[
            { id: 'dashboard', label: 'Earthy Orbit', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
            { id: 'home', label: 'Home Blueprint', icon: <Home className="w-4 h-4 text-emerald-400" /> },
            { id: 'plugs', label: 'Smart Plugs', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
            { id: 'insights', label: 'AI Insights', icon: <Brain className="w-4 h-4 text-emerald-400" /> },
            { id: 'analytics', label: 'Energy Curves', icon: <BarChart className="w-4 h-4 text-emerald-400" /> },
            { id: 'goals', label: 'Eco Milestones', icon: <Target className="w-4 h-4 text-emerald-400" /> },
            { id: 'architecture', label: 'System Flow', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
            { id: 'settings', label: 'Local Rates', icon: <Settings className="w-4 h-4 text-emerald-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium flex items-center gap-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 shadow-md shadow-emerald-950/20 font-semibold'
                  : 'bg-slate-900/40 border border-slate-900 text-sky-200/60 hover:border-slate-800 hover:text-sky-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* COMPONENT ROUTER CONTAINER */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: HOME ORBIT DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Orbit Globe */}
                <div className="lg:col-span-7 bg-gradient-to-b from-emerald-950/25 to-slate-950/40 border border-emerald-500/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between h-[480px]">
                  
                  {/* Rotating Globe Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-sky-500/20 flex items-center justify-center animate-slow-spin pointer-events-none">
                    <div className="w-72 h-72 rounded-full border border-emerald-500/20 flex items-center justify-center animate-reverse-slow-spin">
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-900/30 via-slate-900/50 to-sky-900/30 border border-emerald-500/40 opacity-70 filter blur-xs animate-earth-glow" />
                    </div>
                  </div>

                  {/* Absolute atmospheric indicators inside the globe */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-center pointer-events-none p-6">
                    <Globe className="w-16 h-16 text-emerald-400/80 filter drop-shadow-md mb-2 animate-pulse" style={{ animationDuration: '3s' }} />
                    <h4 className="font-sans font-bold text-lg text-emerald-300">Net Carbon Flow Stable</h4>
                    <p className="text-[10px] text-sky-200/50 font-mono mt-1">Grid footprint synchronized with orbital standards</p>
                  </div>

                  {/* Top content */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 block font-semibold">Active Orbital Telemetry</span>
                      <h3 className="font-sans font-bold text-2xl text-emerald-100 mt-1">Earthy Digital Space Orbit</h3>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] font-mono text-emerald-300 animate-pulse flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400 inline" /> PROTECTING PLANET
                    </div>
                  </div>

                  {/* Bottom content: snapshot card */}
                  <div className="relative z-10 bg-slate-950/70 border border-slate-900 rounded-2xl p-4 grid grid-cols-3 gap-4 backdrop-blur-lg">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider font-mono text-sky-200/50 block">Monthly Proj.</span>
                      <span className="text-lg font-mono font-bold text-sky-300 block mt-0.5">{getCurrencySymbol()}{stats.monthlyCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider font-mono text-sky-200/50 block">Annual Tax Est.</span>
                      <span className="text-lg font-mono font-bold text-emerald-300 block mt-0.5">{getCurrencySymbol()}{stats.estimatedBill.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider font-mono text-sky-200/50 block">Bio equivalent</span>
                      <span className="text-lg font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400 inline" />
                        {Math.round(stats.energySavedKwh * 0.1)} Trees
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Quick Controls */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Preset triggers */}
                  <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
                    <div>
                      <h4 className="font-sans font-semibold text-base text-emerald-100 flex items-center gap-1.5">
                        <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
                        Home energy Presets
                      </h4>
                      <p className="text-xs text-sky-200/60 mt-0.5">Toggles dynamic state changes across active smart plugs</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => applyPreset('eco')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          activePreset === 'eco' 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-inner' 
                            : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
                        }`}
                      >
                        <Leaf className="w-5 h-5 text-emerald-400 block" />
                        <span className="text-xs font-semibold block mt-1.5">Eco Guard</span>
                        <span className="text-[9px] text-sky-200/40 block mt-0.5">Saves ~24%</span>
                      </button>

                      <button
                        onClick={() => applyPreset('performance')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          activePreset === 'performance' 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-inner' 
                            : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
                        }`}
                      >
                        <Zap className="w-5 h-5 text-amber-400 block" />
                        <span className="text-xs font-semibold block mt-1.5">Peak Performance</span>
                        <span className="text-[9px] text-sky-200/40 block mt-0.5">Max currents</span>
                      </button>

                      <button
                        onClick={() => applyPreset('sleep')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          activePreset === 'sleep' 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-inner' 
                            : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
                        }`}
                      >
                        <Moon className="w-5 h-5 text-sky-400 block" />
                        <span className="text-xs font-semibold block mt-1.5">Sleep Sentry</span>
                        <span className="text-[9px] text-sky-200/40 block mt-0.5">Standby off</span>
                      </button>
                    </div>
                  </div>

                  {/* Active thermostat */}
                  <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans font-semibold text-base text-emerald-100 flex items-center gap-1.5">
                          <Wind className="w-5 h-5 text-sky-400" />
                          Climate Guard thermostat
                        </h4>
                        <p className="text-xs text-sky-200/60 mt-0.5">Governs Living Room AC compression rates</p>
                      </div>
                      <span className="text-2xl font-mono font-bold text-sky-300">{thermostatTemp}°C</span>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="range"
                        min="18"
                        max="28"
                        value={thermostatTemp}
                        onChange={(e) => {
                          setThermostatTemp(parseInt(e.target.value));
                          setActivePreset('custom');
                        }}
                        className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-sky-200/30">
                        <span>Max cooling (18°C)</span>
                        <span>Eco thermal (28°C)</span>
                      </div>
                    </div>

                    {thermostatTemp >= 24 && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl text-[10px] text-emerald-400 font-mono flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Optimal eco-thermostat temperature (saving ~16% AC draw)
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            )}

            {/* VIEW 2: SMART HOME OVERVIEW FLOORPLAN */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SmartHomeMap devices={devices} rooms={rooms} />
              </motion.div>
            )}

            {/* VIEW 3: CONNECTED DEVICES */}
            {activeTab === 'plugs' && (
              <motion.div
                key="plugs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConnectedDevices 
                  devices={devices} 
                  onToggleDevice={handleToggleDevice} 
                  onModifyLoad={handleModifyLoad}
                  onAddDevice={handleAddDevice}
                />
              </motion.div>
            )}

            {/* VIEW 4: AI INSIGHTS & AUDITS */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AIInsightsPanel 
                  insights={insights} 
                  healthLogs={healthLogs} 
                  devices={devices}
                  regionalRate={settings.regionalRate}
                  currency={settings.currency}
                />
              </motion.div>
            )}

            {/* VIEW 5: ENERGY ANALYTICS CURVES */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EnergyAnalytics stats={stats} currency={settings.currency} />
              </motion.div>
            )}

            {/* VIEW 6: GOALS & BADGES */}
            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GoalsAndAchievements 
                  goals={goals} 
                  achievements={achievements} 
                  onAddGoal={handleAddGoal}
                  onRemoveGoal={handleRemoveGoal}
                />
              </motion.div>
            )}

            {/* VIEW 7: ARCHITECTURE DIAGRAM */}
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ArchitectureDiagram />
              </motion.div>
            )}

            {/* VIEW 8: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SettingsPanel 
                  settings={settings} 
                  onUpdateSettings={handleUpdateSettings} 
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* FLOATING CONVERSATIONAL AI TRIGGER BUBBLE */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFloatingChat(!showFloatingChat)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 flex items-center justify-center text-white shadow-2xl filter drop-shadow-[0_0_12px_rgba(52,211,153,0.4)] hover:scale-105 transition-all relative group"
          id="floating-chat-trigger"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md group-hover:blur-lg" />
          <MessageSquare className="w-6 h-6 text-slate-950 relative z-10" />
        </button>
      </div>

      {/* SLIDE OUT CONVERSATIONAL CHAT ADVISOR */}
      <AnimatePresence>
        {showFloatingChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md px-4 sm:px-0"
          >
            <AIChatAdvisor 
              devices={devices} 
              onClose={() => setShowFloatingChat(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-emerald-500/5 py-8 mt-12 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-sky-200/40">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '10s' }} />
            Earthy Home microgrid Core v1.2.0
          </span>
          <span>© 2026 Earthy. Protecting our living planet.</span>
        </div>
      </footer>

    </div>
  );
}
