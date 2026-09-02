import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Cpu,
  Send,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Clock,
  Check,
  CreditCard,
  Radio,
  Lock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PipelineStep {
  id: number;
  badge: string;
  title: string;
  description: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
  stat: string;
  samplePayload: Record<string, string>;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    badge: 'STAGE 1: FAILURE INGESTION',
    title: 'Real-Time Telemetry Ingestion',
    description: 'Instant webhook captures failed transaction (Bank 504 Gateway Timeout, 3DS OTP drop-off, or NACH Mandate bounce).',
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
    icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    stat: '0.2s Detection',
    samplePayload: {
      event: 'payment.failed',
      errorCode: 'GATEWAY_TIMEOUT_504',
      issuer: 'HDFC Bank UPI Switch',
      amount: '₹4,999.00',
    },
  },
  {
    id: 2,
    badge: 'STAGE 2: AI ROOT-CAUSE DIAGNOSIS',
    title: 'Autonomous Neural Intent & Diagnostics',
    description: 'AI model analyzes bank telemetry to classify whether failure was an issuer outage or user abandonment, choosing the optimal fallback rail.',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
    stat: '96% Accuracy',
    samplePayload: {
      diagnosis: 'Temporary Issuer Switch Downtime',
      strategy: 'Direct Razorpay UPI Deep-Link',
      recoveryScore: '92% High Probability',
    },
  },
  {
    id: 3,
    badge: 'STAGE 3: 1-CLICK RECOVERY DISPATCH',
    title: 'Smart Razorpay Pay Link Dispatched',
    description: 'Dispatches friction-free 1-click Razorpay UPI intent link directly to the customer via WhatsApp, SMS, or in-app notification.',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    icon: <CreditCard className="w-5 h-5 text-cyan-400" />,
    stat: '1-Click Pay',
    samplePayload: {
      paymentRail: 'Razorpay UPI Intent (GPay / PhonePe / Paytm)',
      paymentUrl: 'https://rzp.io/i/rev_1001',
      dispatchChannel: 'WhatsApp + In-App Push',
    },
  },
  {
    id: 4,
    badge: 'STAGE 4: PROMISE-TO-PAY (P2P) PAUSE',
    title: 'Promise-to-Pay Auto-Suppression',
    description: 'When customer commits to pay on a future date (e.g. salary day), all dunning alerts and calls are automatically paused to prevent spam.',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    icon: <Calendar className="w-5 h-5 text-amber-400" />,
    stat: 'Zero Friction',
    samplePayload: {
      ptpStatus: 'PAUSED_RETRY',
      scheduledDate: 'Tomorrow at 10:00 AM',
      nudgeSuppression: 'ACTIVE (No Nudges Sent)',
    },
  },
  {
    id: 5,
    badge: 'STAGE 5: RBI ANTI-SPAM COMPLIANCE',
    title: 'RBI Safety Cap & Quiet Hours',
    description: 'Strict enforcement of RBI guidelines: hard cap at maximum 3 contact attempts and guaranteed quiet hours cooling window (7 PM - 9 AM).',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    stat: '100% Compliant',
    samplePayload: {
      attempts: 'Attempt 1 of 3 Used',
      quietHours: 'Active (19:00 - 09:00 IST)',
      disputeLock: 'Enabled',
    },
  },
  {
    id: 6,
    badge: 'STAGE 6: SETTLEMENT & RECONCILIATION',
    title: 'Instant Webhook Settlement',
    description: 'Razorpay payment.captured webhook confirms receipt, clears the at-risk transaction, and updates merchant ERP ledger within 1.2 seconds.',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    stat: 'Capital Rescued',
    samplePayload: {
      status: 'CAPTURED',
      recoveredAmount: '₹4,999.00',
      settlementSpeed: '1.2s via Razorpay Webhook',
    },
  },
];

export const InteractiveRecoveryPipeline: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStartSimulation = () => {
    setActiveStep(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(1);
  };

  const currentStepData = PIPELINE_STEPS.find((s) => s.id === activeStep) || PIPELINE_STEPS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-3xl p-5 md:p-6 space-y-6 transition-all duration-300 shadow-2xl font-sans ${
        isDark
          ? 'bg-white/[0.04] ring-1 ring-white/10 text-white shadow-black/80'
          : 'bg-white/80 ring-1 ring-slate-200/90 text-slate-900 shadow-xl'
      }`}
    >
      {/* Background Subtle Gradient Glow Orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-700"
        style={{ backgroundColor: currentStepData.color }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b pb-4 border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)] shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <h3 className="text-sm sm:text-lg font-extrabold tracking-tight">
              Autonomous Recovery Pipeline
            </h3>
          </div>
          <p className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
            End-to-end lifecycle from bank failure ingestion to Razorpay instant settlement.
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end pt-1 sm:pt-0">
          {!isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartSimulation}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Live Flow</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer animate-pulse"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Simulating (Stage {activeStep}/6)...</span>
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.05, rotate: -45 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className={`p-2 sm:p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* 6-Stage Visual Stepper Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
        {PIPELINE_STEPS.map((step) => {
          const isCurrent = step.id === activeStep;
          const isPassed = step.id < activeStep;

          return (
            <motion.button
              key={step.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsPlaying(false);
                setActiveStep(step.id);
              }}
              className={`p-3.5 rounded-2xl ring-1 text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer backdrop-blur ${
                isCurrent
                  ? isDark
                    ? 'bg-blue-600/20 ring-blue-500 shadow-lg'
                    : 'bg-blue-50 ring-blue-500 shadow-md'
                  : isPassed
                  ? isDark
                    ? 'bg-emerald-950/20 ring-emerald-500/30 text-slate-300'
                    : 'bg-emerald-50/60 ring-emerald-200 text-slate-700'
                  : isDark
                  ? 'bg-white/[0.03] ring-white/5 text-slate-400 hover:ring-white/20'
                  : 'bg-slate-50 ring-slate-200 text-slate-600 hover:ring-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold opacity-80">0{step.id}</span>
                <div className="p-1 rounded-lg bg-black/20">
                  {isPassed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    step.icon
                  )}
                </div>
              </div>

              <div>
                <div
                  className={`text-xs font-bold leading-snug line-clamp-1 ${
                    isCurrent
                      ? isDark ? 'text-white' : 'text-blue-900'
                      : isPassed
                      ? isDark ? 'text-emerald-300' : 'text-emerald-900'
                      : isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  {step.stat}
                </div>
              </div>

              {isCurrent && (
                <div className="w-full h-1 bg-blue-500 rounded-full mt-2 animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Stage with Inset UI Architecture */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`p-5 sm:p-6 rounded-2xl ring-1 transition-all relative z-10 backdrop-blur ${
            isDark
              ? 'bg-gradient-to-b from-white/5 to-white/[0.02] ring-white/10'
              : 'bg-gradient-to-b from-slate-50 to-white ring-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Stage Description */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentStepData.color}20`,
                    color: currentStepData.color,
                    border: `1px solid ${currentStepData.color}40`,
                  }}
                >
                  {currentStepData.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Stage {currentStepData.id} of 6
                </span>
              </div>

              <h4 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentStepData.title}
              </h4>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {currentStepData.description}
              </p>
            </div>

            {/* Real Telemetry Payload Preview */}
            <div className="lg:col-span-5">
              <div
                className={`p-4 rounded-xl border font-mono text-xs space-y-2 shadow-inner ${
                  isDark ? 'bg-black/60 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`flex items-center justify-between text-[11px] border-b pb-1.5 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-700 font-semibold'}>Telemetry Payload</span>
                  <span className="text-emerald-500 font-bold text-[10px]">● LIVE DISPATCH</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  {Object.entries(currentStepData.samplePayload).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className={`${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'} shrink-0`}>{key}:</span>
                      <span className={`font-semibold text-right truncate ${isDark ? 'text-cyan-300' : 'text-indigo-700'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveRecoveryPipeline;
