import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  Bot,
  User,
} from 'lucide-react';
import { RecoveryCase } from '../types';
import { SiriWave } from './ui/siri-wave';

interface HinglishVoiceModalProps {
  caseData: RecoveryCase | null;
  isOpen: boolean;
  onClose: () => void;
  onPTPCommitted: (caseId: string, ptpDate: string, amount: number) => void;
}

interface MessageTurn {
  sender: 'priya' | 'customer';
  hinglishText: string;
  englishTranslation?: string;
  intent?: string;
  timestamp: string;
}

export const HinglishVoiceModal: React.FC<HinglishVoiceModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onPTPCommitted,
}) => {
  if (!isOpen || !caseData) return null;

  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [customUtterance, setCustomUtterance] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<MessageTurn[]>([
    {
      sender: 'priya',
      hinglishText: `Hello ${caseData.customerName}! This is Priya from the Revora AI recovery desk. Your payment of ₹${caseData.amount.toLocaleString('en-IN')} could not be processed. May I help you complete it?`,
      englishTranslation: `Hello ${caseData.customerName}! This is Priya from the Revora AI recovery desk. Your payment of ₹${caseData.amount.toLocaleString('en-IN')} could not be processed. May I help you complete it?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [lockedPTP, setLockedPTP] = useState<{ date: string; amount: number; discount: number } | null>(null);

  const timerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call timer
  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callActive]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendCustomerUtterance = async (text: string) => {
    if (!text.trim() || !callActive || isGenerating) return;

    const userTurn: MessageTurn = {
      sender: 'customer',
      hinglishText: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newHistory = [...messages, userTurn];
    setMessages(newHistory);
    setCustomUtterance('');
    setIsGenerating(true);
    setIsSpeaking(true);

    try {
      const res = await fetch('/api/ai/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseData.id,
          customerUtterance: text,
          conversationHistory: newHistory,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const agentTurn: MessageTurn = {
          sender: 'priya',
          hinglishText: data.reply.hinglishText,
          englishTranslation: data.reply.englishTranslation,
          intent: data.reply.detectedIntent,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, agentTurn]);

        // If PTP extracted
        if (data.reply.extractedPTP) {
          const ptp = data.reply.extractedPTP;
          setLockedPTP({
            date: ptp.commitmentDate,
            amount: ptp.committedAmount || caseData.amount,
            discount: data.reply.authorizedDiscountPercent || 0,
          });
          onPTPCommitted(caseData.id, ptp.commitmentDate, ptp.committedAmount || caseData.amount);
        }
      }
    } catch (err) {
      console.error('Voice turn generation failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'priya',
          hinglishText: 'Yes, I am sending you a direct payment link on WhatsApp so you can conveniently complete it.',
          englishTranslation: 'Yes, I am sending you a direct payment link on WhatsApp so you can conveniently complete it.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  // Quick Customer Responses for testing
  const quickResponses = [
    { label: 'UPI failed on phone', text: 'My Google Pay timed out during UPI PIN verification.' },
    { label: 'Salary on 5th (PTP)', text: 'I am low on funds right now, I will definitely pay on the 5th.' },
    { label: 'Give 10% discount', text: 'Can I get a discount or fee waiver on this transaction?' },
    { label: 'Send link on WhatsApp', text: 'Please send me the payment link on WhatsApp, I will complete it tonight.' },
    { label: 'Dispute / Cancel', text: 'I would like to dispute or cancel this billing request.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030708]/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#080d14] border border-white/[0.08] w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                <Bot className="w-5 h-5" />
              </div>
              {callActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Priya — Autonomous Voice Recovery Agent
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Voice Rail
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calling {caseData.customerName} ({caseData.customerPhone}) • ₹{caseData.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="font-mono text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
              {formatTimer(callDuration)}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Banner with SiriWave */}
        <div className="px-6 py-3 bg-[#030708]/90 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-28 h-10 rounded-xl overflow-hidden bg-black/80 border border-purple-500/30 flex items-center justify-center shrink-0">
              <SiriWave
                variant={isSpeaking ? "wave" : "fluid-dots"}
                size={80}
                className="w-full h-full object-cover scale-125 pointer-events-none"
              />
            </div>
            <span className="text-xs text-slate-300 font-medium truncate">
              {isSpeaking ? 'Priya is speaking (Empathetic AI Desk)...' : 'Listening for customer response...'}
            </span>
          </div>

          {lockedPTP && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-in fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PTP Locked: {lockedPTP.date}</span>
            </div>
          )}
        </div>

        {/* Conversation Dialog Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'priya' ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="font-semibold text-slate-400 text-[11px]">
                  {m.sender === 'priya' ? 'Priya (AI Desk)' : caseData.customerName}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{m.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-lg space-y-1.5 shadow-xl ${
                  m.sender === 'priya'
                    ? 'bg-[#030708] border border-purple-500/30 text-purple-100 rounded-tl-sm'
                    : 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-100 rounded-tr-sm'
                }`}
              >
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{m.hinglishText}</p>
                {m.englishTranslation && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-white/[0.08]">
                    {m.englishTranslation}
                  </p>
                )}
                {m.intent && (
                  <div className="flex items-center gap-1 pt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-purple-300">
                      Intent: {m.intent}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-3 rounded-2xl bg-[#030708] border border-purple-500/30 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Priya is formulating Hinglish response...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Customer Test Prompts */}
        <div className="px-6 py-2.5 bg-[#030708]/60 border-t border-white/[0.08]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] text-slate-400 font-mono shrink-0 mr-1">Simulate:</span>
            {quickResponses.map((qr, i) => (
              <button
                key={i}
                onClick={() => handleSendCustomerUtterance(qr.text)}
                disabled={isGenerating || !callActive}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer"
              >
                {qr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Call Controls */}
        <div className="p-4 bg-[#030708]/90 border-t border-white/[0.08] flex items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCustomerUtterance(customUtterance);
            }}
            className="flex-1 flex gap-2"
          >
            <input
              type="text"
              value={customUtterance}
              onChange={(e) => setCustomUtterance(e.target.value)}
              placeholder="Type customer reply in Hinglish or English..."
              disabled={!callActive || isGenerating}
              className="flex-1 px-4 py-2.5 bg-[#080d14] border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!customUtterance.trim() || !callActive || isGenerating}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

          {/* End / Redial Call button */}
          <button
            onClick={() => setCallActive(!callActive)}
            className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
              callActive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/30'
            }`}
            title={callActive ? 'End Voice Call' : 'Redial Voice Call'}
          >
            {callActive ? <PhoneOff className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default HinglishVoiceModal;
