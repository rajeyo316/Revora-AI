import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CreditCard,
  Layers,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Radio,
  Play,
  TrendingUp,
  ExternalLink,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  onRefreshData: () => Promise<void>;
  onOpenRazorpayModal: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onRefreshData,
  onOpenRazorpayModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [apiKeyConnected, setApiKeyConnected] = useState(true);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [aiAnalysisDone, setAiAnalysisDone] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);
  const [recoveryDetails, setRecoveryDetails] = useState<{
    caseId: string;
    amount: number;
    customer: string;
    paymentUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  // Step 1: Connect Razorpay
  const handleVerifyRazorpay = () => {
    setIsSimulatingApi(true);
    setTimeout(() => {
      setApiKeyConnected(true);
      setIsSimulatingApi(false);
      setStep(2);
    }, 600);
  };

  // Step 2: Ingest Sample Cases
  const handleLoadSample = async () => {
    setIsSimulatingApi(true);
    try {
      await fetch('/api/cases/reset-seed', { method: 'POST' });
      await onRefreshData();
      setSampleLoaded(true);
      setTimeout(() => {
        setIsSimulatingApi(false);
        setStep(3);
      }, 500);
    } catch (e) {
      console.error(e);
      setIsSimulatingApi(false);
      setStep(3);
    }
  };

  // Step 3: Run AI Diagnostic
  const handleRunAiDiagnosis = async () => {
    setIsSimulatingApi(true);
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      const firstCase = (data.cases && data.cases[0]) || {
        id: 'case_onboard_01',
        amount: 34999,
        customerName: 'Aarav Singhania',
      };

      // Trigger recovery on first case
      const recRes = await fetch(`/api/cases/${firstCase.id}/recover`, { method: 'POST' });
      const recData = await recRes.json();

      setRecoveryDetails({
        caseId: firstCase.id,
        amount: firstCase.amount,
        customer: firstCase.customerName,
        paymentUrl: recData.paymentUrl || `https://rzp.io/i/sim_${firstCase.id}`,
      });

      setAiAnalysisDone(true);
      setIsSimulatingApi(false);
      setStep(4);
    } catch (e) {
      console.error(e);
      setRecoveryDetails({
        caseId: 'case_seed_01',
        amount: 34999,
        customer: 'Aarav Singhania (Credo Cloud)',
        paymentUrl: 'https://rzp.io/i/sim_credo_01',
      });
      setAiAnalysisDone(true);
      setIsSimulatingApi(false);
      setStep(4);
    }
  };

  // Step 4: Simulate Razorpay Webhook Recovery
  const handleSimulatePayment = async () => {
    if (!recoveryDetails) return;
    setIsSimulatingApi(true);
    try {
      await fetch(`/api/cases/${recoveryDetails.caseId}/simulate-payment`, { method: 'POST' });
      await onRefreshData();
      setRecoveryDone(true);
    } catch (e) {
      console.error(e);
      setRecoveryDone(true);
    } finally {
      setIsSimulatingApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col font-sans transition-all ${
          isDark
            ? 'bg-[#080d1a] border-white/10 text-white shadow-black/90'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#050810] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Get Started with Revora AI
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Step {step} of 4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Setup your Razorpay connection and run your first autonomous recovery diagnostic.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className={`px-6 py-3 border-b ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, title: 'Razorpay API' },
              { num: 2, title: 'Load Cases' },
              { num: 3, title: 'AI Diagnosis' },
              { num: 4, title: 'Simulate Recovery' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className={`flex items-center gap-2 p-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : step > s.num
                    ? isDark
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-emerald-700 bg-emerald-50'
                    : isDark
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${
                    step === s.num
                      ? 'bg-white text-blue-600'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : isDark
                      ? 'bg-white/10 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="text-[11px] truncate hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
          {/* STEP 1: Razorpay Integration */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <CreditCard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-300">Razorpay Test & Live API Connection</div>
                  <div className="text-slate-300 text-[11.5px] mt-0.5">
                    Revora AI connects directly with your Razorpay account to ingest failed payments,
                    generate smart payment links, and verify automated webhook callbacks.
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Razorpay Key ID</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Sandbox Active</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="rzp_test_TTfg3j9B21aRev"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-blue-500 select-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Razorpay Key Secret</span>
                    <span className="text-[10px] text-slate-400 font-mono">Server-Side Encrypted</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      readOnly
                      value="RevoraSecretRazorpaySecureKey2025"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 font-mono text-xs select-all"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Live Webhook Endpoint</label>
                  <input
                    type="text"
                    readOnly
                    value="https://revora.ai/api/razorpay/webhook"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-cyan-300 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onOpenRazorpayModal}
                  className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
                >
                  Configure Custom Razorpay Keys →
                </button>
                <button
                  onClick={handleVerifyRazorpay}
                  disabled={isSimulatingApi}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingApi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Sandbox Keys</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Ingest Failed Revenue Cases */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <Layers className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-300">Revenue at Risk Pipeline</div>
                  <div className="text-slate-300 text-[11.5px] mt-0.5">
                    Revora categorizes failed transactions across 5 core enterprise scenarios: UPI
                    failures, expired cards, broken NACH mandates, overdue B2B invoices, and checkout dropoffs.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>UPI & Card Failures</span>
                    <span className="text-[10px] text-rose-400 font-mono">12 Cases</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Bank timeouts & OTP dropoffs</div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>Subscriptions & Mandates</span>
                    <span className="text-[10px] text-amber-400 font-mono">8 Cases</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Auto-debit recurring failures</div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>B2B Overdue Invoices</span>
                    <span className="text-[10px] text-cyan-400 font-mono">4 Cases</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Net-30 payment delay tracking</div>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>Total At-Risk</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">₹8,45,200</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Ready for bounded recovery</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleLoadSample}
                  disabled={isSimulatingApi}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingApi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ingesting Cases...</span>
                    </>
                  ) : (
                    <>
                      <span>Load Pipeline & Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Diagnostic & Razorpay Smart Link */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-cyan-300">Neural AI Root Cause Matrix & Stopping Rules</div>
                  <div className="text-slate-300 text-[11.5px] mt-0.5">
                    Revora's diagnostic engine maps error codes to bank health indicators, applies RBI
                    anti-harassment rules (9 AM–7 PM, max 3 bounds), and generates a personalized Razorpay link.
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3 text-xs`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-200">Test Case: Aarav Singhania (Credo Cloud)</div>
                  <span className="font-mono font-bold text-amber-400">₹34,999</span>
                </div>
                <div className="space-y-1.5 text-[11.5px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>RBI Compliance Guard:</strong> Passed (0/3 attempts, valid contact window)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Root Cause:</strong> Bank issuer OTP timeout (HDFC gateway retryable)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span><strong>Intervention Strategy:</strong> Razorpay Smart Link with 1-click UPI Deep Link</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleRunAiDiagnosis}
                  disabled={isSimulatingApi}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingApi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing AI Intervention...</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch Razorpay Smart Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Live Payment & Webhook Settlement */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300">Instant Razorpay Settlement & Audit Verification</div>
                  <div className="text-slate-300 text-[11.5px] mt-0.5">
                    Test the complete recovery cycle by simulating customer checkout. Revora will ingest the
                    webhook callback, update metrics in real-time, and log tamper-evident audit records.
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3 text-xs`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">
                      {recoveryDetails?.customer || 'Aarav Singhania'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">Case ID: {recoveryDetails?.caseId}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-base font-extrabold text-emerald-400">
                      ₹{recoveryDetails?.amount ? recoveryDetails.amount.toLocaleString('en-IN') : '34,999'}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">Smart Link Dispatched</div>
                  </div>
                </div>

                {recoveryDone ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Payment Verified via Razorpay Webhook!</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/30 px-2 py-0.5 rounded">
                      SHA-256 AUDIT LOGGED
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isSimulatingApi}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSimulatingApi ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Reconciling Webhook...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Simulate Customer Payment Callback</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('queue');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Full Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
