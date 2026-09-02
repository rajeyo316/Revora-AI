import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  Sparkles,
  AlertTriangle,
  CreditCard,
  Repeat,
  CheckCircle2,
  Loader2,
  Terminal,
} from 'lucide-react';

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWebhookTriggered: () => void;
}

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
  onWebhookTriggered,
}) => {
  if (!isOpen) return null;

  const [selectedEventType, setSelectedEventType] = useState<'payment.failed' | 'payment_link.paid' | 'subscription.halted'>('payment.failed');
  const [amount, setAmount] = useState('18500');
  const [customerName, setCustomerName] = useState('Aman Saxena');
  const [customerEmail, setCustomerEmail] = useState('aman.saxena@zenith.in');
  const [failureReason, setFailureReason] = useState('UPI switch timeout at HDFC gateway (Bank Error 504)');
  const [isFiring, setIsFiring] = useState(false);
  const [webhookLog, setWebhookLog] = useState<{ status: string; event: string; caseAffected?: string } | null>(null);

  const handleFireWebhook = async () => {
    setIsFiring(true);
    setWebhookLog(null);

    const payload = {
      event: selectedEventType,
      payload: {
        payment: {
          entity: {
            id: `pay_${Math.random().toString(36).substr(2, 9)}`,
            amount: Number(amount) * 100, // paisa
            currency: 'INR',
            status: selectedEventType === 'payment.failed' ? 'failed' : 'captured',
            method: 'upi',
            bank: 'HDFC Bank',
            email: customerEmail,
            contact: '+91 98920 11990',
            error_code: 'BAD_REQUEST_GATEWAY_TIMEOUT',
            error_description: failureReason,
            notes: {
              customer_name: customerName,
              company_name: 'Zenith Tech Systems',
            },
          },
        },
      },
    };

    try {
      const res = await fetch('/api/webhooks/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'rzp_sig_simulation_valid_hex',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === 'ok') {
        setWebhookLog({
          status: '200 OK - Processed',
          event: selectedEventType,
          caseAffected: data.caseId,
        });
        onWebhookTriggered();
      }
    } catch (err) {
      console.error('Webhook simulation failed:', err);
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Razorpay Webhook Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Emulate live production webhook events to test real-time AI ingestion
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
          {/* Event Type Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Webhook Event Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'payment.failed', label: 'payment.failed', desc: 'Triggers AI diagnostic & dunning' },
                { id: 'payment_link.paid', label: 'payment_link.paid', desc: 'Reconciles & marks recovered' },
                { id: 'subscription.halted', label: 'subscription.halted', desc: 'Initiates mandate retry' },
              ].map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEventType(ev.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedEventType === ev.id
                      ? 'bg-blue-950/60 border-blue-500/50 text-blue-200 shadow-md shadow-blue-900/30'
                      : 'bg-[#030708] border-white/[0.06] text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="font-mono font-bold text-xs text-white">{ev.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{ev.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payload Details */}
          <div className="space-y-4 p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400">Transaction Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
              </div>

              <div className="col-span-full">
                <label className="text-[10px] font-mono text-slate-400">Decline / Failure Reason</label>
                <input
                  type="text"
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#080d14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Webhook Response Log (if fired) */}
          {webhookLog && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Webhook Ingested & AI Handled: {webhookLog.status}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Event <strong className="font-mono text-emerald-300">{webhookLog.event}</strong> was verified and routed to the bounded recovery controller.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#030708]/90 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            POST /api/webhooks/razorpay
          </span>
          <button
            onClick={handleFireWebhook}
            disabled={isFiring}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isFiring ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching Webhook...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Fire Webhook Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default WebhookSimulatorModal;
