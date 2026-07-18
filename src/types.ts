/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SmartDevice {
  id: string;
  name: string;
  room: string;
  powerUsage: number; // in Watts (W)
  dailyKwh: number;
  monthlyKwh: number;
  status: boolean; // true = On, false = Off
  efficiencyScore: number; // 0 to 100
  type: 'refrigerator' | 'ac' | 'tv' | 'laptop' | 'lights' | 'washing_machine' | 'water_heater' | 'fan' | 'other';
}

export interface Room {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
  baseKwh: number;
  carbonImpact: number; // kg CO2
  suggestions: string[];
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  environmentalImpact: string;
  suggestedAction: string;
  estimatedSavings: number; // monthly savings in Currency
  category: 'efficiency' | 'warning' | 'standby' | 'savings';
}

export interface ApplianceHealth {
  id: string;
  applianceName: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  estimatedSavings: number; // monthly cost saved if fixed
  detectedAt: string;
  status: 'monitoring' | 'action_required' | 'resolved';
}

export interface SustainabilityGoal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: 'reduction' | 'carbon' | 'budget' | 'standby';
  daysLeft: number;
  status: 'active' | 'completed';
}

export interface EcoAchievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressMax: number;
  progressCurrent: number;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}

export interface EarthySettings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  connectedDevicesCount: number;
  energyUnit: 'kWh' | 'MJ';
  currency: 'USD' | 'EUR' | 'GBP';
  regionalRate: number; // e.g., $0.15 per kWh
  privacyConsent: boolean;
}

export interface HouseStats {
  currentPower: number; // Total active Watts
  dailyCost: number;
  monthlyCost: number;
  carbonFootprint: number; // kg CO2
  energySavedKwh: number;
  estimatedBill: number;
  aiSustainabilityScore: number; // 0 to 100
}
