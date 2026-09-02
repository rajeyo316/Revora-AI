import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  Download,
  Sliders,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BankGatewayDataStore {
  [tab: string]: {
    [range: number]: {
      data: number[];
      growth: string;
      users: string;
      insights: string;
      avgRate: string;
      avgRateDelta: string;
      avgTat: string;
      avgTatDelta: string;
    };
  };
}

const GATEWAY_DATA_STORE: BankGatewayDataStore = {
  performance: {
    7: {
      data: [38, 26, 21, 17, 14],
      growth: '+89%',
      users: '45,231',
      insights: 'HDFC SmartHub & ICICI switches show highest auto-resolution for UPI 504 timeouts on weekends.',
      avgRate: '86.4%',
      avgRateDelta: '+1.2%',
      avgTat: '1.24s',
      avgTatDelta: '-0.32s',
    },
    30: {
      data: [98, 76, 59, 54, 41],
      growth: '+127%',
      users: '143,829',
      insights: 'HDFC and Axis switches demonstrate 2.4x faster NPCI re-query reconciliation. Recommend prioritizing HDFC as primary UPI switch.',
      avgRate: '88.6%',
      avgRateDelta: '+2.4%',
      avgTat: '1.14s',
      avgTatDelta: '-0.28s',
    },
    90: {
      data: [245, 192, 168, 142, 110],
      growth: '+156%',
      users: '287,446',
      insights: 'SBI ePay degraded failure rate reduced by 42% following smart dynamic queue balancing and Razorpay link fallbacks.',
      avgRate: '84.2%',
      avgRateDelta: '+3.8%',
      avgTat: '1.45s',
      avgTatDelta: '-0.15s',
    },
    365: {
      data: [780, 620, 510, 430, 320],
      growth: '+203%',
      users: '1,247,832',
      insights: 'Annual gateway resilience matrix shows Kotak and ICICI achieving 99.4% SLA for recurring e-Mandate auto-captures.',
      avgRate: '89.1%',
      avgRateDelta: '+5.4%',
      avgTat: '0.98s',
      avgTatDelta: '-0.42s',
    },
  },
  reroute: {
    7: {
      data: [28, 22, 19, 14, 11],
      growth: '+67%',
      users: '28,445',
      insights: 'Auto-reroute triggers diverted 4,200 pending transactions away from slow SBI nodes during peak 2 PM banking hours.',
      avgRate: '82.1%',
      avgRateDelta: '+0.9%',
      avgTat: '1.55s',
      avgTatDelta: '-0.20s',
    },
    30: {
      data: [82, 64, 51, 48, 35],
      growth: '+94%',
      users: '98,234',
      insights: 'Multi-bank fallback routing prevented ₹18.4L in permanent cart drop-offs during bank scheduled maintenance windows.',
      avgRate: '85.3%',
      avgRateDelta: '+1.8%',
      avgTat: '1.38s',
      avgTatDelta: '-0.25s',
    },
    90: {
      data: [195, 154, 132, 118, 92],
      growth: '+134%',
      users: '215,678',
      insights: 'Real-time health probing saved 31,000 debit transactions by routing directly to secondary payment rails.',
      avgRate: '87.0%',
      avgRateDelta: '+2.9%',
      avgTat: '1.22s',
      avgTatDelta: '-0.30s',
    },
    365: {
      data: [610, 480, 410, 360, 270],
      growth: '+178%',
      users: '892,445',
      insights: 'Dynamic latency throttling minimized gateway timeout disputes by 68% across all Indian partner banks.',
      avgRate: '88.5%',
      avgRateDelta: '+4.2%',
      avgTat: '1.05s',
      avgTatDelta: '-0.38s',
    },
  },
  attribution: {
    7: {
      data: [32, 25, 20, 16, 12],
      growth: '+76%',
      users: '38,992',
      insights: 'Failure attribution highlights OTP delivery latency on mobile networks as the top contributor to 3DS drop-offs.',
      avgRate: '81.4%',
      avgRateDelta: '+1.1%',
      avgTat: '1.62s',
      avgTatDelta: '-0.18s',
    },
    30: {
      data: [91, 72, 58, 49, 38],
      growth: '+112%',
      users: '156,772',
      insights: '64% of failed Netbanking attempts successfully converted when re-prompted with instant UPI QR & Intent links.',
      avgRate: '87.2%',
      avgRateDelta: '+2.6%',
      avgTat: '1.20s',
      avgTatDelta: '-0.34s',
    },
    90: {
      data: [210, 168, 145, 124, 98],
      growth: '+145%',
      users: '298,883',
      insights: 'Cross-rail attribution shows WhatsApp smart nudges driving 72% faster recovery than standard automated SMS.',
      avgRate: '86.8%',
      avgRateDelta: '+3.4%',
      avgTat: '1.28s',
      avgTatDelta: '-0.26s',
    },
    365: {
      data: [690, 540, 460, 390, 290],
      growth: '+189%',
      users: '1,189,223',
      insights: 'First-touch AI dunning captured ₹1.2Cr in high-ticket receivables before transitioning to debt collection stage.',
      avgRate: '90.2%',
      avgRateDelta: '+6.1%',
      avgTat: '0.92s',
      avgTatDelta: '-0.45s',
    },
  },
  settlement: {
    7: {
      data: [25, 20, 16, 13, 9],
      growth: '+72%',
      users: '32,187',
      insights: 'T+0 instantaneous UPI settlements reached 94% on HDFC & ICICI merchant nodes.',
      avgRate: '83.9%',
      avgRateDelta: '+0.8%',
      avgTat: '1.40s',
      avgTatDelta: '-0.15s',
    },
    30: {
      data: [75, 60, 48, 42, 31],
      growth: '+103%',
      users: '124,556',
      insights: 'Automatic reconciliation via Razorpay webhooks shortened dispute turnaround time from 72 hours to 4 minutes.',
      avgRate: '88.1%',
      avgRateDelta: '+2.1%',
      avgTat: '1.18s',
      avgTatDelta: '-0.29s',
    },
    90: {
      data: [180, 142, 120, 105, 80],
      growth: '+149%',
      users: '267,889',
      insights: 'Merchant liquidity increased by 18% due to automated same-day P2P and settlement confirmation callbacks.',
      avgRate: '86.5%',
      avgRateDelta: '+3.1%',
      avgTat: '1.30s',
      avgTatDelta: '-0.22s',
    },
    365: {
      data: [580, 460, 390, 340, 250],
      growth: '+195%',
      users: '1,098,776',
      insights: 'Yearly settlement consistency maintained zero unresolved chargeback penalties under RBI audit guidelines.',
      avgRate: '89.7%',
      avgRateDelta: '+4.8%',
      avgTat: '0.95s',
      avgTatDelta: '-0.40s',
    },
  },
};

const BANK_CHANNELS = [
  {
    name: 'HDFC SmartHub',
    code: 'HDFC',
    color: '#10b981',
    bgLight: 'bg-emerald-500/10',
    borderLight: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
  },
  {
    name: 'SBI ePay Switch',
    code: 'SBI',
    color: '#f59e0b',
    bgLight: 'bg-amber-500/10',
    borderLight: 'border-amber-500/20',
    textColor: 'text-amber-400',
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
  },
  {
    name: 'ICICI Razorpay PG',
    code: 'ICICI',
    color: '#f43f5e',
    bgLight: 'bg-rose-500/10',
    borderLight: 'border-rose-500/20',
    textColor: 'text-rose-400',
    gradientFrom: '#f43f5e',
    gradientTo: '#e11d48',
  },
  {
    name: 'Axis Bank Direct',
    code: 'Axis',
    color: '#3b82f6',
    bgLight: 'bg-blue-500/10',
    borderLight: 'border-blue-500/20',
    textColor: 'text-blue-400',
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
  },
  {
    name: 'Kotak e-Mandate',
    code: 'Kotak',
    color: '#8b5cf6',
    bgLight: 'bg-violet-500/10',
    borderLight: 'border-violet-500/20',
    textColor: 'text-violet-400',
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed',
  },
];

const TABS = [
  { id: 'performance', label: 'Gateway Performance' },
  { id: 'reroute', label: 'Smart Reroute Analysis' },
  { id: 'attribution', label: 'Error Attribution' },
  { id: 'settlement', label: 'Settlement Velocity' },
];

export const BankGatewayAnalytics: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentTab, setCurrentTab] = useState<string>('performance');
  const [currentDateRange, setCurrentDateRange] = useState<number>(30);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState<boolean>(false);
  const [hoveredBankIndex, setHoveredBankIndex] = useState<number | null>(null);
  const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const currentData = GATEWAY_DATA_STORE[currentTab][currentDateRange];
  const totalVolume = currentData.data.reduce((acc, v) => acc + v, 0);

  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl border ${
        isDark
          ? 'bg-gradient-to-b from-[#0c121e] via-[#0f172a] to-[#090e17] border-white/10 text-white'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-slate-200/60'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] dark:border-white/[0.08] border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Landmark className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">
              Bank Gateway & Payment Switch Performance
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time settlement & auto-reroute matrix across Indian banking switches
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Switch</span>
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDateDropdownOpen(!isDateDropdownOpen);
                setIsMenuDropdownOpen(false);
              }}
              className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-xl transition-all text-xs font-bold shadow-sm border cursor-pointer ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {currentDateRange === 7
                  ? 'Last 7 Days'
                  : currentDateRange === 30
                  ? 'Last 30 Days'
                  : currentDateRange === 90
                  ? 'Last 90 Days'
                  : 'Last Year'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isDateDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'
                }`}
              />
            </button>

            <AnimatePresence>
              {isDateDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl p-1.5 z-30 border ${
                    isDark
                      ? 'bg-[#0f172a] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {[
                    { label: 'Last 7 Days', range: 7 },
                    { label: 'Last 30 Days', range: 30 },
                    { label: 'Last 90 Days', range: 90 },
                    { label: 'Last Year', range: 365 },
                  ].map((opt) => (
                    <button
                      key={opt.range}
                      onClick={() => {
                        setCurrentDateRange(opt.range);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        currentDateRange === opt.range
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : isDark
                          ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentDateRange === opt.range && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsMenuDropdownOpen(!isMenuDropdownOpen);
                setIsDateDropdownOpen(false);
              }}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-xl transition-all shadow-sm border cursor-pointer ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-slate-300 hover:text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {isMenuDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl p-1.5 z-30 border ${
                    isDark
                      ? 'bg-[#0f172a] border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <button
                    onClick={() => setIsMenuDropdownOpen(false)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Switch Data</span>
                  </button>
                  <button
                    onClick={() => setIsMenuDropdownOpen(false)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>Configure Reroute Rules</span>
                  </button>
                  <button
                    onClick={() => setIsMenuDropdownOpen(false)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Set Gateway Latency Alert</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative z-10 pt-4 pb-2">
        <div className="flex items-center gap-6 text-xs sm:text-sm overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`relative pb-3 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isDark ? 'text-white' : 'text-slate-900'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeBankTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-md shadow-emerald-500/50"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 dark:via-white/10 via-slate-200 to-transparent my-2" />

      {/* Content 2-Column Layout */}
      <div className="relative z-10 pt-4 flex flex-col xl:flex-row xl:items-stretch gap-6">
        {/* Left Column: Stats & Insights */}
        <div className="xl:w-[340px] flex-shrink-0 flex flex-col justify-between space-y-5">
          {/* Primary Metric Hero */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? 'bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/10'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400 font-sans mb-1">
              {currentData.growth}
            </div>
            <div className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Total gateway recovery conversion
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
              {currentData.users} transactions dynamically rescued
            </div>
          </div>

          {/* Real-time 2x Stats Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div
              className={`p-3.5 rounded-2xl border ${
                isDark
                  ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/10'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xl font-black font-sans">{currentData.avgRate}</div>
              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Win Rate</div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400">{currentData.avgRateDelta}</span>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isDark
                  ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/10'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xl font-black font-sans">{currentData.avgTat}</div>
              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Switch Latency</div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400">{currentData.avgTatDelta}</span>
              </div>
            </div>
          </div>

          {/* Strategic Insights Panel */}
          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-transparent border-violet-500/20'
                : 'bg-violet-50/50 border-violet-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-2.5">
              <div className="h-8 w-8 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  Strategic Switch Insights
                </h4>
                <p className={`text-xs leading-relaxed mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {currentData.insights}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/[0.08] dark:border-white/[0.08] border-slate-200 flex items-center justify-end">
              <button
                onClick={handleRefreshInsights}
                className="text-[11px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Refresh analysis</span>
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive High-Polish Bar Chart */}
        <div className="flex-1 flex flex-col justify-between min-h-[340px]">
          <div
            className={`flex-1 rounded-2xl border p-5 flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border-white/10'
                : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            {/* Top Indicator info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
              <span className="font-mono text-[11px]">Rescued Capital Volume (₹k)</span>
              <span className="text-[11px] font-bold text-emerald-400">
                {selectedBankIndex !== null
                  ? `Selected: ${BANK_CHANNELS[selectedBankIndex].name}`
                  : 'Hover/Click on any switch to inspect'}
              </span>
            </div>

            {/* Custom Interactive SVG Bar Chart with rounded capsules */}
            <div className="relative w-full h-56 flex items-end justify-around gap-2 pt-4 px-2">
              {BANK_CHANNELS.map((bank, index) => {
                const value = currentData.data[index] || 10;
                const maxValue = Math.max(...currentData.data, 1);
                const heightPercent = Math.max(12, Math.round((value / maxValue) * 100));
                const isHovered = hoveredBankIndex === index;
                const isSelected = selectedBankIndex === index;
                const percentOfTotal = ((value / totalVolume) * 100).toFixed(1);

                return (
                  <div
                    key={bank.name}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredBankIndex(index)}
                    onMouseLeave={() => setHoveredBankIndex(null)}
                    onClick={() => setSelectedBankIndex(isSelected ? null : index)}
                  >
                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute bottom-full mb-1 z-30 px-3 py-2 rounded-xl shadow-2xl border text-center pointer-events-none ${
                            isDark
                              ? 'bg-[#0f172a] border-white/20 text-white'
                              : 'bg-white border-slate-300 text-slate-900 shadow-xl'
                          }`}
                        >
                          <div className="text-xs font-bold">{bank.name}</div>
                          <div className="text-sm font-black font-sans text-emerald-400">
                            ₹{value}k
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {percentOfTotal}% of total recovery
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Value on top of bar */}
                    <span
                      className={`text-[11px] font-mono font-bold mb-1.5 transition-colors ${
                        isHovered || isSelected
                          ? 'text-white scale-105'
                          : isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      ₹{value}k
                    </span>

                    {/* The Bar */}
                    <div className="w-full max-w-[56px] h-full flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                        className={`w-full rounded-2xl transition-all duration-200 relative overflow-hidden ${
                          isSelected ? 'ring-2 ring-white shadow-lg' : ''
                        }`}
                        style={{
                          background: `linear-gradient(180deg, ${bank.gradientFrom} 0%, ${bank.gradientTo} 100%)`,
                          boxShadow: isHovered || isSelected
                            ? `0 0 20px ${bank.color}80, 0 4px 12px ${bank.color}40`
                            : `0 4px 12px ${bank.color}20`,
                          opacity: hoveredBankIndex !== null && !isHovered ? 0.45 : 1,
                        }}
                      >
                        {/* Shimmer top cap */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-white/30 rounded-t-2xl" />
                      </motion.div>
                    </div>

                    {/* X-axis Bank Code Label */}
                    <span
                      className={`text-[11px] font-bold mt-2.5 transition-colors ${
                        isHovered || isSelected
                          ? 'text-white'
                          : isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {bank.code}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Switch Date Labels */}
          <div className="mt-3 grid grid-cols-5 gap-2 text-center">
            {['HDFC Live', 'SBI Node', 'ICICI Switch', 'Axis Direct', 'Kotak PG'].map((label) => (
              <div key={label} className={`text-[10px] font-mono truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Legend Cards below */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.08] dark:border-white/[0.08] border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BANK_CHANNELS.map((channel, index) => {
            const value = currentData.data[index];
            const percentage = ((value / totalVolume) * 100).toFixed(1);
            const isHovered = hoveredBankIndex === index;
            const isSelected = selectedBankIndex === index;

            return (
              <motion.div
                key={channel.name}
                onMouseEnter={() => setHoveredBankIndex(index)}
                onMouseLeave={() => setHoveredBankIndex(null)}
                onClick={() => setSelectedBankIndex(isSelected ? null : index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                  isHovered || isSelected
                    ? isDark
                      ? 'bg-white/[0.08] border-white/30 shadow-lg'
                      : 'bg-white border-slate-300 shadow-md ring-1 ring-slate-300'
                    : isDark
                    ? 'bg-white/[0.03] border-white/5 hover:border-white/15'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm"
                  style={{
                    backgroundColor: channel.color,
                    boxShadow: isHovered || isSelected ? `0 0 10px ${channel.color}` : 'none',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold truncate transition-colors ${
                      isHovered || isSelected
                        ? isDark ? 'text-white' : 'text-slate-900'
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {channel.name}
                  </div>
                  <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ₹{value}k • {percentage}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
