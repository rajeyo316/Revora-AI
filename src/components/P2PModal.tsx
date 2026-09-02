import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RecoveryCase } from '../types';

interface P2PModalProps {
  caseData: RecoveryCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveP2P: (caseId: string, promiseDate: string, amount?: number) => Promise<void>;
}

export const P2PModal: React.FC<P2PModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onSaveP2P,
}) => {
  if (!isOpen || !caseData) return null;

  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [promiseDate, setPromiseDate] = useState(tomorrow);
  const [amount, setAmount] = useState(caseData.amount);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveP2P(caseData.id, promiseDate, amount);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0b1324] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 text-white font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold">Log Promise-to-Pay (P2P)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
          <div className="font-bold text-cyan-300">Target: {caseData.customerName} ({caseData.caseNumber})</div>
          <div>Dunning nudges will be <b>automatically paused</b> until the chosen settlement date.</div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Customer Promised Settlement Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={promiseDate}
              onChange={(e) => setPromiseDate(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Promised Amount (INR ₹)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              {isSaving ? 'Saving...' : 'Confirm & Suppress Nudges'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
