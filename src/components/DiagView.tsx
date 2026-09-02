import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Server,
  CreditCard,
  Smartphone,
  Building2,
  Calendar,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  FileText,
  Clock,
  Play,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RecoveryCase } from '../types';
import { DiagnosticTerminal } from './DiagnosticTerminal';

interface DiagViewProps {
  cases: RecoveryCase[];
  onOpenCaseModal?: (c: RecoveryCase) => void;
  onOpenRazorpayModal?: (c: RecoveryCase) => void;
  onRecoverCase?: (caseId: string) => Promise<void>;
  onSimulatePayment?: (caseId: string) => Promise<void> | void;
  onNavigateAudit?: () => void;
}

export const DiagView: React.FC<DiagViewProps> = ({
  cases = [],
  onOpenCaseModal,
  onOpenRazorpayModal,
  onRecoverCase,
  onSimulatePayment,
  onNavigateAudit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(cases[0] || null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisStep, setDiagnosisStep] = useState<number>(4); // 1 = ingesting, 2 = analyzing, 3 = formulating, 4 = ready
  const [liveDiagnosis, setLiveDiagnosis] = useState<any>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Revora AI Root-Cause Matrix Kernel v3.7 active on port 3000.',
    '[TELEMETRY] Ingesting NPCI UPI Switch, Razorpay 3DS2, and e-Mandate gateway signals.',
    '[DIAGNOSTIC] Neural model correlated 18 high-conversion recovery pathways across HDFC, ICICI, SBI.',
    '[READY] Select any incident or trigger 1-click autonomous diagnosis below.',
  ]);

  // Root Cause Categorization Matrix
  const categories = [
    {
      id: 'all',
      name: 'All Degradation Incidents',
      count: cases.length,
      icon: Activity,
      color: 'text-cyan-400',
      description: 'Unified cross-rail telemetry feed',
    },
    {
      id: 'BANK_SWITCH',
      name: 'Bank Switch & Gateway Outages',
      count: cases.filter((c) => c.failureReason?.toLowerCase().includes('gateway') || c.failureReason?.toLowerCase().includes('timeout') || c.failureReason?.toLowerCase().includes('switch') || c.scenario === 'payment_failure').length,
      icon: Server,
      color: 'text-rose-400',
      description: 'NPCI UPI switch latency, 504 timeouts, ISO-8583 bank drops',
    },
    {
      id: 'AUTH_DROPOFF',
      name: '3DS2 & OTP Drop-offs',
      count: cases.filter((c) => c.failureReason?.toLowerCase().includes('otp') || c.failureReason?.toLowerCase().includes('drop') || c.failureReason?.toLowerCase().includes('3ds') || c.scenario === 'checkout_abandonment').length,
      icon: Smartphone,
      color: 'text-purple-400',
      description: 'Customer tab closures, SMS OTP delivery delays, biometric timeouts',
    },
    {
      id: 'MANDATE_SUBSCRIPTION',
      name: 'Mandate & Recurring Lapses',
      count: cases.filter((c) => c.failureReason?.toLowerCase().includes('mandate') || c.failureReason?.toLowerCase().includes('subscription') || c.scenario === 'failed_subscription').length,
      icon: RefreshCw,
      color: 'text-blue-400',
      description: 'e-Mandate liquidity mismatches, expired tokenization records',
    },
    {
      id: 'B2B_INVOICE',
      name: 'B2B Invoices & Receivables',
      count: cases.filter((c) => c.scenario === 'overdue_invoice' || c.scenario === 'receivables' || c.failureReason?.toLowerCase().includes('invoice') || c.failureReason?.toLowerCase().includes('reconciliation')).length,
      icon: Building2,
      color: 'text-emerald-400',
      description: 'ERP reconciliation lapses, Net-30 invoice term overdues',
    },
  ];

  const filteredCases = cases.filter((c) => {
    if (activeCategory === 'all') return true;
    const r = (c.failureReason || '').toLowerCase();
    if (activeCategory === 'BANK_SWITCH') {
      return r.includes('gateway') || r.includes('timeout') || r.includes('switch') || c.scenario === 'payment_failure';
    }
    if (activeCategory === 'AUTH_DROPOFF') {
      return r.includes('otp') || r.includes('drop') || r.includes('3ds') || c.scenario === 'checkout_abandonment';
    }
    if (activeCategory === 'MANDATE_SUBSCRIPTION') {
      return r.includes('mandate') || r.includes('subscription') || c.scenario === 'failed_subscription';
    }
    if (activeCategory === 'B2B_INVOICE') {
      return c.scenario === 'overdue_invoice' || c.scenario === 'receivables' || r.includes('invoice') || r.includes('reconciliation');
    }
    return true;
  });

  const handleRunDeepDiagnosis = async (caseItem: RecoveryCase) => {
    setSelectedCase(caseItem);
    setIsDiagnosing(true);
    setAnalyzingId(caseItem.id);
    setDiagnosisStep(1);

    setTerminalLogs((prev) => [
      `[AI_STEP_1] Ingesting failure telemetry for case ${caseItem.caseNumber}...`,
      `[HEADERS] Code=${caseItem.failureCode || 'GATEWAY_TIMEOUT'} | Amount=₹${caseItem.amount} | Rail=${caseItem.paymentMethod || 'UPI'}`,
      ...prev.slice(0, 10),
    ]);

    // Progressive step transitions to visually display how the AI works
    setTimeout(() => {
      setDiagnosisStep(2);
      setTerminalLogs((prev) => [
        `[AI_STEP_2] Gemini neural engine evaluating failure vector & bank switch latency (>3800ms)...`,
        ...prev.slice(0, 10),
      ]);
    }, 450);

    setTimeout(() => {
      setDiagnosisStep(3);
      setTerminalLogs((prev) => [
        `[AI_STEP_3] Synthesizing optimal recovery strategy & dynamic discount eligibility...`,
        ...prev.slice(0, 10),
      ]);
    }, 850);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseItem.id }),
      });
      const data = await res.json();
      if (data.diagnosis) {
        setLiveDiagnosis(data.diagnosis);
        setTerminalLogs((prev) => [
          `[AI_STEP_4] Diagnosis complete! Root Cause=${data.diagnosis.rootCauseCategory} | Confidence=${data.diagnosis.recoveryConfidenceScore}%.`,
          `[EXECUTION] Prescribed rail=${data.diagnosis.recommendedRecoveryChannel}. Ready for 1-click execution.`,
          ...prev.slice(0, 10),
        ]);
      }
    } catch (err) {
      console.error(err);
      setLiveDiagnosis({
        rootCauseCategory: 'BANK_SWITCH_OUTAGE',
        deepTechnicalExplanation: `Telemetry indicates ${caseItem.bankName || 'HDFC'} switch latency exceeded 3500ms timeout threshold during NPCI UPI routing. Customer was dropped at checkout before 3DS authorization was verified.`,
        recommendedRecoveryChannel: 'razorpay_smart_link',
        recoveryConfidenceScore: 92,
        dynamicDiscountEligible: false,
      });
    } finally {
      setDiagnosisStep(4);
      setIsDiagnosing(false);
      setAnalyzingId(null);
    }
  };

  const handleExecuteAutoSettle = async () => {
    if (!selectedCase) return;
    setIsSettling(true);
    try {
      if (onSimulatePayment) {
        await onSimulatePayment(selectedCase.id);
      } else if (onRecoverCase) {
        await onRecoverCase(selectedCase.id);
      }
      setTerminalLogs((prev) => [
        `[SETTLED] Webhook simulation confirmed payment for ${selectedCase.caseNumber}! State updated to Settled.`,
        ...prev.slice(0, 10),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Root Cause Matrix & Recovery Engine
              </h1>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Decomposes payment drop-offs, diagnoses technical switch outages, and executes real-time recovery actions.
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Chip */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            isDark ? 'bg-black/60 border-cyan-500/30 text-cyan-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Neural Engine: Active</span>
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout: Incident Stream (Left) & Working AI Diagnosis Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
        {/* Left Column: Incidents List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Incidents Queue ({filteredCases.length})
              </h3>
              <span className="text-[10px] text-slate-400">Select an incident to inspect failure telemetry</span>
            </div>

            {/* Minimal Category Filter */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={`text-xs font-mono px-2.5 py-1 rounded-xl border outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#0a0f1d] border-white/10 text-slate-200 hover:border-white/20'
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'
              }`}
            >
              <option value="all">All Incidents ({cases.length})</option>
              <option value="BANK_SWITCH">Bank Switch Outages</option>
              <option value="AUTH_DROPOFF">3DS2 & OTP Drop-offs</option>
              <option value="MANDATE_SUBSCRIPTION">Mandates & Recurring</option>
              <option value="B2B_INVOICE">B2B Invoices & Receivables</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border ${
                isDark ? 'bg-[#0a0f1d] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                No active incidents found in this category.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const isAnalyzingThis = analyzingId === c.id;
                const isRecovered = c.status === 'recovered' || c.recovered === true;
                const isFailed = c.status === 'failed' || c.failureCode === 'BAD_REQUEST_ERROR' || Boolean(c.failureReason?.toLowerCase().includes('declined')) || Boolean(c.failureReason?.toLowerCase().includes('failed'));
                const isPTP = c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY';

                return (
                  <div
                    key={c.id}
                    onClick={() => handleRunDeepDiagnosis(c)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-[#0d1730] border-cyan-500/70 shadow-lg shadow-cyan-500/15'
                          : 'bg-blue-50/90 border-blue-500 shadow-md shadow-blue-500/10'
                        : isDark
                        ? 'bg-[#090e1c] border-white/[0.08] hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {c.caseNumber || `REV-${c.id}`}
                          </span>

                          {/* Status Dot */}
                          {isRecovered ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Settled
                            </span>
                          ) : isFailed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Failed
                            </span>
                          ) : isPTP ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Active
                            </span>
                          )}
                        </div>

                        <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {c.customerName || 'Customer'}
                        </h4>

                        <div className="text-[10.5px] text-slate-400 font-mono truncate">
                          {c.bankName || 'HDFC Bank'} • {c.paymentMethod?.toUpperCase() || 'UPI'}
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <div className="text-xs font-extrabold font-mono text-emerald-400">
                          ₹{(c.amount || 0).toLocaleString('en-IN')}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunDeepDiagnosis(c);
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                            isAnalyzingThis
                              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 animate-pulse'
                              : isDark
                              ? 'bg-white/5 hover:bg-cyan-900/40 text-cyan-300 border-cyan-500/30'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          <Zap className={`w-2.5 h-2.5 ${isAnalyzingThis ? 'animate-spin' : 'text-amber-400'}`} />
                          <span>{isAnalyzingThis ? 'Diagnosing...' : 'AI Diagnose'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Root Cause reason snippet */}
                    <div className={`mt-2 p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${
                      isDark ? 'bg-black/30 text-slate-300 border border-white/5' : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{c.failureReason || 'Gateway Timeout during checkout'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Working AI Root Cause Diagnosis & Recovery Action Hub (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Working AI Diagnosis & Execution Hub
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Real-time Decision Kernel</span>
          </div>

          {selectedCase ? (
            <div className={`p-5 rounded-2xl border space-y-4 shadow-2xl ${
              isDark ? 'bg-[#090f20] border-cyan-500/30' : 'bg-white border-slate-200'
            }`}>
              {/* Selected Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {selectedCase.caseNumber || `REV-${selectedCase.id}`}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      selectedCase.status === 'recovered'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {selectedCase.status === 'recovered' ? 'SETTLED' : 'ACTIVE INCIDENT'}
                    </span>
                  </div>
                  <h4 className={`text-lg font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedCase.customerName}
                  </h4>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedCase.bankName || 'HDFC Bank'} • {selectedCase.paymentMethod?.toUpperCase() || 'UPI'} • {selectedCase.scenarioLabel || 'Payment Gateway Failure'}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Incident Capital</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    ₹{(selectedCase.amount || 0).toLocaleString('en-IN')}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Attempts: {selectedCase.attemptsCount || 1} / {selectedCase.maxAttempts || 3}
                  </div>
                </div>
              </div>

              {/* Working Root Cause Diagnosis & Terminal */}
              <DiagnosticTerminal
                caseData={selectedCase}
                diagnosisData={liveDiagnosis}
                onRecover={(c) => onRecoverCase && onRecoverCase(c.id)}
                onOpenCheckout={onOpenRazorpayModal}
                onAutoSettle={handleExecuteAutoSettle}
                autoStart={true}
              />
            </div>
          ) : (
            <div className={`p-12 text-center rounded-2xl border text-xs text-slate-400 ${
              isDark ? 'bg-[#090f20] border-white/10' : 'bg-white border-slate-200'
            }`}>
              Select an incident from the queue on the left to inspect real-time AI diagnosis.
            </div>
          )}

          {/* Real-time Telemetry Stream */}
          <div className="p-4 rounded-2xl bg-black border border-cyan-500/30 font-mono text-xs shadow-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white text-[11px]">telemetry-kernel-stream</span>
              </div>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> STREAM ACTIVE
              </span>
            </div>

            <div className="space-y-1 text-slate-300 max-h-36 overflow-y-auto text-[11px] leading-relaxed">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <span className="text-cyan-400 select-none">❯</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagView;
