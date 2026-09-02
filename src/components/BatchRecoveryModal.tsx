import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PhoneCall,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { BatchRecoveryResult } from '../types';

interface BatchRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: BatchRecoveryResult | null;
  isRunning: boolean;
}

export const BatchRecoveryModal: React.FC<BatchRecoveryModalProps> = ({
  isOpen,
  onClose,
  result,
  isRunning,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isRunning) {
      const t1 = setTimeout(() => setCurrentStep(2), 1200);
      const t2 = setTimeout(() => setCurrentStep(3), 2400);
      const t3 = setTimeout(() => setCurrentStep(4), 3600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setCurrentStep(4);
    }
  }, [isRunning]);

  const steps = [
    { num: 1, label: 'Neural Root-Cause Diagnosis' },
    { num: 2, label: 'Stopping Rules & Compliance Gate' },
    { num: 3, label: 'Multi-Rail Dispatch (Razorpay/Voice)' },
    { num: 4, label: 'Settlement & PTP Reconciled' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Batch AI Revenue Recovery Engine
              </h2>
              <p className="text-xs text-slate-400">
                Parallelized autonomous multi-channel recovery execution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4 bg-[#030708]/60 border-b border-white/[0.08]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step) => {
              const isDone = currentStep > step.num || (!isRunning && result);
              const isActive = isRunning && currentStep === step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-2xl border transition-all text-xs ${
                    isDone
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : isActive
                      ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200 animate-pulse'
                      : 'bg-[#080d14] border-white/[0.06] text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    ) : (
                      <span className="font-mono text-[11px] text-slate-500">{step.num}.</span>
                    )}
                    <span className="text-[11px]">Step {step.num}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isRunning ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-white">
                  Executing Autonomous Recovery Rails...
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Analyzing payment decline telemetry, validating RBI dunning compliance gates, and generating dynamic Razorpay links.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Executive Outcome Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#030708] via-emerald-950/40 to-[#030708] border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Batch Execution Completed Successfully</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {result.successRate}% Win Rate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Recovered Revenue</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      ₹{result.recoveredAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                    <span className="text-[10px] uppercase font-mono text-slate-400">PTP Committed</span>
                    <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
                      ₹{result.ptpCommittedAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Compliance Protected</span>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                      {result.stoppedCasesCount} Cases Halter
                    </div>
                  </div>
                </div>
              </div>

              {/* Rails Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Autonomous Multi-Rail Dispatch Summary
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-1">
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-400" /> Razorpay Smart Links
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {result.channelDispatches.razorpay_links} links dispatched
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Auto-generated tokenized links with localized UPI fallback.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-1">
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="font-semibold flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-purple-400" /> Hinglish Voice Calls
                      </span>
                      <span className="font-mono text-purple-300 font-bold">
                        {result.channelDispatches.hinglish_calls} voice sessions
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Priya agent engaged high-ticket overdue invoices with empathy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#030708]/90 border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
export default BatchRecoveryModal;
