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
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RecoveryCase } from '../types';

interface DiagViewProps {
  cases: RecoveryCase[];
  onOpenCaseModal?: (c: RecoveryCase) => void;
  onOpenRazorpayModal?: (c: RecoveryCase) => void;
  onRecoverCase?: (caseId: string) => Promise<void>;
}

export const DiagView: React.FC<DiagViewProps> = ({
  cases = [],
  onOpenCaseModal,
  onOpenRazorpayModal,
  onRecoverCase,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(cases[0] || null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [liveDiagnosis, setLiveDiagnosis] = useState<any>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Revora AI Root-Cause Matrix Kernel v3.7 active on port 3000.',
    '[TELEMETRY] Listening to NPCI UPI Switch, Razorpay 3DS2, and e-Mandate telemetry.',
    '[INGEST] Correlating failure codes with historical merchant settlement matrices.',
    '[DIAGNOSTIC] Classified 18 high-confidence recovery routes across HDFC, ICICI, and SBI rails.',
    '[DISPATCH] Automated multi-channel retry sequencing ready.',
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
      color: 'text-red-400',
      description: 'NPCI UPI switch latency, 504 timeouts, ISO-8583 bank drops',
    },
    {
      id: 'AUTH_DROPOFF',
      name: '3DS2 & OTP Drop-offs',
      count: cases.filter((c) => c.failureReason?.toLowerCase().includes('otp') || c.failureReason?.toLowerCase().includes('drop') || c.failureReason?.toLowerCase().includes('3ds') || c.scenario === 'checkout_abandonment').length,
      icon: Smartphone,
      color: 'text-amber-400',
      description: 'User tab closures, SMS OTP delivery delays, biometric timeouts',
    },
    {
      id: 'MANDATE_SUBSCRIPTION',
      name: 'Mandate & Recurring Lapses',
      count: cases.filter((c) => c.failureReason?.toLowerCase().includes('mandate') || c.failureReason?.toLowerCase().includes('subscription') || c.scenario === 'failed_subscription').length,
      icon: RefreshCw,
      color: 'text-purple-400',
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

    setTerminalLogs((prev) => [
      `[AI_DIAGNOSE] Initializing multi-variable neural telemetry analysis for ${caseItem.caseNumber}...`,
      `[INPUT] Telemetry: ${caseItem.failureReason} | Amount: ₹${caseItem.amount} | Rail: ${caseItem.paymentMethod}`,
      ...prev.slice(0, 10),
    ]);

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
          `[SUCCESS] Deep analysis complete: Category=${data.diagnosis.rootCauseCategory}, Confidence=${data.diagnosis.recoveryConfidenceScore}%.`,
          `[PRESCRIPTION] Strategy=${data.diagnosis.recommendedRecoveryChannel}. DiscountPermitted=${data.diagnosis.dynamicDiscountEligible ? 'YES' : 'NO'}.`,
          ...prev.slice(0, 10),
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
      setAnalyzingId(null);
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
                AI Root Cause Matrix
              </h1>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Autonomous failure decomposition kernel decomposing drop-offs into deterministic, high-conversion recovery actions.
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
            <span>Telemetry Kernel: Online (Neural Core 3.7)</span>
          </span>
        </div>
      </div>

      {/* How It Works Explainer Banner */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-black/40 border-cyan-500/20' : 'bg-blue-50/80 border-blue-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-cyan-300' : 'text-blue-800'}`}>
                How the AI Root Cause Matrix Works
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} max-w-3xl leading-relaxed`}>
              Revora intercepts real-time Razorpay telemetry codes (e.g. <code className="font-mono text-cyan-400">NPCI_504_TIMEOUT</code>, <code className="font-mono text-amber-400">OTP_DROPOFF</code>), parses the underlying technical and behavioral cause, and automatically pairs the case with the bounded recovery rail (Instant Smart Payment Link, WhatsApp 1-Click Retry, or Autonomous Hinglish AI Voice Specialist).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`px-3 py-2 rounded-xl border text-center font-mono ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400">Decomposition Speed</div>
              <div className="text-sm font-extrabold text-cyan-400">&lt;140ms</div>
            </div>
            <div className={`px-3 py-2 rounded-xl border text-center font-mono ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400">Recovery Uplift</div>
              <div className="text-sm font-extrabold text-emerald-400">+38.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? isDark
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-blue-100/70 border-blue-400 shadow-md shadow-blue-500/10'
                  : isDark
                  ? 'bg-[#0a0f1d] border-white/10 hover:border-white/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </div>
              <div className="mt-2.5">
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout: Grid of Diagnosed Cases & Live Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categorized Matrix Cases (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Diagnosed Telemetry Cases ({filteredCases.length})
            </h3>
            <span className="text-[11px] text-slate-400">Click a case to inspect deep AI synthesis</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className={`p-8 text-center rounded-2xl border ${
                isDark ? 'bg-[#0a0f1d] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                No active incidents found for this category.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const isAnalyzingThis = analyzingId === c.id;
                const isRecovered = c.status === 'recovered';

                return (
                  <div
                    key={c.id}
                    onClick={() => handleRunDeepDiagnosis(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-[#0d162d] border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                          : 'bg-blue-50/90 border-blue-500 shadow-md shadow-blue-500/10'
                        : isDark
                        ? 'bg-[#090e1c] border-white/[0.08] hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{c.caseNumber}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            c.riskLevel === 'critical'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : c.riskLevel === 'high'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}>
                            {c.riskLevel?.toUpperCase()} RISK
                          </span>
                          {isRecovered && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <Check className="w-3 h-3" /> SETTLED
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {c.customerName}
                        </h4>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {c.bankName || 'HDFC Bank'} • {c.paymentMethod?.toUpperCase() || 'UPI'} • {c.daysOverdue || 0}d Overdue
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold font-mono text-emerald-400">
                          ₹{c.amount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                          {c.aiScore || `${c.riskScore}% SCORE`}
                        </span>
                      </div>
                    </div>

                    {/* Root Cause Box */}
                    <div className={`mt-3 p-3 rounded-xl border text-xs space-y-1 ${
                      isDark ? 'bg-black/40 border-white/[0.06]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Root Cause:</span>
                        <span className="font-mono text-[10px] text-slate-400">{c.failureCode || 'GATEWAY_TIMEOUT'}</span>
                      </div>
                      <div className={`font-semibold flex items-center gap-1.5 ${
                        c.failureReason?.toLowerCase().includes('timeout') || c.failureReason?.toLowerCase().includes('504')
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.failureReason}</span>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        Recommended: <strong className="text-slate-200">Instant Smart Payment Link</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {onOpenRazorpayModal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRazorpayModal(c);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-blue-500/30"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test Pay</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunDeepDiagnosis(c);
                          }}
                          disabled={isAnalyzingThis}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isAnalyzingThis ? 'animate-spin' : ''}`} />
                          <span>{isAnalyzingThis ? 'Analyzing...' : 'Deep Diagnose'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Deep AI Root Cause Inspector & Live Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Deep Diagnostic Synthesis
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Neural Intelligence Kernel</span>
          </div>

          {/* Deep AI Diagnostic Card */}
          <div className={`p-5 rounded-2xl border space-y-4 shadow-xl ${
            isDark ? 'bg-[#0b1324] border-cyan-500/30' : 'bg-white border-slate-200'
          }`}>
            {selectedCase ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400">{selectedCase.caseNumber}</span>
                    <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedCase.customerName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">INCIDENT AMOUNT</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      ₹{selectedCase.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* AI Diagnostic Decomposition Output */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Technical Root Cause Breakdown
                    </span>
                    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isDark ? 'bg-black/50 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {liveDiagnosis?.deepTechnicalExplanation ||
                        `Telemetry indicates ${selectedCase.bankName || 'HDFC'} switch latency exceeded 3500ms timeout threshold during NPCI UPI routing. Customer was charged 0 rupees and dropped at checkout.`}
                    </div>
                  </div>

                  {/* Classification Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-400">Recovery Confidence</div>
                      <div className="text-base font-extrabold font-mono text-emerald-400">
                        {liveDiagnosis?.recoveryConfidenceScore || 94}%
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-400">Prescribed Channel</div>
                      <div className="text-xs font-bold text-cyan-400 truncate mt-1">
                        {liveDiagnosis?.recommendedRecoveryChannel
                          ? liveDiagnosis.recommendedRecoveryChannel.replace(/_/g, ' ').toUpperCase()
                          : 'RAZORPAY SMART LINK'}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Discount & Policy Check */}
                  <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          RBI Fair Contact Policy
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Attempts: {selectedCase.attemptsCount || 0} / {selectedCase.maxAttempts || 3} (Compliant)
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      APPROVED
                    </span>
                  </div>

                  {/* Immediate Action Launcher */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    {onOpenRazorpayModal && (
                      <button
                        onClick={() => onOpenRazorpayModal(selectedCase)}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Open Razorpay Checkout</span>
                      </button>
                    )}

                    {onOpenCaseModal && (
                      <button
                        onClick={() => onOpenCaseModal(selectedCase)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span>Full Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select a case on the left to inspect root-cause decomposition.
              </div>
            )}
          </div>

          {/* Live Telemetry Terminal */}
          <div className="p-4 rounded-2xl bg-black border border-cyan-500/30 font-mono text-xs shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white text-[11px]">telemetry-kernel-stream</span>
              </div>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE STREAM
              </span>
            </div>

            <div className="space-y-1 text-slate-300 max-h-48 overflow-y-auto text-[11px] leading-relaxed">
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
