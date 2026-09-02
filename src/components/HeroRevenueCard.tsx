"use client";

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import {
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Check,
} from 'lucide-react';

interface HeroRevenueCardProps {
  isDark?: boolean;
}

export const HeroRevenueCard: React.FC<HeroRevenueCardProps> = ({ isDark = true }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  const [progress, setProgress] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [recentFlash, setRecentFlash] = useState(false);

  // Animation controller for synchronized number + SVG graph reveal
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 2500; // 2.5 seconds smooth easing
    const startVal = 100000;
    const endVal = 523960; // Exact target amount as requested

    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);

      setProgress(easedProgress);
      const calculatedVal = Math.round(startVal + (endVal - startVal) * easedProgress);
      setCurrentAmount(calculatedVal);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setRecentFlash(true);
        setTimeout(() => setRecentFlash(false), 800);
      }
    };

    if (isInView) {
      setProgress(0);
      setCurrentAmount(startVal);
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  // Format currency in Indian Numbering System
  const formatRupees = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Upward trending SVG curve with realistic zig-zag ups and downs (failures & recoveries)
  const p0 = { x: 0, y: 72 };
  const p1 = { x: 42, y: 84 - progress * 6 };       // Initial failure dip
  const p2 = { x: 85, y: 64 - progress * 16 };      // First recovery attempt surge
  const p3 = { x: 130, y: 76 - progress * 20 };     // Mid-funnel drop / timeout
  const p4 = { x: 175, y: 48 - progress * 28 };     // WhatsApp 1-tap breakout
  const p5 = { x: 220, y: 58 - progress * 32 };     // Micro pullback / auth check
  const p6 = { x: 260, y: 32 - progress * 22 };     // UPI settlement surge
  const endY = 66 - progress * 50;                  // Rising to peak Y: 16
  const p7 = { x: 300, y: endY };

  // Smooth zig-zag bezier path
  const pathD = `M ${p0.x},${p0.y} ` +
    `C 15,${(p0.y + p1.y) / 2} 28,${p1.y} ${p1.x},${p1.y} ` +
    `C 56,${p1.y} 70,${p2.y + 6} ${p2.x},${p2.y} ` +
    `C 100,${p2.y - 6} 115,${p3.y} ${p3.x},${p3.y} ` +
    `C 145,${p3.y} 160,${p4.y + 8} ${p4.x},${p4.y} ` +
    `C 190,${p4.y - 8} 205,${p5.y} ${p5.x},${p5.y} ` +
    `C 235,${p5.y} 248,${p6.y + 6} ${p6.x},${p6.y} ` +
    `C 275,${p6.y - 6} 288,${p7.y + 3} ${p7.x},${p7.y}`;

  const areaD = `${pathD} L 300,100 L 0,100 Z`;

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[450px] lg:max-w-[465px] mx-auto py-5 sm:py-7 px-2 sm:px-3 select-none">
      
      {/* ================= FLOATING BADGE 1: WHATSAPP SMART LINK (Top-Right Floating) ================= */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-0.6, 0.6, -0.6],
        }}
        transition={{
          duration: 5.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className={`absolute -top-3 -right-2 sm:-right-4 z-30 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/95 border-emerald-500/40 text-white shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(37,211,102,0.2)]'
            : 'bg-white/95 border-emerald-500/35 text-slate-900 shadow-[0_12px_35px_rgba(16,185,129,0.2)]'
        }`}
      >
        {/* Exact WhatsApp Official Green Icon Match */}
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md flex items-center justify-center bg-[#25D366]">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold tracking-tight">WhatsApp Smart Link</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold tracking-tight">91% 1-Tap Read Rate</p>
        </div>
      </motion.div>

      {/* ================= MAIN REVENUE CARD (Permanent Glowing Border + Glassmorphism) ================= */}
      <motion.div
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="relative"
      >
        {/* Multi-Layered Atmosphere Glow Behind Glass */}
        <div
          className="absolute -top-14 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
        />
        <div
          className="absolute -bottom-10 right-2 h-48 w-48 rounded-full bg-lime-500/20 blur-3xl pointer-events-none"
        />

        {/* The Frosted Glassmorphism Card with Permanent Glowing Emerald Border */}
        <div
          ref={cardRef}
          className={`relative overflow-hidden rounded-[26px] p-5 sm:p-6 backdrop-blur-2xl transition-all duration-500 text-left border ${
            isDark
              ? 'bg-[#0B0F19]/90 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.18),0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-emerald-400/20'
              : 'bg-white/95 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.18),0_25px_60px_-15px_rgba(15,23,42,0.12)] ring-1 ring-emerald-500/20'
          }`}
        >
          {/* Permanent Top Specular Light Border Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

          <div className="relative flex flex-col gap-4 sm:gap-5 z-10">
            
            {/* Top Header Section - Single Clean Top-Line with LIVE badge beside text */}
            <div className={`flex items-center justify-between border-b pb-3.5 ${
              isDark ? 'border-white/[0.08]' : 'border-slate-200/80'
            }`}>
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className={`text-xs sm:text-[13px] font-bold tracking-wider uppercase ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  REVENUE RECOVERED · THIS MONTH
                </p>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
            </div>

            {/* Revenue Number Counter Section */}
            <div className="flex items-end justify-between pt-1">
              <div className="space-y-1">
                <div className={`text-xs font-semibold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span className="tracking-tight">Settled Capital</span>
                </div>
                
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight transition-colors duration-300 ${
                    recentFlash
                      ? isDark ? 'text-emerald-300' : 'text-emerald-600'
                      : isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    ₹{formatRupees(currentAmount)}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg border shadow-xs ${
                  isDark
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-300'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  +46.8%
                </div>
                <p className={`text-[11px] font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  vs last month · Razorpay
                </p>
              </div>
            </div>

            {/* Vosoone-adapted SVG Graph: Realistic Zig-Zag Volatility (Red/At-Risk -> Green Recovered Peak) */}
            <div className={`relative h-24 sm:h-28 w-full overflow-hidden rounded-2xl p-1 border backdrop-blur-xs ${
              isDark
                ? 'bg-black/40 border-white/[0.08]'
                : 'bg-slate-50/60 border-slate-200/90'
            }`}>
              <svg
                className="h-full w-full overflow-visible"
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Transition Gradient along the path: Red/At-Risk on Left -> Green/Recovered on Right */}
                  <linearGradient id="vosoone-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />     {/* Rose/Red at-risk drop */}
                    <stop offset="25%" stopColor="#fb923c" />    {/* Amber recovery step */}
                    <stop offset="55%" stopColor="#38bdf8" />    {/* Sky smart dunning rail */}
                    <stop offset="80%" stopColor="#34d399" />    {/* Emerald authorization */}
                    <stop offset="100%" stopColor="#10b981" />   {/* Peak settlement */}
                  </linearGradient>

                  <linearGradient id="vosoone-area-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25 * progress + 0.05} />
                    <stop offset="40%" stopColor="#fb923c" stopOpacity={0.15 * progress} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.35 * progress + 0.05} />
                  </linearGradient>

                  <filter id="glow-vosoone" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Subtle Grid Lines */}
                <line x1="0" y1="25" x2="300" y2="25" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="300" y2="65" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} strokeDasharray="3 3" />

                {/* Filled Area Gradient */}
                <path
                  d={areaD}
                  fill="url(#vosoone-area-gradient)"
                />

                {/* Glowing Accent Multi-Color Curve with Zig-Zag Fluctuations */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#vosoone-line-gradient)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={isDark ? "url(#glow-vosoone)" : undefined}
                />
              </svg>

              {/* Dynamic Glowing Endpoint Vertex at the recovered peak */}
              <div
                className="absolute transition-all duration-75"
                style={{
                  right: '6px',
                  top: `${Math.max(12, Math.min(85, (endY / 100) * 100))}%`,
                  transform: 'translateY(-50%)',
                }}
              >
                <div className="relative h-3.5 w-3.5">
                  <div className={`absolute inset-0 rounded-full ${
                    isDark ? 'bg-emerald-400 shadow-[0_0_14px_#10b981]' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                  }`} />
                  <div className="animate-ping absolute inset-0 rounded-full bg-emerald-400/50" />
                </div>
              </div>
            </div>

            {/* Bottom Three Metrics: SAVES, WHATSAPP OPEN, RECOVERED */}
            <div className={`grid grid-cols-3 divide-x border-y py-3 rounded-2xl px-2 backdrop-blur-xs ${
              isDark
                ? 'divide-white/[0.08] border-white/[0.08] bg-white/[0.02]'
                : 'divide-slate-200 border-slate-200 bg-slate-50/80'
            }`}>
              
              {/* SAVES */}
              <div className="text-center px-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  SAVES
                </p>
                <p className={`text-base sm:text-lg font-extrabold mt-0.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  142
                </p>
                <span className="text-[10px] text-emerald-500 font-semibold block">+18 today</span>
              </div>

              {/* WHATSAPP OPEN */}
              <div className="text-center px-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  WHATSAPP OPEN
                </p>
                <p className={`text-base sm:text-lg font-extrabold mt-0.5 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  91%
                </p>
                <span className={`text-[10px] font-medium block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>Avg 4.2m speed</span>
              </div>

              {/* RECOVERED */}
              <div className="text-center px-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  RECOVERED
                </p>
                <p className={`text-base sm:text-lg font-extrabold mt-0.5 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  86%
                </p>
                <span className="text-[10px] text-emerald-500 font-semibold block">Auto-settled</span>
              </div>

            </div>

            {/* Footer Cryptographic Verification Bar */}
            <div className="flex items-center justify-between text-xs pt-0.5 px-1">
              <span className={`flex items-center gap-1.5 font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                Razorpay Webhook Verified
              </span>
              <span className={`font-semibold text-[11px] flex items-center gap-1 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                1-Tap Ready <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ================= FLOATING BADGE 2: PAYMENT RECOVERED (Bottom-Left Floating with Premium Glowing Checkmark) ================= */}
      <motion.div
        animate={{
          y: [6, -6, 6],
          rotate: [0.6, -0.6, 0.6],
        }}
        transition={{
          duration: 5.8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.5,
        }}
        className={`absolute -bottom-3 -left-2 sm:-left-5 z-30 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isDark
            ? 'bg-slate-900/95 border-emerald-500/40 text-white shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.2)]'
            : 'bg-white/95 border-emerald-500/35 text-slate-900 shadow-[0_12px_35px_rgba(16,185,129,0.2)]'
        }`}
      >
        {/* Premium Dual-Tone Gradient Emerald Checkmark Badge */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1.5px] shadow-[0_0_12px_rgba(16,185,129,0.4)] shrink-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </div>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold tracking-tight">Payment Recovered</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/25">₹4,999</span>
          </div>
          <p className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Auto-Settled · 1-Tap UPI
          </p>
        </div>
      </motion.div>

    </div>
  );
};
