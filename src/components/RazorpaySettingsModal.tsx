import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Radio,
  Save,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { RazorpaySettings } from '../types';

interface RazorpaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RazorpaySettings | null;
  onSaveSettings: (newSettings: RazorpaySettings) => Promise<void>;
}

export const RazorpaySettingsModal: React.FC<RazorpaySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.run.app';
  const defaultWebhookEndpoint = `${currentOrigin}/api/webhooks/razorpay`;

  const [apiKeyId, setApiKeyId] = useState(settings?.apiKeyId || 'rzp_test_TTfg3j9DzfQA0t');
  const [apiKeySecret, setApiKeySecret] = useState(settings?.apiKeySecret || '8BGvLp2hmqT9YYfTvd1cmefr');
  const [webhookSecret, setWebhookSecret] = useState(settings?.webhookSecret || 'whsec_revora_prod_2026');
  const [webhookUrl, setWebhookUrl] = useState(settings?.webhookUrl || defaultWebhookEndpoint);
  const [autoCreatePaymentLinks, setAutoCreatePaymentLinks] = useState(settings?.autoCreatePaymentLinks ?? true);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(settings?.maxDiscountPercent || 15);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveSettings({
        apiKeyId,
        apiKeySecret: apiKeySecret || '••••••••••••••••',
        webhookSecret,
        webhookUrl,
        autoCreatePaymentLinks,
        maxDiscountPercent: Number(maxDiscountPercent),
        currency: 'INR',
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Razorpay API & Webhook Configuration
              </h2>
              <p className="text-xs text-slate-400">
                Connect your Razorpay account to stream live payment failures and trigger autonomous recovery
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Beginner's Interactive Step-by-Step Guide */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 overflow-hidden">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full px-4 py-3 bg-blue-950/40 flex items-center justify-between text-left cursor-pointer hover:bg-blue-950/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-xs text-blue-200">
                  Beginner's Guide: How to get Webhook URL & Secret from Razorpay Dashboard
                </span>
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-[11px] font-medium">
                <span>{showGuide ? 'Hide Guide' : 'Show Guide'}</span>
                {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {showGuide && (
              <div className="p-4 space-y-3.5 text-slate-300 text-xs border-t border-blue-500/20">
                <ol className="space-y-3 list-decimal list-inside text-slate-300 leading-relaxed">
                  <li className="pl-1">
                    <strong className="text-white">Log in to your Razorpay Dashboard:</strong> Go to{' '}
                    <a
                      href="https://dashboard.razorpay.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline inline-flex items-center gap-0.5 hover:text-blue-300"
                    >
                      dashboard.razorpay.com <ExternalLink className="w-3 h-3 inline" />
                    </a>{' '}
                    (You can use <em>Test Mode</em> if you are testing).
                  </li>
                  <li className="pl-1">
                    <strong className="text-white">Navigate to Webhooks:</strong> In the left sidebar, click on{' '}
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-[11px]">Account & Settings</span>{' '}
                    → under <span className="text-slate-200">"Website & App Settings"</span>, select{' '}
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono text-[11px]">Webhooks</span>.
                  </li>
                  <li className="pl-1">
                    <strong className="text-white">Click "+ Add New Webhook":</strong>
                    <div className="mt-2 space-y-2 pl-4 border-l-2 border-blue-500/30">
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] block uppercase">Webhook URL to paste in Razorpay:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-[#030708] px-2.5 py-1 rounded-lg text-emerald-300 font-mono text-[11px] border border-white/10 flex-1 truncate">
                            {webhookUrl}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyWebhookUrl}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
                          >
                            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] block uppercase">Secret:</span>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Create any secret password/passphrase (e.g. <span className="font-mono text-emerald-400">whsec_mysecret123</span>). Type it in Razorpay and paste the exact same text in the <strong>Webhook Secret</strong> field below.
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] block uppercase">Active Events to Checkmark:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {['payment.failed', 'payment_link.paid', 'subscription.halted', 'payment.authorized'].map((ev) => (
                            <span
                              key={ev}
                              className="px-2 py-0.5 rounded-md bg-white/[0.08] text-emerald-300 font-mono text-[10px] border border-white/10"
                            >
                              ✓ {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="pl-1">
                    <strong className="text-white">Save Webhook in Razorpay:</strong> Click <span className="text-white font-semibold">"Save"</span>. Razorpay will now automatically ping this app whenever any payment fails or settles!
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-4 p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              Razorpay API Credentials & Endpoint
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Razorpay Key ID (rzp_live_... or rzp_test_...)
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={apiKeyId}
                    onChange={(e) => setApiKeyId(e.target.value)}
                    placeholder="rzp_test_xxxxxx"
                    className="w-full px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Razorpay Key Secret
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    value={apiKeySecret}
                    onChange={(e) => setApiKeySecret(e.target.value)}
                    placeholder="Enter Key Secret from Razorpay"
                    className="w-full px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Webhook Secret (HMAC-SHA256 Signature Verification)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Must match the Secret entered in Razorpay
                  </span>
                </div>
                <input
                  type="text"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="e.g. whsec_revrecover_prod99"
                  className="w-full mt-1 px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-emerald-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
              </div>

              <div className="col-span-full">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Target Webhook Endpoint URL
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyWebhookUrl}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied to clipboard' : 'Copy Endpoint URL'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Autonomous Dunning Constraints */}
          <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] space-y-3">
            <h3 className="font-bold text-white text-xs">Autonomous Link Incentives & Safeguards</h3>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Auto-Generate Payment Links on Failure</div>
                <div className="text-[11px] text-slate-400">
                  Emit tokenized Razorpay links as soon as a failure is diagnosed.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoCreatePaymentLinks}
                onChange={(e) => setAutoCreatePaymentLinks(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-400">
                  Max Authorized Dynamic Waiver / Discount ({maxDiscountPercent}%)
                </label>
                <span className="font-mono text-emerald-400 text-xs font-bold">{maxDiscountPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={maxDiscountPercent}
                onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#030708]/90 border-t border-white/[0.08] flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default RazorpaySettingsModal;
