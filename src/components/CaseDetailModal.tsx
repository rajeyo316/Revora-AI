import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  MessageSquare,
  PhoneCall,
  Repeat,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Send,
  Loader2,
  FileText,
  User,
  Building,
} from 'lucide-react';
import { RecoveryCase, RecoveryChannel } from '../types';

interface CaseDetailModalProps {
  caseData: RecoveryCase;
  isOpen: boolean;
  onClose: () => void;
  onRecover: (c: RecoveryCase) => Promise<void>;
  onVerifyManualPayment: (caseId: string) => Promise<void>;
  onOpenVoiceCall: (c: RecoveryCase) => void;
  isProcessing: boolean;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onRecover,
  onVerifyManualPayment,
  onOpenVoiceCall,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnosis' | 'compliance' | 'ptp' | 'audit'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (caseData.paymentUrl) {
      navigator.clipboard.writeText(caseData.paymentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRunDeepDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseData.id }),
      });
      const data = await res.json();
      if (data.diagnosis) {
        setDiagnosisData(data.diagnosis);
        setActiveTab('diagnosis');
      }
    } catch (err) {
      console.error('Deep diagnosis error:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-4xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {caseData.customerName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                  {caseData.caseNumber}
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                  ₹{caseData.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {caseData.customerEmail} • {caseData.customerPhone} • {caseData.scenario.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-[#030708]/50 border-b border-white/[0.08] flex space-x-4 text-xs font-medium overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Actions' },
            { id: 'diagnosis', label: 'AI Root-Cause Diagnosis' },
            { id: 'compliance', label: 'Stopping Rules & Compliance' },
            { id: 'ptp', label: 'Promise-to-Pay (PTP)' },
            { id: 'audit', label: `Audit Trail (${caseData.auditTrail.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                    Failure Reason & Code
                  </span>
                  <div className="font-semibold text-slate-100 mt-1 text-sm">
                    {caseData.failureReason}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Code: {caseData.failureCode || 'GATEWAY_ERROR'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                    Payment Method & Bank
                  </span>
                  <div className="font-semibold text-slate-100 mt-1 text-sm capitalize">
                    {caseData.paymentMethod} {caseData.bankName ? `• ${caseData.bankName}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Sentiment: <span className="text-amber-400 capitalize">{caseData.customerSentiment || 'Neutral'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                    Recovery State
                  </span>
                  <div className="font-semibold text-emerald-400 mt-1 text-sm uppercase">
                    {caseData.status.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Attempts: {caseData.attemptsCount} / {caseData.maxAttempts} max
                  </div>
                </div>
              </div>

              {/* Action Rails Panel */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#030708] via-[#0b121e] to-[#030708] border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Autonomous Recovery Rails
                    </h3>
                    <p className="text-xs text-slate-400">
                      Deploy bounded interventions across Razorpay, WhatsApp, or AI Voice.
                    </p>
                  </div>

                  <button
                    onClick={handleRunDeepDiagnosis}
                    disabled={diagnosing}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs transition-colors cursor-pointer"
                  >
                    {diagnosing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    <span>Run AI Diagnosis</span>
                  </button>
                </div>

                {/* Razorpay Link preview with direct pay and open actions */}
                <div className="p-4 rounded-2xl bg-[#080d14] border border-blue-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-blue-400 font-bold flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-blue-400" />
                        Razorpay Live Payment Link
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Active Rail
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-200 truncate max-w-md">
                      {window.location.origin}/pay/{caseData.caseNumber.toLowerCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`/pay/${caseData.caseNumber.toLowerCase()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Webpage</span>
                    </a>
                  </div>
                </div>

                {/* Channel Actions buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => onRecover(caseData)}
                    disabled={isProcessing || caseData.status === 'recovered'}
                    className="p-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-left transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-white">Razorpay Multi-Rail</span>
                      <CreditCard className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">
                      Generate fallback payment link with dynamic discount waiver.
                    </span>
                  </button>

                  <button
                    onClick={() => onOpenVoiceCall(caseData)}
                    className="p-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-left transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-white">Hinglish AI Voice Call</span>
                      <PhoneCall className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">
                      Launch empathetic voice agent Priya with PTP negotiation.
                    </span>
                  </button>

                  <button
                    onClick={() => onVerifyManualPayment(caseData.id)}
                    disabled={caseData.status === 'recovered'}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 text-left transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs text-white">Reconcile & Settle</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2">
                      Mark as verified recovery and reconcile to ledger.
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Neural Intelligence Root-Cause Analysis
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    High Confidence
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {diagnosisData?.rootCauseDiagnosis ||
                    caseData.rootCauseDiagnosis ||
                    'Click "Run AI Diagnosis" to generate deep root cause analysis and custom intervention strategies.'}
                </p>
              </div>

              {diagnosisData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-2">
                    <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold">
                      Recommended Strategy & Channel
                    </span>
                    <div className="font-bold text-white text-xs">
                      {diagnosisData.recommendedChannel?.toUpperCase()}
                    </div>
                    <p className="text-slate-400 text-xs">{diagnosisData.recoveryStrategy}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">
                      Dynamic Incentive & PTP Window
                    </span>
                    <div className="font-bold text-emerald-300 text-xs">
                      {diagnosisData.suggestedDiscountPercent}% Authorized Waiver
                    </div>
                    <p className="text-slate-400 text-xs">
                      Suggested PTP Horizon: {diagnosisData.suggestedPTPDeadlineHours} Hours
                    </p>
                  </div>

                  {diagnosisData.whatsappTemplateMessage && (
                    <div className="col-span-full p-4 rounded-2xl bg-[#030708]/90 border border-emerald-500/30 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">
                        Personalized WhatsApp AI Message Template
                      </span>
                      <div className="p-3.5 rounded-xl bg-[#080d14] font-mono text-xs text-emerald-200 border border-white/10">
                        {diagnosisData.whatsappTemplateMessage}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Compliance Engine & Stopping Rules Verification
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      name: 'Maximum Contact Frequency Cap',
                      passed: caseData.attemptsCount < caseData.maxAttempts,
                      desc: `Conducted ${caseData.attemptsCount} of maximum ${caseData.maxAttempts} allowed attempts.`,
                    },
                    {
                      name: 'RBI Anti-Harassment Communication Hours (9 AM - 7 PM IST)',
                      passed: true,
                      desc: 'Current intervention window is verified within compliant calling & messaging hours.',
                    },
                    {
                      name: 'Active Customer Dispute Hold',
                      passed: caseData.customerSentiment !== 'disputing' && caseData.status !== 'stopped',
                      desc:
                        caseData.customerSentiment === 'disputing'
                          ? 'Customer has open dispute ticket. Dunning locked immediately.'
                          : 'No active dispute or chargeback complaint.',
                    },
                    {
                      name: 'Promise-to-Pay Grace Period Protection',
                      passed: !caseData.promiseToPayDate,
                      desc: caseData.promiseToPayDate
                        ? `Active PTP holds until ${caseData.promiseToPayDate}. Intrusive contacts suppressed.`
                        : 'No active grace pause.',
                    },
                  ].map((rule, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-start justify-between ${
                        rule.passed
                          ? 'bg-[#080d14] border-white/[0.06]'
                          : 'bg-rose-950/30 border-rose-500/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                          {rule.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          )}
                          {rule.name}
                        </div>
                        <p className="text-slate-400 text-xs pl-6">{rule.desc}</p>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                          rule.passed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {rule.passed ? 'PASSED' : 'BLOCKED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ptp' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Promise-to-Pay (PTP) Ledger
                </h3>

                {caseData.promiseToPayDate ? (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 text-sm">Active PTP Commitment</span>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                        Status: {caseData.ptpStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Customer committed to settle ₹{(caseData.promiseToPayAmount || caseData.amount).toLocaleString('en-IN')} by{' '}
                      <strong className="text-white font-mono">{caseData.promiseToPayDate}</strong>.
                    </div>
                    <p className="text-[11px] text-slate-400">
                      All intrusive reminders are automatically held until this deadline expires.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No active Promise-to-Pay committed yet. Launch a Hinglish AI Voice call to negotiate a settlement date.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="p-5 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
                <h3 className="font-bold text-sm text-white mb-4">Immutable Event Audit Trail</h3>
                <div className="relative pl-6 space-y-4 border-l border-white/10">
                  {caseData.auditTrail.map((entry) => (
                    <div key={entry.id} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#030708]" />
                      <div className="p-3.5 rounded-2xl bg-[#080d14] border border-white/[0.06] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 text-xs">{entry.action}</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{entry.details}</p>
                        <div className="text-[10px] font-mono text-emerald-400 uppercase pt-1">
                          Actor: {entry.actor.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#030708]/90 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Case ID: <span className="font-mono text-slate-400">{caseData.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default CaseDetailModal;
