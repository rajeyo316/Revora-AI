import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  ShieldCheck,
  FileCheck2,
  Cpu,
  UserCheck,
  Lock,
  Key,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Download,
  Search,
  ExternalLink,
  Save,
  Radio,
  Clock,
  PhoneCall,
  MessageSquare,
  Mail,
  Zap,
  Info,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  RazorpaySettings,
  StoppingRulesConfig,
  UserProfile,
  AuditEntry,
} from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsViewProps {
  currentUser?: UserProfile | null;
  razorpaySettings: RazorpaySettings | null;
  stoppingRules: StoppingRulesConfig | null;
  auditLogs: AuditEntry[];
  onSaveRazorpaySettings: (settings: RazorpaySettings) => Promise<void>;
  onSaveComplianceRules: (rules: StoppingRulesConfig) => Promise<void>;
  onSwitchUserRole?: (role: 'fintech_admin' | 'recovery_manager') => void;
  onOpenWebhookSimulator?: () => void;
  onShowBanner?: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

type SettingsTab = 'integrations' | 'compliance' | 'audit' | 'ai_engine' | 'workspace';

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  razorpaySettings,
  stoppingRules,
  auditLogs = [],
  onSaveRazorpaySettings,
  onSaveComplianceRules,
  onSwitchUserRole,
  onOpenWebhookSimulator,
  onShowBanner,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<SettingsTab>('integrations');

  // Razorpay API State
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://revora.ai';
  const defaultWebhookUrl = `${currentOrigin}/api/webhooks/razorpay`;

  const [keyId, setKeyId] = useState(razorpaySettings?.keyId || 'rzp_test_TTfg3j9DzfQA0t');
  const [keySecret, setKeySecret] = useState('');
  const [webhookSecret, setWebhookSecret] = useState(razorpaySettings?.webhookSecretMasked || 'whsec_revora_prod_2026');
  const [webhookUrl, setWebhookUrl] = useState(razorpaySettings?.webhookEndpointUrl || defaultWebhookUrl);
  const [testMode, setTestMode] = useState(razorpaySettings?.testMode ?? true);
  const [showKeySecret, setShowKeySecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSavingRazorpay, setIsSavingRazorpay] = useState(false);

  // Compliance State
  const [maxAttempts, setMaxAttempts] = useState(stoppingRules?.maxAttempts || 3);
  const [startHour, setStartHour] = useState(stoppingRules?.antiHarassmentHoursStart || 8);
  const [endHour, setEndHour] = useState(stoppingRules?.antiHarassmentHoursEnd || 19);
  const [maxDiscount, setMaxDiscount] = useState(stoppingRules?.maxDiscountAllowed || 10);
  const [blockOnDispute, setBlockOnDispute] = useState(stoppingRules?.blockOnDispute ?? true);
  const [disputeCooldownDays, setDisputeCooldownDays] = useState(stoppingRules?.disputeCooldownDays || 7);
  const [minAmountForVoice, setMinAmountForVoice] = useState(stoppingRules?.minAmountForVoiceRecovery || 5000);
  const [isSavingCompliance, setIsSavingCompliance] = useState(false);

  // AI & Dunning State
  const [aiAutonomousMode, setAiAutonomousMode] = useState<'full_auto' | 'human_review'>('full_auto');
  const [temperature, setTemperature] = useState(0.2);
  const [ptpGraceDays, setPtpGraceDays] = useState(3);
  const [preferredRail, setPreferredRail] = useState('razorpay_upi');

  // Audit Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('all');

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    if (onShowBanner) onShowBanner('Webhook URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleSaveRzp = async () => {
    setIsSavingRazorpay(true);
    try {
      await onSaveRazorpaySettings({
        keyId,
        keySecretMasked: keySecret ? '••••••••' + keySecret.slice(-4) : razorpaySettings?.keySecretMasked || '••••••••••••',
        hasKeySecret: true,
        webhookSecretMasked: webhookSecret,
        hasWebhookSecret: true,
        testMode,
        webhookEndpointUrl: webhookUrl,
      });
      if (onShowBanner) onShowBanner('Razorpay API integration credentials saved securely.', 'success');
    } catch {
      if (onShowBanner) onShowBanner('Failed to save Razorpay settings', 'warning');
    } finally {
      setIsSavingRazorpay(false);
    }
  };

  const handleSaveRules = async () => {
    setIsSavingCompliance(true);
    try {
      await onSaveComplianceRules({
        maxAttempts: Number(maxAttempts),
        antiHarassmentHoursStart: Number(startHour),
        antiHarassmentHoursEnd: Number(endHour),
        maxDiscountAllowed: Number(maxDiscount),
        disputeCooldownDays: Number(disputeCooldownDays),
        blockOnDispute,
        minAmountForVoiceRecovery: Number(minAmountForVoice),
        mandateRetryIntervalHours: 48,
      });
      if (onShowBanner) onShowBanner('RBI Compliance Guardrails saved and updated.', 'success');
    } catch {
      if (onShowBanner) onShowBanner('Failed to save compliance rules', 'warning');
    } finally {
      setIsSavingCompliance(false);
    }
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.case_id && log.case_id.toLowerCase().includes(auditSearch.toLowerCase()));
    const matchesActor = actorFilter === 'all' || log.actor === actorFilter;
    return matchesSearch && matchesActor;
  });

  const handleDownloadAuditCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Action', 'Details', 'Case ID'];
    const rows = filteredAuditLogs.map((log) => [
      log.id,
      log.timestamp,
      log.actor,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.details.replace(/"/g, '""')}"`,
      log.case_id || 'N/A',
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revora_rbi_compliance_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowBanner) onShowBanner('Compliance Audit CSV export downloaded.', 'success');
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'integrations', label: 'Payment Rails & APIs', icon: <CreditCard className="w-4 h-4" />, badge: 'Active' },
    { id: 'compliance', label: 'RBI Safety & Rules', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Guarded' },
    { id: 'audit', label: 'Cryptographic Audit Trail', icon: <FileCheck2 className="w-4 h-4" />, badge: `${auditLogs.length}` },
    { id: 'ai_engine', label: 'AI Dunning Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace & Security', icon: <UserCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Settings & Integration Rails
            </h1>
          </div>
          <p className={`text-xs sm:text-sm mt-1 max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage server-side Razorpay credentials, RBI fair-practice compliance guardrails, cryptographic audit ledgers, and AI dunning behaviors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
            testMode
              ? isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
              : isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${testMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            {testMode ? 'Test Sandbox Active' : 'Live Production Gateway'}
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center gap-1.5 shadow-sm ${
        isDark ? 'bg-[#080d19]/80 border-white/10' : 'bg-white border-slate-200'
      }`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Payment Rails & API Credentials */}
      {activeTab === 'integrations' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Razorpay API Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
            isDark ? 'bg-[#080d19]/90 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Razorpay Live & Test Credentials
                  </h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Keys are kept strictly on the backend server for HMAC webhook authentication and link dispatch.
                  </p>
                </div>
              </div>

              {onOpenWebhookSimulator && (
                <button
                  onClick={onOpenWebhookSimulator}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                    isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  }`}
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Launch Webhook Simulator</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key ID */}
              <div className="space-y-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Razorpay Key ID
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                    placeholder="rzp_live_... or rzp_test_..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                      isDark ? 'bg-black/40 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-400">Public merchant identifier for smart checkout.</p>
              </div>

              {/* Key Secret */}
              <div className="space-y-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Razorpay Key Secret
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showKeySecret ? 'text' : 'password'}
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                    placeholder={razorpaySettings?.keySecretMasked || 'Enter secret to update...'}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                      isDark ? 'bg-black/40 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeySecret(!showKeySecret)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showKeySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Never exposed to client side; used exclusively for server-side link generation.</p>
              </div>

              {/* Webhook Endpoint URL */}
              <div className="space-y-2 md:col-span-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Ingress Webhook Endpoint URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCopyWebhookUrl}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      copiedUrl
                        ? 'bg-emerald-600 text-white'
                        : isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste this URL in your Razorpay Dashboard &gt; Settings &gt; Webhooks. Subscribe to <code className="text-cyan-400 font-mono">payment.failed</code>, <code className="text-emerald-400 font-mono">order.paid</code>, and <code className="text-purple-400 font-mono">invoice.paid</code>.
                </p>
              </div>

              {/* Webhook Secret */}
              <div className="space-y-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Webhook Secret (HMAC Verification)
                </label>
                <input
                  type="text"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Environment Mode Toggle */}
              <div className="space-y-2 flex flex-col justify-end">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Gateway Execution Mode
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setTestMode(true)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      testMode
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Test / Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestMode(false)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      !testMode
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Live Production
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleSaveRzp}
                disabled={isSavingRazorpay}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSavingRazorpay ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingRazorpay ? 'Saving...' : 'Save Razorpay Configuration'}</span>
              </button>
            </div>
          </div>

          {/* Secondary Rails (WhatsApp, Voice, SMS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* WhatsApp Cloud API */}
            <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#080d19]/70 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>WhatsApp Cloud API</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                1-click interactive payment buttons dispatched via WhatsApp Business API with 98% open rate.
              </p>
            </div>

            {/* Hinglish Voice Rail */}
            <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#080d19]/70 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Connected
                </span>
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Neural Voice Bot Rail</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Interactive Hinglish conversational phone recovery powered by Web Speech / Neural TTS synthesis.
              </p>
            </div>

            {/* SMS Carrier DLT */}
            <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#080d19]/70 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  DLT Approved
                </span>
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>SMS & e-Mandate Failover</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant SMS fallbacks for offline customers with dynamic deep links to UPI apps.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: RBI Compliance Guardrails */}
      {activeTab === 'compliance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
            isDark ? 'bg-[#080d19]/90 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  RBI Fair Practice & Anti-Harassment Rules
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Mathematical boundaries enforcing customer protection, bounded retries, and strict cooling hours.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Attempts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Max Contact Attempts per Failed Transaction
                  </label>
                  <span className="font-mono text-xs font-bold text-cyan-400">{maxAttempts} attempts</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[11px] text-slate-400">RBI mandates max 3 contact attempts to avoid harassment penalties.</p>
              </div>

              {/* Max Discount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Max Dynamic Incentive Discount Allowed
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-400">{maxDiscount}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[11px] text-slate-400">Upper bound on discounts AI can offer to salvage abandoned checkouts.</p>
              </div>

              {/* Calling Window */}
              <div className="space-y-2 md:col-span-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Permitted Outbound Communication Window (IST)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Window Opens</span>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(Number(e.target.value))}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                        isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={8}>08:00 AM (RBI Recommended)</option>
                      <option value={9}>09:00 AM</option>
                      <option value={10}>10:00 AM</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Window Closes (Quiet Hours Begin)</span>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(Number(e.target.value))}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                        isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={19}>07:00 PM (19:00 IST - Strict RBI Rule)</option>
                      <option value={20}>08:00 PM</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zero automated SMS, WhatsApp nudges, or voice phone calls are permitted outside this window.
                </p>
              </div>

              {/* Dispute Freeze */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Instant Dispute Freeze</h4>
                  <p className="text-[11px] text-slate-400">Permanently halts active dunning if customer disputes charge.</p>
                </div>
                <input
                  type="checkbox"
                  checked={blockOnDispute}
                  onChange={(e) => setBlockOnDispute(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Min amount for voice */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Min Invoice for Voice AI</h4>
                  <p className="text-[11px] text-slate-400">Threshold before triggering Hinglish voice agent.</p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-400">₹{minAmountForVoice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleSaveRules}
                disabled={isSavingCompliance}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSavingCompliance ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isSavingCompliance ? 'Saving...' : 'Apply RBI Compliance Guardrails'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Cryptographic Audit Trail */}
      {activeTab === 'audit' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#080d19]/90 border-white/10' : 'bg-white border-slate-200'
          }`}>
            {/* Header & Export controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Immutable Regulatory Audit Ledger
                  </h2>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tamper-evident logs of every webhook, AI recovery decision, cooldown trigger, and settlement event.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleDownloadAuditCSV}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV Ledger</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search actions, case numbers, actor names..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'gemini_agent', 'razorpay_webhook', 'compliance_engine', 'user'].map((act) => (
                  <button
                    key={act}
                    onClick={() => setActorFilter(act)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      actorFilter === act
                        ? 'bg-blue-600 text-white'
                        : isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {act.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className={`text-[11px] uppercase font-mono font-bold ${
                  isDark ? 'bg-black/50 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action & Event</th>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">SHA-256 Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No audit records match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {log.timestamp}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                            log.actor === 'gemini_agent'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : log.actor === 'razorpay_webhook'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : log.actor === 'compliance_engine'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {log.actor.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.action}</div>
                          <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{log.details}</div>
                        </td>
                        <td className="p-3 font-mono text-cyan-400">
                          {log.case_id || 'Global'}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: AI Engine & Recovery Intelligence */}
      {activeTab === 'ai_engine' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#080d19]/90 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Autonomous Recovery Intelligence Engine
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Fine-tuned autonomous root-cause extraction and smart retry orchestration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  Autonomous Execution Mode
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setAiAutonomousMode('full_auto')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      aiAutonomousMode === 'full_auto'
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : isDark ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Fully Autonomous Interventions</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">High-confidence recovery actions execute immediately within RBI rules.</div>
                  </div>

                  <div
                    onClick={() => setAiAutonomousMode('human_review')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      aiAutonomousMode === 'human_review'
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : isDark ? 'bg-black/30 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Human-in-the-Loop Approval</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">All outbound link dispatches queue for manager authorization.</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      Model Diagnostic Temperature
                    </label>
                    <span className="font-mono text-xs font-bold text-purple-400">{temperature} (Deterministic)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-[11px] text-slate-400">Low temperature guarantees strict, deterministic diagnosis without hallucination.</p>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Primary Recovery Rail Priority
                  </label>
                  <select
                    value={preferredRail}
                    onChange={(e) => setPreferredRail(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="razorpay_upi">1. Dynamic 1-Click Razorpay UPI Intent</option>
                    <option value="whatsapp">2. WhatsApp Interactive Payment Message</option>
                    <option value="voice">3. Hinglish Neural Voice Bot</option>
                    <option value="email">4. Proactive Dunning Email</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: Workspace & Security */}
      {activeTab === 'workspace' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#080d19]/90 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Workspace Role & Access Control (RBAC)
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Manage admin privileges, authentication sessions, and operational overrides.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs text-slate-400 mb-1">Active User Persona</div>
                <div className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentUser?.name || 'Rajeyo Haldar'}
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-0.5">{currentUser?.email || 'rajeyoh@gmail.com'}</div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Active Role:</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {currentUser?.role === 'fintech_admin' ? 'Fintech Admin' : 'Recovery Manager'}
                  </span>
                </div>
              </div>

              {onSwitchUserRole && (
                <div className="space-y-3">
                  <label className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Simulate Role Switch
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUserRole('fintech_admin');
                        if (onShowBanner) onShowBanner('Switched role to Fintech Admin (Full API & Regulatory Access)', 'info');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        currentUser?.role === 'fintech_admin'
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Fintech Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUserRole('recovery_manager');
                        if (onShowBanner) onShowBanner('Switched role to Recovery Manager (Operational Queue Mode)', 'info');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        currentUser?.role === 'recovery_manager'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Recovery Manager
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fintech Admins can modify API credentials and regulatory guardrails. Recovery Managers focus on queue triage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsView;
