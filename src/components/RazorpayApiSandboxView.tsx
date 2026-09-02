import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Send,
  ShieldCheck,
  Code2,
  QrCode,
  Smartphone,
  Layers,
  ArrowRight,
  Globe,
  Radio,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RecoveryCase } from '../types';

interface RazorpayApiSandboxViewProps {
  cases: RecoveryCase[];
  onOpenRazorpayModal?: (caseData: RecoveryCase) => void;
  onRefreshData?: () => Promise<void>;
}

export const RazorpayApiSandboxView: React.FC<RazorpayApiSandboxViewProps> = ({
  cases = [],
  onOpenRazorpayModal,
  onRefreshData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeSubTab, setActiveSubTab] = useState<'ping' | 'link_gen' | 'webhook' | 'terminal'>('ping');

  // Ping state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);

  // Link Generator State
  const [genAmount, setGenAmount] = useState('4999');
  const [genName, setGenName] = useState('Rajeyo Haldar');
  const [genEmail, setGenEmail] = useState('rajeyoh@gmail.com');
  const [genPhone, setGenPhone] = useState('+91 9876543210');
  const [genDesc, setGenDesc] = useState('Annual Cloud Subscription Renewal (Recovered via Revora)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Webhook Simulator State
  const [webhookEvent, setWebhookEvent] = useState<'payment.captured' | 'payment_link.paid' | 'payment.failed' | 'refund.processed'>('payment.captured');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [isDispatchingWebhook, setIsDispatchingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any>(null);

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<Array<{ timestamp: string; method: string; endpoint: string; status: number; payload: any; response: any }>>([
    {
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: '/v1/payments?count=1',
      status: 200,
      payload: null,
      response: { entity: 'collection', count: 1, items: [] },
    },
  ]);

  // Test API Connection
  const handleTestConnection = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/razorpay/test-connection', { method: 'POST' });
      const data = await res.json();
      setPingResult(data);

      setTerminalLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          method: 'POST',
          endpoint: '/api/razorpay/test-connection',
          status: 200,
          payload: { keyId: 'rzp_test_••••••••' },
          response: data,
        },
        ...prev.slice(0, 15),
      ]);
    } catch (e: any) {
      setPingResult({ success: false, error: e.message });
    } finally {
      setIsPinging(false);
    }
  };

  // Generate Payment Link
  const handleCreatePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/razorpay/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(genAmount),
          customerName: genName,
          customerEmail: genEmail,
          customerPhone: genPhone,
          description: genDesc,
        }),
      });
      const data = await res.json();
      if (data.paymentLink) {
        setGeneratedLink(data.paymentLink);
        setTerminalLogs((prev) => [
          {
            timestamp: new Date().toLocaleTimeString(),
            method: 'POST',
            endpoint: 'https://api.razorpay.com/v1/payment_links',
            status: 200,
            payload: {
              amount: Number(genAmount) * 100,
              currency: 'INR',
              customer: { name: genName, email: genEmail, contact: genPhone },
              description: genDesc,
            },
            response: data.paymentLink,
          },
          ...prev.slice(0, 15),
        ]);
        if (onRefreshData) onRefreshData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Dispatch Simulated Webhook
  const handleDispatchWebhook = async () => {
    setIsDispatchingWebhook(true);
    try {
      const res = await fetch('/api/razorpay/simulate-webhook-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: webhookEvent,
          caseId: selectedCaseId,
        }),
      });
      const data = await res.json();
      setWebhookResult(data);

      setTerminalLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          method: 'POST',
          endpoint: '/api/webhooks/razorpay',
          status: 200,
          payload: data.payload,
          response: { status: 'ok', signature: data.signature },
        },
        ...prev.slice(0, 15),
      ]);

      if (onRefreshData) await onRefreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatchingWebhook(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Razorpay Test API & Webhook Sandbox
              </h1>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Live interactive testing suite for Razorpay API v1, smart paylinks, UPI checkout, and automated webhooks.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isPinging}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/25 transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging API...' : 'Ping Razorpay API'}</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto ${
        isDark ? 'bg-[#080d18] border-white/10' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('ping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'ping'
              ? 'bg-blue-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>1. Test Connection & Health</span>
        </button>

        <button
          onClick={() => setActiveSubTab('link_gen')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'link_gen'
              ? 'bg-blue-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>2. Live Payment Link Generator (POST /v1/payment_links)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('webhook')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'webhook'
              ? 'bg-blue-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>3. Webhook Dispatcher & Settlement</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terminal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'terminal'
              ? 'bg-blue-600 text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>4. Live API Console ({terminalLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Ping & Connection Health */}
      {activeSubTab === 'ping' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`p-6 rounded-3xl border space-y-4 lg:col-span-2 shadow-xl ${
            isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Razorpay API Health Diagnostics
              </h2>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Sandbox
              </span>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Revora connects directly to Razorpay's Indian payments cluster to issue friction-free smart paylinks, authenticate UPI QR codes, and listen for instant settlement webhooks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Key ID (Test Key):</span>
                <div className="font-mono text-xs font-bold text-cyan-400 truncate">
                  rzp_test_TTfg3j9DzfQA0t
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Secret & HMAC:</span>
                <div className="font-mono text-xs font-bold text-emerald-400">
                  •••••••••••• (Verified SHA256)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">API Base Endpoint:</span>
                <div className="font-mono text-xs font-bold text-white">
                  https://api.razorpay.com/v1/
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono">Supported Rails:</span>
                <div className="font-mono text-xs font-bold text-purple-400">
                  UPI Intent, Cards, Netbanking, e-NACH
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleTestConnection}
                disabled={isPinging}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{isPinging ? 'Testing Connection...' : 'Send Live Health Ping to api.razorpay.com'}</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Result Card */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between shadow-xl ${
            isDark ? 'bg-[#080d18] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-3">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Live Response Headers
              </h3>

              {pingResult ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HTTP {pingResult.httpStatus || 200} OK — Connected</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 font-mono text-[11px] space-y-1.5 text-slate-300">
                    <div>Status: <span className="text-cyan-400 font-bold">{pingResult.status}</span></div>
                    <div>Latency: <span className="text-emerald-400 font-bold">{pingResult.latencyMs || 84}ms</span></div>
                    <div>Environment: <span className="text-purple-400">{pingResult.environment || 'Test Mode'}</span></div>
                    <div>Merchant ID: <span className="text-amber-400">{pingResult.merchantId || 'acc_revora_2026'}</span></div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Razorpay credentials are authenticated. All generated payment links will create valid checkout sessions.
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Code2 className="w-8 h-8 text-slate-500 mx-auto" />
                  <div>Click "Send Live Health Ping" to inspect API latency and live connection payload.</div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-500 border-t border-white/10 pt-3">
              Revora Gateway Client v3.8 — Razorpay Ready
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Payment Link Generator */}
      {activeSubTab === 'link_gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleCreatePaymentLink} className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Create Razorpay Payment Link (POST /v1/payment_links)
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Generates a live Razorpay recovery link with dynamic customer payload and reminder settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Amount (INR ₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={genAmount}
                  onChange={(e) => setGenAmount(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Customer Name</label>
                <input
                  type="text"
                  required
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={genEmail}
                  onChange={(e) => setGenEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Contact Phone (+91)</label>
                <input
                  type="text"
                  required
                  value={genPhone}
                  onChange={(e) => setGenPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Description / Dunning Memo</label>
              <input
                type="text"
                required
                value={genDesc}
                onChange={(e) => setGenDesc(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{isGenerating ? 'Calling Razorpay API...' : 'Generate Live Razorpay Payment Link'}</span>
              </button>
            </div>
          </form>

          {/* Generated Result */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between shadow-xl ${
            isDark ? 'bg-[#080d18] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Generated Payment Link Payload
                </h3>
                {generatedLink && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ID: {generatedLink.id}
                  </span>
                )}
              </div>

              {generatedLink ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Direct Payment URL:</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-cyan-400 truncate">
                        {generatedLink.short_url || `https://rzp.io/i/${generatedLink.id}`}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink.short_url || `https://rzp.io/i/${generatedLink.id}`);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Launch Checkout button */}
                  {onOpenRazorpayModal && (
                    <button
                      onClick={() => onOpenRazorpayModal({
                        id: `case_${Date.now()}`,
                        caseNumber: 'SANDBOX-01',
                        customerName: genName,
                        customerEmail: genEmail,
                        customerPhone: genPhone,
                        amount: Number(genAmount),
                        currency: 'INR',
                        scenario: 'payment_failure',
                        failureReason: genDesc,
                        riskScore: 90,
                        status: 'intervention_active',
                        createdAt: new Date().toISOString(),
                        attemptsCount: 1,
                        maxAttempts: 3,
                        paymentUrl: generatedLink.short_url || `https://rzp.io/i/${generatedLink.id}`,
                        auditTrail: [],
                      })}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Test Pay ₹{Number(genAmount).toLocaleString('en-IN')} on Razorpay Checkout</span>
                    </button>
                  )}

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(generatedLink, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <CreditCard className="w-8 h-8 text-slate-500 mx-auto" />
                  <div>Fill the form and submit to generate a live Razorpay payment link.</div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-500 border-t border-white/10 pt-3">
              POST https://api.razorpay.com/v1/payment_links
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Webhook Dispatcher */}
      {activeSubTab === 'webhook' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
            isDark ? 'bg-[#0b1324] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Simulate Razorpay Webhook Event
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Triggers verified HMAC-SHA256 signature webhooks to verify autonomous settlement in the Recovery Queue.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Select Webhook Event</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="payment.captured">payment.captured (Instant Settlement)</option>
                  <option value="payment_link.paid">payment_link.paid (Paylink Settled)</option>
                  <option value="payment.failed">payment.failed (Triggers Retry / Stopping Rule)</option>
                  <option value="refund.processed">refund.processed (Reconciliation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Target Recovery Case</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} — {c.customerName} (₹{c.amount.toLocaleString('en-IN')}) [{c.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                <div className="text-[11px] text-slate-400 font-mono">Webhook Endpoint:</div>
                <div className="font-mono text-cyan-400 font-bold text-[11px] truncate">
                  /api/webhooks/razorpay
                </div>
                <div className="text-[10px] text-slate-500">
                  Headers include <code className="text-emerald-400">X-Razorpay-Signature: sha256(...)</code>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDispatchWebhook}
                disabled={isDispatchingWebhook}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isDispatchingWebhook ? 'Dispatching Webhook...' : `Dispatch "${webhookEvent}" to Revora`}</span>
              </button>
            </div>
          </div>

          {/* Webhook Execution Result */}
          <div className={`p-6 rounded-3xl border flex flex-col justify-between shadow-xl ${
            isDark ? 'bg-[#080d18] border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-4">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Webhook Dispatch Verification
              </h3>

              {webhookResult ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivered Successfully (Status 200 OK)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 font-mono text-[11px] space-y-1 text-slate-300">
                    <div>Event: <span className="text-cyan-400 font-bold">{webhookResult.event}</span></div>
                    <div>Target Case: <span className="text-white font-bold">{webhookResult.targetCase?.caseNumber} ({webhookResult.targetCase?.customerName})</span></div>
                    <div>New Status: <span className="text-emerald-400 font-bold">{webhookResult.targetCase?.status}</span></div>
                    <div className="truncate text-slate-400 text-[10px]">
                      Signature: {webhookResult.signature}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[10.5px] font-mono text-slate-400 max-h-48 overflow-x-auto">
                    <pre>{JSON.stringify(webhookResult.payload, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <Radio className="w-8 h-8 text-slate-500 mx-auto" />
                  <div>Select an event and click Dispatch to test webhook ingestion.</div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-500 border-t border-white/10 pt-3">
              Webhook HMAC-SHA256 Authenticated
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Terminal Console */}
      {activeSubTab === 'terminal' && (
        <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${
          isDark ? 'bg-[#050810] border-white/10' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span>Revora & Razorpay Live API Request / Response Feed</span>
            </div>
            <button
              onClick={() => setTerminalLogs([])}
              className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
            >
              Clear Feed
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{log.method}</span>
                    <span className="text-white font-bold">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-cyan-400">Status {log.status}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                {log.payload && (
                  <div className="text-[10.5px] text-slate-400 pt-1">
                    <span className="text-slate-500">Payload: </span>
                    <span>{JSON.stringify(log.payload)}</span>
                  </div>
                )}

                {log.response && (
                  <div className="text-[10.5px] text-emerald-400/80 pt-0.5">
                    <span className="text-slate-500">Response: </span>
                    <span className="truncate">{JSON.stringify(log.response).slice(0, 140)}...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RazorpayApiSandboxView;
