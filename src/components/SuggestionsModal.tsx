import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MessageSquare,
  Zap,
  Mic,
  Activity,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Layers,
  ArrowRight,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const suggestions = [
    {
      id: 'whatsapp_ai',
      title: 'WhatsApp Interactive UPI Intent Links',
      subtitle: '90-Second Instant Drop-off Saver',
      badge: 'High Impact • 34% Higher Conversion',
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      tag: 'Omnichannel Dunning',
      description:
        'Trigger automatic WhatsApp Business messages with 1-click Razorpay UPI intent buttons (GPay, PhonePe, Paytm) within 90 seconds of checkout drop-off.',
      benefits: [
        'Bypasses low email open rates (98% WhatsApp open rate)',
        '1-tap deep-link directly into GPay/PhonePe without entering UPI ID',
        'Built-in conversational bot answering customer pricing & refund FAQs',
      ],
      previewSnippet: `[WHATSAPP_DISPATCH] Sent to +91 9876543210:
"Hi Rajeyo! We noticed your cart of ₹4,999 at Nike India wasn't completed. Click below to pay via GPay/PhonePe with 1-tap: [Pay ₹4,999 Now]"`,
    },
    {
      id: 'dynamic_discount',
      title: 'Dynamic Behavioral Discounting Engine',
      subtitle: 'AI-Authorized 2%–5% Instant Settlement Waivers',
      badge: 'Revenue Velocity • 41% Faster Recovery',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      tag: 'Dynamic Pricing',
      description:
        'Allow the autonomous AI to dynamically offer a time-sensitive waiver (e.g. 5% off if settled within 15 minutes) for high-risk hesitant buyers.',
      benefits: [
        'Calculates price elasticity using customer lifetime value (LTV)',
        'Automatic countdown timer on Razorpay Smart Link',
        'Strict RBI & Finance CFO margin cap enforcement',
      ],
      previewSnippet: `[AI_OFFER_CALC] Dynamic Incentive:
"Limited Window: Settle within 15:00 mins to unlock an instant 5% recovery waiver (₹250 off). Amount Payable: ₹4,749"`,
    },
    {
      id: 'multilingual_voice',
      title: 'Multilingual Indic Voice Agent (6 Languages)',
      subtitle: 'Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali',
      badge: 'Hyper-Local • 89% Customer Engagement',
      icon: <Mic className="w-5 h-5 text-indigo-400" />,
      tag: 'Voice AI',
      description:
        'Expand Priya Voice Bot to automatically detect customer geographical region and converse in regional vernacular dialects with hyper-realistic intonation.',
      benefits: [
        'Automatic language switching based on customer response',
        'Native dialect empathy reduces adversarial friction',
        'Real-time P2P commitment date parsing across all 6 languages',
      ],
      previewSnippet: `[VOICE_SYNTH_TELUGU] Priya Agent Output:
"Namaskaram Ananya garu! Revora AI nundi Priya matladuthunnanu. Mee ₹12,500 payment fail ayindi. WhatsApp lo payment link pampinchala?"`,
    },
    {
      id: 'npci_telemetry',
      title: 'NPCI & Bank Gateway Downtime Telemetry',
      subtitle: 'Smart Nudge Pauser during Banking Outages',
      badge: 'Zero False Failures • Saves Merchant Brand',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
      tag: 'Infrastructure Telemetry',
      description:
        'Monitor live HDFC, ICICI, SBI UPI & Netbanking gateway success rates. Automatically pause customer dunning reminders during national bank downtime.',
      benefits: [
        'Prevents annoying customers when failure was caused by bank servers',
        'Automatically resumes recovery sequence once bank uptime restores to 99.2%',
        'Saves payment attempt quotas under compliance rules',
      ],
      previewSnippet: `[NPCI_TELEMETRY_ALERT] Switch Congestion:
"HDFC Bank UPI Switch error rate is 28.4%. Pausing 8 pending reminders for HDFC users. Retrying at 14:30 IST."`,
    },
    {
      id: 'salary_cycle_nach',
      title: 'Salary-Cycle Synchronized NACH / e-Mandates',
      subtitle: 'Auto-Debit Orchestrator for 1st–5th of Month',
      badge: 'B2C Subscriptions • 62% Higher Debit Hit Rate',
      icon: <CreditCard className="w-5 h-5 text-rose-400" />,
      tag: 'Mandate Recovery',
      description:
        'Instead of blindly retrying failed e-mandates daily, schedule recurring subscription retries on customer salary credit dates (1st, 2nd, 5th, 7th).',
      benefits: [
        'Eliminates bounced debit penalty charges for customers',
        'Increases subscription retention and MRR durability',
        'Pre-debit WhatsApp alerts 24 hours prior to mandate execution',
      ],
      previewSnippet: `[MANDATE_CALENDAR] Auto-Debit Schedule:
"User Aarav Sharma (SBI) marked for automated NACH debit retry on 1st of next month at 06:00 AM."`,
    },
    {
      id: 'self_serve_portal',
      title: 'Buyer Self-Serve Recovery & EMI Portal',
      subtitle: 'Custom White-Labeled Settlement Page',
      badge: 'Zero Agent Overhead • 24/7 Self-Service',
      icon: <ExternalLink className="w-5 h-5 text-teal-400" />,
      tag: 'Customer Experience',
      description:
        'A slick, mobile-first portal where buyers can select alternative payment methods, convert overdue invoices into 3 no-cost EMIs, or request callback.',
      benefits: [
        'Branded with your merchant logo and Razorpay secure checkout',
        'Instant Razorpay No-Cost EMI & Cardless PayLater activation',
        'Dispute dispute resolution form with automated ticket creation',
      ],
      previewSnippet: `[SELF_SERVE_PORTAL] Customer Direct Link:
"https://pay.yourbrand.com/recover/REV-1002?auth=tok_982a1f"`,
    },
  ];

  const handleSimulate = (title: string) => {
    setSimulatedAction(title);
    setTimeout(() => setSimulatedAction(null), 3000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark
            ? 'bg-[#070c18] border-white/10 text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#050812] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Suggested Features & Enterprise Fintech Roadmap
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  Razorpay Scale
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                High-impact capabilities to make Revora AI the #1 autonomous revenue recovery platform in India.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left List + Right Interactive Feature Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Feature Navigator */}
          <div
            className={`md:col-span-5 p-4 border-r overflow-y-auto space-y-2.5 ${
              isDark ? 'border-white/10 bg-[#040711]' : 'border-slate-200 bg-slate-50/50'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 tracking-wider">
              Recommended Innovations
            </div>

            {suggestions.map((item, idx) => {
              const isSelected = activeFeature === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveFeature(idx)}
                  className={`w-full p-3 rounded-2xl text-left transition-all border flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-r from-indigo-950/60 to-cyan-950/30 border-cyan-500/50 text-white shadow-md'
                        : 'bg-white border-blue-500 shadow-md text-slate-900 ring-1 ring-blue-500/20'
                      : isDark
                      ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-300'
                      : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">{item.title}</span>
                    </div>
                    <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                      {item.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Feature Deep Dive & Interactive Preview */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
            {(() => {
              const feat = suggestions[activeFeature];
              return (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {feat.icon}
                      </span>
                      <h3 className="text-base font-extrabold tracking-tight">{feat.title}</h3>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                      {feat.description}
                    </p>
                  </div>

                  {/* High Impact Pill */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{feat.badge}</span>
                  </div>

                  {/* Core Value & Architecture */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                      Why Razorpay & D2C Brands Need This:
                    </div>
                    <div className="space-y-1.5">
                      {feat.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Simulation Code / Output Box */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono flex items-center justify-between">
                      <span>Simulated Live Telemetry Payload:</span>
                    </div>
                    <pre
                      className={`p-3.5 rounded-xl border font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed ${
                        isDark ? 'bg-black/60 border-white/10 text-cyan-300' : 'bg-slate-900 border-slate-800 text-cyan-200'
                      }`}
                    >
                      {feat.previewSnippet}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleSimulate(feat.title)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isDark
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      }`}
                    >
                      {simulatedAction ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Triggered in Pipeline</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Test Feature in Simulation</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onClose}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                        isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Close Roadmap
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
