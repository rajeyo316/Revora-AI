import React from 'react';
import {
  Sparkles,
  PhoneCall,
  CreditCard,
  MessageSquare,
  Repeat,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Play,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { RecoveryCase, ScenarioType, RecoveryChannel, RecoveryStatus } from '../types';

interface CaseTableProps {
  cases: RecoveryCase[];
  selectedCaseIds: string[];
  onToggleSelectCase: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onInspectCase: (c: RecoveryCase) => void;
  onQuickRecover: (c: RecoveryCase) => void;
  onOpenVoiceCall: (c: RecoveryCase) => void;
  onBatchRecoverSelected: () => void;
  isProcessing: boolean;
}

export const CaseTable: React.FC<CaseTableProps> = ({
  cases,
  selectedCaseIds,
  onToggleSelectCase,
  onSelectAll,
  onClearSelection,
  onInspectCase,
  onQuickRecover,
  onOpenVoiceCall,
  onBatchRecoverSelected,
  isProcessing,
}) => {
  const allSelected = cases.length > 0 && selectedCaseIds.length === cases.length;

  const getScenarioBadge = (scenario: ScenarioType) => {
    switch (scenario) {
      case 'payment_failure':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">Payment Failure</span>;
      case 'checkout_abandonment':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">Checkout Drop</span>;
      case 'failed_subscription':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">Failed Sub</span>;
      case 'overdue_invoice':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">Overdue Invoice</span>;
      case 'receivables':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">Receivables</span>;
    }
  };

  const getStatusBadge = (status: RecoveryStatus, stoppingRule?: string) => {
    switch (status) {
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recovered
          </span>
        );
      case 'ptp_active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> PTP Locked
          </span>
        );
      case 'intervention_active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Play className="w-3 h-3 text-blue-400" /> In-Flight
          </span>
        );
      case 'analyzing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" /> AI Diagnosing
          </span>
        );
      case 'stopped':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30"
            title={stoppingRule || 'Stopped by Compliance Engine'}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Stopped: Rule Gate
          </span>
        );
      case 'identified':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/10">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Identified
          </span>
        );
    }
  };

  const getChannelIcon = (channel?: RecoveryChannel) => {
    switch (channel) {
      case 'razorpay_link':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
            <CreditCard className="w-3.5 h-3.5" /> Razorpay Link
          </span>
        );
      case 'whatsapp_ai':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp AI
          </span>
        );
      case 'hinglish_voice':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-medium">
            <PhoneCall className="w-3.5 h-3.5" /> Hinglish Voice
          </span>
        );
      case 'mandate_retry':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Repeat className="w-3.5 h-3.5" /> Mandate Retry
          </span>
        );
      case 'dunning_email':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Mail className="w-3.5 h-3.5" /> Dunning Mail
          </span>
        );
      default:
        return <span className="text-xs text-slate-500 font-mono">Auto-Select Rail</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#080d14]/90 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">
      {/* Table Action Bar */}
      <div className="px-5 py-3.5 bg-[#030708]/80 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-xs text-slate-300">
          <span className="font-bold text-white text-sm tracking-tight">{cases.length} Cases Monitored</span>
          {selectedCaseIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono text-xs">
              {selectedCaseIds.length} Selected
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedCaseIds.length > 0 ? (
            <>
              <button
                onClick={onBatchRecoverSelected}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recover Selected ({selectedCaseIds.length})</span>
              </button>
              <button
                onClick={onClearSelection}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs transition-colors cursor-pointer"
              >
                Clear
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-500 hidden sm:inline">
              Select cases to execute batch recovery or click any row to inspect deep diagnostic audit
            </span>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#030708]/60 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-white/[0.08]">
            <tr>
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={allSelected ? onClearSelection : onSelectAll}
                  className="rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">Case & Customer</th>
              <th className="py-3.5 px-4">Scenario & Root Cause</th>
              <th className="py-3.5 px-4">Amount at Risk</th>
              <th className="py-3.5 px-4">Risk / Gate</th>
              <th className="py-3.5 px-4">Channel Rail</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Bounded Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {cases.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center text-slate-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  No recovery cases match the current filter.
                </td>
              </tr>
            ) : (
              cases.map((c) => {
                const isSelected = selectedCaseIds.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    id={`case-row-${c.id}`}
                    className={`hover:bg-white/[0.03] transition-colors group cursor-pointer ${
                      isSelected ? 'bg-indigo-950/25' : ''
                    }`}
                    onClick={() => onInspectCase(c)}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectCase(c.id)}
                        className="rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 cursor-pointer"
                      />
                    </td>

                    {/* Case & Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs sm:text-sm">
                        {c.customerName}
                        {c.companyName && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({c.companyName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span className="text-slate-300">{c.caseNumber}</span>
                        <span>•</span>
                        <span>{c.customerPhone}</span>
                      </div>
                    </td>

                    {/* Scenario & Failure Reason */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {getScenarioBadge(c.scenario)}
                        {c.bankName && (
                          <span className="text-[10px] font-mono text-slate-300 bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/10">
                            {c.bankName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1" title={c.failureReason}>
                        {c.failureReason}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sm text-white">
                        ₹{c.amount.toLocaleString('en-IN')}
                      </div>
                      {c.dynamicDiscountPercent ? (
                        <div className="text-[10px] text-emerald-400 font-mono">
                          +{c.dynamicDiscountPercent}% discount rail
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono">
                          Full Settlement
                        </div>
                      )}
                    </td>

                    {/* Risk & Compliance Gate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.riskScore > 75
                                ? 'bg-rose-500'
                                : c.riskScore > 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {c.riskScore}/100
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        {c.status === 'stopped' ? (
                          <span className="text-rose-400 flex items-center gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" /> Rule Blocked
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> Gate Passed ({c.attemptsCount}/{c.maxAttempts})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-4">
                      {getChannelIcon(c.channel)}
                      {c.promiseToPayDate && (
                        <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                          PTP: {c.promiseToPayDate}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(c.status, c.stoppingRuleTriggered)}
                    </td>

                    {/* Bounded Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status !== 'recovered' && c.status !== 'stopped' && (
                          <button
                            onClick={() => onQuickRecover(c)}
                            className="px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Execute AI Intervention"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Recover</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenVoiceCall(c)}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-purple-950/60 text-slate-400 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer"
                          title="Hinglish AI Voice Simulator"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onInspectCase(c)}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                          title="Inspect Details & Audit Trail"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CaseTable;
