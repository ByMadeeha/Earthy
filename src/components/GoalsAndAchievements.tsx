/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Target, Leaf, Plus, Check, Award, Flame, 
  Trash2, ShieldCheck, Compass, Info, ChevronRight, Sparkles,
  Clock, Home
} from "lucide-react";
import { SustainabilityGoal, EcoAchievement } from "../types";

interface GoalsAndAchievementsProps {
  goals: SustainabilityGoal[];
  achievements: EcoAchievement[];
  onAddGoal?: (newGoal: Omit<SustainabilityGoal, 'id' | 'currentValue'>) => void;
  onRemoveGoal?: (id: string) => void;
}

export default function GoalsAndAchievements({ goals, achievements, onAddGoal, onRemoveGoal }: GoalsAndAchievementsProps) {
  const [activeTab, setActiveTab] = useState<'goals' | 'badges'>('goals');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(100);
  const [newGoalUnit, setNewGoalUnit] = useState("kWh");
  const [newGoalCategory, setNewGoalCategory] = useState<SustainabilityGoal['category']>("reduction");
  const [newGoalDays, setNewGoalDays] = useState(30);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    if (onAddGoal) {
      onAddGoal({
        title: newGoalTitle,
        targetValue: newGoalTarget,
        unit: newGoalUnit,
        category: newGoalCategory,
        daysLeft: newGoalDays,
        status: 'active'
      });
    }

    setNewGoalTitle("");
    setIsAddingGoal(false);
  };

  const categoryIcon = (cat: SustainabilityGoal['category']) => {
    switch (cat) {
      case 'carbon': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'budget': return <Award className="w-5 h-5 text-amber-400" />;
      case 'standby': return <Flame className="w-5 h-5 text-sky-400" />;
      default: return <Target className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getAchievementBadge = (iconName: string, unlocked: boolean) => {
    const activeColor = unlocked ? "text-amber-400 bg-amber-500/10 border-amber-500/30 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]" : "text-slate-600 bg-slate-900/40 border-slate-900";
    switch (iconName) {
      case 'saver': return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Flame className="w-6 h-6" /></div>;
      case 'hero': return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Leaf className="w-6 h-6" /></div>;
      case 'home': return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Home className="w-6 h-6" /></div>;
      case 'explorer': return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Compass className="w-6 h-6" /></div>;
      case 'champion': return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Trophy className="w-6 h-6" /></div>;
      default: return <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${activeColor}`}><Award className="w-6 h-6" /></div>;
    }
  };

  return (
    <div className="bg-slate-950/40 border border-emerald-500/10 rounded-3xl p-6 backdrop-blur-md shadow-xl" id="goals-and-achievements-panel">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5 mb-6">
        <div>
          <h3 className="font-sans font-semibold text-xl text-emerald-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Ecological Milestone Tracker
          </h3>
          <p className="text-xs text-sky-200/60 mt-0.5">Define your environmental limits and unlock natural milestones</p>
        </div>

        {/* Tab switchers and add buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex bg-emerald-950/40 border border-emerald-500/15 p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'goals' 
                  ? 'bg-emerald-500/25 text-emerald-300 font-medium' 
                  : 'text-sky-200/50 hover:text-sky-200'
              }`}
            >
              Active Goals ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'badges' 
                  ? 'bg-emerald-500/25 text-emerald-300 font-medium' 
                  : 'text-sky-200/50 hover:text-sky-200'
              }`}
            >
              Eco Badges ({achievements.filter(a => a.unlocked).length})
            </button>
          </div>

          {activeTab === 'goals' && (
            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          )}
        </div>
      </div>

      {/* Add Goal Form Popup */}
      <AnimatePresence>
        {isAddingGoal && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleCreateGoal}
            className="bg-emerald-950/15 border border-emerald-500/15 p-5 rounded-2xl mb-6 overflow-hidden space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-mono text-emerald-300 block mb-1">Goal Objective</label>
                <input 
                  type="text"
                  placeholder="e.g., Lower water heater usage by 20%"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-emerald-300 block mb-1">Target Limit</label>
                <input 
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Math.max(1, parseInt(e.target.value) || 50))}
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-emerald-300 block mb-1">Metric Unit</label>
                <input 
                  type="text"
                  value={newGoalUnit}
                  onChange={(e) => setNewGoalUnit(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-emerald-300 block mb-1">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => {
                    const val = e.target.value as SustainabilityGoal['category'];
                    setNewGoalCategory(val);
                    if (val === 'carbon') setNewGoalUnit("kg CO2");
                    else if (val === 'budget') setNewGoalUnit("USD");
                    else if (val === 'standby') setNewGoalUnit("W");
                    else setNewGoalUnit("kWh");
                  }}
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400 transition-all"
                >
                  <option value="reduction">General Reduction (kWh)</option>
                  <option value="carbon">Carbon Cut (kg CO2)</option>
                  <option value="budget">Finances (USD/EUR)</option>
                  <option value="standby">Standby Draw (Watts)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-xl text-xs transition-all"
              >
                Commit Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: ACTIVE GOALS LIST */}
        {activeTab === 'goals' && (
          <motion.div
            key="goals-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {goals.map((goal) => {
              const progressPct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              const isCompleted = goal.currentValue >= goal.targetValue;

              return (
                <div 
                  key={goal.id}
                  className="bg-emerald-950/10 border border-emerald-500/10 rounded-2xl p-5 hover:border-emerald-500/20 transition-all relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/10">{categoryIcon(goal.category)}</span>
                        <div>
                          <h4 className="font-sans font-semibold text-xs text-emerald-100">{goal.title}</h4>
                          <span className="text-[9px] uppercase tracking-wider font-mono text-sky-200/50">Category: {goal.category}</span>
                        </div>
                      </div>

                      {onRemoveGoal && (
                        <button
                          onClick={() => onRemoveGoal(goal.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 bg-slate-900/20 hover:bg-rose-950/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Progress stream styled bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-sky-200/55">Progress: {progressPct}%</span>
                        <span className="text-sky-200/55">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-900/80 relative">
                        {/* Shimmer energy flow effect inside progress */}
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-emerald-500/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-sky-200/30 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-400" /> {goal.daysLeft} days remaining</span>
                    
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-400/30 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold tracking-wider uppercase">Active</span>
                    )}
                  </div>
                </div>
              );
            })}

            {goals.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl">
                <Target className="w-8 h-8 mx-auto stroke-1 mb-2 text-emerald-400" />
                <p className="text-xs font-sans">No target metrics defined. Click "New Goal" to map standard boundaries.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: ECO ACHIEVEMENTS GRID */}
        {activeTab === 'badges' && (
          <motion.div
            key="badges-view"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {achievements.map((badge) => {
              const progressPct = Math.min(100, Math.round((badge.progressCurrent / badge.progressMax) * 100));
              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between h-[210px] relative transition-all group ${
                    badge.unlocked 
                      ? "bg-gradient-to-b from-emerald-950/20 to-slate-950/50 border-amber-500/20 shadow-amber-950/5 shadow-xl" 
                      : "bg-slate-950/20 border-slate-900"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Badge Icon and status */}
                    <div className="flex items-start justify-between">
                      {getAchievementBadge(badge.iconName, badge.unlocked)}
                      
                      {badge.unlocked ? (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-400 border border-amber-500/25 bg-amber-500/5 px-1.5 py-0.5 rounded-full font-mono font-semibold">
                          <Check className="w-2.5 h-2.5" />
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-600 border border-slate-900 bg-slate-950/40 px-1.5 py-0.5 rounded-full font-mono">
                          LOCKED
                        </span>
                      )}
                    </div>

                    {/* Badge Title & description */}
                    <div>
                      <h4 className={`font-sans font-semibold text-xs mt-1 ${badge.unlocked ? "text-emerald-100 group-hover:text-amber-300" : "text-slate-500"} transition-colors`}>
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-sky-200/55 leading-relaxed mt-1.5">{badge.description}</p>
                    </div>
                  </div>

                  {/* Badge Progress or date */}
                  <div className="border-t border-slate-900/40 pt-3 text-[9px] font-mono text-sky-200/30">
                    {badge.unlocked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Unlocked this week</span>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Progress</span>
                          <span>{badge.progressCurrent}/{badge.progressMax}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-700" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
