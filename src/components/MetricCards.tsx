"use client";

import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  AlertTriangle,
  CalendarClock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { RecoveryAnalytics } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MetricCardsProps {
  analytics: RecoveryAnalytics | null;
  onFilterByStatus?: (status: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ analytics }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-32 rounded-3xl border ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'recovered',
      title: 'Money Recovered',
      value: `₹${analytics.totalRecovered.toLocaleString('en-IN')}`,
      subtext: `${analytics.recoveryRatePercent}% Portfolio Win Rate`,
      icon: TrendingUp,
      accent: 'emerald',
      gradient: isDark
        ? 'from-emerald-500/10 via-emerald-500/5 to-transparent'
        : 'from-emerald-50 via-emerald-50/50 to-transparent',
      borderColor: isDark ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-emerald-200 hover:border-emerald-300',
      iconBg: isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      glowBg: 'bg-emerald-500/10',
      badge: 'Live Captured',
      badgeClass: isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'at_risk',
      title: 'Revenue at Risk',
      value: `₹${analytics.totalAtRisk.toLocaleString('en-IN')}`,
      subtext: `${analytics.activeInFlightCount} In-Flight Interventions`,
      icon: AlertTriangle,
      accent: 'rose',
      gradient: isDark
        ? 'from-rose-500/10 via-rose-500/5 to-transparent'
        : 'from-rose-50 via-rose-50/50 to-transparent',
      borderColor: isDark ? 'border-rose-500/20 hover:border-rose-500/40' : 'border-rose-200 hover:border-rose-300',
      iconBg: isDark ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25' : 'bg-rose-100 text-rose-700 border border-rose-200',
      glowBg: 'bg-rose-500/10',
      badge: 'Immediate Action',
      badgeClass: isDark ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'ptp',
      title: 'Promise-to-Pay (PTP)',
      value: `₹${analytics.ptpCommittedAmount.toLocaleString('en-IN')}`,
      subtext: 'Committed Grace Settlements',
      icon: CalendarClock,
      accent: 'indigo',
      gradient: isDark
        ? 'from-indigo-500/10 via-indigo-500/5 to-transparent'
        : 'from-indigo-50 via-indigo-50/50 to-transparent',
      borderColor: isDark ? 'border-indigo-500/20 hover:border-indigo-500/40' : 'border-indigo-200 hover:border-indigo-300',
      iconBg: isDark ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' : 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      glowBg: 'bg-indigo-500/10',
      badge: 'Voice Locked',
      badgeClass: isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      id: 'compliance',
      title: 'Stopping Rule Halts',
      value: `${analytics.stoppedByRulesCount}`,
      subtext: 'Anti-Harassment Protected',
      icon: ShieldAlert,
      accent: 'amber',
      gradient: isDark
        ? 'from-amber-500/10 via-amber-500/5 to-transparent'
        : 'from-amber-50 via-amber-50/50 to-transparent',
      borderColor: isDark ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-amber-200 hover:border-amber-300',
      iconBg: isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-amber-100 text-amber-700 border border-amber-200',
      glowBg: 'bg-amber-500/10',
      badge: 'RBI Compliant',
      badgeClass: isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'channels',
      title: 'AI Multi-Rail Reach',
      value: '5 Rails',
      subtext: 'Razorpay • WhatsApp • Voice',
      icon: Sparkles,
      accent: 'cyan',
      gradient: isDark
        ? 'from-cyan-500/10 via-cyan-500/5 to-transparent'
        : 'from-cyan-50 via-cyan-50/50 to-transparent',
      borderColor: isDark ? 'border-cyan-500/20 hover:border-cyan-500/40' : 'border-cyan-200 hover:border-cyan-300',
      iconBg: isDark ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' : 'bg-cyan-100 text-cyan-700 border border-cyan-200',
      glowBg: 'bg-cyan-500/10',
      badge: 'Autonomous',
      badgeClass: isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-cyan-100 text-cyan-800 border-cyan-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            id={`metric-card-${card.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 shadow-xl ${
              isDark
                ? 'bg-white/[0.04] ring-1 ring-white/10 hover:ring-white/20'
                : 'bg-white ring-1 ring-slate-200 shadow-sm hover:ring-slate-300'
            }`}
          >
            {/* Ambient subtle card glow orbs */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`}
            />
            <div
              className={`absolute -right-20 -top-20 h-56 w-56 rounded-full ${card.glowBg} blur-3xl opacity-50 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none`}
            />

            {/* Inset UI Container */}
            <div className={`relative z-10 rounded-2xl p-3.5 backdrop-blur ring-1 transition-all ${
              isDark
                ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10'
                : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10.5px] font-bold tracking-wider uppercase font-mono truncate max-w-[130px] ${
                  isDark ? 'text-slate-400' : 'text-slate-700 font-bold'
                }`}>
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className={`text-xl lg:text-2xl font-extrabold font-metric tracking-tight mt-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {card.value}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="relative z-10 mt-3 flex items-center justify-between gap-1 text-xs">
              <span className={`truncate text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-700 font-semibold'}`}>
                {card.subtext}
              </span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricCards;
