import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import {
  Check,
  RotateCw,
  Zap,
  ShieldCheck,
  Sparkles,
  Phone,
  Mic,
  ArrowRight,
  Lock,
  Clock,
  CheckCheck,
  Copy,
  User,
  Activity,
  ChevronLeft,
  Video,
  Plus,
  Camera,
  Wifi,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isDark: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', isDark }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative group rounded-2xl transition-all duration-300 w-full overflow-hidden ${
        isDark
          ? 'bg-[#0b1324]/90 text-white border border-white/10 shadow-2xl shadow-black/60 hover:border-emerald-500/30 hover:shadow-emerald-500/10'
          : 'bg-white text-slate-900 border border-slate-200/90 shadow-xl shadow-slate-200/60 hover:border-emerald-500/40 hover:shadow-emerald-500/10'
      } backdrop-blur-xl ${className}`}
    >
      {/* Subtle Top Inner Sheen Line */}
      <div className={`absolute inset-x-0 top-0 h-[1px] ${
        isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'
      }`} />
      {/* Card Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

interface StageProps {
  stepNumber: number;
  badgeText: string;
  title: string;
  reason?: string;
  explanation: string;
  pillTag: string;
  pillIcon: React.ComponentType<{ className?: string }>;
  isDark: boolean;
  reversed?: boolean;
  children: React.ReactNode;
}

const SingleStage: React.FC<StageProps> = ({
  stepNumber,
  badgeText,
  title,
  explanation,
  pillTag,
  pillIcon: PillIcon,
  isDark,
  reversed = false,
  children,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { margin: '-20% 0px -20% 0px', once: false });

  return (
    <div
      ref={stageRef}
      id={`recovery-stage-${stepNumber}`}
      className="relative min-h-[440px] lg:min-h-[500px] flex items-center justify-center py-6 sm:py-10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ------------------------------------------------------------- */}
          {/* TEXT CONTENT COLUMN                                           */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 24 : -24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: '-15% 0px -15% 0px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-5 flex flex-col justify-center space-y-3.5 ${
              reversed ? 'lg:order-3' : 'lg:order-1'
            }`}
          >
            {/* Step Category Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 transition-colors ${
                isInView
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isDark
                  ? 'bg-white/5 border-white/10 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isInView ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{badgeText}</span>
              </span>
            </div>

            {/* Stage Title */}
            <h2 className={`text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight font-sans leading-[1.2] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {title}
            </h2>

            {/* Explanation Narrative */}
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {explanation}
            </p>

            {/* Clean Pill Tag */}
            <div className="pt-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <PillIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-xs">{pillTag}</span>
              </div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------- */}
          {/* CENTER COLUMN: Numbered Node positioned over the vertical rail */}
          {/* ------------------------------------------------------------- */}
          <div className="hidden lg:flex lg:col-span-2 lg:order-2 justify-center items-center relative py-4 z-20">
            <div className="relative group cursor-default">
              {/* Pulsing Luminous Emerald Aura when In View */}
              {isInView && (
                <motion.div
                  layoutId="activeRailNodeGlow"
                  className="absolute -inset-3 rounded-full bg-emerald-500/35 blur-md animate-pulse pointer-events-none"
                />
              )}

              {/* Numbered Circular Node */}
              <motion.button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`recovery-stage-${stepNumber}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                title={`Jump to Step 0${stepNumber}`}
                animate={{
                  scale: isInView ? 1.15 : 1,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-400 relative z-20 shadow-lg cursor-pointer ${
                  isInView
                    ? 'bg-emerald-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-500/30 border-2 border-emerald-400'
                    : isDark
                    ? 'bg-[#0a0f1d] text-slate-400 border-2 border-slate-700 hover:border-slate-500 hover:text-white'
                    : 'bg-white text-slate-500 border-2 border-slate-200 hover:border-slate-400 shadow-sm hover:text-slate-800'
                }`}
              >
                <span>{stepNumber}</span>
              </motion.button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PRODUCT UI / VISUAL CARD COLUMN (PERFECTLY CENTERED)          */}
          {/* ------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? -24 : 24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, margin: '-15% 0px -15% 0px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:col-span-5 flex items-center justify-center w-full ${
              reversed ? 'lg:order-1' : 'lg:order-3'
            }`}
          >
            <div className="w-full max-w-[360px] sm:max-w-[390px] mx-auto flex items-center justify-center">
              {children}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export const RecoveryRailSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stagesWrapperRef = useRef<HTMLDivElement>(null);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);

  // Measure continuous scroll progress strictly across the stages wrapper
  const { scrollYProgress } = useScroll({
    target: stagesWrapperRef,
    offset: ['start 40%', 'end 60%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const railProgressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  return (
    <section
      id="workflow"
      className={`relative w-full overflow-hidden ${
        isDark ? 'bg-[#060913]' : 'bg-slate-50/50'
      }`}
    >
      {/* ======================================================================= */}
      {/* SECTION HEADER                                                          */}
      {/* ======================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold font-mono uppercase tracking-wider text-emerald-400 mb-3 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Autonomous Recovery Rail</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400 text-[10px] font-bold">RAZORPAY DIRECT INTEGRATION</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          From Bank Failure to Instant Settlement
        </h2>
        <p className={`mt-2.5 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Every transaction failure is evaluated against hard stopping rules, diagnostic patterns, and dynamic payment links.
        </p>

        {/* Interactive 1 2 3 4 Stage Quick Navigation Selector */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { num: 1, label: '01 Failure Ingestion', icon: Zap },
            { num: 2, label: '02 AI Diagnosis', icon: Cpu },
            { num: 3, label: '03 Omni Outreach', icon: Sparkles },
            { num: 4, label: '04 Settle & Sync', icon: CheckCheck },
          ].map((stage) => {
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.num}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`recovery-stage-${stage.num}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`group px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold font-sans flex items-center gap-2 transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-200 hover:border-emerald-500/40 hover:bg-emerald-50 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  {stage.num}
                </span>
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* STAGES WRAPPER WITH BOUNDED CENTER VERTICAL RAIL (DOT 1 TO DOT 4 ONLY)  */}
      {/* ======================================================================= */}
      <div ref={stagesWrapperRef} className="relative z-10 py-4">

        {/* CONTINUOUS CENTER VERTICAL RAIL (Desktop) - bounded precisely between Node 1 (12.5%) and Node 4 (87.5%) */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[12.5%] bottom-[12.5%] w-[3px] z-10 pointer-events-none">
          {/* Background Neutral Track Line */}
          <div className={`w-full h-full rounded-full ${
            isDark ? 'bg-slate-800/80' : 'bg-slate-200'
          }`} />

          {/* Continuous Active Laser Emerald Progress Fill Line */}
          <motion.div
            className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] origin-top"
            style={{ height: railProgressHeight }}
          />

          {/* Luminous Glowing Bead Traveling down the Rail */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-300 shadow-[0_0_14px_#10b981,0_0_22px_#34d399] z-20"
            style={{
              top: railProgressHeight,
              opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
            }}
          />
        </div>

        {/* ===================================================================== */}
        {/* STAGE 1: DOT 1 -> TEXT ON LEFT, CARD ON RIGHT                         */}
        {/* ===================================================================== */}
        <SingleStage
          stepNumber={1}
          badgeText="STEP 01 · 2-CLICK SETUP & INGESTION"
          title="Razorpay Payment/Revenue Risk Detected"
          explanation="No manual CSV uploads or API wrangling. Official Razorpay OAuth links your account in 30 seconds, automatically subscribing to real-time payment.failed webhooks and mandate drop-offs before customer churn occurs."
          pillTag="1-click · 30 seconds"
          pillIcon={Clock}
          isDark={isDark}
          reversed={false}
        >
          {/* Card 1: Razorpay OAuth & Webhook Ingestion */}
          <GlassCard isDark={isDark} className="p-5 sm:p-6">
            {/* Top Browser Bar */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-tight ${
                isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                app.revora.ai/razorpay-sync
              </div>
            </div>

            {/* Checklist */}
            <div className="py-4 space-y-3 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2.5">
                <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Authorising via Razorpay Official Partner OAuth
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Subscribing to payment.failed & order.paid webhooks
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-4.5 h-4.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center shrink-0">
                  <RotateCw className="w-3 h-3 animate-spin text-emerald-500" />
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Importing active subscriptions & UPI mandates
                </span>
              </div>
            </div>

            {/* Primary Razorpay Action Button */}
            <div className="pt-1">
              <button className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm text-center shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Connect Razorpay Account</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400 dark:text-slate-400 pt-3">
              Official Razorpay Partner OAuth · Read-only access · Revoke anytime
            </p>
          </GlassCard>
        </SingleStage>

        {/* ===================================================================== */}
        {/* STAGE 2: DOT 2 -> CARD ON LEFT, TEXT ON RIGHT (Shivangi Sharma)       */}
        {/* ===================================================================== */}
        <SingleStage
          stepNumber={2}
          badgeText="STEP 02 · REAL-TIME AI DIAGNOSIS"
          title="AI Root Cause Identified"
          explanation="Insufficient funds, expired cards, paused UPI mandates, bank switch downtime — Revora decodes the technical error signature behind every Razorpay decline in under 300ms, scoring recovery propensity and scheduling the ideal strategy."
          pillTag="Automatic detection · 24/7"
          pillIcon={Zap}
          isDark={isDark}
          reversed={true}
        >
          {/* Card 2: Live Failed Payments Queue */}
          <GlassCard isDark={isDark} className="p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Failed payments (Razorpay Live Feed)
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </span>
            </div>

            {/* Transaction Rows */}
            <div className="divide-y divide-slate-100 dark:divide-white/10 text-xs">
              {/* Row 1 - Shivangi Sharma */}
              <motion.div
                whileHover={{ x: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                className="py-2.5 px-2 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Shivangi Sharma
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Pro · monthly
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹1,499
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40">
                    Insufficient funds
                  </span>
                </div>
              </motion.div>

              {/* Row 2 */}
              <motion.div
                whileHover={{ x: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                className="py-2.5 px-2 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Arjun Mehta
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Growth · monthly
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹999
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200/60 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800/40">
                    UPI mandate paused
                  </span>
                </div>
              </motion.div>

              {/* Row 3 */}
              <motion.div
                whileHover={{ x: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                className="py-2.5 px-2 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Neha Kapoor
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Starter · monthly
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹499
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/40">
                    Card expired
                  </span>
                </div>
              </motion.div>

              {/* Row 4 */}
              <motion.div
                whileHover={{ x: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                className="py-2.5 px-2 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Rohan Verma
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Pro · annual
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹14,999
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    Bank downtime
                  </span>
                </div>
              </motion.div>
            </div>

            <p className="text-center text-[10px] text-slate-400 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-white/10">
              Decoded in real time · recovery queued automatically
            </p>
          </GlassCard>
        </SingleStage>

        {/* ===================================================================== */}
        {/* STAGE 3: DOT 3 -> TEXT ON LEFT, PURE IPHONE WHATSAPP UI                */}
        {/* ===================================================================== */}
        <SingleStage
          stepNumber={3}
          badgeText="STEP 03 · BOUNDED OUTREACH"
          title="Recovery Action Executed"
          explanation="Revora’s conversational voice agent or interactive WhatsApp smart templates reach out empathetically at the exact right moment. Strict policy boundaries enforce maximum 3 retry attempts, quiet hours (9 AM - 8 PM), and pre-approved dynamic waivers."
          pillTag="RBI compliant · Bounded policies"
          pillIcon={ShieldCheck}
          isDark={isDark}
          reversed={false}
        >
          {/* Direct Standalone Ultra-Slim Bezel iPhone 16 Pro Frame with static WhatsApp UI */}
          <div className="flex flex-col items-center justify-center w-full py-2">
            {/* iPhone Ultra-Thin Titanium Chassis */}
            <div className="w-full max-w-[315px] mx-auto rounded-[50px] p-[3.5px] bg-gradient-to-b from-[#4b5563] via-[#232a36] to-[#111622] border border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] relative select-none">
              
              {/* iPhone Screen Container */}
              <div className="w-full rounded-[46px] overflow-hidden bg-[#0c1317] text-[#e9edef] flex flex-col h-[545px] relative">
                
                {/* iPhone Status Bar + Perfectly Centered Dynamic Island */}
                <div className="pt-3 px-6 pb-1 bg-[#0c1317] relative flex items-center justify-between text-[12px] font-semibold text-[#e9edef] z-20">
                  <span className="font-medium tracking-tight pl-1">9:41</span>
                  
                  {/* Centered Dynamic Island Pill */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[94px] h-[25px] bg-black rounded-full flex items-center justify-between px-3 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d151a] border border-[#1e2a32] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#1b252d]" />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0a0f13] border border-[#1b242a]" />
                  </div>

                  <div className="flex items-center gap-1.5 text-[#e9edef] pr-1">
                    {/* Signal bars */}
                    <div className="flex items-end gap-[1.5px] h-2.5">
                      <span className="w-[2px] h-1 bg-white rounded-xs" />
                      <span className="w-[2px] h-1.5 bg-white rounded-xs" />
                      <span className="w-[2px] h-2 bg-white rounded-xs" />
                      <span className="w-[2px] h-2.5 bg-white rounded-xs" />
                    </div>
                    <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                    <div className="w-5 h-2.5 rounded-[3.5px] border border-white p-[1px] flex items-center">
                      <div className="w-full h-full bg-white rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp App Navigation Header */}
                <div className="px-3.5 py-2 bg-[#0c1317] border-b border-[#202c33]/70 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-6 h-6 text-[#007aff] -ml-1.5 cursor-pointer stroke-[2.5]" />
                    
                    {/* Profile Avatar with Revora Waveform Logo */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                      <Activity className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                    
                    {/* Contact Name & Status */}
                    <div className="leading-tight">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold text-[#e9edef]">Revora AI</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#00a884] text-[9px] text-white flex items-center justify-center font-bold">
                          ✓
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8696a0]">Business Account</span>
                    </div>
                  </div>

                  {/* Video & Phone Call Buttons */}
                  <div className="flex items-center gap-4 text-[#007aff] pr-1.5">
                    <Video className="w-5 h-5 cursor-pointer opacity-90" />
                    <Phone className="w-4.5 h-4.5 cursor-pointer opacity-90" />
                  </div>
                </div>

                {/* WhatsApp Chat Canvas */}
                <div 
                  className="flex-1 p-3.5 overflow-y-auto space-y-3 relative flex flex-col justify-start"
                  style={{
                    backgroundColor: '#0c1317',
                    backgroundImage: `radial-gradient(#1c272e 0.75px, transparent 0.75px)`,
                    backgroundSize: '14px 14px',
                  }}
                >
                  
                  {/* Date Divider (Today) */}
                  <div className="text-center pt-0.5">
                    <span className="px-3 py-0.5 rounded-lg bg-[#182229] text-[10px] text-[#8696a0] font-medium shadow-xs border border-white/5">
                      Today
                    </span>
                  </div>

                  {/* End-to-End Encryption Notice */}
                  <div className="p-2.5 rounded-xl bg-[#182229]/95 border border-[#202c33]/70 text-center shadow-sm max-w-[96%] mx-auto">
                    <div className="flex items-start justify-center gap-1.5 text-[9.5px] text-[#ffd279] leading-tight">
                      <Lock className="w-3 h-3 text-[#ffd279] shrink-0 mt-0.5" />
                      <span>
                        Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. <span className="text-[#53bdeb] cursor-pointer hover:underline">Learn more.</span>
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Message Bubble from Revora AI */}
                  <div className="max-w-[96%] rounded-2xl rounded-tl-xs p-3.5 bg-[#1f2c34] text-[#e9edef] shadow-lg space-y-2.5 border border-white/5">
                    <p className="text-[12px] font-semibold text-white">
                      Namaste Raj! 👋
                    </p>
                    
                    <p className="text-[11px] text-[#e9edef] leading-relaxed">
                      We noticed your Razorpay checkout for <strong className="text-white font-bold">*Nike Air Max 2026*</strong> had a bank switch timeout.
                    </p>

                    <p className="text-[11px] text-[#e9edef] leading-relaxed">
                      Don’t worry — your order is safe. We can help you complete it in just a tap.
                    </p>

                    <p className="text-[11px] text-[#e9edef] leading-relaxed">
                      Tap below to continue your payment securely with Razorpay.
                    </p>

                    <div className="text-right text-[9.5px] text-[#8696a0] -mt-1">
                      9:41 AM
                    </div>

                    {/* Embedded Razorpay Interactive Action Button (Exact as screenshot) */}
                    <div className="pt-0.5 border-t border-white/10">
                      <div className="w-full py-2.5 px-4 rounded-xl bg-[#182229] hover:bg-[#151e24] text-[#00a884] font-semibold text-[11.5px] flex items-center justify-between border border-[#26353d] cursor-pointer select-none transition-colors">
                        <span className="flex-1 text-center font-bold">Pay with Razorpay</span>
                        <ExternalLink className="w-4 h-4 text-[#00a884] shrink-0 stroke-[2.2]" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* WhatsApp Message Input Bar */}
                <div className="px-2.5 py-2 bg-[#0c1317] border-t border-[#202c33]/80 flex items-center gap-2 z-20">
                  <button className="w-7 h-7 rounded-full text-[#007aff] flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  
                  <div className="flex-1 bg-[#1f2c34] rounded-2xl px-3 py-1.5 text-[11px] text-[#8696a0] flex items-center justify-between border border-[#2a3942]/70 shadow-inner">
                    <span className="text-transparent">|</span>
                    <div className="w-4 h-4 rounded-full border border-[#007aff] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#007aff]" />
                    </div>
                  </div>

                  <button className="w-7 h-7 rounded-full text-[#007aff] flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                    <Camera className="w-4.5 h-4.5" />
                  </button>

                  <button className="w-7 h-7 rounded-full text-[#007aff] flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                    <Mic className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Bottom Home Indicator */}
                <div className="pb-1.5 pt-0.5 bg-[#0c1317]">
                  <div className="w-32 h-1 bg-white/70 rounded-full mx-auto" />
                </div>

              </div>
            </div>
          </div>
        </SingleStage>

        {/* ===================================================================== */}
        {/* STAGE 4: DOT 4 -> CARD ON LEFT, TEXT ON RIGHT                         */}
        {/* ===================================================================== */}
        <SingleStage
          stepNumber={4}
          badgeText="STEP 04 · INSTANT SETTLEMENT"
          title="Revenue Recovered"
          explanation="Customers complete payment in 1 tap through native UPI deep-links (Google Pay, PhonePe, Paytm) or Razorpay checkout links. Real-time webhook reconciliation marks invoices settled with zero manual intervention."
          pillTag="Automated Ledger Reconciliation"
          pillIcon={Sparkles}
          isDark={isDark}
          reversed={true}
        >
          {/* Card 4: 1-Click Settlement & Instant Ledger Sync (Ultra-Premium Fintech Visuals) */}
          <GlassCard isDark={isDark} className="p-5 sm:p-6 overflow-hidden relative">
            {/* Luminous emerald ambient accent glow in dark mode */}
            {isDark && (
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            )}

            {/* Header with Live Status Tag */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <span className={`text-xs sm:text-sm font-bold block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Payment Settled & Synced
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Webhook: payment.captured</span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Reconciled</span>
              </span>
            </div>

            {/* Rescued Amount Display */}
            <div className="py-4 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-400 block">
                Capital Rescued & Credited
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                ₹18,000.00
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Raj Sharma</span>
                <span className="text-slate-400">·</span>
                <span>Nike Air Max 2026</span>
              </div>
            </div>

            {/* Settlement Timeline & Payment Metadata */}
            <div className={`p-3 rounded-xl border space-y-2 text-xs ${
              isDark ? 'bg-black/60 border-white/10' : 'bg-slate-50 border-slate-200/80'
            }`}>
              {/* Event Timing Bar */}
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] px-1">
                <span>Failed: 11:20:00 AM</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                <span>AI Engaged: 11:20:15 AM</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Paid: 11:22:14 AM</span>
              </div>

              {/* Rails and Metadata */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/10 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment Rail:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Google Pay UPI via Razorpay Intent
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Razorpay Invoice:</span>
                  <button
                    onClick={() => handleCopy('#INV-4821-RZP')}
                    className="font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 cursor-pointer hover:underline bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20"
                  >
                    <span>#INV-4821-RZP</span>
                    {copiedInvoice ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Settlement Status:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    T+0 Instant Payout
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 dark:text-slate-400 pt-3">
              Direct Razorpay payout · Zero churn · Merchant ledger reconciled
            </p>
          </GlassCard>
        </SingleStage>

      </div>
    </section>
  );
};
