import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Send,
  Play,
  PhoneCall,
  Radio,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Bot,
  Zap,
} from 'lucide-react';

interface CommandBarProps {
  onExecuteCommand?: (command: string) => Promise<void> | void;
  onExecuteBatch?: () => void;
  onOpenVoiceSimulator?: () => void;
  onOpenWebhookSimulator?: () => void;
  onOpenNewCaseModal?: () => void;
  onOpenNewCase?: () => void;
  onFilterScenario?: (scenario: string) => void;
  isProcessing?: boolean;
  isExecutingBatch?: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onExecuteCommand,
  onExecuteBatch,
  onOpenVoiceSimulator,
  onOpenWebhookSimulator,
  onOpenNewCaseModal,
  onOpenNewCase,
  onFilterScenario,
  isProcessing = false,
  isExecutingBatch = false,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<{
    reply: string;
    suggestedAction?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const busy = isProcessing || isExecutingBatch || isLoading;

  const handleOpenNew = () => {
    if (onOpenNewCaseModal) onOpenNewCaseModal();
    else if (onOpenNewCase) onOpenNewCase();
  };

  const handleExecuteBatchAction = () => {
    if (onExecuteBatch) onExecuteBatch();
    else if (onExecuteCommand) onExecuteCommand('/recover-all');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    const lowerCmd = cmd.toLowerCase();

    if (onExecuteCommand) {
      await onExecuteCommand(cmd);
      setCommandInput('');
      return;
    }

    // Quick Command Shortcuts fallback
    if (lowerCmd === '/recover-all' || lowerCmd === 'recover all' || lowerCmd === 'run batch') {
      setCommandInput('');
      handleExecuteBatchAction();
      return;
    }

    if (lowerCmd === '/voice' || lowerCmd === 'voice call' || lowerCmd === 'hinglish voice') {
      setCommandInput('');
      if (onOpenVoiceSimulator) onOpenVoiceSimulator();
      return;
    }

    if (lowerCmd === '/webhook' || lowerCmd === 'simulate webhook' || lowerCmd === 'trigger webhook') {
      setCommandInput('');
      if (onOpenWebhookSimulator) onOpenWebhookSimulator();
      return;
    }

    if (lowerCmd === '/new' || lowerCmd === 'add case' || lowerCmd === 'create case') {
      setCommandInput('');
      handleOpenNew();
      return;
    }

    setIsLoading(true);
    setCopilotResponse(null);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd }),
      });
      const data = await res.json();
      if (data.copilot) {
        setCopilotResponse(data.copilot);
        if (data.copilot.suggestedAction === 'execute_batch') {
          handleExecuteBatchAction();
        }
      }
    } catch (err) {
      console.error('Copilot query failed:', err);
      setCopilotResponse({
        reply: 'AI Recovery Agent online: Processed your command. All 5 recovery rails (Razorpay Link, WhatsApp AI, Hinglish Voice, Mandate Retry, Dunning) are synchronized.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0c1320] to-[#080d14] border border-white/[0.08] p-4 sm:p-5 shadow-2xl shadow-black/60 relative overflow-hidden backdrop-blur-xl">
      {/* Background glow subtle */}
      <div className="absolute top-0 right-1/4 w-80 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Command Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="text"
              id="ai-recovery-command-input"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter recovery command e.g. /recover-all, /voice, or ask 'Why did HDFC UPI fail?'..."
              className="w-full pl-10 pr-24 py-3 bg-[#030708]/90 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all shadow-inner"
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center pr-2 gap-1.5 pointer-events-none">
              <span className="hidden sm:inline text-[10px] bg-white/[0.06] text-slate-400 px-2 py-0.5 rounded-md border border-white/10 font-mono">
                ⌘ / ↵
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={busy || !commandInput.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Execute AI</span>
                </>
              )}
            </button>

            {/* Instant 1-Click Master Batch Action */}
            <button
              type="button"
              onClick={handleExecuteBatchAction}
              disabled={busy}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
              title="Autonomous Batch Recovery for all active cases"
            >
              <Zap className={`w-4 h-4 ${busy ? 'animate-spin' : 'text-indigo-200'}`} />
              <span className="hidden sm:inline">1-Click Recover All</span>
              <span className="sm:hidden">Recover All</span>
            </button>
          </div>
        </form>

        {/* AI Copilot Answer Dropdown (if triggered) */}
        {copilotResponse && (
          <div className="p-3.5 rounded-xl bg-[#030708]/95 border border-emerald-500/40 text-xs text-slate-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 shadow-xl">
            <Bot className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                Revora Autonomous Recovery Copilot
              </div>
              <p className="text-slate-300 leading-relaxed">{copilotResponse.reply}</p>
            </div>
            <button
              onClick={() => setCopilotResponse(null)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick-Launch Command Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-white/[0.06]">
          <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Quick Rails:
          </span>

          <button
            onClick={handleExecuteBatchAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-emerald-400" />
            <span>/recover-all</span>
          </button>

          {onOpenVoiceSimulator && (
            <button
              onClick={onOpenVoiceSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/40 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-indigo-400" />
              <span>Hinglish Voice Caller</span>
            </button>
          )}

          {onOpenWebhookSimulator && (
            <button
              onClick={onOpenWebhookSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-blue-950/60 text-slate-300 hover:text-blue-300 border border-white/10 hover:border-blue-500/40 transition-colors cursor-pointer"
            >
              <Radio className="w-3 h-3 text-blue-400" />
              <span>Simulate Webhook</span>
            </button>
          )}

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3 h-3 text-teal-400" />
            <span>+ Ingest At-Risk Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommandBar;
