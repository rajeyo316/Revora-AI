import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Ban,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { StoppingRulesConfig } from '../types';

interface ComplianceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: StoppingRulesConfig | null;
  onSaveRules: (newRules: StoppingRulesConfig) => Promise<void>;
}

export const ComplianceSettingsModal: React.FC<ComplianceSettingsModalProps> = ({
  isOpen,
  onClose,
  rules,
  onSaveRules,
}) => {
  if (!isOpen) return null;

  const [maxAttemptsPerCase, setMaxAttemptsPerCase] = useState(rules?.maxAttemptsPerCase || 4);
  const [suppressOnDispute, setSuppressOnDispute] = useState(rules?.suppressOnDispute ?? true);
  const [respectPTPGracePeriod, setRespectPTPGracePeriod] = useState(rules?.respectPTPGracePeriod ?? true);
  const [antiHarassmentCallWindow, setAntiHarassmentCallWindow] = useState(rules?.antiHarassmentCallWindow ?? true);
  const [optOutSuppression, setOptOutSuppression] = useState(rules?.optOutSuppression ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveRules({
        maxAttemptsPerCase: Number(maxAttemptsPerCase),
        suppressOnDispute,
        respectPTPGracePeriod,
        antiHarassmentCallWindow,
        optOutSuppression,
        cooldownHoursBetweenAttempts: 24,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Stopping Rules & Compliance Gates
              </h2>
              <p className="text-xs text-slate-400">
                RBI & FinTech dunning guardrails to prevent customer harassment
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Rules List */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Maximum Attempts Per Case (Frequency Cap)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  AI engine automatically halts all recovery attempts once threshold is reached.
                </div>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                value={maxAttemptsPerCase}
                onChange={(e) => setMaxAttemptsPerCase(Number(e.target.value))}
                className="w-16 px-2.5 py-1.5 bg-[#080d14] border border-white/10 rounded-xl text-center text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Dispute & Chargeback Suppression</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Immediately halt all automated communication if an active dispute ticket is detected.
                </div>
              </div>
              <input
                type="checkbox"
                checked={suppressOnDispute}
                onChange={(e) => setSuppressOnDispute(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-slate-900 text-amber-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Promise-to-Pay (PTP) Grace Window</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Silence all intrusive recovery prompts until the committed payment date arrives.
                </div>
              </div>
              <input
                type="checkbox"
                checked={respectPTPGracePeriod}
                onChange={(e) => setRespectPTPGracePeriod(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-slate-900 text-amber-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">RBI Compliant Calling Hours (9 AM - 7 PM IST)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Block automated voice agent calls outside compliant telemarketing windows.
                </div>
              </div>
              <input
                type="checkbox"
                checked={antiHarassmentCallWindow}
                onChange={(e) => setAntiHarassmentCallWindow(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-slate-900 text-amber-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#030708]/90 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Honor WhatsApp / Email Opt-Out</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Permanently suppress messages if customer texts "STOP" or "UNSUBSCRIBE".
                </div>
              </div>
              <input
                type="checkbox"
                checked={optOutSuppression}
                onChange={(e) => setOptOutSuppression(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-slate-900 text-amber-500 cursor-pointer"
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
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Compliance Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ComplianceSettingsModal;
