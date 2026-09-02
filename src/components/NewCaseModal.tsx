import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  CreditCard,
  ShoppingCart,
  Repeat,
  FileText,
  Briefcase,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { ScenarioType } from '../types';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: () => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Rahul Nambiar');
  const [customerEmail, setCustomerEmail] = useState('rahul.n@apexretail.in');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 11980');
  const [companyName, setCompanyName] = useState('Apex Retailers Pvt Ltd');
  const [scenario, setScenario] = useState<ScenarioType>('payment_failure');
  const [amount, setAmount] = useState('24500');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [failureReason, setFailureReason] = useState('UPI switch timeout at issuer gateway during transaction authentication');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          companyName,
          scenario,
          amount: Number(amount),
          paymentMethod,
          bankName,
          failureReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onCaseCreated();
        onClose();
      }
    } catch (err) {
      console.error('Failed to create case:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Ingest At-Risk Revenue Case
              </h2>
              <p className="text-xs text-slate-400">
                Register an interrupted checkout, failed recurring debit, or overdue invoice
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Scenario Picker */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Scenario Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'payment_failure', label: 'Payment Failure' },
                { id: 'checkout_abandonment', label: 'Checkout Drop-off' },
                { id: 'failed_subscription', label: 'Failed Subscription' },
                { id: 'overdue_invoice', label: 'Overdue Invoice' },
                { id: 'receivables', label: 'B2B Receivables' },
              ].map((sc) => (
                <button
                  type="button"
                  key={sc.id}
                  onClick={() => setScenario(sc.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    scenario === sc.id
                      ? 'bg-teal-950/60 border-teal-500 text-teal-300 font-semibold shadow-md shadow-teal-900/30'
                      : 'bg-[#030708] border-white/[0.06] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Company Name (Optional)</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Amount (₹ INR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 font-mono text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Payment Method & Bank</label>
              <div className="flex gap-2">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner cursor-pointer"
                >
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="mandate_nach">Mandate (NACH)</option>
                  <option value="netbanking">NetBanking</option>
                </select>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank name"
                  className="w-1/2 px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Failure Description */}
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Failure Reason / Incompletion Trigger</label>
            <input
              type="text"
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              className="w-full px-3 py-2 bg-[#030708] border border-white/10 rounded-xl text-slate-100 text-xs focus:ring-1 focus:ring-teal-500 shadow-inner"
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#030708]/90 border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Ingest & Initialize Case</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewCaseModal;
