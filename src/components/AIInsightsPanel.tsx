/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ShieldAlert, CheckCircle, Brain, RefreshCw, 
  Leaf, Trees, HelpCircle, Activity, Lightbulb, Compass, Zap
} from "lucide-react";
import { AIInsight, ApplianceHealth, SmartDevice } from "../types";

interface AIInsightsPanelProps {
  insights: AIInsight[];
  healthLogs: ApplianceHealth[];
  devices: SmartDevice[];
  regionalRate: number;
  currency: string;
}

export default function AIInsightsPanel({ insights, healthLogs, devices, regionalRate, currency }: AIInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'health' | 'audit'>('insights');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const getCurrencySymbol = () => {
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    return '$';
  };

  const severityColor = (sev: ApplianceHealth['severity']) => {
    switch (sev) {
      case 'high': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default: return 'bg-sky-500/10 border-sky-500/30 text-sky-400';
    }
  };

  // Connects with server.ts's `/api/audit` endpoint!
  const triggerAiAudit = async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devices,
          regionalRate
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile audit. Check server connection.");
      }

      const data = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      setAuditError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl h-full flex flex-col justify-between" id="ai-insights-panel">
      
      <div>
        {/* Navigation Tabs */}
        <div className="flex bg-emerald-950/30 border border-emerald-500/15 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'insights' 
                ? 'bg-emerald-500/25 text-emerald-300 font-semibold' 
                : 'text-sky-200/50 hover:text-sky-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            AI Insights
          </button>
          
          <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'health' 
                ? 'bg-emerald-500/25 text-emerald-300 font-semibold' 
                : 'text-sky-200/50 hover:text-sky-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Appliance Health
          </button>

          <button
            onClick={() => {
              setActiveTab('audit');
              if (!auditResult && !auditLoading) triggerAiAudit();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'audit' 
                ? 'bg-emerald-500/25 text-emerald-300 font-semibold' 
                : 'text-sky-200/50 hover:text-sky-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Earthy AI Audit
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: AI INSIGHTS */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300">Live Ecological Observations</h4>
                </div>

                {insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/10 hover:border-emerald-500/25 transition-all relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 border-b border-l border-emerald-500/10 text-[9px] font-mono text-emerald-400 rounded-bl-xl uppercase tracking-wider">
                      Save {getCurrencySymbol()}{insight.estimatedSavings.toFixed(2)}/mo
                    </div>

                    <h5 className="font-sans font-semibold text-sm text-emerald-100 flex items-center gap-2 pr-20">
                      <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                      {insight.title}
                    </h5>
                    
                    <p className="text-xs text-sky-200/70 mt-2 leading-relaxed">{insight.description}</p>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-500/5 text-[11px] font-sans">
                      <div>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> Why it matters</span>
                        <p className="text-sky-200/55 mt-0.5 leading-normal">{insight.whyItMatters}</p>
                      </div>
                      <div>
                        <span className="text-sky-300 font-semibold flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-sky-300 animate-spin" style={{ animationDuration: '8s' }} /> Eco Action</span>
                        <p className="text-sky-200/55 mt-0.5 leading-normal">{insight.suggestedAction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 2: APPLIANCE HEALTH */}
            {activeTab === 'health' && (
              <motion.div
                key="health"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300">Smart Plug Thermal & Draw Metrics</h4>
                </div>

                {healthLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="font-sans font-semibold text-sm text-emerald-100">{log.applianceName}</h5>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono border ${severityColor(log.severity)}`}>
                          {log.severity} severity
                        </span>
                      </div>
                      
                      <p className="text-xs text-rose-300/80 font-mono italic">Issue: {log.issue}</p>
                      
                      <div className="text-xs text-sky-200/60 leading-relaxed pt-1">
                        <span className="text-emerald-400 font-medium">Recommendation: </span>
                        {log.recommendation}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/10 min-w-[120px] shrink-0 text-center">
                      <span className="text-[10px] text-emerald-300/60 uppercase font-mono block">Fix Savings</span>
                      <span className="text-lg font-mono font-bold text-sky-300 mt-0.5">
                        {getCurrencySymbol()}{log.estimatedSavings.toFixed(2)}<span className="text-xs font-sans font-light">/mo</span>
                      </span>
                    </div>
                  </div>
                ))}

                {healthLogs.length === 0 && (
                  <div className="py-12 text-center text-slate-500 bg-slate-900/10 border border-slate-900 rounded-2xl">
                    <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    <p className="text-xs font-sans">All appliance micro-draw signatures are stable and in optimal health.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: LIVE AI AUDIT */}
            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-mono text-emerald-300">Gemini LLM Home Energy Audit</h4>
                    <p className="text-[10px] text-sky-200/50 font-mono mt-0.5">Continuous analysis of your active plug behaviors</p>
                  </div>
                  <button 
                    onClick={triggerAiAudit}
                    disabled={auditLoading}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-400/20 rounded-lg text-[10px] text-emerald-300 hover:bg-emerald-500/20 transition-all font-mono"
                  >
                    <RefreshCw className={`w-3 h-3 ${auditLoading ? 'animate-spin' : ''}`} />
                    RE-AUDIT
                  </button>
                </div>

                {auditLoading && (
                  <div className="py-16 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <Brain className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-300 font-mono tracking-wider animate-pulse uppercase">Earthy AI Core Synthesizing...</p>
                      <p className="text-[11px] text-sky-200/50 italic mt-1">Modeling thermal currents & calculating regional rates</p>
                    </div>
                  </div>
                )}

                {auditError && (
                  <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl text-rose-300 text-xs flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-semibold block">Audit Core Unavailable</span>
                      {auditError}
                    </div>
                  </div>
                )}

                {!auditLoading && !auditError && auditResult && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="space-y-5"
                  >
                    {/* Overall Score Badge Card */}
                    <div className="bg-gradient-to-r from-emerald-950/50 to-slate-950/70 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-5">
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        {/* Circular track */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="rgba(16,185,129,0.1)" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="4" fill="transparent" 
                            strokeDasharray={175} 
                            strokeDashoffset={175 - (175 * auditResult.overallScore) / 100} 
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute font-mono font-bold text-xl text-emerald-300">{auditResult.overallScore}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400">Household Sustainability Score</span>
                        <p className="text-xs text-sky-100/90 leading-relaxed mt-1">{auditResult.summary}</p>
                      </div>
                    </div>

                    {/* Hotspots */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block">Abnormal Consumption Signals</span>
                      <div className="grid grid-cols-1 gap-2">
                        {auditResult.hotspots.map((hot: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900/40 border border-slate-900 rounded-xl text-xs text-sky-200/80">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{hot}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations Generated */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300/70 block">Targeted AI Directives</span>
                      <div className="space-y-3">
                        {auditResult.customRecommendations.map((rec: any, idx: number) => (
                          <div key={idx} className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl">
                            <div className="flex justify-between items-start">
                              <h5 className="text-xs font-semibold text-emerald-100">{rec.appliance}</h5>
                              <span className="text-xs font-mono font-bold text-sky-300">
                                Save {getCurrencySymbol()}{rec.estimatedSavings.toFixed(2)}/mo
                              </span>
                            </div>
                            <p className="text-[11px] text-rose-300/70 font-mono mt-1">Issue: {rec.issue}</p>
                            <p className="text-[11px] text-sky-200/60 leading-normal mt-1.5">{rec.environmentalImpact}</p>
                            <div className="mt-2.5 bg-emerald-950/30 border border-emerald-500/10 p-2 rounded-lg text-[10px] text-emerald-300 font-sans">
                              <span className="font-bold">Directive:</span> {rec.action}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eco Equivalent banner */}
                    <div className="p-4 bg-sky-950/20 border border-sky-500/20 rounded-2xl flex items-center gap-3">
                      <Trees className="w-5 h-5 text-emerald-400 shrink-0" />
                      <p className="text-xs text-sky-100 leading-relaxed italic">{auditResult.environmentalEquivalent}</p>
                    </div>

                  </motion.div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Info bar */}
      <div className="mt-6 pt-4 border-t border-emerald-500/5 flex items-center gap-2.5 text-[10px] font-mono text-sky-200/40">
        <Compass className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
        Earthy Energy Analytics Engine (Gemini 3.5 Active)
      </div>

    </div>
  );
}
