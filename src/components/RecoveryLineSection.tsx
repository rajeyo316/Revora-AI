"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface RecoveryCardItem {
  id: string;
  caseType: 'mandate' | 'card' | 'gateway' | 'cart' | 'subscription';
  failureReason: string;
  amount: number;
  customerName: string;
  maskedId: string;
  expiryOrDetail: string;
  methodType: 'card' | 'upi' | 'mandate';
  gateway: 'Razorpay';
  // Real world credit/debit/fintech card color schemes
  cardTheme: {
    bgGradient: string;
    borderDefault: string;
    accentColor: string;
    issuer: string;
  };
}

// Exact Customer Profiles with distinctive realistic card themes (Platinum, Midnight Slate, Deep Ocean Navy, Titanium Dark Gold, Emerald Obsidian)
const DATABASE_CASES: RecoveryCardItem[] = [
  {
    id: 'case-1',
    caseType: 'mandate',
    failureReason: 'Mandate expired',
    amount: 12500,
    customerName: 'ANANYA ROY',
    maskedId: '•••• •••• •••• 8391',
    expiryOrDetail: '11/26',
    methodType: 'card',
    gateway: 'Razorpay',
    cardTheme: {
      bgGradient: 'from-[#1e1b4b]/95 via-[#0f172a]/95 to-[#090d16]/95', // Deep Indigo Slate
      borderDefault: 'border-indigo-500/30',
      accentColor: 'from-indigo-400 to-purple-400',
      issuer: 'HDFC INFINIA',
    },
  },
  {
    id: 'case-2',
    caseType: 'gateway',
    failureReason: 'Gateway timeout',
    amount: 4999,
    customerName: 'RAJEYO HALDAR',
    maskedId: 'rajeyo@okaxis',
    expiryOrDetail: 'UPI AUTOPAY · eNACH',
    methodType: 'upi',
    gateway: 'Razorpay',
    cardTheme: {
      bgGradient: 'from-[#082f49]/95 via-[#0c1f2d]/95 to-[#050e14]/95', // Deep Ocean Cyan Navy
      borderDefault: 'border-cyan-500/30',
      accentColor: 'from-cyan-400 to-teal-300',
      issuer: 'AXIS REVOLVE',
    },
  },
  {
    id: 'case-3',
    caseType: 'subscription',
    failureReason: 'Auto-Debit Failed',
    amount: 8900,
    customerName: 'AARAV SHARMA',
    maskedId: '•••• •••• •••• 2475',
    expiryOrDetail: '09/27',
    methodType: 'mandate',
    gateway: 'Razorpay',
    cardTheme: {
      bgGradient: 'from-[#271d15]/95 via-[#1a140f]/95 to-[#0b0806]/95', // Titanium Gold/Bronze
      borderDefault: 'border-amber-500/30',
      accentColor: 'from-amber-400 to-yellow-200',
      issuer: 'ICICI SAPPHIRO',
    },
  },
  {
    id: 'case-4',
    caseType: 'cart',
    failureReason: 'Checkout abandoned',
    amount: 15400,
    customerName: 'PRIYA NAIR',
    maskedId: 'priya.nair@hdfcbank',
    expiryOrDetail: 'Smart 1-Tap Link · WhatsApp',
    methodType: 'upi',
    gateway: 'Razorpay',
    cardTheme: {
      bgGradient: 'from-[#2e1065]/95 via-[#1a0b36]/95 to-[#0c051a]/95', // Royal Midnight Violet
      borderDefault: 'border-purple-500/30',
      accentColor: 'from-purple-400 to-pink-400',
      issuer: 'CRED BLACK',
    },
  },
  {
    id: 'case-5',
    caseType: 'card',
    failureReason: 'Card declined',
    amount: 18500,
    customerName: 'VIKRAM SINGH',
    maskedId: '•••• •••• •••• 6104',
    expiryOrDetail: '03/28',
    methodType: 'card',
    gateway: 'Razorpay',
    cardTheme: {
      bgGradient: 'from-[#18181b]/95 via-[#111113]/95 to-[#09090b]/95', // Matte Obsidian Platinum
      borderDefault: 'border-slate-500/30',
      accentColor: 'from-slate-300 to-slate-400',
      issuer: 'AMEX CENTURION',
    },
  },
];

export const RecoveryLineSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Animation continuous track loop (0 to 1)
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying] = useState(true);

  // Fast looping ledger counter: 0 -> 300000 -> 0 (throttled at 120ms to prevent main-thread layout thrashing)
  const MAX_COUNTER = 300000;
  const [liveLedgerCounter, setLiveLedgerCounter] = useState(148500);

  const [floatingNotification, setFloatingNotification] = useState<{
    amount: number;
    id: number;
  } | null>(null);

  // Recovery wave trigger state for outwards propagating green waves on successful recovery
  const [recoveryWaveTrigger, setRecoveryWaveTrigger] = useState<number>(0);

  const recoveredInCurrentCycleRef = useRef<Set<string>>(new Set());
  const notifCounterRef = useRef(0);

  // Counter update throttled smoothly (every 120ms instead of 40ms) to ensure 60fps GPU frame rate without CPU thrashing
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setLiveLedgerCounter((prev) => {
        const increment = Math.floor(Math.random() * 2500) + 3200;
        const next = prev + increment;
        if (next >= MAX_COUNTER) {
          return 0; // Reset back to 0 once touching 300,000 and restart
        }
        return next;
      });
    }, 120);

    return () => clearInterval(counterInterval);
  }, []);

  const numCards = DATABASE_CASES.length;

  // High-performance smooth RAF loop for conveyor with low-latency updates
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    const CYCLE_DURATION = 16000; // 16 seconds for silky smooth, serene cadence

    const loop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (isPlaying) {
        setTrackProgress((prev) => {
          const next = (prev + delta / CYCLE_DURATION) % 1;

          // Check for card transitions inside the RAF loop directly for instantaneous sync
          DATABASE_CASES.forEach((card, index) => {
            const cardProgress = (next + index / numCards) % 1;

            // Trigger transformation exactly at center (0.49 to 0.51)
            if (cardProgress >= 0.49 && cardProgress <= 0.51) {
              if (!recoveredInCurrentCycleRef.current.has(card.id)) {
                recoveredInCurrentCycleRef.current.add(card.id);

                notifCounterRef.current += 1;
                const newId = notifCounterRef.current;
                setRecoveryWaveTrigger(Date.now());
                setFloatingNotification({
                  amount: card.amount,
                  id: newId,
                });

                setTimeout(() => {
                  setFloatingNotification((curr) => (curr?.id === newId ? null : curr));
                }, 1400);
              }
            }

            // Reset once card loops past start
            if (cardProgress < 0.08) {
              recoveredInCurrentCycleRef.current.delete(card.id);
            }
          });

          return next;
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, numCards]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="risk-to-revenue" className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Outer Large Dark Premium Glass Showcase Panel */}
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/[0.09] bg-gradient-to-b from-[#0B0F19] via-[#070A12] to-[#04060C] shadow-[0_20px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        
        {/* Ambient Top Glow & Grid Texture */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-b from-emerald-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

        <div className="relative z-10 px-3 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-8 sm:pb-10 flex flex-col items-center text-center">
          
          {/* Eyebrow: Minimal clean style with subtle lines */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-2.5"
          >
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-rose-500/40 to-rose-500/70" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase font-sans flex items-center gap-1.5">
              <span className="text-rose-400">FROM RISK</span>
              <span className="text-slate-500 font-normal">TO</span>
              <span className="text-emerald-400">REVENUE</span>
            </span>
            <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-emerald-500/40 to-emerald-500/70" />
          </motion.div>

          {/* Heading: Payments fail. (Line 1) / Revora recovers. (Line 2) */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-white font-metric leading-[1.12] max-w-3xl"
          >
            <span className="block">Payments fail.</span>
            <span className="font-editorial italic font-normal text-emerald-400 block mt-1 text-[1.12em] drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              Revora recovers.
            </span>
          </motion.h2>

          {/* Subtitle: From failed payments to successful recoveries — automated by Revora, powered by Razorpay. */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-3 text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl font-normal leading-relaxed"
          >
            From failed payments to successful recoveries — automated by <strong className="text-white font-semibold">Revora</strong>, powered by <strong className="text-white font-semibold">Razorpay</strong>.
          </motion.p>

          {/* ========================================================================= */}
          {/* THE RECOVERY RAIL CONVEYOR WITH PERFECT CENTER-ALIGNED LOGO & WAVES       */}
          {/* ========================================================================= */}
          <div className="relative w-full mt-6 sm:mt-8 mb-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl p-2 sm:p-4 shadow-inner">
            
            {/* Edge Fog Gradients (Seamless box exit and entry without clipping pop) */}
            <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#070A12] via-[#070A12]/95 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#070A12] via-[#070A12]/95 to-transparent z-20 pointer-events-none" />

            {/* Cards Carousel Conveyor Track - Both cards and Revora node live in this exact container */}
            <div className="relative h-[270px] sm:h-[290px] w-full flex items-center justify-center">
              
              {/* Horizontal Center Guide Rail Line with Moving Left-to-Right Red & Green Flow Arrows */}
              {/* Left Rail (Risk / Failed Payments Stream): Dim Red Subtle Rail + Soft Red Arrows */}
              <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-6 flex items-center overflow-hidden pointer-events-none z-0 opacity-40">
                {/* Subtle dimmed red rail line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-rose-500/25 to-rose-500/40" />
                
                {/* Moving red chevrons track (left to right towards Revora center hub) */}
                <div className="absolute inset-y-0 -left-12 right-4 flex items-center justify-end overflow-hidden">
                  <div className="flex items-center gap-5 animate-rail-flow pr-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <svg
                        key={`red-arr-${i}`}
                        className="w-2.5 h-2.5 text-rose-500/35 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Rail (Recovery / Settled Revenue Stream): Dim Green Subtle Rail + Soft Green Arrows */}
              <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-6 flex items-center overflow-hidden pointer-events-none z-0 opacity-40">
                {/* Subtle dimmed green rail line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-emerald-500/40 via-emerald-400/25 to-transparent" />
                
                {/* Moving green chevrons track (center hub towards right exit) */}
                <div className="absolute inset-y-0 left-4 -right-12 flex items-center justify-start overflow-hidden">
                  <div className="flex items-center gap-5 animate-rail-flow pl-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <svg
                        key={`grn-arr-${i}`}
                        className="w-2.5 h-2.5 text-emerald-400/40 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Cards Moving on the track - Vertically centered on exact same axis as Revora logo */}
              {DATABASE_CASES.map((card, index) => {
                // Generous spacing math: span from -25% (fully out of box on left) to 125% (fully out of box on right)
                const cardProgress = (trackProgress + index / numCards) % 1;
                const posX = -25 + cardProgress * 150;
                
                // Transformation state (before vs after center 50%)
                const isRecovered = cardProgress >= 0.50;
                
                // Distance from center (0 = exactly at center)
                const distFromCenter = Math.abs(cardProgress - 0.5);
                const isAtCenterHub = distFromCenter < 0.08;
                
                // Smooth scale and elevation during center crossing
                const cardScale = isAtCenterHub ? 1.05 : 0.94;
                
                // Smooth edge fade in/out for seamless loop exiting the box
                let cardOpacity = 1;
                if (cardProgress < 0.10) {
                  cardOpacity = Math.max(0, cardProgress / 0.10);
                } else if (cardProgress > 0.90) {
                  cardOpacity = Math.max(0, (1 - cardProgress) / 0.10);
                }

                return (
                  <div
                    key={card.id}
                    className="absolute top-1/2 will-change-transform pointer-events-none"
                    style={{
                      left: `${posX}%`,
                      top: '50%',
                      transform: `translate3d(-50%, -50%, 0) scale(${cardScale})`,
                      opacity: cardOpacity,
                      zIndex: isAtCenterHub ? 10 : 5,
                      transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), opacity 0.25s ease-out',
                    }}
                  >
                    {/* Realistic Real-World Physical Card with Distinctive Base Theme */}
                    <div
                      className={`relative w-[240px] xs:w-[260px] sm:w-[285px] rounded-2xl p-3.5 sm:p-4 transition-all duration-500 backdrop-blur-xl border bg-gradient-to-br ${card.cardTheme.bgGradient} ${
                        isRecovered
                          ? 'border-emerald-500/40 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.2)] text-white'
                          : `${card.cardTheme.borderDefault} shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_15px_rgba(244,63,94,0.15)] text-slate-100`
                      }`}
                    >
                      {/* Top Specular Sheen (Real-world glossy plastic/metal card effect) */}
                      <div className={`absolute inset-x-0 top-0 h-[1.5px] rounded-t-2xl bg-gradient-to-r from-transparent ${
                        isRecovered
                          ? 'via-emerald-400/60'
                          : 'via-white/30'
                      } to-transparent`} />

                      {/* Card Header: ONLY STATUS AND AMOUNT BADGE CHANGE COLOR (RED -> GREEN) */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          {/* Live Status indicator Dot */}
                          <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            isRecovered ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                          }`} />
                          
                          {/* Status Label Text */}
                          <span className={`text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-300 ${
                            isRecovered ? 'text-emerald-300' : 'text-rose-400'
                          }`}>
                            {isRecovered ? 'Recovered' : card.failureReason}
                          </span>
                        </div>

                        {/* Amount Pill: Red when failed on left, Green when recovered on right */}
                        <span className={`text-[11px] sm:text-xs font-black font-metric px-2 py-0.5 rounded-md border transition-all duration-300 ${
                          isRecovered
                            ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'text-rose-300 bg-rose-500/20 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        }`}>
                          {isRecovered ? `+₹${formatCurrency(card.amount)}` : `-₹${formatCurrency(card.amount)}`}
                        </span>
                      </div>

                      {/* Card Middle: Card / UPI visual elements with real card issuer badge */}
                      <div className="py-2.5 space-y-1 text-left">
                        {card.methodType === 'card' || card.methodType === 'mandate' ? (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                {/* Gold EMV Chip / Contactless */}
                                <div className="w-5 h-3.5 rounded bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border border-amber-500/60 shadow-xs flex items-center justify-center">
                                  <div className="w-3 h-2 border-r border-b border-amber-700/50" />
                                </div>
                                <div className="text-[10px] text-slate-300 font-mono tracking-tight font-semibold">
                                  {card.cardTheme.issuer}
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">Razorpay</span>
                            </div>
                            <p className="text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-100 pt-0.5">
                              {card.maskedId}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-100">
                                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                                <span>UPI Autopay</span>
                                <span className="text-[9px] font-mono text-slate-400 ml-1">· {card.cardTheme.issuer}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">Razorpay</span>
                            </div>
                            <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-100 truncate pt-0.5">
                              {card.maskedId}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Card Footer: Database Customer Name & Settlement Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[9px] sm:text-[10px]">
                        <div className="text-left">
                          <span className="text-slate-400 block text-[8px] uppercase font-semibold tracking-wider font-mono">CUSTOMER / ACCOUNT</span>
                          <span className="font-bold text-slate-200 truncate max-w-[125px] block tracking-tight font-sans">
                            {card.customerName}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 block text-[8px] uppercase font-semibold tracking-wider font-mono">
                            {isRecovered ? 'STATUS' : 'ACTION'}
                          </span>
                          <span className={`font-bold font-sans transition-colors duration-300 ${
                            isRecovered ? 'text-emerald-400' : 'text-slate-300'
                          }`}>
                            {isRecovered ? '1-Tap Settled' : card.expiryOrDetail}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* ========================================================================= */}
              {/* EXACT VERTICAL & HORIZONTAL MID-PLACEMENT: CIRCULAR GREEN REVORA NODE      */}
              {/* Cards physically pass directly behind the middle of this node (z-30)      */}
              {/* Green waves propagate outwards with fading opacity on recovery & continuous*/}
              {/* ========================================================================= */}
              <div
                className="absolute left-1/2 top-1/2 z-30 pointer-events-none flex items-center justify-center"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                
                {/* DYNAMIC PROPAGATING RECOVERY SHOCKWAVE BURST (Triggers on Card Recovery) */}
                <AnimatePresence>
                  {recoveryWaveTrigger > 0 && (
                    <React.Fragment key={`burst-group-${recoveryWaveTrigger}`}>
                      {/* Outward Propagating Wave 1 */}
                      <motion.div
                        key={`burst-1-${recoveryWaveTrigger}`}
                        initial={{ scale: 0.7, opacity: 0.8 }}
                        animate={{ scale: 3.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute w-16 h-16 rounded-full border-2 border-emerald-400/80 pointer-events-none"
                      />
                      {/* Outward Propagating Wave 2 */}
                      <motion.div
                        key={`burst-2-${recoveryWaveTrigger}`}
                        initial={{ scale: 0.7, opacity: 0.6 }}
                        animate={{ scale: 2.6, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                        className="absolute w-16 h-16 rounded-full border border-teal-300/70 pointer-events-none"
                      />
                      {/* Outward Propagating Ambient Glow Disk */}
                      <motion.div
                        key={`burst-3-${recoveryWaveTrigger}`}
                        initial={{ scale: 0.6, opacity: 0.4 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                        className="absolute w-20 h-20 rounded-full bg-emerald-500/20 blur-md pointer-events-none"
                      />
                    </React.Fragment>
                  )}
                </AnimatePresence>

                {/* CONTINUOUS AMBIENT RADAR WAVES: Radiating Outwards with Fading Opacity */}
                <motion.div
                  animate={{
                    scale: [0.7, 2.4],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-16 h-16 rounded-full border border-emerald-400/50 pointer-events-none"
                />

                <motion.div
                  animate={{
                    scale: [0.7, 2.4],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 1.3,
                  }}
                  className="absolute w-16 h-16 rounded-full border border-teal-400/40 pointer-events-none"
                />

                {/* Circular Green Revora Center Badge */}
                <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 p-[2px] shadow-[0_0_25px_rgba(16,185,129,0.6)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#05130E] flex items-center justify-center backdrop-blur-md">
                    {/* Glowing Green Heartbeat Waveform Logo with Smooth Soft Pulse Glow */}
                    <svg
                      viewBox="0 0 512 512"
                      className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 108 268 H 182 L 222 176 C 228 162 242 162 248 176 L 278 358 C 283 372 297 372 302 358 L 338 252"
                        stroke="currentColor"
                        strokeWidth="38"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 326 264 L 372 254 C 382 251 388 260 384 270 L 366 312"
                        stroke="currentColor"
                        strokeWidth="38"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom 3 Stage Labels directly on the rail */}
            <div className="grid grid-cols-3 text-center border-t border-white/[0.08] pt-2.5 text-[11px] sm:text-xs font-semibold font-sans tracking-wider">
              <div className="flex items-center justify-center gap-1.5 text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>FAILED PAYMENTS</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>RECOVERY FLOW</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>RECOVERED</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* REAL RAPIDLY INCREASING ACCOUNTING TOTALS (0 -> 3,00,000 LOOP)            */}
          {/* ========================================================================= */}
          <div className="relative w-full max-w-xl flex items-center justify-center gap-2.5 sm:gap-4">
            
            {/* Left Card: WITHOUT REVORA (Red Lost Revenue) */}
            <div className="flex-1 relative rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-rose-500/30 bg-gradient-to-b from-rose-950/25 to-black/60 backdrop-blur-xl text-center shadow-lg">
              
              {/* Floating Amount Deduction Toast */}
              <AnimatePresence>
                {floatingNotification && (
                  <motion.div
                    key={`notif-loss-${floatingNotification.id}`}
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-sans font-bold text-[10px] sm:text-xs shadow-md"
                  >
                    -₹{formatCurrency(floatingNotification.amount)}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[10px] sm:text-xs font-semibold font-sans tracking-wider text-slate-400 uppercase">
                WITHOUT REVORA
              </p>
              
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-sans tracking-tight text-rose-400 mt-0.5 tabular-nums">
                -₹{formatCurrency(liveLedgerCounter)}
              </div>

              <p className="text-[11px] sm:text-xs font-sans text-slate-400 mt-0.5">
                lost · recurring
              </p>
            </div>

            {/* Center VS Indicator Badge */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-[#0B0F19] text-slate-400 font-sans font-semibold text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-md">
              VS
            </div>

            {/* Right Card: WITH REVORA (Green Recovered Revenue) */}
            <div className="flex-1 relative rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-500/40 bg-gradient-to-b from-emerald-950/25 to-black/60 backdrop-blur-xl text-center shadow-lg">
              
              {/* Floating Amount Addition Toast */}
              <AnimatePresence>
                {floatingNotification && (
                  <motion.div
                    key={`notif-gain-${floatingNotification.id}`}
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: -20, scale: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-sans font-black text-[10px] sm:text-xs shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                  >
                    +₹{formatCurrency(floatingNotification.amount)}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[10px] sm:text-xs font-semibold font-sans tracking-wider text-slate-400 uppercase">
                WITH REVORA
              </p>
              
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-sans tracking-tight text-emerald-400 mt-0.5 tabular-nums">
                +₹{formatCurrency(liveLedgerCounter)}
              </div>

              <p className="text-[11px] sm:text-xs font-sans text-emerald-400/80 mt-0.5">
                recovered · autonomous
              </p>
            </div>

          </div>

          {/* Bottom Footnote Badge: Real Razorpay Telemetry Sync */}
          <div className="mt-5 flex items-center gap-2 text-[11px] font-sans text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay Autonomous Recovery Daemon Active · 100% Deterministic Event Graph</span>
          </div>

        </div>

      </div>

    </section>
  );
};
