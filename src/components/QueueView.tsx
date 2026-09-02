import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Zap,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Eye,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Building,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { RecoveryCase } from '../types';
import { useTheme } from '../context/ThemeContext';

interface QueueViewProps {
  cases: RecoveryCase[];
  onDeployAction: (caseId: string) => void;
  onSimulatePayment: (caseId: string) => void;
  onOpenP2PModal: (caseData: RecoveryCase) => void;
  onInspectCase: (caseData: RecoveryCase) => void;
  onOpenRazorpayModal?: (caseData: RecoveryCase) => void;
  onOpenVoiceCall?: (caseData: RecoveryCase) => void;
  onOpenIngestModal?: () => void;
  onGenerateDummyCases?: (count?: number) => void;
  onResetSeed?: () => void;
  isProcessing?: boolean;
}

export const QueueView: React.FC<QueueViewProps> = ({
  cases = [],
  onDeployAction,
  onSimulatePayment,
  onOpenP2PModal,
  onInspectCase,
  onOpenRazorpayModal,
  onOpenVoiceCall,
  onOpenIngestModal,
  onGenerateDummyCases,
  onResetSeed,
  isProcessing,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'default' | 'amount_desc' | 'risk_desc' | 'date_desc'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCaseId, setCopiedCaseId] = useState<string | null>(null);
  const pageSize = 8;

  // Filter cases safely with fallback guards
  const filteredCases = useMemo(() => {
    return (cases || []).filter((c) => {
      if (!c) return false;
      const matchesScenario = scenarioFilter === 'all' || c.scenario === scenarioFilter;
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'recovered'
          ? c.status === 'recovered' || c.recovered === true
          : statusFilter === 'active'
          ? c.status !== 'recovered' && c.status !== 'stopped'
          : statusFilter === 'ptp'
          ? c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY'
          : statusFilter === 'stopped'
          ? c.status === 'stopped'
          : true;

      const q = (search || '').trim().toLowerCase();
      if (!q) return matchesScenario && matchesStatus;

      const name = (c.customerName || '').toLowerCase();
      const num = (c.caseNumber || '').toLowerCase();
      const email = (c.customerEmail || '').toLowerCase();
      const comp = (c.companyName || '').toLowerCase();
      const bank = (c.bankName || '').toLowerCase();
      const reason = (c.failureReason || '').toLowerCase();

      const matchesSearch =
        name.includes(q) ||
        num.includes(q) ||
        email.includes(q) ||
        comp.includes(q) ||
        bank.includes(q) ||
        reason.includes(q);

      return matchesScenario && matchesStatus && matchesSearch;
    });
  }, [cases, scenarioFilter, statusFilter, search]);

  // Sort cases safely
  const sortedCases = useMemo(() => {
    const arr = [...filteredCases];
    if (sortBy === 'amount_desc') return arr.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    if (sortBy === 'risk_desc') return arr.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    if (sortBy === 'date_desc') {
      return arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return arr;
  }, [filteredCases, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedCases.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageCases = sortedCases.slice(startIndex, startIndex + pageSize);

  const handleCopyLink = (caseItem: RecoveryCase, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = caseItem.paymentUrl || `https://rzp.io/i/rev_${(caseItem.caseNumber || 'case').toLowerCase()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedCaseId(caseItem.id);
    setTimeout(() => setCopiedCaseId(null), 2000);
  };

  const handleOpenLink = (caseItem: RecoveryCase, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenRazorpayModal) {
      onOpenRazorpayModal(caseItem);
    } else {
      const link = caseItem.paymentUrl || `https://rzp.io/i/rev_${(caseItem.caseNumber || 'case').toLowerCase()}`;
      window.open(link, '_blank');
    }
  };

  const scenarioTabs = [
    { id: 'all', label: 'All Scenarios', count: cases.length },
    { id: 'payment_failure', label: 'Gateway Timeouts', count: cases.filter((c) => c.scenario === 'payment_failure').length },
    { id: 'checkout_abandonment', label: 'OTP Drop-offs', count: cases.filter((c) => c.scenario === 'checkout_abandonment').length },
    { id: 'failed_subscription', label: 'Subscriptions', count: cases.filter((c) => c.scenario === 'failed_subscription').length },
    { id: 'overdue_invoice', label: 'B2B Invoices', count: cases.filter((c) => c.scenario === 'overdue_invoice').length },
    { id: 'receivables', label: 'Receivables', count: cases.filter((c) => c.scenario === 'receivables').length },
  ];

  const activeCount = cases.filter((c) => c.status !== 'recovered' && c.status !== 'stopped').length;
  const recoveredCount = cases.filter((c) => c.status === 'recovered' || c.recovered === true).length;
  const ptpCount = cases.filter((c) => c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header & Fast Action Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Active Recovery Pipeline
            </h1>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              isDark ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {cases.length} Total Cases
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Prioritized stream of at-risk transactions with real-time Razorpay dynamic payment links, AI root-cause diagnostics, and autonomous settlement.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5 sm:self-center self-start shrink-0">
          {/* View Mode Toggle */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? 'bg-[#080d18] border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          {/* Reset Quick Action */}
          {onResetSeed && (
            <button
              onClick={onResetSeed}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Reset to 24 Clean Enterprise Cases"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Primary Ingest Button */}
          {onOpenIngestModal && (
            <button
              onClick={onOpenIngestModal}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/25 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Ingest Failed Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            setStatusFilter('active');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'ring-2 ring-blue-500 border-transparent shadow-md'
              : isDark
              ? 'bg-[#0b1324] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Active Recoveries</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className={`text-xl font-extrabold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeCount}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            setStatusFilter('recovered');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'recovered'
              ? 'ring-2 ring-emerald-500 border-transparent shadow-md'
              : isDark
              ? 'bg-[#0b1324] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Settled (Paid)</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-emerald-400 mt-1">
            {recoveredCount}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            setStatusFilter('ptp');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ptp'
              ? 'ring-2 ring-cyan-500 border-transparent shadow-md'
              : isDark
              ? 'bg-[#0b1324] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>P2P Paused</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-cyan-400 mt-1">
            {ptpCount}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            setStatusFilter('all');
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'ring-2 ring-indigo-500 border-transparent shadow-md'
              : isDark
              ? 'bg-[#0b1324] border-white/[0.08] hover:border-white/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Total Ingested</span>
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className={`text-xl font-extrabold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {cases.length}
          </div>
        </motion.button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`p-4 rounded-2xl border space-y-3.5 shadow-md ${
          isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, Case ID (REV-...), bank, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none border transition-all ${
                isDark
                  ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Controls Right */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end text-xs">
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDark ? 'bg-black/50 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Statuses ({cases.length})</option>
              <option value="active">Active Recoveries ({activeCount})</option>
              <option value="recovered">Settled / Paid ({recoveredCount})</option>
              <option value="ptp">P2P Grace Window ({ptpCount})</option>
              <option value="stopped">Halted by Rules</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDark ? 'bg-black/50 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="default">Sort: Default Priority</option>
              <option value="amount_desc">Sort: Amount (High to Low)</option>
              <option value="risk_desc">Sort: AI Likelihood (High to Low)</option>
              <option value="date_desc">Sort: Recently Ingested</option>
            </select>
          </div>
        </div>

        {/* Scenario Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {scenarioTabs.map((tab) => {
            const isSelected = scenarioFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setScenarioFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-blue-600 border-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/20 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table View */}
      {viewMode === 'table' && (
        <div
          className={`rounded-2xl border overflow-hidden shadow-xl ${
            isDark ? 'bg-[#080d18] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                    isDark ? 'bg-[#050810] border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <th className="py-3 px-3.5">Case ID</th>
                  <th className="py-3 px-3.5">Customer & Failure</th>
                  <th className="py-3 px-3.5">Overdue</th>
                  <th className="py-3 px-3.5">Capital</th>
                  <th className="py-3 px-3.5">Smart Pay Link</th>
                  <th className="py-3 px-3.5">AI Diagnosis</th>
                  <th className="py-3 px-3.5 text-right">Recovery Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-200'}`}>
                {pageCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                        <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          No cases found matching your criteria
                        </div>
                        <p className="text-xs text-slate-400">
                          Try resetting the filters or ingesting new transactions into the pipeline.
                        </p>
                        {onResetSeed && (
                          <button
                            onClick={onResetSeed}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                          >
                            Reset to 24 Enterprise Scenarios
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageCases.map((c, index) => {
                    const isRecovered = c.status === 'recovered' || c.recovered === true;
                    const isStopped = c.status === 'stopped';
                    const isPTP = c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY';
                    const caseNum = c.caseNumber || `REV-${c.id}`;
                    const paymentUrl = c.paymentUrl || `https://rzp.io/i/rev_${caseNum.toLowerCase()}`;
                    const isCopied = copiedCaseId === c.id;
                    const days = c.daysOverdue ?? (parseInt(c.caseNumber.replace(/\D/g, '')) % 15 + 1);
                    const risk = c.riskLevel || (days >= 15 ? 'critical' : days >= 7 ? 'high' : days >= 3 ? 'moderate' : 'low');

                    return (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.26,
                          delay: Math.min(index * 0.04, 0.35),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Case ID */}
                        <td className="py-2.5 px-3.5 font-mono font-bold whitespace-nowrap">
                          <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>
                            {caseNum}
                          </span>
                        </td>

                        {/* Customer & Failure */}
                        <td className="py-2.5 px-3.5 space-y-0.5 max-w-[150px]">
                          <div className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {c.customerName || 'Customer'}
                          </div>
                          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-mono truncate">
                            <span>{c.scenarioLabel || c.scenario || 'Payment Failure'}</span>
                            {c.bankName && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-white/5 border border-white/10">
                                {c.bankName}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Overdue Days & Risk */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                days >= 14
                                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                  : days >= 7
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              }`}
                            >
                              {days === 0 ? '0d' : `${days}d`}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1 py-0.2 rounded ${
                                risk === 'critical'
                                  ? 'bg-rose-600/20 text-rose-300'
                                  : risk === 'high'
                                  ? 'bg-amber-600/20 text-amber-300'
                                  : 'bg-emerald-600/20 text-emerald-300'
                              }`}
                            >
                              {risk}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <span className={`font-mono font-extrabold text-xs ${
                            isRecovered ? 'text-emerald-400' : isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            ₹{(c.amount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Razorpay Payment Link */}
                        <td className="py-2.5 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleOpenLink(c, e)}
                              className={`font-mono text-[10.5px] px-2 py-1 rounded-md border transition-all flex items-center gap-1 cursor-pointer max-w-[120px] truncate ${
                                isDark
                                  ? 'bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/30 text-blue-300'
                                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                              }`}
                              title="Open Live Razorpay Payment Checkout Link"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 text-blue-400" />
                              <span className="truncate">rzp.io/i/{caseNum.toLowerCase()}</span>
                            </button>

                            <button
                              onClick={(e) => handleCopyLink(c, e)}
                              className={`p-1 rounded-md border transition-colors cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                  : isDark
                                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                              }`}
                              title={isCopied ? 'Copied URL!' : 'Copy Payment URL'}
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* AI Diagnosis */}
                        <td className="py-2.5 px-3.5 max-w-[170px]">
                          <div
                            className={`text-[11px] font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                            title={c.failureReason}
                          >
                            {c.failureReason || 'Gateway Timeout'}
                          </div>
                          <div className="text-[9.5px] text-cyan-400 font-mono">
                            {c.aiScore || `${c.riskScore || 85}% Win Prob`}
                          </div>
                        </td>

                        {/* Compact Recovery Actions - Fully Visible without Scrolling */}
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Inspect */}
                            <button
                              onClick={() => onInspectCase(c)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isDark
                                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                              }`}
                              title="Inspect AI Diagnostics & Full Audit Trail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* P2P Hold */}
                            <button
                              onClick={() => onOpenP2PModal(c)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                isDark
                                  ? 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/30 text-cyan-300'
                                  : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700'
                              }`}
                              title="Log Promise-to-Pay (Pause Dunning)"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>

                            {/* Pay via Razorpay Checkout */}
                            {!isRecovered && onOpenRazorpayModal && (
                              <button
                                onClick={() => onOpenRazorpayModal(c)}
                                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                title="Open Live Razorpay Checkout Modal"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Pay</span>
                              </button>
                            )}

                            {/* Instant Mark as Paid (Webhook Simulation) */}
                            {!isRecovered && (
                              <button
                                onClick={() => onSimulatePayment(c.id)}
                                className={`px-2 py-1 rounded-lg border font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                                  isDark
                                    ? 'bg-emerald-950/50 hover:bg-emerald-900/70 border-emerald-500/40 text-emerald-300'
                                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                                }`}
                                title="Simulate Instant Payment Webhook (Auto-Settle)"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Paid</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div
            className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-[#050810] border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div>
              Showing <span className="font-bold text-blue-500">{pageCases.length}</span> of{' '}
              <span className="font-bold">{sortedCases.length}</span> filtered cases ({cases.length} total in pipeline)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Cards View */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageCases.map((c, index) => {
              const isRecovered = c.status === 'recovered' || c.recovered === true;
              const isStopped = c.status === 'stopped';
              const isPTP = c.status === 'ptp_active' || c.promiseStatus === 'PAUSED_RETRY';
              const caseNum = c.caseNumber || `REV-${c.id}`;
              const paymentUrl = c.paymentUrl || `https://rzp.io/i/rev_${caseNum.toLowerCase()}`;
              const isCopied = copiedCaseId === c.id;
              const days = c.daysOverdue ?? (parseInt(c.caseNumber.replace(/\D/g, '')) % 15 + 1);
              const risk = c.riskLevel || (days >= 15 ? 'critical' : days >= 7 ? 'high' : days >= 3 ? 'moderate' : 'low');

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03 }}
                  whileHover={{
                    y: -6,
                    scale: 1.015,
                    transition: { duration: 0.18, ease: 'easeOut' },
                  }}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-colors shadow-lg cursor-pointer ${
                    isDark
                      ? 'bg-[#080d18]/90 hover:bg-[#0c1426] border-white/10 hover:border-cyan-500/40 hover:shadow-cyan-950/30'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-blue-900/10'
                  }`}
                  onClick={() => onInspectCase(c)}
                >
                  {/* Card Top */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        {caseNum}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            days >= 14
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : days >= 7
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {days === 0 ? 'Just Failed' : `${days}d Overdue`}
                        </span>

                        {isRecovered ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                        ) : isStopped ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-mono">
                            <ShieldCheck className="w-3 h-3" /> Halted
                          </span>
                        ) : isPTP ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" /> PTP
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {c.customerName || 'Customer'}
                      </h3>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{c.customerEmail}</span>
                        {c.bankName && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                            {c.bankName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pay Link Snippet in Card */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="text-slate-400 truncate text-[11px]">
                          {paymentUrl.replace('https://', '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleOpenLink(c, e)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 rounded border border-blue-500/30 cursor-pointer"
                        >
                          Open Link
                        </button>
                        <button
                          onClick={(e) => handleCopyLink(c, e)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          title="Copy Payment URL"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">At-Risk Capital:</span>
                        <span className="font-extrabold text-base text-emerald-400">
                          ₹{(c.amount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Root Cause:</span>
                        <span className="text-amber-300 font-medium truncate max-w-[160px]" title={c.failureReason}>
                          {c.failureReason || 'Gateway Timeout'}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Risk Assessment:</span>
                        <span className={`font-bold uppercase ${
                          risk === 'critical' ? 'text-rose-400' : risk === 'high' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {risk} ({c.riskScore || 85}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 pt-3 border-t border-white/10 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onInspectCase(c)}
                        className={`py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                          isDark
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onOpenP2PModal(c)}
                        className={`py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                          isDark
                            ? 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/30 text-cyan-300'
                            : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>P2P Pause</span>
                      </button>
                    </div>

                    {!isRecovered ? (
                      <div className="space-y-1.5">
                        {onOpenRazorpayModal && (
                          <button
                            onClick={() => onOpenRazorpayModal(c)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ₹{(c.amount || 0).toLocaleString('en-IN')} (Razorpay)</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSimulatePayment(c.id)}
                          className="w-full py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark as Paid (Auto-Settle)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center font-bold text-xs text-emerald-400 font-mono">
                        ✓ Recovered & Settled via Razorpay
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Grid Pagination */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-[#050810] border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div>
              Showing <span className="font-bold text-blue-500">{pageCases.length}</span> of{' '}
              <span className="font-bold">{sortedCases.length}</span> filtered cases
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueView;
