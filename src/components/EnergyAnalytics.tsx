/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  BarChart, Leaf, TrendingDown, DollarSign, Activity, 
  Lightbulb, ShieldCheck, Car, HelpCircle, Trees, Info, Calendar
} from "lucide-react";
import { HouseStats } from "../types";

interface EnergyAnalyticsProps {
  stats: HouseStats;
  currency: string;
}

export default function EnergyAnalytics({ stats, currency }: EnergyAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [metric, setMetric] = useState<'energy' | 'carbon' | 'cost' | 'efficiency'>('energy');

  const getCurrencySymbol = () => {
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    return '$';
  };

  // Curved Graph Datasets
  const datasets = {
    daily: {
      labels: ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "11 PM"],
      energy: [0.4, 0.2, 1.5, 0.8, 1.2, 2.8, 1.1], // kWh
      carbon: [0.15, 0.08, 0.58, 0.31, 0.46, 1.08, 0.42], // kg CO2
      cost: [0.06, 0.03, 0.22, 0.12, 0.18, 0.42, 0.16], // Currency
      efficiency: [94, 98, 82, 89, 87, 72, 88] // %
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      energy: [14.2, 12.8, 15.5, 11.2, 16.8, 18.2, 13.1],
      carbon: [5.4, 4.9, 5.9, 4.3, 6.4, 7.0, 5.0],
      cost: [2.13, 1.92, 2.32, 1.68, 2.52, 2.73, 1.96],
      efficiency: [86, 88, 84, 91, 82, 78, 89]
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      energy: [102.5, 96.2, 114.8, 88.4],
      carbon: [39.4, 37.0, 44.2, 34.0],
      cost: [15.37, 14.43, 17.22, 13.26],
      efficiency: [84, 86, 81, 91]
    },
    yearly: {
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      energy: [420, 395, 310, 480, 350, 410],
      carbon: [161.7, 152.0, 119.3, 184.8, 134.7, 157.8],
      cost: [63.0, 59.2, 46.5, 72.0, 52.5, 61.5],
      efficiency: [81, 83, 89, 78, 87, 83]
    }
  };

  const activeData = datasets[timeframe];
  const points = activeData[metric];
  const labels = activeData.labels;

  // Max value for scaling
  const maxVal = Math.max(...points) * 1.15;

  // Render SVG smooth curved cubic-bezier line path
  const buildSvgPath = (dataPoints: number[], width: number, height: number) => {
    if (dataPoints.length === 0) {
      return { strokePath: "", fillPath: "", coords: [] };
    }
    const paddingX = 50;
    const paddingY = 40;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;
    
    const stepX = chartW / (dataPoints.length - 1);
    
    // Map points to SVG coordinates
    const coordinates = dataPoints.map((val, idx) => {
      const x = paddingX + idx * stepX;
      const y = height - paddingY - (val / maxVal) * chartH;
      return { x, y };
    });

    let d = `M ${coordinates[0].x} ${coordinates[0].y}`;
    
    // Draw smooth cubic splines
    for (let i = 0; i < coordinates.length - 1; i++) {
      const curr = coordinates[i];
      const next = coordinates[i + 1];
      const cpX1 = curr.x + stepX / 2;
      const cpY1 = curr.y;
      const cpX2 = next.x - stepX / 2;
      const cpY2 = next.y;
      
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    return {
      strokePath: d,
      fillPath: `${d} L ${coordinates[coordinates.length - 1].x} ${height - paddingY} L ${coordinates[0].x} ${height - paddingY} Z`,
      coords: coordinates
    };
  };

  const width = 800;
  const height = 300;
  const { strokePath, fillPath, coords } = buildSvgPath(points, width, height);

  // Translate active stats into understandable environmental infographics
  const calculateEcoFootprint = () => {
    // Standard conversion factors
    const monthlyKwh = stats.monthlyCost / 0.15 || 240;
    const treesEquivalent = Math.round(monthlyKwh * 0.385 * 0.05); // trees planted equivalent
    const drivingKm = Math.round(monthlyKwh * 0.385 * 2.5); // km driving avoided
    const ledBulbs = Math.round(monthlyKwh / 3); // LED bulbs powered for a year
    const co2Reduced = Math.round(stats.energySavedKwh * 0.385); // CO2 reduced in kg

    return {
      trees: Math.max(1, treesEquivalent),
      driving: Math.max(10, drivingKm),
      bulbs: Math.max(5, ledBulbs),
      co2: Math.max(1, co2Reduced)
    };
  };

  const eco = calculateEcoFootprint();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="energy-analytics-section">
      
      {/* LEFT: Curve Chart Section */}
      <div className="xl:col-span-8 bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-emerald-500/10 pb-5">
            <div>
              <h3 className="font-sans font-semibold text-xl text-emerald-100 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-400" />
                Micro-Flow Energy Analytics
              </h3>
              <p className="text-xs text-sky-200/60 mt-0.5">Flowing vector curves showing electrical cycles</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-emerald-950/40 border border-emerald-500/15 p-1 rounded-xl self-start sm:self-auto font-mono text-xs">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all ${
                    timeframe === t 
                      ? 'bg-emerald-500/25 text-emerald-300 font-medium' 
                      : 'text-sky-200/50 hover:text-sky-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setMetric('energy')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                metric === 'energy' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-inner' 
                  : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-mono block text-emerald-400/70 mb-1">Energy Saved</span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Active Power
              </span>
            </button>

            <button
              onClick={() => setMetric('carbon')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                metric === 'carbon' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-inner' 
                  : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-mono block text-emerald-400/70 mb-1">CO₂ footprint</span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Carbon Mass
              </span>
            </button>

            <button
              onClick={() => setMetric('cost')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                metric === 'cost' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-inner' 
                  : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-mono block text-emerald-400/70 mb-1">Net cost</span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Electricity Bill
              </span>
            </button>

            <button
              onClick={() => setMetric('efficiency')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                metric === 'efficiency' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-inner' 
                  : 'bg-slate-900/20 border-slate-900 text-sky-200/50 hover:border-slate-800'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-mono block text-emerald-400/70 mb-1">Grid Rating</span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Eco Efficiency
              </span>
            </button>
          </div>

          {/* Flowing Curved Line Chart (Responsive Vector) */}
          <div className="relative aspect-[8/3] w-full bg-slate-950/40 rounded-2xl border border-slate-900 p-4 overflow-hidden">
            
            {/* Chart Atmosphere Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" id="curved-chart-svg">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 40 + ratio * 220;
                return (
                  <line 
                    key={idx} 
                    x1="45" y1={y} x2="755" y2={y} 
                    stroke="rgba(16, 185, 129, 0.05)" 
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Shaded Area under spline */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                d={fillPath} 
                fill="url(#chart-grad)"
              />

              {/* Curved Stroke Line */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                d={strokePath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Glowing Interactive Data Points */}
              {coords.map((coord, idx) => {
                const isPeak = points[idx] === Math.max(...points);
                return (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={coord.x} 
                      cy={coord.y} 
                      r={isPeak ? "6" : "4.5"} 
                      fill={isPeak ? "#38bdf8" : "#10b981"} 
                      className="filter drop-shadow-[0_0_4px_rgba(16,185,129,0.8)] hover:scale-125 transition-transform"
                    />
                    <circle 
                      cx={coord.x} 
                      cy={coord.y} 
                      r="12" 
                      fill="transparent" 
                      className="hover:fill-emerald-500/10 transition-colors"
                    />
                    
                    {/* Tooltip on hover */}
                    <text 
                      x={coord.x} 
                      y={coord.y - 12} 
                      textAnchor="middle" 
                      className="fill-emerald-300 font-mono text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {metric === 'cost' ? getCurrencySymbol() : ''}
                      {points[idx]}
                      {metric === 'energy' ? ' kWh' : metric === 'carbon' ? ' kg' : metric === 'efficiency' ? '%' : ''}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {coords.map((coord, idx) => (
                <text 
                  key={idx}
                  x={coord.x} 
                  y={height - 12} 
                  textAnchor="middle" 
                  className="fill-sky-200/40 font-mono text-[9px]"
                >
                  {labels[idx]}
                </text>
              ))}

              {/* Y Axis Max */}
              <text 
                x="35" 
                y="45" 
                textAnchor="end" 
                className="fill-sky-200/30 font-mono text-[8px]"
              >
                Peak
              </text>
              <text 
                x="35" 
                y={height - 40} 
                textAnchor="end" 
                className="fill-sky-200/30 font-mono text-[8px]"
              >
                Min
              </text>

            </svg>
          </div>
        </div>

        {/* Informative advice footer */}
        <div className="flex gap-3 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-2xl text-[11px] leading-relaxed text-emerald-300/80 mt-5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Your current microgrid currents show that electricity spikes are concentrated heavily during off-peak windows. This reduces overall structural strain on your local grid distribution and decreases average CO2 output by 14%.
          </p>
        </div>
      </div>

      {/* RIGHT: Carbon Footprint Infographics */}
      <div className="xl:col-span-4 bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="border-b border-emerald-500/10 pb-5 mb-5">
            <h3 className="font-sans font-semibold text-lg text-emerald-100 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Living Footprint Translator
            </h3>
            <p className="text-xs text-sky-200/60 mt-0.5">Translating raw electricity into environmental vitalities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            
            {/* Infographic 1: Trees Planted */}
            <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/10 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="absolute -right-6 -bottom-6 text-emerald-400/5 pointer-events-none group-hover:scale-110 transition-transform">
                <Trees className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                <Trees className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60">Equivalent Forest Flow</span>
                <span className="text-xl font-mono font-bold text-emerald-200 block mt-0.5">{eco.trees} Pine Trees</span>
                <span className="text-[10px] text-sky-200/50 block">carbon absorption capacity matched</span>
              </div>
            </div>

            {/* Infographic 2: Kilometers driving avoided */}
            <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/10 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="absolute -right-6 -bottom-6 text-emerald-400/5 pointer-events-none group-hover:scale-110 transition-transform">
                <Car className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60">Carbon-Avoided Transit</span>
                <span className="text-xl font-mono font-bold text-sky-300 block mt-0.5">{eco.driving} km Driving</span>
                <span className="text-[10px] text-sky-200/50 block">equivalent gasoline combustion saved</span>
              </div>
            </div>

            {/* Infographic 3: LED bulbs powered */}
            <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/10 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="absolute -right-6 -bottom-6 text-emerald-400/5 pointer-events-none group-hover:scale-110 transition-transform">
                <Lightbulb className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60">Eco-Illumination Saved</span>
                <span className="text-xl font-mono font-bold text-emerald-200 block mt-0.5">{eco.bulbs} LED Bulbs</span>
                <span className="text-[10px] text-sky-200/50 block">powered continuously for a full month</span>
              </div>
            </div>

            {/* Infographic 4: CO2 emissions reduced */}
            <div className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/10 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="absolute -right-6 -bottom-6 text-emerald-400/5 pointer-events-none group-hover:scale-110 transition-transform">
                <Leaf className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/60">Net Atmospheric CO₂ Avoided</span>
                <span className="text-xl font-mono font-bold text-emerald-100 block mt-0.5">{eco.co2} kg CO₂</span>
                <span className="text-[10px] text-sky-200/50 block">kept completely out of the atmosphere</span>
              </div>
            </div>

          </div>
        </div>

        {/* Global movement message */}
        <div className="p-4 bg-gradient-to-br from-emerald-950/30 to-sky-950/30 border border-emerald-500/15 rounded-2xl text-[10px] leading-relaxed text-sky-200/70 text-center mt-6">
          <span className="font-bold text-emerald-300 flex items-center justify-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> GLOBAL IMPACT</span>
          <p className="mt-1 font-sans">
            By keeping standby loads low, you belong to the top 8% of energy-saving smart homes in your region this month. Every watt counts.
          </p>
        </div>
      </div>

    </div>
  );
}
