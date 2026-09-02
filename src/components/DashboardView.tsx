import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Zap,
  Activity,
  CreditCard,
  Bot,
  Calendar,
  Lock,
  PlusCircle,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  MessageSquare,
  Globe,
  Radio,
  FileCheck2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DonutChart } from './ui/donut-chart';
import { BankGatewayAnalytics } from './BankGatewayAnalytics';
import { RecoveryAnalytics } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DashboardViewProps {
  analytics: RecoveryAnalytics | null;
  onNavigateTab: (tab: any) => void;
  onGenerateDummyCases?: (count?: number) => void;
  onOpenSuggestionsModal?: () => void;
}

const hourlyTrendData = [
  { time: '08:00', recovered: 18000, exposed: 42000, attempts: 12 },
  { time: '10:00', recovered: 45000, exposed: 68000, attempts: 28 },
  { time: '12:00', recovered: 92000, exposed: 110000, attempts: 44 },
  { time: '14:00', recovered: 148000, exposed: 165000, attempts: 65 },
  { time: '16:00', recovered: 215000, exposed: 235000, attempts: 89 },
  { time: '18:00', recovered: 290000, exposed: 310000, attempts: 112 },
  { time: '20:00', recovered: 365000, exposed: 380000, attempts: 130 },
];

const rootCauseDetails = [
  {
    name: 'UPI Gateway Switch & 504 Timeouts',
    category: 'Bank Switch Failure',
    amount: 148000,
    percent: 38,
    color: '#3b82f6',
    intervention: 'Deploy instant Razorpay multi-bank fallback smart paylink via WhatsApp AI.',
  },
  {
    name: '3D-Secure OTP Drop-off & SMS Delay',
    category: 'Authentication Friction',
    amount: 112000,
    percent: 29,
    color: '#06b6d4',
    intervention: 'Automated 1-click biometric re-trigger with UPI Intent fallback.',
  },
  {
    name: 'e-Mandate Liquidity & Daily Limit Cap',
    category: 'Subscription Mandate',
    amount: 74000,
    percent: 19,
    color: '#8b5cf6',
    intervention: 'Smart retry staggered across optimal salary credit window (1st-5th of month).',
  },
  {
    name: 'B2B Net-30 Invoices & ERP Mismatches',
    category: 'Accounts Receivable',
    amount: 54000,
    percent: 14,
    color: '#f59e0b',
    intervention: 'Razorpay Virtual Account (VAN) automated reconciliation with Hinglish voice reminder.',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [hoveredRootCause, setHoveredRootCause] = useState<string | null>(null);

  const atRisk = analytics?.totalAtRisk || 184500;
  const recovered = analytics?.totalRecovered || 84500;
  const total = atRisk + recovered || 1;
  const recoveryRate = Math.min(100, Math.round((recovered / total) * 100));
  const haltedCount = analytics?.stoppedByRulesCount || 2;
  const ptpAmount = analytics?.ptpCommittedAmount || 64500;

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* 3D Reveal Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dashboard
            </h1>
          </div>
          <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            High-velocity autonomous recovery engine powered by deep neural failure diagnostics and Razorpay payment rails.
          </p>
        </div>
      </motion.div>

      {/* Dedicated Executive Recovery Success & Velocity Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2 }}
        className={`group relative overflow-hidden rounded-3xl p-5 md:p-6 space-y-4 transition-all duration-300 shadow-xl ${
          isDark
            ? 'bg-white/[0.04] ring-1 ring-white/10'
            : 'bg-white/80 ring-1 ring-slate-200/90'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Revenue Recovery Success Velocity
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Dynamic pipeline conversion measuring auto-settled capital vs total degraded payment volume.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-sans">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Success Efficiency</div>
              <div className="text-2xl font-black text-emerald-400 tracking-tight">{recoveryRate}% Rescued</div>
            </div>
          </div>
        </div>

        {/* Multi-Segment Inset UI Container */}
        <div className={`relative z-10 rounded-2xl p-4 ring-1 backdrop-blur space-y-3 ${
          isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
        }`}>
          <div className={`w-full h-3.5 rounded-full overflow-hidden p-0.5 border ${
            isDark ? 'bg-black/50 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="h-full flex rounded-full overflow-hidden">
              {/* Settled Bar */}
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full transition-all duration-700 relative group"
                style={{ width: `${Math.max(5, recoveryRate)}%` }}
                title={`Settled: ₹${recovered.toLocaleString('en-IN')}`}
              />
              {/* PTP Bar */}
              <div
                className="bg-cyan-500/60 h-full transition-all duration-700"
                style={{ width: `${Math.min(30, Math.round((ptpAmount / total) * 100))}%` }}
                title={`PTP Committed: ₹${ptpAmount.toLocaleString('en-IN')}`}
              />
            </div>
          </div>

          {/* Legend Breakdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-400">Settled:</span>
              <span className="font-bold text-emerald-400">₹{recovered.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span className="text-slate-400">P2P Grace:</span>
              <span className="font-bold text-cyan-400">₹{ptpAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              <span className="text-slate-400">At-Risk:</span>
              <span className="font-bold text-amber-400">₹{atRisk.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
              <span className="text-slate-400">Compliance Held:</span>
              <span className="font-bold text-purple-400">{haltedCount} cases</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Primary Metric Cards with Feature Highlight Card Architecture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* At-Risk Capital */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateTab('queue')}
          className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10 hover:ring-amber-500/40'
              : 'bg-white/80 ring-1 ring-slate-200/90 hover:ring-amber-400'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Inset UI Container */}
          <div className={`relative z-10 rounded-2xl p-4 ring-1 backdrop-blur ${
            isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
          }`}>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-semibold">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold truncate">Exposed Revenue</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-sans font-bold inline-flex items-center gap-1 shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                <span className="leading-none whitespace-nowrap">AT RISK</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-sans text-amber-400 mt-2.5 tracking-tight">
              ₹{atRisk.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400/90 mt-1 truncate">
              Intercepted across 5 banking switches
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 mt-3 flex items-center justify-between gap-2">
            <span className="font-medium truncate">Active degraded pipeline</span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans inline-flex items-center gap-1 transition-all shrink-0 ${
                isDark
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 group-hover:bg-amber-500/25 group-hover:border-amber-500/40'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 group-hover:bg-amber-100'
              }`}
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.div>

        {/* Recovered Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateTab('queue')}
          className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10 hover:ring-emerald-500/40'
              : 'bg-white/80 ring-1 ring-slate-200/90 hover:ring-emerald-400'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Inset UI Container */}
          <div className={`relative z-10 rounded-2xl p-4 ring-1 backdrop-blur ${
            isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
          }`}>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-semibold">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold truncate">Recovered Capital</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-sans font-bold inline-flex items-center gap-1 shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
                <span className="leading-none whitespace-nowrap">SETTLED</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-sans text-emerald-400 mt-2.5 tracking-tight">
              ₹{recovered.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-400/90 mt-1 truncate">
              100% verified via Razorpay webhook
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 mt-3 flex items-center justify-between gap-2">
            <span className="font-medium truncate">Settled via Razorpay Rails</span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans inline-flex items-center gap-1 transition-all shrink-0 ${
                isDark
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/40'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-100'
              }`}
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.div>

        {/* P2P Committed Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateTab('p2p')}
          className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10 hover:ring-cyan-500/40'
              : 'bg-white/80 ring-1 ring-slate-200/90 hover:ring-cyan-400'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Inset UI Container */}
          <div className={`relative z-10 rounded-2xl p-4 ring-1 backdrop-blur ${
            isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
          }`}>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-semibold">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold truncate">Promise-to-Pay</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-sans font-bold inline-flex items-center gap-1 shrink-0 border border-cyan-500/30">
                <Calendar className="w-3 h-3 shrink-0 text-cyan-400" />
                <span className="leading-none whitespace-nowrap">PAUSED</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-sans text-cyan-400 mt-2.5 tracking-tight">
              ₹{ptpAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-cyan-400/90 mt-1 truncate">
              Zero-harassment grace hold active
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 mt-3 flex items-center justify-between gap-2">
            <span className="font-medium truncate">Grace window protected</span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans inline-flex items-center gap-1 transition-all shrink-0 ${
                isDark
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 group-hover:bg-cyan-500/25 group-hover:border-cyan-500/40'
                  : 'bg-cyan-50 text-cyan-800 border border-cyan-200 group-hover:bg-cyan-100'
              }`}
            >
              <span>Schedule</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.div>

        {/* RBI Compliance Cap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigateTab('batch')}
          className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10 hover:ring-purple-500/40'
              : 'bg-white/80 ring-1 ring-slate-200/90 hover:ring-purple-400'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          {/* Inset UI Container */}
          <div className={`relative z-10 rounded-2xl p-4 ring-1 backdrop-blur ${
            isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
          }`}>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-semibold">
              <span className="font-sans text-[11px] uppercase tracking-wider font-semibold truncate">RBI Safeguard</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-sans font-bold inline-flex items-center gap-1 shrink-0 border border-purple-500/30">
                <ShieldCheck className="w-3 h-3 shrink-0 text-purple-400" />
                <span className="leading-none whitespace-nowrap">GUARD</span>
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-sans text-purple-400 mt-2.5 tracking-tight flex items-baseline gap-1.5">
              <span>{haltedCount}</span>
              <span className="text-xs font-semibold text-purple-300/80">Protected</span>
            </div>
            <div className="text-[10px] text-purple-400/90 mt-1 truncate">
              Max 3 retries & cooling-off enforced
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 mt-3 flex items-center justify-between gap-2">
            <span className="font-medium truncate">Cooling off protected</span>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-sans inline-flex items-center gap-1 transition-all shrink-0 ${
                isDark
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20 group-hover:bg-purple-500/25 group-hover:border-purple-500/40'
                  : 'bg-purple-50 text-purple-800 border border-purple-200 group-hover:bg-purple-100'
              }`}
            >
              <span>Audits</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Analytics & High-Resolution Charts with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Hourly Recovery Trajectory Chart Column (2 cols) */}
        <div
          className={`group relative overflow-hidden rounded-3xl p-5 md:p-6 transition-all duration-300 shadow-xl flex flex-col justify-between lg:col-span-2 ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10'
              : 'bg-white/80 ring-1 ring-slate-200/90'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className={`text-base font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Hourly Recovery Trajectory & Velocity</span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-time timeline of recovered capital vs. exposed transactions across all payment rails.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 shadow-md cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 shadow-emerald-950/40 backdrop-blur-xl'
                    : 'bg-gradient-to-r from-emerald-50 via-teal-50/80 to-emerald-100/90 border-emerald-300/80 hover:border-emerald-400 text-emerald-900 shadow-emerald-100 backdrop-blur-xl'
                }`}
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </div>
                <span className={`text-[11px] font-semibold tracking-tight ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>
                  Recovered
                </span>
                <span className="font-mono text-xs font-bold tracking-tight text-emerald-400">
                  ₹{recovered.toLocaleString('en-IN')}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="recoveredTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="exposedTrajectoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0a0f1d' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0',
                    borderRadius: '14px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                  formatter={(val: any, name: string) => [
                    `₹${Number(val).toLocaleString('en-IN')}`,
                    name === 'recovered' ? 'Recovered & Settled' : 'Total Exposed Capital',
                  ]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => (value === 'recovered' ? 'Recovered & Settled' : 'Total Exposed Capital')}
                />
                <Area
                  type="monotone"
                  name="recovered"
                  dataKey="recovered"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#recoveredTrajectoryGradient)"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 7, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  name="exposed"
                  dataKey="exposed"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: '#f59e0b', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Donut Chart: Failure Root-Cause Distribution */}
        <div
          className={`group relative overflow-hidden rounded-3xl p-5 md:p-6 transition-all duration-300 shadow-xl flex flex-col justify-between ${
            isDark
              ? 'bg-white/[0.04] ring-1 ring-white/10'
              : 'bg-white/80 ring-1 ring-slate-200/90'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className={`text-base font-extrabold flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>Failure Root-Cause Breakdown</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                AI Diagnostic
              </span>
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Categorized by gateway telemetry & transaction friction.
            </p>

            {/* Inset UI Box with Modern Animated SVG Donut Chart */}
            <div className={`rounded-2xl p-3 my-3 ring-1 backdrop-blur flex items-center justify-center ${
              isDark ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10' : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
            }`}>
              {(() => {
                const chartSegments = rootCauseDetails.map((item) => ({
                  value: item.percent,
                  color: item.color,
                  label: item.name,
                  amount: item.amount,
                  category: item.category,
                }));
                const activeSegment = chartSegments.find(
                  (s) => s.label === hoveredRootCause
                );
                const displayLabel = activeSegment ? activeSegment.category : 'Total Exposed';
                const displayValue = activeSegment ? `${activeSegment.value}%` : '100%';
                const displaySub = activeSegment
                  ? `₹${(activeSegment.amount / 1000).toFixed(0)}k`
                  : `₹${(rootCauseDetails.reduce((sum, d) => sum + d.amount, 0) / 1000).toFixed(0)}k`;

                return (
                  <DonutChart
                    data={chartSegments}
                    size={210}
                    strokeWidth={22}
                    animationDuration={1.1}
                    animationDelayPerSegment={0.06}
                    highlightOnHover={true}
                    activeSegmentLabel={hoveredRootCause}
                    onSegmentHover={(seg) => setHoveredRootCause(seg ? seg.label : null)}
                    centerContent={
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={displayLabel}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="flex flex-col items-center justify-center text-center px-1"
                        >
                          <p className={`text-[10px] font-semibold uppercase tracking-wider truncate max-w-[120px] ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {displayLabel}
                          </p>
                          <p className={`text-2xl font-black font-mono tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {displayValue}
                          </p>
                          <p className="text-[11px] font-bold font-mono text-cyan-400">
                            {displaySub}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    }
                  />
                );
              })()}
            </div>

            <div className="space-y-1.5 pt-1">
              {rootCauseDetails.map((item, idx) => {
                const isHovered = hoveredRootCause === item.name;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredRootCause(item.name)}
                    onMouseLeave={() => setHoveredRootCause(null)}
                    className={`flex items-center justify-between text-xs font-medium px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? isDark
                          ? 'bg-white/10 shadow-sm translate-x-1'
                          : 'bg-slate-200/80 shadow-sm translate-x-1'
                        : isDark
                        ? 'hover:bg-white/5'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate max-w-[210px]">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: item.color,
                          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                          boxShadow: isHovered ? `0 0 8px ${item.color}` : 'none',
                        }}
                      />
                      <span className={`truncate text-[11.5px] ${
                        isHovered
                          ? isDark ? 'text-white font-bold' : 'text-slate-950 font-bold'
                          : isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10.5px] text-slate-400">
                        ₹{(item.amount / 1000).toFixed(0)}k
                      </span>
                      <span className={`font-mono font-bold text-xs ${
                        isHovered ? 'text-cyan-400' : isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-3">
            <button
              onClick={() => onNavigateTab('diag')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>View Deep AI Diagnostic Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bank Gateway & Payment Switch Performance Suite (Interactive HTML-Inspired Centerpiece) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <BankGatewayAnalytics />
      </motion.div>
    </div>
  );
};

export default DashboardView;
