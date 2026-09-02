import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Filter,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Download,
  CreditCard,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { RecoveryCase } from '../types';
import { useTheme } from '../context/ThemeContext';

interface P2PViewProps {
  cases: RecoveryCase[];
  onOpenP2PModal: (caseData: RecoveryCase) => void;
  onOpenRazorpayModal?: (caseData: RecoveryCase) => void;
}

export const P2PView: React.FC<P2PViewProps> = ({
  cases,
  onOpenP2PModal,
  onOpenRazorpayModal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'active' | 'settled' | 'overdue'>('all');

  const p2pCases = cases.filter((c) => {
    if (filter === 'active') return c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY';
    if (filter === 'settled') return c.status === 'recovered';
    if (filter === 'overdue') {
      const isPast = c.promiseToPayDate && c.promiseToPayDate !== 'Not Set' && new Date(c.promiseToPayDate) < new Date();
      return isPast && c.status !== 'recovered';
    }
    return c.promiseToPayDate && c.promiseToPayDate !== 'Not Set';
  });

  const allPtpCases = cases.filter((c) => c.promiseToPayDate && c.promiseToPayDate !== 'Not Set');
  const activePtpCount = cases.filter((c) => c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY').length;
  const totalCommittedAmt = allPtpCases.reduce((sum, c) => sum + (c.amount || 0), 0);
  const settledPtpCount = cases.filter((c) => c.promiseToPayDate && c.status === 'recovered').length;
  const settledPtpAmount = cases
    .filter((c) => c.promiseToPayDate && c.status === 'recovered')
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Case_ID', 'Customer', 'Phone', 'Committed_Amount_INR', 'Promise_Date', 'Status', 'Dunning_Suppressed'];
    const rows = allPtpCases.map((c) => [
      c.caseNumber,
      `"${c.customerName}"`,
      c.customerPhone,
      c.amount,
      c.promiseToPayDate,
      c.status === 'recovered' ? 'SETTLED' : 'ACTIVE_HOLD',
      c.status === 'recovered' ? 'NO' : 'YES_SUPPRESSED',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Revora_PTP_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Promise-to-Pay (P2P) Ledger &amp; Suppress Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              ANTI-HARASSMENT GUARD
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Captures customer payment commitments from voice negotiation &amp; WhatsApp. Automatically pauses recovery nudges to maintain 100% regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export P2P Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Dunning Pauses</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">{activePtpCount} Cases</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nudges suppressed until commitment date</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Committed Capital</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">₹{totalCommittedAmt.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under verified customer promises</div>
        </div>

        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Settled Commitments</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-400 mt-1">₹{settledPtpAmount.toLocaleString('en-IN')} ({settledPtpCount} cases)</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Recovered following PTP schedule</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
        isDark ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
      }`}>
        <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <div className={`font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-900'}`}>
            Automated Anti-Spam Dunning Suppression
          </div>
          <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            When a customer promises to settle on a specific date (via Hinglish Voice Call or WhatsApp), Revora AI halts all outgoing voice and WhatsApp nudges until the grace deadline expires.
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl ${
        isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'
      }`}>
        {/* Table Filter Tabs */}
        <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'border-white/[0.08] bg-black/20' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Commitment Ledger ({p2pCases.length})
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-white/[0.04] text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Commitments ({allPtpCases.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === 'active'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-white/[0.04] text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Active Grace Pauses ({activePtpCount})
            </button>
            <button
              onClick={() => setFilter('settled')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === 'settled'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-white/[0.04] text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Settled ({settledPtpCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider font-mono ${
                isDark ? 'border-white/[0.08] bg-black/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Customer &amp; Scenario</th>
                <th className="py-3.5 px-4">Committed Amount</th>
                <th className="py-3.5 px-4">Promise Date</th>
                <th className="py-3.5 px-4">Autonomous Channel</th>
                <th className="py-3.5 px-4">Dunning State</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDark ? 'divide-white/[0.05]' : 'divide-slate-200'}`}>
              {p2pCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No Promise-to-Pay records found for this filter.
                  </td>
                </tr>
              ) : (
                p2pCases.map((c) => {
                  const isSettled = c.status === 'recovered';
                  const isPaused = c.promiseStatus === 'PAUSED_RETRY' || c.status === 'ptp_active';
                  const isVoiceOriginated = c.caseNumber === 'REV-CC-1008' || c.caseNumber === 'REV-NIKE-1800' || (c.detectionReason && c.detectionReason.includes('Voice'));

                  return (
                    <tr key={c.id} className={`transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{c.caseNumber}</span>
                        {isVoiceOriginated && (
                          <div className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mt-1 block w-fit">
                            <span>AI Voice Sync</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.customerName}</div>
                        <div className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">
                          <span>{c.customerPhone}</span>
                          {c.bankName && (
                            <span className="text-[9.5px] px-1 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
                              {c.bankName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <span className={isSettled ? 'text-emerald-400' : isDark ? 'text-white' : 'text-slate-900'}>
                          ₹{c.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        <div className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{c.promiseToPayDate || 'Pending'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-[240px]">
                        <div
                          className={`text-[11.5px] leading-snug line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                          title={c.detectionReason || c.resolutionNotes || c.recoveryStrategy || 'Customer committed payment date via conversational agent.'}
                        >
                          {c.detectionReason || c.resolutionNotes || c.recoveryStrategy || 'Customer committed payment date via conversational agent.'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isSettled ? (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                            SETTLED
                          </span>
                        ) : isPaused ? (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                            DUNNING PAUSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                            ACTIVE NUDGE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenRazorpayModal && !isSettled && (
                            <button
                              onClick={() => onOpenRazorpayModal(c)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                isDark
                                  ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/30'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                              }`}
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Razorpay</span>
                            </button>
                          )}
                          <button
                            onClick={() => onOpenP2PModal(c)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                              isDark
                                ? 'bg-white/[0.06] hover:bg-white/[0.12] text-cyan-300 border-cyan-500/30'
                                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-300'
                            }`}
                          >
                            Update Date
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
    </div>
  );
};

export default P2PView;
