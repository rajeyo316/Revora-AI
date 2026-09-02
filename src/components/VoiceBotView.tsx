"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Bot,
  User,
  PhoneCall,
  Send,
  Volume2,
  VolumeX,
  PhoneOff,
  PhoneForwarded,
  ShieldCheck,
  Zap,
  MessageSquare,
  Sliders,
  Sparkle,
  Briefcase,
  Heart,
  Flame,
  Globe,
  Lock
} from 'lucide-react';
import { RecoveryCase } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SiriWave } from './ui/siri-wave';

interface VoiceBotViewProps {
  cases: RecoveryCase[];
  onOpenP2PModal: (caseData: RecoveryCase) => void;
}

export type AgentPersona = 'formal' | 'empathetic' | 'assertive';
export type VoiceLanguage = 'english' | 'hinglish';

interface DialogueTurn {
  id: string;
  sender: 'agent' | 'customer';
  speakerName: string;
  spokenEnglish: string;
  hinglishText?: string;
  englishTranslation?: string;
  intent?: string;
  timestamp: string;
}

export const VoiceBotView: React.FC<VoiceBotViewProps> = ({ cases, onOpenP2PModal }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const defaultCase: RecoveryCase = {
    id: 'case_nike_1800',
    caseNumber: 'REV-NIKE-1800',
    customerName: 'Raj',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rajeyoh@gmail.com',
    amount: 18499,
    status: 'failed',
    failureReason: 'Abandoned checkout due to competitor pricing comparison',
    createdAt: new Date().toISOString(),
    currency: 'INR',
    attemptsCount: 1,
    maxAttempts: 3,
    riskScore: 35,
    scenario: 'checkout_abandonment',
    auditTrail: [],
  };

  const [activeScenario, setActiveScenario] = useState<'nike' | 'bill_due'>('nike');
  const [selectedPersona, setSelectedPersona] = useState<AgentPersona>('empathetic');
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceLanguage>('english');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || defaultCase.id);
  const currentCase = cases.find((c) => c.id === selectedCaseId) || defaultCase;

  const [callStatus, setCallStatus] = useState<'READY TO DIAL' | 'CALL IN PROGRESS' | 'PAUSED' | 'CALL COMPLETED'>('READY TO DIAL');
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);

  // Persona Details Definition
  const PERSONA_CONFIG: Record<AgentPersona, {
    label: string;
    icon: any;
    badgeColor: string;
    description: string;
    tactics: string[];
  }> = {
    formal: {
      label: 'Formal & Professional',
      icon: Briefcase,
      badgeColor: 'from-blue-600 to-indigo-600',
      description: 'Polite, structured, corporate vocabulary with strict compliance and direct settlement terms.',
      tactics: [
        'Uses respectful honorifics & clear reference numbers',
        'Outlines policy-backed price matching',
        'Directs to verified 256-bit Razorpay links',
      ],
    },
    empathetic: {
      label: 'Empathetic & Warm',
      icon: Heart,
      badgeColor: 'from-pink-600 to-rose-600',
      description: 'Friendly, compassionate, actively validates user hesitation and solves pricing pain points.',
      tactics: [
        'Acknowledges customer perspective warmly',
        'Offers authorized ₹499 waiver seamlessly',
        'Generates instant 1-tap WhatsApp payment link',
      ],
    },
    assertive: {
      label: 'Assertive & Urgent',
      icon: Flame,
      badgeColor: 'from-amber-600 to-orange-600',
      description: 'Direct, confident, creates healthy urgency to secure immediate settlement before cart expiry.',
      tactics: [
        'Highlights stock reservation & expiration timer',
        'Offers immediate ₹18,000 settlement match',
        'Requires immediate confirmation or fixed PTP',
      ],
    },
  };

  // Pre-configured Exact Transcripts for each Persona (Strictly in English)
  const getDialogueForScenario = (scenario: 'nike' | 'bill_due', persona: AgentPersona): DialogueTurn[] => {
    if (scenario === 'nike') {
      if (persona === 'formal') {
        return [
          {
            id: 'f1',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Formal)',
            spokenEnglish: 'Good day Raj. This is Revora AI Recovery Services calling regarding your recent checkout for the Nike Air Step. I noticed the transaction was not completed. May I know if you encountered any difficulty?',
            hinglishText: 'Good day Raj. This is Revora AI Recovery Services calling regarding your recent checkout for the Nike Air Step. I noticed the transaction was not completed. May I know if you encountered any difficulty?',
            englishTranslation: 'Hello Raj, I am calling from Revora AI Services. Payment was incomplete on Nike checkout. Did you face an issue?',
            timestamp: '09:41 AM',
          },
          {
            id: 'f2',
            sender: 'customer',
            speakerName: 'Customer Raj (Male 2)',
            spokenEnglish: 'Actually, I am getting these same shoes elsewhere for eighteen thousand rupees.',
            hinglishText: 'Actually, I am getting these same shoes elsewhere for ₹18,000.',
            englishTranslation: 'Yes, actually I am getting these same shoes elsewhere for ₹18,000.',
            timestamp: '09:41 AM',
          },
          {
            id: 'f3',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Formal)',
            spokenEnglish: 'Understood. The original price is eighteen thousand four hundred ninety-nine. Under our price assurance guarantee, I have authorized a four hundred ninety-nine rupee price adjustment to match eighteen thousand. Shall I dispatch the verified Razorpay link to your WhatsApp?',
            hinglishText: 'Understood. The original price is ₹18,499. Under our price assurance guarantee, I have authorized a ₹499 price adjustment to match ₹18,000. Shall I dispatch the verified Razorpay link to your WhatsApp?',
            englishTranslation: 'Understood. Original price is ₹18,499. Under policy I will approve ₹499 discount to match ₹18,000. Shall I send it on WhatsApp?',
            timestamp: '09:42 AM',
          },
          {
            id: 'f4',
            sender: 'customer',
            speakerName: 'Customer Raj (Male 2)',
            spokenEnglish: 'Yes, please dispatch the link to my WhatsApp.',
            hinglishText: 'Yes, please dispatch the link to my WhatsApp.',
            englishTranslation: 'Yes, please send on WhatsApp.',
            timestamp: '09:42 AM',
          },
          {
            id: 'f5',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Formal)',
            spokenEnglish: 'Certainly Raj. The eighteen thousand rupee verified Razorpay link has been dispatched to your WhatsApp. You may complete the transaction securely. Thank you for your time.',
            hinglishText: 'Certainly Raj. The ₹18,000 verified Razorpay link has been dispatched to your WhatsApp. You may complete the transaction securely. Thank you for your time.',
            englishTranslation: 'Certainly Raj. The ₹18,000 secure link is sent to your WhatsApp. You can complete it there. Thank you.',
            timestamp: '09:43 AM',
          },
        ];
      }

      if (persona === 'assertive') {
        return [
          {
            id: 'a1',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Assertive)',
            spokenEnglish: 'Hello Raj, this is the Revora Recovery Desk regarding your Nike Air Step order of eighteen thousand four hundred ninety-nine. Your cart reservation is about to expire.',
            hinglishText: 'Hello Raj, this is the Revora Recovery Desk regarding your Nike Air Step order of ₹18,499. Your cart reservation is about to expire.',
            englishTranslation: 'Hello Raj, I am calling from Revora. Your cart reservation is about to expire.',
            timestamp: '09:41 AM',
          },
          {
            id: 'a2',
            sender: 'customer',
            speakerName: 'Customer Raj (Male 2)',
            spokenEnglish: 'I found the exact same pair for eighteen thousand on another app.',
            hinglishText: 'I found the exact same pair for ₹18,000 on another app.',
            englishTranslation: 'I found these shoes on another app for ₹18,000.',
            timestamp: '09:41 AM',
          },
          {
            id: 'a3',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Assertive)',
            spokenEnglish: 'We can match eighteen thousand immediately if we confirm the order right now. I will issue a direct Razorpay link to your WhatsApp. Can you complete it within the next fifteen minutes?',
            hinglishText: 'We can match ₹18,000 immediately if we confirm the order right now. I will issue a direct Razorpay link to your WhatsApp. Can you complete it within the next 15 minutes?',
            englishTranslation: 'I can match ₹18,000 now. Sending direct Razorpay link to WhatsApp. Can you complete within 15 minutes?',
            timestamp: '09:42 AM',
          },
          {
            id: 'a4',
            sender: 'customer',
            speakerName: 'Customer Raj (Male 2)',
            spokenEnglish: 'Yes, send the link, I will pay right away.',
            hinglishText: 'Yes, send the link, I will pay right away.',
            englishTranslation: 'Yes send it, I will pay now.',
            timestamp: '09:42 AM',
          },
          {
            id: 'a5',
            sender: 'agent',
            speakerName: 'AI Recovery Agent (Male 1 - Assertive)',
            spokenEnglish: 'The link is active on your WhatsApp. Please complete the settlement to secure your delivery. Thank you.',
            hinglishText: 'The link is active on your WhatsApp. Please complete the settlement to secure your delivery. Thank you.',
            englishTranslation: 'Link is sent on WhatsApp. Complete payment to secure order. Thank you.',
            timestamp: '09:43 AM',
          },
        ];
      }

      // Default: Empathetic
      return [
        {
          id: 'e1',
          sender: 'agent',
          speakerName: 'AI Recovery Agent (Male 1 - Empathetic)',
          spokenEnglish: 'Hi Raj! I am your Revora Recovery Assistant. I noticed you were checking out the Nike Air Step shoes but did not finish the payment. Is everything okay?',
          hinglishText: 'Hi Raj! I am your Revora Recovery Assistant. I noticed you were checking out the Nike Air Step shoes but did not finish the payment. Is everything okay?',
          englishTranslation: 'Hello Raj, I am Revora AI Recovery Assistant. You did not complete payment for Nike Air Step checkout. Did you face an issue?',
          timestamp: '09:41 AM',
        },
        {
          id: 'e2',
          sender: 'customer',
          speakerName: 'Customer Raj (Male 2)',
          spokenEnglish: 'Yeah, actually I am getting these same shoes elsewhere for eighteen thousand rupees.',
          hinglishText: 'Yeah, actually I am getting these same shoes elsewhere for ₹18,000.',
          englishTranslation: 'Yes, actually I am getting these same shoes elsewhere for ₹18,000.',
          timestamp: '09:41 AM',
        },
        {
          id: 'e3',
          sender: 'agent',
          speakerName: 'AI Recovery Agent (Male 1 - Empathetic)',
          spokenEnglish: 'I completely understand! We want to make sure you get the best deal. The original price is eighteen thousand four hundred ninety-nine, but I can apply an instant four hundred ninety-nine discount so you get them for eighteen thousand. Shall I send that link to your WhatsApp?',
          hinglishText: 'I completely understand! We want to make sure you get the best deal. The original price is ₹18,499, but I can apply an instant ₹499 discount so you get them for ₹18,000. Shall I send that link to your WhatsApp?',
          englishTranslation: 'I understand! I will approve a ₹499 discount and generate an ₹18,000 link. Shall I send it on WhatsApp?',
          timestamp: '09:42 AM',
        },
        {
          id: 'e4',
          sender: 'customer',
          speakerName: 'Customer Raj (Male 2)',
          spokenEnglish: 'Yes, send it over.',
          hinglishText: 'Yes, send it over.',
          englishTranslation: 'Yes, send it.',
          timestamp: '09:42 AM',
        },
        {
          id: 'e5',
          sender: 'agent',
          speakerName: 'AI Recovery Agent (Male 1 - Empathetic)',
          spokenEnglish: 'Awesome Raj! I am sending the eighteen thousand rupee secure Razorpay link to your WhatsApp right now. You can complete it whenever you are ready. Thank you!',
          hinglishText: 'Awesome Raj! I am sending the ₹18,000 secure Razorpay link to your WhatsApp right now. You can complete it whenever you are ready. Thank you!',
          englishTranslation: 'Sure Raj. I am sending the ₹18,000 secure link to your WhatsApp right now. You can complete it there. Thank you.',
          timestamp: '09:43 AM',
        },
      ];
    }

    // Bill Due Scenario
    return [
      {
        id: 'b1',
        sender: 'agent',
        speakerName: `AI Recovery Agent (Male 1 - ${PERSONA_CONFIG[persona].label.split(' ')[0]})`,
        spokenEnglish: persona === 'formal'
          ? 'Good day Raj. This is Revora AI calling on behalf of HDFC Bank regarding your credit card statement due for eighteen thousand four hundred fifty rupees.'
          : persona === 'assertive'
          ? 'Hello Raj, calling from Revora AI regarding your overdue credit card statement of eighteen thousand four hundred fifty rupees.'
          : 'Hi Raj, I am calling from Revora AI regarding your pending bill payment of eighteen thousand four hundred fifty rupees—',
        hinglishText: persona === 'formal'
          ? 'Good day Raj. This is Revora AI calling on behalf of HDFC Bank regarding your credit card statement due for ₹18,450.'
          : persona === 'assertive'
          ? 'Hello Raj, calling from Revora AI regarding your overdue credit card statement of ₹18,450.'
          : 'Hello Raj, this is Revora AI Recovery Assistant calling regarding your pending bill payment—',
        englishTranslation: 'Hello Raj, I am Revora AI Recovery Assistant. Your bill is due, so I am calling to assist regarding payment—',
        timestamp: '09:41 AM',
      },
      {
        id: 'b2',
        sender: 'customer',
        speakerName: 'Customer Raj (Male 2)',
        spokenEnglish: '*(Customer hangs up the call mid-sentence)*',
        hinglishText: '*(Customer hangs up the call mid-sentence)*',
        englishTranslation: '*(Customer disconnects call)*',
        timestamp: '09:41 AM',
      },
      {
        id: 'b3',
        sender: 'agent',
        speakerName: 'WhatsApp Autonomous Follow-up',
        spokenEnglish: 'Hi Raj, we tried reaching you regarding your pending statement of eighteen thousand four hundred fifty rupees. If you need assistance or wish to schedule a Promise-to-Pay date, tap any date option below to pause retry calls. — Revora AI Recovery',
        hinglishText: 'Hi Raj, we tried reaching you regarding your pending bill payment, but the call could not be connected. If you need assistance with the payment or would like to schedule it on a convenient date, you can reply right here. — Revora AI Recovery Assistant',
        englishTranslation: 'Hi Raj, we tried contacting you regarding pending bill payment. If you need assistance or wish to pay on a convenient date, reply here.',
        timestamp: '09:42 AM',
      },
    ];
  };

  const [dialogue, setDialogue] = useState<DialogueTurn[]>(() =>
    getDialogueForScenario('nike', 'empathetic')
  );

  // Update dialogue whenever scenario or persona changes
  useEffect(() => {
    setDialogue(getDialogueForScenario(activeScenario, selectedPersona));
    stopSpeech();
    setCallStatus('READY TO DIAL');
  }, [activeScenario, selectedPersona]);

  const isVoiceActiveRef = useRef<boolean>(false);
  const autoPlayTimeoutRef = useRef<any>(null);

  const stopSpeech = () => {
    isVoiceActiveRef.current = false;
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSpeakingIndex(null);
  };

  // Two distinct male voices for synthesis
  const speakTurn = (turn: DialogueTurn, onComplete?: () => void) => {
    if (!isVoiceActiveRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete && isVoiceActiveRef.current) setTimeout(onComplete, 3000);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = selectedLanguage === 'english'
      ? turn.spokenEnglish.replace(/\*.*\*/g, '')
      : (turn.hinglishText || turn.spokenEnglish).replace(/\*.*\*/g, '');

    if (!textToSpeak.trim()) {
      if (onComplete && isVoiceActiveRef.current) onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const maleKeywords = ['male', 'david', 'george', 'daniel', 'guy', 'rishi', 'ravi', 'kiran', 'prabhat', 'james', 'alex', 'fred', 'tom', 'google uk english male', 'microsoft david', 'microsoft mark'];
    const maleVoices = enVoices.filter(v => 
      maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );

    if (turn.sender === 'agent') {
      // Distinct Male Voice 1 (AI Recovery Agent): Crisp, professional, confident tone
      utterance.pitch = selectedPersona === 'assertive' ? 1.08 : selectedPersona === 'formal' ? 1.02 : 1.05;
      utterance.rate = selectedPersona === 'assertive' ? 1.05 : 1.00;
      if (maleVoices.length > 0) {
        utterance.voice = maleVoices[0];
      } else if (enVoices.length > 0) {
        utterance.voice = enVoices[0];
      }
    } else {
      // Distinct Male Voice 2 (Customer Raj): Deep, relaxed, natural conversational male tone
      utterance.pitch = 0.82;
      utterance.rate = 0.94;
      if (maleVoices.length > 1) {
        utterance.voice = maleVoices[1];
      } else if (enVoices.length > 1) {
        utterance.voice = enVoices[1];
      } else if (maleVoices.length > 0) {
        utterance.voice = maleVoices[0];
      }
    }

    utterance.onstart = () => {
      if (!isVoiceActiveRef.current) {
        window.speechSynthesis.cancel();
        return;
      }
      setIsPlaying(true);
      setCallStatus('CALL IN PROGRESS');
    };

    utterance.onend = () => {
      if (onComplete && isVoiceActiveRef.current) {
        onComplete();
      } else {
        setIsPlaying(false);
        setCallStatus('CALL COMPLETED');
        setCurrentSpeakingIndex(null);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCallStatus('READY TO DIAL');
      setCurrentSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play whole conversation sequentially
  const playAllTurns = (startIndex = 0) => {
    isVoiceActiveRef.current = true;
    if (startIndex >= dialogue.length) {
      setIsPlaying(false);
      setCallStatus('CALL COMPLETED');
      setCurrentSpeakingIndex(null);
      return;
    }

    setCurrentSpeakingIndex(startIndex);
    const turn = dialogue[startIndex];
    
    // Skip speech if customer hangs up
    if (turn.spokenEnglish.includes('*') || turn.hinglishText?.includes('*')) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        if (!isVoiceActiveRef.current) return;
        playAllTurns(startIndex + 1);
      }, 1000);
      return;
    }

    speakTurn(turn, () => {
      if (!isVoiceActiveRef.current) return;
      autoPlayTimeoutRef.current = setTimeout(() => {
        if (!isVoiceActiveRef.current) return;
        playAllTurns(startIndex + 1);
      }, 600);
    });
  };

  const handlePause = () => {
    stopSpeech();
    setCallStatus('CALL ENDED / PAUSED');
  };

  const handleResume = () => {
    isVoiceActiveRef.current = true;
    setIsPlaying(true);
    setCallStatus('CALL IN PROGRESS');
    playAllTurns(currentSpeakingIndex || 0);
  };

  const handleSendUtterance = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userTurn: DialogueTurn = {
      id: `${Date.now()}-u`,
      sender: 'customer',
      speakerName: 'Customer Raj (Male 2)',
      spokenEnglish: textToSend,
      hinglishText: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDialogue((prev) => [...prev, userTurn]);
    setInputText('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/hinglish-voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: currentCase.id,
          customerUtterance: textToSend,
          conversationHistory: dialogue,
          persona: selectedPersona,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      const reply = data.voiceResult || data.reply;
      const spokenResponse = reply?.spokenText || reply?.englishTranslation || 'Certainly Raj, I am sending the verified eighteen thousand rupee Razorpay payment link to your WhatsApp right now.';

      const agentTurn: DialogueTurn = {
        id: `${Date.now()}-a`,
        sender: 'agent',
        speakerName: `AI Recovery Agent (Male 1 - ${PERSONA_CONFIG[selectedPersona].label.split(' ')[0]})`,
        spokenEnglish: spokenResponse,
        hinglishText: reply?.hinglishText || reply?.spokenResponseHinglish,
        englishTranslation: reply?.englishTranslation,
        intent: reply?.detectedIntent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDialogue((prev) => [...prev, agentTurn]);
      speakTurn(agentTurn);
    } catch (e) {
      const fallbackEnglish = selectedPersona === 'assertive'
        ? 'Understood Raj. Sending the verified eighteen thousand rupee Razorpay link to your WhatsApp now. Please complete it to lock in your order.'
        : selectedPersona === 'formal'
        ? 'Certainly Raj. I have dispatched the eighteen thousand rupee Razorpay settlement link to your WhatsApp. Thank you.'
        : 'Awesome Raj! Sending the eighteen thousand rupee Razorpay link to your WhatsApp right now. Enjoy your shoes!';

      const agentTurn: DialogueTurn = {
        id: `${Date.now()}-fb`,
        sender: 'agent',
        speakerName: `AI Recovery Agent (Male 1 - ${PERSONA_CONFIG[selectedPersona].label.split(' ')[0]})`,
        spokenEnglish: fallbackEnglish,
        hinglishText: 'Haanji Raj, main turant WhatsApp par secure payment link bhej raha hoon.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDialogue((prev) => [...prev, agentTurn]);
      speakTurn(agentTurn);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    { label: 'Shoes ₹18,000 Elsewhere', text: 'I am getting these same shoes elsewhere for eighteen thousand rupees.' },
    { label: 'Agree to ₹18,000 Match', text: 'Yes, please send the eighteen thousand rupee link to my WhatsApp.' },
    { label: 'Pay on 5th Sep (PTP)', text: 'I will settle this full payment on fifth September once my salary arrives.' },
    { label: 'Send WhatsApp Link', text: 'Please dispatch the official Razorpay payment link to my WhatsApp now.' },
  ];

  return (
    <div className="space-y-5 font-sans pb-10 animate-in fade-in duration-300">
      
      {/* Header with Persona & Language Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-slate-200/50 dark:border-white/5">
        <div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Revora Agent
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time conversational voice recovery engine with dynamic AI persona routing &amp; instant Razorpay dispatch.
          </p>
        </div>

        {/* Controls: Persona Selector + Language Toggle + Scenario Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Persona Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">Persona:</span>
            {(['formal', 'empathetic', 'assertive'] as AgentPersona[]).map((p) => {
              const Icon = PERSONA_CONFIG[p].icon;
              const isActive = selectedPersona === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPersona(p)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={PERSONA_CONFIG[p].description}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="capitalize">{p}</span>
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setSelectedLanguage('english')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLanguage === 'english'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>English (Crisp)</span>
            </button>
            <button
              onClick={() => setSelectedLanguage('hinglish')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedLanguage === 'hinglish'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Hinglish</span>
            </button>
          </div>

          {/* Scenario Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setActiveScenario('nike')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeScenario === 'nike'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Nike ₹18k
            </button>
            <button
              onClick={() => setActiveScenario('bill_due')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeScenario === 'bill_due'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bill Due
            </button>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Main Voice Agent Transcript & Controls (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0b1324] border border-cyan-500/20 shadow-2xl space-y-4 text-white relative overflow-hidden">
          
          {/* Target Profile Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${PERSONA_CONFIG[selectedPersona].badgeColor} flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/25`}>
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white">
                    {activeScenario === 'nike' ? 'Nike Cart Recovery' : 'HDFC Regalia Statement'} → Raj
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    PERSONA: {selectedPersona.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    2 DISTINCT MALE VOICES
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeScenario === 'nike' ? 'REV-NIKE-1800 • ₹18,499 → ₹18,000 • +91 98765 43210' : 'REV-CC-1008 • Overdue ₹18,450 • +91 94123 45678'}
                </div>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold self-start sm:self-auto border ${
                isPlaying
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-white/[0.06] text-slate-300 border-white/10'
              }`}
            >
              {callStatus}
            </span>
          </div>

          {/* Siri-Wave GLSL Shader Voice Waveform */}
          <div className="py-2 px-4 flex items-center justify-between bg-black/60 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                {isPlaying ? 'AI Voice Active (WebGL Waveform)' : 'Voice Synthesizer Ready'}
              </span>
            </div>
            <div className="w-48 h-12 rounded-xl overflow-hidden bg-black/80 border border-cyan-500/20 flex items-center justify-center">
              <SiriWave
                variant={isPlaying ? "wave" : "fluid-dots"}
                size={120}
                className="w-full h-full object-cover scale-125 pointer-events-none"
              />
            </div>
          </div>

          {/* Transcript Section */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 text-xs scrollbar-thin">
            {dialogue.map((turn, idx) => {
              const isTurnSpeaking = currentSpeakingIndex === idx;
              return (
                <div
                  key={turn.id}
                  onClick={() => {
                    setCurrentSpeakingIndex(idx);
                    speakTurn(turn);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    turn.sender === 'agent'
                      ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-50 hover:border-cyan-400'
                      : 'bg-white/[0.04] border-white/10 text-slate-200 ml-4 hover:border-white/30'
                  } ${isTurnSpeaking ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                    <span className={`flex items-center gap-1.5 ${turn.sender === 'agent' ? 'text-cyan-400 font-mono' : 'text-slate-300'}`}>
                      {turn.sender === 'agent' ? (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>{turn.speakerName}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5" />
                          <span>{turn.speakerName}</span>
                        </>
                      )}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">{turn.timestamp}</span>
                  </div>
                  
                  {/* Spoken English Text (Crisp voice synthesis target) */}
                  <div className="text-xs leading-relaxed font-sans font-medium text-white">
                    {turn.spokenEnglish}
                  </div>

                  {/* Optional Hinglish subtitle if in Hinglish mode or available */}
                  {selectedLanguage === 'hinglish' && turn.hinglishText && turn.hinglishText !== turn.spokenEnglish && (
                    <div className="text-[11px] text-cyan-300/80 italic mt-1 pt-1 border-t border-white/[0.06]">
                      🇮🇳 Hinglish: "{turn.hinglishText}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Audio Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.08]">
            <button
              onClick={() => playAllTurns(0)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-98 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Simulate Conversation ({selectedPersona.toUpperCase()})</span>
            </button>

            {isPlaying ? (
              <button
                onClick={handlePause}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={() => onOpenP2PModal(currentCase)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Log Promise-To-Pay (P2P)</span>
            </button>
          </div>

          {/* Interactive Customer Prompts */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Test Customer Reply with {selectedPersona.toUpperCase()} AI:</span>
              <span className="text-[10px] text-cyan-400 font-mono">Real-time Conversational Routing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendUtterance(p.text)}
                  disabled={isGenerating}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] text-left text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <b className="text-cyan-400 block">{p.label}:</b>
                  <span className="truncate block opacity-85">"{p.text}"</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendUtterance(inputText)}
                placeholder={`Type custom customer phrase (AI responds as ${PERSONA_CONFIG[selectedPersona].label})...`}
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
              />
              <button
                onClick={() => handleSendUtterance(inputText)}
                disabled={isGenerating || !inputText.trim()}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Persona Strategy & Guardrails (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0b1324] border border-white/[0.08] space-y-4 text-white">
          
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Persona Strategy: {PERSONA_CONFIG[selectedPersona].label}</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <p className="text-slate-300 leading-relaxed">
              {PERSONA_CONFIG[selectedPersona].description}
            </p>
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Persona Recovery Tactics:</span>
              {PERSONA_CONFIG[selectedPersona].tactics.map((t, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Guardrails */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Customer Name:</span>
              <span className="font-bold text-white">Raj</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Original Cart / Due:</span>
              <span className="font-mono text-slate-200">₹18,499</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Max Policy Discount:</span>
              <span className="font-mono text-emerald-400 font-bold">₹499 (Match ₹18,000)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Gateway:</span>
              <span className="font-mono text-cyan-300 font-bold">Razorpay 3DS2</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Voice Recovery Features</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Two distinct male audio synthesizers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Automatic trigger on checkout abandonment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Direct Razorpay WhatsApp dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Promise-to-Pay (PTP) scheduling</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VoiceBotView;
