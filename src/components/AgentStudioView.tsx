"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShoppingBag,
  CreditCard,
  Mail,
  ShieldCheck,
  Calendar,
  DollarSign,
  Inbox,
  Copy,
  Check,
  Terminal as TerminalIcon,
  Trash2,
  UserCheck,
  FileText,
  Download,
  Share2,
  QrCode,
  X,
  MessageSquare,
  Send,
  MoreVertical,
  CheckCheck,
  Heart,
  HelpCircle,
  Lock,
  ArrowUpRight,
  Smartphone,
  Video,
  Smile,
  Paperclip,
  Camera,
  Building2,
  BadgeAlert,
  ArrowDownLeft,
  Flame,
  CalendarClock,
  Bell,
  Info,
  Wallet,
  LayoutGrid
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SiriWave } from './ui/siri-wave';
import RazorpayCheckoutModal from './RazorpayCheckoutModal';
import { RecoveryCase } from '../types';

export interface AgentStudioViewProps {
  onNavigateTab?: (tab: string) => void;
  onShowBanner?: (text: string, type?: 'success' | 'info' | 'warning') => void;
  onRefreshData?: () => void;
}

export type ScenarioType = 'nike_cart_recovery' | 'bill_due_disconnect';

interface DialogueLine {
  speaker: 'agent' | 'customer';
  name: string;
  gender: 'male';
  text: string;
  englishText: string;
  audioDurationMs: number;
  discountPrice?: number;
  isDisconnectTrigger?: boolean;
}

interface ScenarioConfig {
  id: ScenarioType;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  merchantName: string;
  productName: string;
  productSubtitle: string;
  productImg?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  agentName: string;
  currencySymbol: string;
  amount: number;
  finalAmount: number;
  caseNumber: string;
  paymentShortLink: string;
  failureReason: string;
  policyWaiverMax: number;
  dialogue: DialogueLine[];
}

const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  nike_cart_recovery: {
    id: 'nike_cart_recovery',
    title: 'Nike Air Step — Cart Recovery (₹18,499 → ₹18,000)',
    subtitle: 'Nike Official Store • Abandoned Checkout at ₹18,499',
    badge: 'D2C Cart Recovery',
    category: 'Cart Recovery',
    merchantName: 'Nike Official Store',
    productName: 'Nike Air Step',
    productSubtitle: 'Unisex • Size 9.5 • Electric Volt',
    productImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    customerName: 'Raj',
    customerPhone: '+91 98765 43210',
    customerEmail: 'rajeyoh@gmail.com',
    agentName: 'Revora Agent',
    currencySymbol: '₹',
    amount: 18499,
    finalAmount: 18000,
    caseNumber: 'REV-NIKE-1800',
    paymentShortLink: 'rzp.io/i/rev-nike-1800',
    failureReason: 'Customer abandoned checkout due to external competitor pricing',
    policyWaiverMax: 499,
    dialogue: [
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Hello Raj, this is Revora Agent calling. You did not complete payment for your Nike Air Step checkout. Did you face any issue?',
        englishText: 'Hello Raj, this is Revora Agent. You did not complete payment for your Nike Air Step checkout. Did you face an issue?',
        audioDurationMs: 4400,
      },
      {
        speaker: 'customer',
        name: 'Customer (Raj)',
        gender: 'male',
        text: 'Yeah, actually I am getting these same shoes elsewhere for ₹18,000.',
        englishText: 'Yeah, actually I am getting these same shoes elsewhere for eighteen thousand rupees.',
        audioDurationMs: 3500,
      },
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Understood. You are getting them for ₹18,000?',
        englishText: 'Understood. You are getting them for eighteen thousand?',
        audioDurationMs: 2500,
      },
      {
        speaker: 'customer',
        name: 'Customer (Raj)',
        gender: 'male',
        text: 'Yes, for ₹18,000.',
        englishText: 'Yes, for eighteen thousand.',
        audioDurationMs: 1800,
      },
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Alright. The original price is ₹18,499. I can approve a ₹499 waiver and generate a direct ₹18,000 payment link for you. Shall I send it to you on WhatsApp?',
        englishText: 'Alright. The original price is eighteen thousand four hundred ninety-nine. I will approve a four hundred ninety-nine discount and generate an eighteen thousand rupee link. Shall I send it on WhatsApp?',
        audioDurationMs: 4800,
        discountPrice: 18000,
      },
      {
        speaker: 'customer',
        name: 'Customer (Raj)',
        gender: 'male',
        text: 'Yes, please send it.',
        englishText: 'Yes, send it.',
        audioDurationMs: 1600,
      },
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Sure Raj. I am sending the ₹18,000 secure payment link to your WhatsApp right now. You can complete it there. Thank you.',
        englishText: 'Sure Raj. I am sending the eighteen thousand rupee secure link to your WhatsApp right now. You can complete it there. Thank you.',
        audioDurationMs: 4200,
      }
    ]
  },

  bill_due_disconnect: {
    id: 'bill_due_disconnect',
    title: 'HDFC Regalia Card — Bill Due Flow',
    subtitle: 'HDFC Bank NetBanking • Overdue ₹18,450 (14 Days Due)',
    badge: 'Banking Bill Due',
    category: 'Bill Due Recovery',
    merchantName: 'HDFC Bank Cards',
    productName: 'Regalia Credit Card Statement',
    productSubtitle: 'Card Ending in •••• 9012 • Overdue by 14 Days',
    customerName: 'Raj',
    customerPhone: '+91 94123 45678',
    customerEmail: 'rajeyoh@gmail.com',
    agentName: 'Revora Agent',
    currencySymbol: '₹',
    amount: 18450,
    finalAmount: 18450,
    caseNumber: 'REV-CC-1008',
    paymentShortLink: 'rzp.io/i/rev-hdfc-18450',
    failureReason: 'Customer follow-up post statement due date',
    policyWaiverMax: 500,
    dialogue: [
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Hello Raj, this is Revora Agent calling regarding your pending bill payment for HDFC Regalia card. Would you like to schedule your payment?',
        englishText: 'Hello Raj, this is Revora Agent calling regarding your pending bill payment for HDFC Regalia card. Would you like to schedule your payment?',
        audioDurationMs: 4000,
      },
      {
        speaker: 'customer',
        name: 'Customer (Raj)',
        gender: 'male',
        text: 'Please send the link on WhatsApp, I will select a date.',
        englishText: 'Please send the link on WhatsApp, I will select a date.',
        audioDurationMs: 2500,
      },
      {
        speaker: 'agent',
        name: 'Revora Agent',
        gender: 'male',
        text: 'Certainly Raj. I have dispatched the payment reminder to your WhatsApp.',
        englishText: 'Certainly Raj. I have dispatched the payment reminder to your WhatsApp.',
        audioDurationMs: 3000,
      }
    ]
  }
};

type PhoneScene =
  | 'store_or_bank'
  | 'checkout'
  | 'call_incoming'
  | 'call_active'
  | 'whatsapp_chat'
  | 'official_razorpay_web'
  | 'gpay'
  | 'success';

interface WhatsAppMessage {
  id: string;
  sender: 'ai' | 'customer';
  text: string;
  time: string;
  isLinkCard?: boolean;
  isDateSelector?: boolean;
}

export const AgentStudioView: React.FC<AgentStudioViewProps> = ({
  onNavigateTab,
  onShowBanner,
  onRefreshData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Selected scenario: 2 scenarios only (Nike Recovery & Bill Due Disconnect)
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioType>('nike_cart_recovery');
  const currentScenario = SCENARIOS[selectedScenarioId];

  // Active scene on the mobile simulator
  const [currentScene, setCurrentScene] = useState<PhoneScene>('store_or_bank');

  // Interactive Product Attributes (for Nike)
  const [selectedSize, setSelectedSize] = useState('9.5');
  const [isFavorited, setIsFavorited] = useState(true);

  // In-Call & Dialogue state
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCustomerSpeaking, setIsCustomerSpeaking] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCallDisconnectedMidway, setIsCallDisconnectedMidway] = useState(false);

  // Simulated WhatsApp notification popup overlay with hover effect & delay
  const [showTopNotif, setShowTopNotif] = useState(false);
  const [isNotifHovered, setIsNotifHovered] = useState(false);
  const [topNotifText, setTopNotifText] = useState("Just a little reminder...");

  // WhatsApp Messages state
  const [waMessages, setWaMessages] = useState<WhatsAppMessage[]>([]);
  const [selectedPtpDate, setSelectedPtpDate] = useState<string | null>(null);

  // Google Pay PIN state (6-digit PIN as per reference image)
  const [pin, setPin] = useState('');
  const PIN_LENGTH = 6;

  // In-Phone Razorpay Checkout state
  const [isRazorpaySheetOpen, setIsRazorpaySheetOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(892);

  // Real Razorpay Merchant Checkout Modal state (optional fallback)
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [checkoutCaseData, setCheckoutCaseData] = useState<RecoveryCase | null>(null);

  // Price & Settlement adjustments (in INR ₹)
  const [appliedPrice, setAppliedPrice] = useState<number>(currentScenario.amount);
  const [copiedLog, setCopiedLog] = useState(false);

  // Live Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<
    Array<{ id: string; time: string; tag: string; tagType: 'ok' | 'info' | 'warn' | 'err'; msg: string }>
  >([]);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoPlayTimeoutRef = useRef<any>(null);
  const isCallActiveRef = useRef<boolean>(false);
  const terminalLogsContainerRef = useRef<HTMLDivElement | null>(null);

  // Determine status bar text color based on scene background
  const isDarkScreenScene = currentScene === 'call_incoming' || currentScene === 'call_active' || currentScene === 'whatsapp_chat' || (currentScene === 'store_or_bank' && selectedScenarioId === 'bill_due_disconnect');

  // Helper to append terminal logs
  const logTerminal = (tag: string, tagType: 'ok' | 'info' | 'warn' | 'err', msg: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setTerminalLogs((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, time, tag, tagType, msg }
    ]);
  };

  // Sync Recovery Outcome to Backend Store and Recovery Queue
  const syncRecoveryToBackend = async (method: string = 'upi_gpay') => {
    try {
      const discount = currentScenario.amount - appliedPrice;
      const resolutionNotes = `Autonomous Hinglish Voice Call + ₹${discount} waiver approved -> WhatsApp Payment Link dispatched -> Captured & Verified via ${method === 'upi_gpay' ? 'Google Pay (Txn #pay_QK92mR7fLscart)' : 'Razorpay Gateway'}`;
      
      await fetch('/api/voice-recovery/complete-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseNumber: currentScenario.caseNumber,
          customerName: currentScenario.customerName,
          customerPhone: currentScenario.customerPhone,
          customerEmail: currentScenario.customerEmail,
          amount: appliedPrice,
          originalAmount: currentScenario.amount,
          discountApplied: discount,
          scenario: currentScenario.category === 'Cart Recovery' ? 'checkout_abandonment' : 'overdue_invoice',
          scenarioLabel: currentScenario.badge,
          paymentShortLink: currentScenario.paymentShortLink,
          resolutionNotes,
        }),
      });
      logTerminal('SYNC_QUEUE', 'ok', `Case <b>${currentScenario.caseNumber}</b> synced to Recovery Queue (Status: 100% RECOVERED, Resolution: ₹${appliedPrice.toLocaleString('en-IN')} collected).`);
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to sync recovery to queue:', err);
    }
  };

  // Sync Promise-to-Pay Date to Backend Store, P2P Ledger, and Recovery Queue
  const syncPtpToBackend = async (dateLabel: string) => {
    try {
      const detectionReason = `Customer disconnected call mid-conversation post statement due date; autonomous WhatsApp follow-up engaged customer -> Selected PTP Date: ${dateLabel} (Salary cycle scheduled for 5th of next month)`;
      
      await fetch('/api/voice-recovery/complete-ptp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseNumber: currentScenario.caseNumber,
          customerName: currentScenario.customerName,
          customerPhone: currentScenario.customerPhone,
          customerEmail: currentScenario.customerEmail,
          amount: currentScenario.amount,
          promiseDate: dateLabel,
          selectedLabel: dateLabel,
          scenario: 'overdue_invoice',
          scenarioLabel: currentScenario.badge,
          paymentShortLink: currentScenario.paymentShortLink,
          detectionReason,
        }),
      });
      logTerminal('SYNC_P2P', 'ok', `Case <b>${currentScenario.caseNumber}</b> synced to P2P Ledger & Recovery Queue (Date: <b>${dateLabel}</b>, Dunning: <b>PAUSED</b>).`);
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to sync PTP to backend:', err);
    }
  };

  // Direct Pay completion inside Phone Razorpay Gateway
  const handleDirectRazorpayPay = () => {
    setIsCheckingOut(true);
    logTerminal('RAZORPAY_INTENT', 'info', `Processing payment of <b>${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}</b> via Razorpay Gateway...`);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCurrentScene('success');
      logTerminal('PAYMENT_RECOVERED', 'ok', `Payment of <b>${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}</b> successfully captured via Razorpay!`);
      syncRecoveryToBackend('razorpay_direct');
      if (onShowBanner) {
        onShowBanner(`Payment of ₹${currentScenario.amount.toLocaleString('en-IN')} successfully verified via Razorpay!`, 'success');
      }
    }, 850);
  };

  // Launch the official Razorpay Checkout Modal (API Test Mode)
  const handleLaunchRealRazorpayModal = () => {
    const caseData: RecoveryCase = {
      id: `case_${currentScenario.id}`,
      caseNumber: currentScenario.caseNumber,
      customerName: currentScenario.customerName,
      customerPhone: currentScenario.customerPhone,
      customerEmail: currentScenario.customerEmail,
      amount: currentScenario.amount,
      currency: 'INR',
      status: 'identified',
      failureReason: currentScenario.failureReason,
      createdAt: new Date().toISOString(),
      attemptsCount: 0,
      maxAttempts: 3,
      riskScore: 35,
      scenario: 'checkout_abandonment',
      scenarioLabel: currentScenario.title,
      bankName: 'HDFC Bank',
      paymentMethod: 'upi',
      paymentUrl: `https://${currentScenario.paymentShortLink}`,
      auditTrail: [],
    };
    setCheckoutCaseData(caseData);
    setIsRazorpayModalOpen(true);
    logTerminal('RAZORPAY_API', 'info', `Opened official Razorpay merchant checkout for <b>${currentScenario.merchantName}</b>.`);
  };

  // User closes Razorpay Checkout without completing payment -> Trigger Autonomous Call
  const handleCloseRazorpayWithoutPaying = () => {
    setIsRazorpayModalOpen(false);
    logTerminal('RAZORPAY_EXIT', 'warn', `Customer exited Razorpay checkout sheet without completing payment.`);
    handleCancelAndTriggerCall();
  };

  // User completes payment in Razorpay Modal
  const handleRazorpayPaymentSuccess = (caseId: string) => {
    setIsRazorpayModalOpen(false);
    setCurrentScene('success');
    logTerminal('PAYMENT_RECOVERED', 'ok', `Payment of <b>${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}</b> received via Razorpay Gateway!`);
    syncRecoveryToBackend('razorpay_modal');
    if (onShowBanner) {
      onShowBanner(`Payment of ₹${currentScenario.amount.toLocaleString('en-IN')} successfully verified via Razorpay!`, 'success');
    }
  };

  // Reset and initialize when scenario changes
  useEffect(() => {
    stopCallAndSpeech();
    setCurrentScene('store_or_bank');
    setCurrentLineIndex(0);
    setCallTimer(0);
    setShowTopNotif(false);
    setPin('');
    setIsCallDisconnectedMidway(false);
    setSelectedPtpDate(null);
    setAppliedPrice(currentScenario.amount);
    setTerminalLogs([]);

    // Initialize WhatsApp chat messages
    if (selectedScenarioId === 'nike_cart_recovery') {
      setWaMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hi Raj! As agreed on our call, here is your exclusive link for Nike Air Step with ₹499 waiver applied (Net: ₹18,000):`,
          time: '9:42 AM',
          isLinkCard: true
        }
      ]);
    } else {
      setWaMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Hi Raj, we tried reaching you regarding your pending bill payment, but the call could not be connected. If you need assistance with the payment or would like to schedule it on a convenient date, you can reply right here. — Revora AI Recovery Assistant`,
          time: '9:42 AM',
          isDateSelector: true
        }
      ]);
    }

    logTerminal('SYS_INIT', 'info', `Loaded recovery module: <b>${currentScenario.title}</b>`);
    logTerminal('TARGET', 'info', `Customer: <b>${currentScenario.customerName}</b> (${currentScenario.customerPhone}) | Case: <b>${currentScenario.caseNumber}</b>`);
    logTerminal('POLICY_RULE', 'info', `Autonomous Waiver Limit: <b>${currentScenario.currencySymbol}${currentScenario.policyWaiverMax.toLocaleString('en-IN')}</b>`);
    logTerminal('STANDBY', 'ok', `Monitoring customer checkout session.`);
  }, [selectedScenarioId]);

  // Keyboard support for typing 6-digit PIN on laptop keyboard
  useEffect(() => {
    if (currentScene !== 'gpay') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeypadPress('back');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, pin]);

  // Terminal scroll fix: ONLY scroll the terminal container itself, NEVER scroll window/page!
  useEffect(() => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // QR Code expiration countdown timer for in-phone Razorpay checkout
  useEffect(() => {
    if (currentScene !== 'checkout') return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 890));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScene]);

  // Call timer interval
  useEffect(() => {
    let interval: any = null;
    if (currentScene === 'call_active') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentScene]);

  // Format MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Stop speech immediately and cancel all active audio synthesis
  const stopCallAndSpeech = () => {
    isCallActiveRef.current = false;
    if (speechUtteranceRef.current) {
      speechUtteranceRef.current.onend = null;
      speechUtteranceRef.current.onerror = null;
      speechUtteranceRef.current.onstart = null;
      speechUtteranceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
    setIsAiSpeaking(false);
    setIsCustomerSpeaking(false);
  };

  // Two distinct male voices (Crisp English audio)
  const speakDialogueLine = (line: DialogueLine, onComplete?: () => void) => {
    if (!isCallActiveRef.current) return;

    if (!('speechSynthesis' in window)) {
      if (onComplete && isCallActiveRef.current) setTimeout(onComplete, line.audioDurationMs);
      return;
    }

    window.speechSynthesis.cancel();
    // Speak crisp, natural English text so there is no awkward phonetic butchering
    const textToSpeak = (line.englishText || line.text).replace(/\*.*\*/g, '');
    if (!textToSpeak.trim()) {
      if (onComplete && isCallActiveRef.current) onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    speechUtteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const maleKeywords = ['male', 'david', 'george', 'daniel', 'guy', 'rishi', 'ravi', 'kiran', 'prabhat', 'james', 'alex', 'fred', 'tom', 'google uk english male', 'microsoft david', 'microsoft mark'];
    const maleVoices = enVoices.filter(v => 
      maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );

    if (line.speaker === 'agent') {
      // Voice 1 (AI Recovery Agent - Male 1): Crisp, confident, professional male tone
      utterance.pitch = 1.05;
      utterance.rate = 1.00;
      if (maleVoices.length > 0) {
        utterance.voice = maleVoices[0];
      } else if (enVoices.length > 0) {
        utterance.voice = enVoices[0];
      }
    } else {
      // Voice 2 (Customer Raj - Male 2): Deep, natural, conversational male tone
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
      if (!isCallActiveRef.current) {
        window.speechSynthesis.cancel();
        return;
      }
      if (line.speaker === 'agent') {
        setIsAiSpeaking(true);
        setIsCustomerSpeaking(false);
      } else {
        setIsCustomerSpeaking(true);
        setIsAiSpeaking(false);
      }
    };

    utterance.onend = () => {
      setIsAiSpeaking(false);
      setIsCustomerSpeaking(false);
      if (onComplete && isCallActiveRef.current) {
        onComplete();
      }
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
      setIsCustomerSpeaking(false);
      if (onComplete && isCallActiveRef.current) {
        onComplete();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Step 1: User clicks "Buy Now" on Store / "Pay Statement" on HDFC Portal -> Opens Checkout
  const handleProceedToCheckout = () => {
    setCurrentScene('checkout');
    setIsRazorpaySheetOpen(false);
    logTerminal('CHECKOUT_INIT', 'info', `Opened Checkout Order Review for <b>${currentScenario.merchantName}</b>. Total: <b>${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}</b>`);
  };

  // Step 2A: User taps "Pay with Razorpay" -> Triggers Razorpay standard checkout popup inside phone
  const handleTriggerRazorpayCheckout = () => {
    setIsRazorpaySheetOpen(true);
    logTerminal('RAZORPAY_TRIGGER', 'info', `Triggered <b>Razorpay Standard Checkout SDK</b>. Order ID: <b>#order_RP9281</b> (Amount: ${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')})`);
    if (onShowBanner) {
      onShowBanner(`Razorpay Standard Checkout opened for ${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}`, 'info');
    }
  };

  // Step 2B: User cancels/abandons checkout (clicks [✕] on Razorpay modal) -> Triggers autonomous voice recovery call
  const handleCancelAndTriggerCall = () => {
    setIsRazorpaySheetOpen(false);
    stopCallAndSpeech();
    setCurrentLineIndex(0);
    setPin('');
    setShowTopNotif(false);
    setIsCallDisconnectedMidway(false);
    setAppliedPrice(currentScenario.amount);

    logTerminal('CHECKOUT_ABANDONED', 'warn', `Customer clicked <b>[✕] Cancel</b> on Razorpay Checkout. Payment session dismissed.`);
    logTerminal('AGENT_ACTIVATED', 'ok', `Autonomous recovery agent triggered! Case: <b>${currentScenario.caseNumber}</b>`);

    if (onShowBanner) {
      onShowBanner(`Checkout cancelled! Autonomous Voice Agent dialing ${currentScenario.customerName}...`, 'info');
    }

    setTimeout(() => {
      logTerminal('DIAL_OUTBOUND', 'ok', `Initiating live voice recovery call to <b>${currentScenario.customerPhone}</b>...`);
      setCurrentScene('call_incoming');
    }, 1000);
  };

  // Answer call when user slides the slider
  const handleAnswerCall = () => {
    setCurrentScene('call_active');
    logTerminal('CALL_CONNECTED', 'ok', `Call connected with <b>${currentScenario.customerName}</b>. AI Agent speaking...`);
    playDialogueLine(0);
  };

  // Step 3: Play dialogue lines
  const playDialogueLine = (index: number) => {
    isCallActiveRef.current = true;
    const lines = currentScenario.dialogue;
    if (index >= lines.length) {
      logTerminal('AI_STATUS', 'ok', `Voice dialogue concluded. Revora Agent listening. Tap 'End Call' or tap top notification to proceed.`);
      return;
    }

    setCurrentLineIndex(index);
    const line = lines[index];

    // Scenario 2 Special: Customer Disconnects Call Mid-Sentence
    if (line.isDisconnectTrigger) {
      logTerminal('TRANSCRIPT', 'info', `<b>Revora Agent</b>: "${line.englishText || line.text}"`);
      speakDialogueLine(line, () => {
        if (!isCallActiveRef.current) return;
        // Disconnect immediately after greeting
        setIsCallDisconnectedMidway(true);
        logTerminal('CALL_DISCONNECTED', 'err', `Customer disconnected call. No conversation completed.`);
        logTerminal('AI_STATUS', 'warn', `Contact Failed → Autonomous WhatsApp Follow-up Ready.`);

        setTimeout(() => {
          stopCallAndSpeech();
          // Dispatch audit email for Scenario 2
          fetch('/api/voice-recovery/dispatch-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toEmail: 'rajeyoh@gmail.com',
              customerName: currentScenario.customerName,
              caseNumber: currentScenario.caseNumber,
              amount: currentScenario.amount,
              scenario: currentScenario.title,
              paymentUrl: `https://${currentScenario.paymentShortLink}`,
              status: 'CONTACT_FAILED_FOLLOWUP_SENT',
              agentName: currentScenario.agentName,
            }),
          }).catch(() => {});

          setCurrentScene('store_or_bank');
          setTopNotifText(`Hi Raj, pending bill follow-up sent. Tap to choose payment date 👉`);
          setShowTopNotif(true);
          logTerminal('WHATSAPP_PUSH', 'ok', `Dispatched follow-up notification alert. Tap banner at top of phone to open WhatsApp.`);
        }, 1200);
      });
      return;
    }

    // Scenario 1 Standard Flow
    if (line.discountPrice) {
      setAppliedPrice(line.discountPrice);
      logTerminal('DISCOUNT_APPLIED', 'ok', `Applied autonomous waiver: Net settlement is <b>${currentScenario.currencySymbol}${line.discountPrice.toLocaleString('en-IN')}</b>`);
    }

    logTerminal('TRANSCRIPT', 'info', `<b>${line.speaker === 'agent' ? 'Revora Agent' : line.name}</b>: "${line.englishText || line.text}"`);

    // Show WhatsApp push notification near end of call
    if (index === lines.length - 2 || index === lines.length - 1) {
      setTopNotifText(`Just a reminder: Complete payment for ${currentScenario.productName}`);
      setShowTopNotif(true);
      logTerminal('WHATSAPP_PUSH', 'ok', `Dispatched WhatsApp push notification alert.`);
    }

    speakDialogueLine(line, () => {
      if (!isCallActiveRef.current) return;
      if (index + 1 < lines.length) {
        autoPlayTimeoutRef.current = setTimeout(() => {
          if (!isCallActiveRef.current) return;
          playDialogueLine(index + 1);
        }, 700);
      } else {
        // Dialogue finished: Call stays connected in listening state until user ends it or taps notification!
        setTopNotifText(`Just a reminder: Complete payment for ${currentScenario.productName}`);
        setShowTopNotif(true);
        logTerminal('AI_STATUS', 'ok', `Voice dialogue concluded. Revora Agent listening. Tap 'End Call' or tap the top WhatsApp notification to continue.`);
      }
    });
  };

  // Step 4: User explicitly finishes / ends call
  const handleFinishCall = async () => {
    stopCallAndSpeech();
    logTerminal('CALL_ENDED', 'ok', `Voice call concluded by user.`);

    // Send real audit email to rajeyoh@gmail.com
    try {
      await fetch('/api/voice-recovery/dispatch-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: 'rajeyoh@gmail.com',
          customerName: currentScenario.customerName,
          caseNumber: currentScenario.caseNumber,
          amount: currentScenario.amount,
          scenario: currentScenario.title,
          paymentUrl: `https://${currentScenario.paymentShortLink}`,
          discountApplied: currentScenario.amount - appliedPrice,
          agentName: currentScenario.agentName,
        }),
      });
      logTerminal('AUDIT_EMAIL', 'ok', `Dispatched recovery transcript and payload to <b>rajeyoh@gmail.com</b>`);
    } catch (e) {}

    // Return to the previous screen and show WhatsApp notification banner for manual tapping (NO auto-redirect)
    setCurrentScene('store_or_bank');
    setTopNotifText(`Just a reminder: Complete payment for ${currentScenario.productName}`);
    setShowTopNotif(true);
    logTerminal('WHATSAPP_PENDING', 'info', `WhatsApp notification alert active on phone screen. Tap banner to open WhatsApp.`);
  };

  // Top WhatsApp Notification tapped -> instantly hides notification
  const handleTapTopNotification = () => {
    setShowTopNotif(false);
    stopCallAndSpeech();
    setCurrentScene('whatsapp_chat');
    logTerminal('NOTIF_CLICKED', 'info', `Customer tapped WhatsApp notification alert.`);
  };

  // Step 5: Open Official Razorpay API Web Checkout inside phone simulator
  const handleOpenOfficialRazorpayWebCheckout = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowTopNotif(false);
    const linkPath = `/pay/${currentScenario.caseNumber.toLowerCase()}`;
    const fullWebUrl = typeof window !== 'undefined' ? `${window.location.origin}${linkPath}` : `https://${currentScenario.paymentShortLink}`;
    
    logTerminal('RAZORPAY_API_WEB', 'ok', `Dispatched official Razorpay payment link: <b>${fullWebUrl}</b> (Rendering in mobile view).`);
    
    setCurrentScene('official_razorpay_web');
    if (onShowBanner) {
      onShowBanner(`Opening official Razorpay Payment Portal (${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')})`, 'info');
    }
  };

  // Step 5 alternative: User taps GPay inside WhatsApp
  const handleSelectGPay = () => {
    setShowTopNotif(false);
    setPin('');
    setCurrentScene('gpay');
    logTerminal('GPAY_LAUNCHED', 'info', `Customer launched <b>Google Pay</b>. Amount: <b>${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')}</b>. Awaiting 6-digit PIN.`);
  };

  // Handle Official Razorpay Web Settlement
  const handleOfficialRazorpaySettlement = () => {
    logTerminal('RAZORPAY_AUTH', 'ok', `Processing payment of <b>${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')}</b> via Razorpay API Web Gateway.`);

    setTimeout(() => {
      setCurrentScene('success');
      logTerminal('RAZORPAY_CAPTURE', 'ok', `Razorpay Webhook broadcasted: <b>payment.captured</b> (ID: pay_rzp_live_${Date.now().toString().slice(-6)})`);
      logTerminal('SETTLED', 'ok', `Recovered <b>${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')}</b>! Case <b>${currentScenario.caseNumber}</b> marked RESOLVED.`);

      syncRecoveryToBackend('razorpay_web');

      if (onShowBanner) {
        onShowBanner(`Payment of ${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')} successfully captured via official Razorpay Gateway!`, 'success');
      }
    }, 600);
  };

  // Scenario 2: Customer selects a Promise-to-Pay (PTP) Date on WhatsApp
  const handleSelectPtpDate = (dateLabel: string) => {
    setSelectedPtpDate(dateLabel);

    // Customer sends message
    const userMsg: WhatsAppMessage = {
      id: `${Date.now()}-u`,
      sender: 'customer',
      text: `I will make the payment on ${dateLabel}.`,
      time: '9:43 AM'
    };

    setWaMessages(prev => [...prev, userMsg]);
    logTerminal('CUSTOMER_REPLY', 'info', `<b>Raj</b> replied: "I will make the payment on ${dateLabel}."`);

    // AI automatically replies autonomously after 600ms
    setTimeout(() => {
      const aiReply: WhatsAppMessage = {
        id: `${Date.now()}-ai`,
        sender: 'ai',
        text: `Understood, Raj! We have scheduled your Promise-to-Pay (PTP) for ${dateLabel}. We will pause dunning calls and send a reminder before your scheduled date. Thank you! 🙏`,
        time: '9:43 AM'
      };
      setWaMessages(prev => [...prev, aiReply]);
      logTerminal('PTP_RECORDED', 'ok', `Promise-to-Pay logged for <b>${dateLabel}</b>. Case <b>${currentScenario.caseNumber}</b> status updated to <b>PTP_SCHEDULED</b>.`);
      
      syncPtpToBackend(dateLabel);

      if (onShowBanner) {
        onShowBanner(`Promise-to-Pay for ${dateLabel} successfully scheduled! Synced to P2P Ledger & Queue.`, 'success');
      }
    }, 600);
  };

  // Keypad interaction for Google Pay 6-digit PIN
  const handleKeypadPress = (val: string) => {
    if (val === 'back') {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < PIN_LENGTH) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin.length === PIN_LENGTH) {
        // Auto-authorize when 6 digits are filled
        setTimeout(() => {
          handleAuthorizePayment();
        }, 300);
      }
    }
  };

  // Step 6: Complete Payment via GPay
  const handleAuthorizePayment = () => {
    logTerminal('PIN_AUTHENTICATED', 'ok', `Google Pay MPIN verified via NPCI gateway.`);

    setTimeout(() => {
      setCurrentScene('success');
      logTerminal('RAZORPAY_CAPTURE', 'ok', `Razorpay Webhook: <b>payment.captured</b> (ID: pay_QK92mR7fLscart)`);
      logTerminal('SETTLED', 'ok', `Recovered <b>${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')}</b>! Case <b>${currentScenario.caseNumber}</b> marked RESOLVED.`);

      syncRecoveryToBackend('upi_gpay');

      if (onShowBanner) {
        onShowBanner(`Payment of ${currentScenario.currencySymbol}${appliedPrice.toLocaleString('en-IN')} successfully settled via Google Pay! Synced to Recovery Queue.`, 'success');
      }
    }, 500);
  };

  // Copy terminal logs
  const handleCopyLogs = () => {
    if (navigator.clipboard) {
      const text = terminalLogs.map((l) => `[${l.time}] [${l.tag}] ${l.msg.replace(/<[^>]*>?/gm, '')}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopiedLog(true);
      setTimeout(() => setCopiedLog(false), 2000);
    }
  };

  // Clear terminal logs
  const handleClearLogs = () => {
    setTerminalLogs([
      {
        id: `${Date.now()}`,
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        tag: 'LOG_CLEARED',
        tagType: 'info',
        msg: `Terminal logs cleared. Voice Recovery Engine ready.`
      }
    ]);
  };

  return (
    <div className="space-y-3 font-sans pb-2 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Revora Agent
          </h1>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            Live Autonomous Engine
          </span>
        </div>

        {/* Compact Scenario Selector Dropdown */}
        <div className="relative min-w-[320px]">
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value as ScenarioType)}
            className={`w-full text-xs font-semibold px-3.5 py-2 rounded-xl border appearance-none pr-8 cursor-pointer transition-all ${
              isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            {(Object.keys(SCENARIOS) as ScenarioType[]).map((k) => (
              <option key={k} value={k} className="bg-slate-900 text-white">
                {SCENARIOS[k].badge}: {SCENARIOS[k].title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Grid: Left Phone Simulator + Right Live Terminal Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: iPhone Simulator (5 Cols)                                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Quick Flow Stage Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl mb-2 text-[10.5px] border ${
            isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setCurrentScene('store_or_bank')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                currentScene === 'store_or_bank' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {selectedScenarioId === 'nike_cart_recovery' ? '1. Store' : '1. Bank'}
            </button>
            <button
              onClick={() => setCurrentScene('checkout')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                currentScene === 'checkout' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Checkout
            </button>
            <button
              onClick={() => {
                setCurrentScene('call_active');
                playDialogueLine(0);
              }}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                currentScene === 'call_incoming' || currentScene === 'call_active'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Voice Call
            </button>
            <button
              onClick={() => setCurrentScene('whatsapp_chat')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                currentScene === 'whatsapp_chat' ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. WhatsApp
            </button>
            {selectedScenarioId === 'nike_cart_recovery' && (
              <button
                onClick={() => setCurrentScene('gpay')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                  currentScene === 'gpay' || currentScene === 'success'
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5. GPay PIN
              </button>
            )}
          </div>

          {/* Sleek iPhone Bezel with Pro Dimensions & Single-View Height */}
          <div className="w-[365px] sm:w-[382px] h-[660px] rounded-[48px] bg-[#0c0f17] p-2.5 shadow-2xl ring-1 ring-white/20 border border-slate-800 flex flex-col relative overflow-hidden shrink-0">
            
            {/* Simulated WhatsApp Dropdown Notification Banner with Hover Effect */}
            {showTopNotif && (
              <div
                onClick={handleTapTopNotification}
                onMouseEnter={() => setIsNotifHovered(true)}
                onMouseLeave={() => setIsNotifHovered(false)}
                className={`absolute top-12 left-3.5 right-3.5 z-50 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-2xl border border-slate-200/90 backdrop-blur-xl cursor-pointer transition-all duration-300 ${
                  isNotifHovered ? 'scale-[1.02] shadow-emerald-500/20 ring-2 ring-emerald-500' : 'scale-100'
                }`}
              >
                <div className="flex items-center justify-between text-[9.5px] text-slate-500 mb-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[8px]">W</span>
                    <span>{currentScenario.merchantName}</span>
                  </div>
                  <span className="text-[9px] text-slate-400">now</span>
                </div>
                <p className="text-[11px] font-bold text-slate-900 leading-tight">Payment Assistance</p>
                <p className="text-[10px] text-slate-600 truncate">
                  {topNotifText}
                </p>
              </div>
            )}

            {/* Viewport Screen with Status Bar */}
            <div className={`w-full h-full rounded-[38px] ${currentScene === 'whatsapp_chat' ? 'bg-[#0B141B]' : isDarkScreenScene ? 'bg-black' : 'bg-white'} overflow-hidden flex flex-col relative pt-1.5 pb-2.5 px-3 font-sans text-xs scrollbar-none`}>
              
              {/* iOS Status Bar & Dynamic Island matching reference image */}
              <div className={`flex items-center justify-between px-4 pt-1 pb-1 z-30 select-none shrink-0 ${
                isDarkScreenScene ? 'text-white' : 'text-black'
              }`}>
                {/* Time (Left) - matching exact iOS typography */}
                <div className="w-16 flex items-center justify-start">
                  <span className="text-[14.5px] font-bold tracking-tight font-sans leading-none">
                    9:41
                  </span>
                </div>

                {/* Dynamic Island (Center) - Authentic iPhone Pro dimensions & front camera reflection */}
                <div className="w-[112px] h-[28px] bg-black rounded-full flex items-center justify-end pr-3 shadow-md pointer-events-none border border-black/40">
                  {/* Front-Facing Camera Lens Reflection */}
                  <div className="w-[11px] h-[11px] rounded-full bg-[#0a0f1d] ring-1 ring-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#040711] relative flex items-center justify-center">
                      <div className="w-[2.5px] h-[2.5px] rounded-full bg-indigo-500/70 blur-[0.3px]" />
                    </div>
                  </div>
                </div>

                {/* Status Icons (Right): 4-Bar Cellular, Wi-Fi, Precision Battery */}
                <div className="w-16 flex items-center justify-end gap-1.5">
                  {/* 4-Bar Cellular Signal */}
                  <svg className="w-[16px] h-[11px] fill-current" viewBox="0 0 18 12">
                    <rect x="0" y="8.5" width="2.8" height="3.5" rx="0.8" />
                    <rect x="4.5" y="5.8" width="2.8" height="6.2" rx="0.8" />
                    <rect x="9" y="3" width="2.8" height="9" rx="0.8" />
                    <rect x="13.5" y="0.2" width="2.8" height="11.8" rx="0.8" />
                  </svg>
                  
                  {/* iOS Wi-Fi Icon */}
                  <svg className="w-[15px] h-[11px] fill-current" viewBox="0 0 16 12">
                    <path d="M8 11.8a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z" />
                    <path d="M3.8 6.9a5.9 5.9 0 018.4 0 .9.9 0 001.3-1.3 7.7 7.7 0 00-11 0 .9.9 0 001.3 1.3z" />
                    <path d="M1.2 3.9a9.6 9.6 0 0113.6 0 .9.9 0 101.3-1.3 11.4 11.4 0 00-16.2 0 .9.9 0 101.3 1.3z" />
                  </svg>

                  {/* iOS Battery Icon (Exact matching outer capsule + inner fill + right knob) */}
                  <div className="flex items-center pl-0.5">
                    <div className="w-[22px] h-[11.5px] rounded-[4px] border-[1.5px] border-current p-[1.5px] flex items-center">
                      <div className="h-full w-full bg-current rounded-[1.5px]" />
                    </div>
                    <div className="w-[1.5px] h-[4.5px] bg-current rounded-r-[1.5px] -ml-[0.5px]" />
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* SCREEN 1A: NIKE D2C STOREFRONT (Nike Recovery)              */}
              {/* ========================================================== */}
              {currentScene === 'store_or_bank' && selectedScenarioId === 'nike_cart_recovery' && (
                <div className="flex-1 flex flex-col justify-between py-2 animate-in fade-in duration-300 text-slate-900 bg-white -mx-3 -mb-3 px-4 pt-1 pb-3 rounded-b-[38px]">
                  
                  {/* Top Bar with Back, Brand, Cart */}
                  <div className="flex items-center justify-between pt-1">
                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-black text-sm tracking-widest text-slate-900">NIKE</span>
                    <div className="relative cursor-pointer">
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">1</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="text-center pt-2">
                    <h2 className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                      {currentScenario.productName}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{currentScenario.productSubtitle}</p>
                  </div>

                  {/* Shoe Display with Size Selector & Fav */}
                  <div className="relative my-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
                      <span className="text-[10px] font-bold text-slate-400">Size</span>
                      {['9', '9.5', '10'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                            selectedSize === sz
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20">
                      <span className="text-[10px] font-bold text-slate-400">Fav</span>
                      <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-slate-900 text-slate-900' : 'text-slate-400'}`} />
                      </button>
                      <span className="text-[9px] text-slate-400">Added</span>
                    </div>

                    {/* Shoe Hero Image */}
                    <div className="w-52 h-52 mx-auto flex items-center justify-center">
                      <img
                        src={currentScenario.productImg}
                        alt="Nike Shoe"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-xl transform -rotate-12 hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block text-left">Question</span>
                      <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 mt-0.5">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400">Price</span>
                      <p className="text-2xl font-black font-mono text-slate-900">
                        {currentScenario.currencySymbol}{currentScenario.amount.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block">Viewed</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mt-0.5 ml-auto">
                        <span className="text-[10px] font-bold text-slate-600">3x</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Now and Proceed Button in iOS SF Pro Font */}
                  <div className="pt-4">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full py-3.5 px-6 rounded-full bg-slate-950 hover:bg-slate-900 active:bg-black text-white font-semibold text-[13.5px] tracking-tight flex items-center justify-center cursor-pointer shadow-lg active:scale-[0.98] transition-all"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif' }}
                    >
                      Buy Now and Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 1B: HDFC BANK NETBANKING / BILL PAY (iOS Style)    */}
              {/* ========================================================== */}
              {currentScene === 'store_or_bank' && selectedScenarioId === 'bill_due_disconnect' && (
                <div 
                  className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 bg-[#060c18] -mx-3 -mb-3 -mt-0.5 px-3.5 pt-1.5 pb-2.5 rounded-b-[38px] text-white overflow-hidden space-y-2.5"
                >
                  
                  {/* Top iOS Header */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setCurrentScene('store_or_bank')}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs border border-white/10"
                        title="Back"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-2xl bg-[#E31837] text-white font-black text-sm flex items-center justify-center shadow-sm">
                          H
                        </div>
                        <div>
                          <h3 className="font-extrabold text-[13.5px] leading-tight tracking-tight text-white">HDFC BANK</h3>
                          <p className="text-[10px] text-slate-400 font-semibold leading-tight">NetBanking • Cards</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-600/40 shadow-2xs tracking-wide">
                      14 Days Overdue
                    </span>
                  </div>

                  {/* Glossy iOS HDFC Regalia Credit Card */}
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-[#112d70] via-[#091b48] to-[#050e26] border border-blue-400/25 shadow-2xl relative overflow-hidden space-y-2">
                    {/* Top Row: Card Brand & Visa */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-extrabold tracking-wider text-blue-200/90 uppercase">
                        HDFC REGALIA
                      </span>
                      <div className="flex items-center gap-1.5 text-white font-black text-xs italic tracking-wider">
                        <CreditCard className="w-4 h-4 not-italic text-blue-300" />
                        <span>VISA</span>
                      </div>
                    </div>

                    {/* Card Number Dots */}
                    <div className="text-[17px] font-extrabold tracking-[0.28em] text-white pt-2 pb-1">
                      ••••  ••••  ••••  9012
                    </div>

                    {/* Bottom Info Row: 3 Columns */}
                    <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/10 text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">CARDHOLDER</span>
                        <span className="font-bold text-white tracking-wide text-[11.5px]">RAJ</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">CREDIT LIMIT</span>
                        <span className="font-bold text-white text-[11.5px]">₹5,00,000.00</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[8.5px] uppercase font-bold tracking-wider">STATEMENT DUE</span>
                        <span className="font-bold text-rose-400 text-[11.5px]">14 AUG 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* iOS Rounded Details List Card */}
                  <div className="rounded-2xl bg-[#091122]/95 border border-white/10 p-2.5 divide-y divide-white/5 backdrop-blur-xl shadow-lg">
                    {/* Row 1: Total Due */}
                    <div className="flex items-center justify-between py-2 first:pt-0.5 last:pb-0.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-bold text-slate-100 leading-tight">Total Due</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">Outstanding amount</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-extrabold text-white tracking-tight">₹18,450.00</span>
                    </div>

                    {/* Row 2: Late Fee Included */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-bold text-slate-100 leading-tight">Late Fee Included</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">For overdue payment</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-extrabold text-rose-400 tracking-tight">₹500.00</span>
                    </div>

                    {/* Row 3: Minimum Due */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-bold text-slate-100 leading-tight">Minimum Due</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">Minimum amount due</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-extrabold text-white tracking-tight">₹1,850.00</span>
                    </div>

                    {/* Row 4: Due Date */}
                    <div className="flex items-center justify-between py-2 last:pb-0.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12.5px] font-bold text-slate-100 leading-tight">Due Date</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">Payment due by</p>
                        </div>
                      </div>
                      <span className="text-[14px] font-extrabold text-white tracking-tight">14 AUG 2026</span>
                    </div>
                  </div>

                  {/* Informational Guidance Banner */}
                  <div className="rounded-xl bg-[#091530] border border-blue-500/20 px-3 py-2 flex items-center gap-2 text-[10.5px] text-blue-200/90 font-medium leading-snug">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Pay now to avoid further late fees and maintain a good credit score.</span>
                  </div>

                  {/* Action Button: Center-Placed Interactive "Pay with Razorpay" Button */}
                  <div className="space-y-1.5 pt-0.5">
                    <button
                      id="hdfc-razorpay-pay-btn"
                      onClick={handleProceedToCheckout}
                      className="group relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#4f46e5] hover:from-[#2563eb] hover:via-[#3b82f6] hover:to-[#6366f1] active:scale-[0.97] transition-all duration-200 text-white shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-2.5 border border-white/25 cursor-pointer overflow-hidden"
                    >
                      {/* Subtle Animated Sheen Effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                      
                      <Lock className="w-4 h-4 text-cyan-300 shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform duration-200" />
                      <span className="font-extrabold text-[15px] tracking-tight text-white group-hover:tracking-normal transition-all duration-200">
                        Pay with Razorpay
                      </span>
                    </button>

                    {/* Bottom Security Badges */}
                    <div className="flex items-center justify-center gap-2.5 text-[9.5px] text-slate-400 font-semibold pt-0.5">
                      <span className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-slate-400" /> 256-Bit SSL Encrypted
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-slate-400" /> Secure &amp; Trusted Payments
                      </span>
                    </div>

                    {/* iOS Home Indicator */}
                    <div className="w-24 h-1 bg-white/25 rounded-full mx-auto mt-1" />
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 2: MERCHANT CHECKOUT REVIEW PAGE                   */}
              {/* ========================================================== */}
              {currentScene === 'checkout' && !isRazorpaySheetOpen && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 text-slate-900 bg-[#f8fafc] -mx-3 -mb-3 rounded-b-[34px] overflow-hidden">
                  
                  {/* Top Merchant Navigation Header */}
                  <div className="bg-white px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentScene('store_or_bank')}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Back to store"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <h4 className="font-bold text-xs leading-tight text-slate-900">
                          {selectedScenarioId === 'nike_cart_recovery' ? 'Nike Checkout' : 'HDFC Bill Pay'}
                        </h4>
                        <p className="text-[9px] text-slate-500 leading-none">Order Review &amp; Payment</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Step 2 of 2
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-3 space-y-2.5 overflow-y-auto font-sans text-xs scrollbar-thin">
                    
                    {/* Delivery / Account info */}
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {selectedScenarioId === 'nike_cart_recovery' ? 'Delivery Address' : 'Account Details'}
                        </span>
                        <span className="text-[9px] font-bold text-blue-600">Verified</span>
                      </div>
                      <p className="font-bold text-[11px] text-slate-800">
                        {currentScenario.customerName} • <span className="font-mono text-slate-500">{currentScenario.customerPhone}</span>
                      </p>
                      <p className="text-[9.5px] text-slate-500 leading-snug">
                        {selectedScenarioId === 'nike_cart_recovery' 
                          ? '12, 100ft Road, Indiranagar, Bengaluru, 560038'
                          : 'HDFC Regalia Credit Card (Ending •••• 9012)'}
                      </p>
                    </div>

                    {/* Order Item Summary Card */}
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Item Summary
                      </span>
                      <div className="flex items-center gap-2.5">
                        {currentScenario.productImg ? (
                          <img
                            src={currentScenario.productImg}
                            alt="Product"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{currentScenario.productName}</p>
                          <p className="text-[10px] text-slate-500">
                            {selectedScenarioId === 'nike_cart_recovery' ? 'Size: UK 9.5 • Color: Ghost Green' : 'Overdue by 14 Days • Statement Cleared'}
                          </p>
                          <p className="text-xs font-black text-slate-900 font-mono mt-0.5">
                            {currentScenario.currencySymbol}{currentScenario.amount.toLocaleString('en-IN')}.00
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Card */}
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 text-[10.5px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal / MRP:</span>
                        <span className="font-mono font-medium">{currentScenario.currencySymbol}{currentScenario.amount.toLocaleString('en-IN')}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Express Delivery:</span>
                        <span className="font-bold text-emerald-600">FREE</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Taxes &amp; Fees:</span>
                        <span className="text-slate-500">Included</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-slate-100 text-slate-900 font-bold text-xs">
                        <span>Total Payable:</span>
                        <span className="font-black text-blue-600 font-mono text-sm">
                          {currentScenario.currencySymbol}{currentScenario.amount.toLocaleString('en-IN')}.00
                        </span>
                      </div>
                    </div>

                    {/* Payment Gateway Provider Selector */}
                    <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                          R
                        </div>
                        <div>
                          <p className="text-[10.5px] font-bold text-slate-900 leading-tight">Razorpay Secure Checkout</p>
                          <p className="text-[8.5px] text-blue-700">UPI, Cards, NetBanking, QR</p>
                        </div>
                      </div>
                      <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        256-bit SSL
                      </span>
                    </div>

                  </div>

                  {/* Sticky Checkout CTA Footer */}
                  <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-1.5 shadow-lg">
                    <button
                      onClick={handleTriggerRazorpayCheckout}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-cyan-300 shrink-0" />
                      <span>Pay with Razorpay</span>
                    </button>
                    <p className="text-[9px] text-slate-400 text-center font-medium flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span>100% Safe &amp; Encrypted Payment via Razorpay</span>
                    </p>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 2B: IN-PHONE EMBEDDED RAZORPAY PAYMENT SHEET (MODAL)*/}
              {/* ========================================================== */}
              {currentScene === 'checkout' && isRazorpaySheetOpen && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200 text-slate-900 bg-[#f4f7fb] -mx-3 -mb-3 rounded-b-[34px] overflow-hidden">
                  
                  {/* Razorpay Top Navy Bar */}
                  <div className="bg-[#0c2340] px-3 py-2 text-white flex items-center justify-between border-b border-blue-900/60 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-xs">
                        R
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 leading-none">
                          <span className="font-black text-xs tracking-tight text-white">Razorpay</span>
                          <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Verified
                          </span>
                        </div>
                        <p className="text-[9px] text-blue-200/80 leading-none mt-0.5 truncate max-w-[130px]">
                          {currentScenario.merchantName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[8.5px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>256-bit</span>
                      </span>
                      <button
                        onClick={handleCancelAndTriggerCall}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                        title="Cancel & Close Checkout"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Order & Amount Header */}
                  <div className="bg-[#081528] px-3 py-1.5 text-white flex items-center justify-between border-b border-blue-950 shrink-0">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Payable Amount</p>
                      <p className="text-sm font-black font-mono text-white leading-tight">
                        {currentScenario.currencySymbol}{currentScenario.amount.toLocaleString('en-IN')}.00
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Order ID</p>
                      <p className="text-[9.5px] font-mono text-cyan-300 font-bold">#order_RP9281</p>
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="bg-white border-b border-slate-200 px-2 pt-1 flex items-center justify-around text-[10px] font-bold shrink-0">
                    <button
                      onClick={() => setCheckoutMethod('upi')}
                      className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                        checkoutMethod === 'upi'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      onClick={() => setCheckoutMethod('card')}
                      className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                        checkoutMethod === 'card'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Cards</span>
                    </button>
                    <button
                      onClick={() => setCheckoutMethod('netbanking')}
                      className={`pb-1 px-2 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                        checkoutMethod === 'netbanking'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>NetBanking</span>
                    </button>
                  </div>

                  {/* Method Tab Content Body */}
                  <div className="flex-1 p-2.5 space-y-2 overflow-y-auto font-sans text-xs scrollbar-thin">
                    {checkoutMethod === 'upi' && (
                      <div className="space-y-2">
                        {/* Fast 1-Tap UPI Apps */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                            1-Tap UPI Apps
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={handleDirectRazorpayPay}
                              className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                            >
                              <div className="w-4 h-4 rounded-full flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                              </div>
                              <span className="text-[9.5px] font-bold text-slate-800">GPay</span>
                            </button>

                            <button
                              onClick={handleDirectRazorpayPay}
                              className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-purple-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                            >
                              <div className="w-4 h-4 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[8px] font-black">
                                पे
                              </div>
                              <span className="text-[9.5px] font-bold text-purple-800">PhonePe</span>
                            </button>

                            <button
                              onClick={handleDirectRazorpayPay}
                              className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                            >
                              <div className="w-4 h-4 rounded-full bg-[#00baf2] flex items-center justify-center text-white text-[7px] font-black">
                                P
                              </div>
                              <span className="text-[9.5px] font-bold text-[#002e6e]">Paytm</span>
                            </button>
                          </div>
                        </div>

                        {/* Dynamic QR Code Box */}
                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
                          <div className="p-1 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <QrCode className="w-11 h-11 text-slate-900" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-900">
                              <span>Scan QR via Any UPI App</span>
                            </div>
                            <p className="text-[8.5px] text-slate-500">BHIM, Cred, Amazon Pay</p>
                            <div className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[8.5px] font-mono font-bold">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Expires in {Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enter UPI ID input */}
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-600">Enter UPI ID / VPA</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              readOnly
                              value="rajeyo@okhdfcbank"
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-slate-800"
                            />
                            <button
                              onClick={handleDirectRazorpayPay}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10.5px] cursor-pointer"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutMethod === 'card' && (
                      <div className="space-y-1.5">
                        {/* Card Number */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[9px] font-bold text-slate-600">Card Number</label>
                            <div className="flex items-center gap-1">
                              <span className="text-[7.5px] font-bold px-1 rounded bg-blue-50 text-blue-700 border border-blue-200">VISA</span>
                              <span className="text-[7.5px] font-bold px-1 rounded bg-rose-50 text-rose-700 border border-rose-200">MC</span>
                            </div>
                          </div>
                          <input
                            type="text"
                            readOnly
                            value="4532  8901  2345  6789"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-slate-800"
                          />
                        </div>

                        {/* Cardholder */}
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-600">Cardholder Name</label>
                          <input
                            type="text"
                            readOnly
                            value="RAJ"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 uppercase"
                          />
                        </div>

                        {/* Expiry & CVV */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <label className="text-[9px] font-bold text-slate-600">Valid Thru</label>
                            <input
                              type="text"
                              readOnly
                              value="08 / 29"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-center text-slate-800"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[9px] font-bold text-slate-600">CVV</label>
                            <input
                              type="password"
                              readOnly
                              value="884"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono text-center text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutMethod === 'netbanking' && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                          Popular Banks
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'HDFC', name: 'HDFC Bank' },
                            { id: 'ICICI', name: 'ICICI Bank' },
                            { id: 'SBI', name: 'State Bank of India' },
                            { id: 'AXIS', name: 'Axis Bank' },
                            { id: 'KOTAK', name: 'Kotak Mahindra' },
                            { id: 'YES', name: 'Yes Bank' },
                          ].map((bank) => (
                            <button
                              key={bank.id}
                              onClick={handleDirectRazorpayPay}
                              className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-500 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all text-left"
                            >
                              <div className="w-4 h-4 rounded-md bg-blue-900 text-white font-black text-[7px] flex items-center justify-center shrink-0">
                                {bank.id.slice(0, 2)}
                              </div>
                              <span className="text-[9.5px] font-bold text-slate-800 truncate">{bank.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Razorpay Action Footer */}
                  <div className="p-2.5 bg-white border-t border-slate-200 shrink-0 space-y-1">
                    <button
                      onClick={handleDirectRazorpayPay}
                      disabled={isCheckingOut}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 cursor-pointer active:scale-98 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {isCheckingOut
                          ? 'Processing with Razorpay...'
                          : `Pay ${currentScenario.currencySymbol}${currentScenario.amount.toLocaleString('en-IN')}.00`}
                      </span>
                    </button>

                    {/* Cancel / Abandon Payment trigger */}
                    <button
                      onClick={handleCancelAndTriggerCall}
                      className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Cancel</span>
                    </button>
                    
                    <p className="text-[8px] text-slate-400 text-center">
                      🔒 Secured by Razorpay 256-bit Payment Gateway
                    </p>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 3A: INCOMING CALL (Reference Image 2)                */}
              {/* ========================================================== */}
              {currentScene === 'call_incoming' && (
                <div
                  className="flex-1 flex flex-col justify-between py-2 animate-in fade-in duration-300 text-center bg-black -mx-3 -mb-4 px-4 rounded-b-[38px] select-none text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif' }}
                >
                  {/* Caller Info Header */}
                  <div className="space-y-1 pt-3">
                    <span className="text-[11px] font-medium tracking-widest text-slate-400/90 uppercase block">
                      INCOMING CALL
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
                      Revora AI
                    </h3>
                    <p className="text-xs text-slate-300 font-normal">
                      {currentScenario.customerPhone}
                    </p>
                  </div>

                  {/* Central Glowing Luminous Siri Wave Orb matching Image 2 */}
                  <div className="flex flex-col items-center justify-center my-auto py-2">
                    <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                      {/* Luminous concentric multi-layer halo glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-cyan-400/30 blur-2xl scale-110 animate-pulse"></div>
                      <div className="absolute inset-1 rounded-full border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
                      
                      {/* SiriWave canvas perfectly rounded & blended */}
                      <div className="relative w-44 h-44 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.45)]">
                        <SiriWave
                          variant="wave"
                          size={180}
                          className="w-full h-full object-cover scale-125 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* AI Assistant Badge & Subtitle */}
                    <div className="mt-3 space-y-0.5 text-center">
                      <div className="inline-flex items-center gap-1 text-[11.5px] font-medium text-sky-400">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400/20 text-sky-400" />
                        <span>AI Recovery Assistant</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400">
                        Handling your revenue recovery, 24/7
                      </p>
                    </div>
                  </div>

                  {/* Remind Me & Message Action Buttons */}
                  <div className="flex items-center justify-around px-8 py-2">
                    <button
                      onClick={() => {
                        if (onShowBanner) onShowBanner('Reminder scheduled for 1 hour later', 'info');
                      }}
                      className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white cursor-pointer group transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/15 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all shadow-sm">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-normal text-slate-300">Remind Me</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentScene('whatsapp_chat');
                      }}
                      className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white cursor-pointer group transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/15 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all shadow-sm">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-normal text-slate-300">Message</span>
                    </button>
                  </div>

                  {/* Slide to Answer Bar matching Image 2 */}
                  <div className="pt-2 pb-3 px-2">
                    <div
                      className="relative w-full max-w-[280px] mx-auto h-15 rounded-full bg-white/10 border border-white/10 p-1 flex items-center overflow-hidden backdrop-blur-xl shadow-lg cursor-pointer"
                      onClick={handleAnswerCall}
                    >
                      {/* Shimmering slide to answer text */}
                      <div className="absolute inset-0 flex items-center justify-center pl-10 pointer-events-none">
                        <span className="text-[13px] font-medium text-slate-300 tracking-wide">
                          slide to <span className="text-white font-semibold">answer</span>
                        </span>
                      </div>

                      {/* Slide Puck */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswerCall();
                        }}
                        className="relative z-10 w-13 h-13 rounded-full bg-white text-blue-600 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Slide / Tap to Answer Call"
                      >
                        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 3B: ACTIVE VOICE CALL (Reference Image 3)           */}
              {/* ========================================================== */}
              {currentScene === 'call_active' && (
                <div
                  className="flex-1 flex flex-col justify-between py-2 animate-in fade-in duration-300 text-center bg-black -mx-3 -mb-4 px-4 rounded-b-[38px] select-none text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif' }}
                >
                  {/* Top Navigation Row matching Image 3: [<]  Revora AI  (i) */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <button
                      onClick={() => setCurrentScene('store_or_bank')}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white backdrop-blur-md cursor-pointer transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight">Revora AI</h3>
                      <p className="text-[11px] text-slate-400 font-normal">{currentScenario.customerPhone}</p>
                      <p className="text-[10.5px] text-sky-400 font-medium mt-0.5">
                        {callTimer === 0 ? 'Connecting...' : `Connected • ${formatTimer(callTimer)}`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onShowBanner) onShowBanner(`Autonomous Recovery Agent: ${currentScenario.agentName}`, 'info');
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white backdrop-blur-md cursor-pointer transition-all"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Central Glowing Luminous Orb matching Image 3 */}
                  <div className="my-auto py-1 flex flex-col items-center justify-center">
                    <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                      {/* Soundwave Concentric Halo Rings */}
                      <div className="absolute inset-0 rounded-full border border-blue-500/20 scale-125 animate-ping opacity-40 pointer-events-none"></div>
                      <div className="absolute inset-2 rounded-full border border-blue-400/40 shadow-[0_0_40px_rgba(59,130,246,0.35)]"></div>
                      
                      {/* Seamless SiriWave Canvas */}
                      <div className="relative w-40 h-40 rounded-full overflow-hidden flex items-center justify-center bg-black/40">
                        <SiriWave
                          variant={isAiSpeaking ? "wave" : "fluid-dots"}
                          size={160}
                          className="w-full h-full object-cover scale-110 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Voice Status & Animated Equalizer Dots */}
                    <div className="mt-2 space-y-1.5 text-center">
                      <p className="text-xs text-slate-300 font-medium">
                        {isAiSpeaking
                          ? 'Revora Agent is speaking...'
                          : isCustomerSpeaking
                          ? 'Customer (Raj) is speaking...'
                          : 'Revora Agent is listening...'}
                      </p>

                      {/* 7 Audio Equalizer Dots */}
                      <div className="flex items-center justify-center gap-1.5">
                        {[6, 10, 16, 22, 16, 10, 6].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              isAiSpeaking
                                ? 'bg-sky-400 animate-pulse'
                                : isCustomerSpeaking
                                ? 'bg-blue-400'
                                : 'bg-sky-500/40'
                            }`}
                            style={{
                              height: (isAiSpeaking || isCustomerSpeaking) ? `${Math.max(6, h * (isAiSpeaking ? 0.9 : 0.6))}px` : '5px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Premium Auto-Fitting Dialogue Card (No scroll required, No emojis, Clean Revora Agent Header) */}
                  <div className="mx-1 px-3.5 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15 text-left backdrop-blur-md shadow-lg transition-all duration-300">
                    {currentScenario.dialogue[currentLineIndex] ? (
                      <div className="animate-in fade-in duration-200 space-y-1">
                        <div className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 font-sans">
                          {currentScenario.dialogue[currentLineIndex].speaker === 'agent' ? 'Revora Agent' : 'Customer (Raj)'}
                        </div>
                        <p className="text-[11px] font-medium text-slate-100 leading-snug">
                          "{currentScenario.dialogue[currentLineIndex].englishText || currentScenario.dialogue[currentLineIndex].text}"
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-1">
                        <p className="text-[10.5px] font-medium text-slate-300">Revora Agent is listening...</p>
                      </div>
                    )}
                  </div>

                  {/* Call Controls: 4 circular controls matching Image 3 [Mute] [Speaker] [Keypad] [End Call] */}
                  <div className="flex items-center justify-around px-2 pt-2 pb-1">
                    {/* Mute Button */}
                    <button
                      onClick={() => setIsCallMuted(!isCallMuted)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCallMuted ? 'bg-white text-slate-900' : 'bg-white/10 group-hover:bg-white/15 text-white'
                      }`}>
                        {isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </div>
                      <span className="text-[10px] text-slate-300">Mute</span>
                    </button>

                    {/* Speaker Button */}
                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isSpeakerOn ? 'bg-white text-slate-900' : 'bg-white/10 group-hover:bg-white/15 text-white'
                      }`}>
                        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </div>
                      <span className="text-[10px] text-slate-300">Speaker</span>
                    </button>

                    {/* Keypad Button */}
                    <button
                      onClick={() => {
                        if (onShowBanner) onShowBanner('Keypad DTMF tone ready', 'info');
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/15 text-white flex items-center justify-center transition-all">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-slate-300">Keypad</span>
                    </button>

                    {/* End Call Button */}
                    <button
                      onClick={handleFinishCall}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-95 transition-all">
                        <PhoneOff className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-rose-400">End</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 4: WHATSAPP CHAT VIEW (iOS Dark Mode)               */}
              {/* ========================================================== */}
              {currentScene === 'whatsapp_chat' && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 bg-[#0B141B] -mx-3 -mb-3 rounded-b-[38px] overflow-hidden text-[#E9EDEF] relative">
                  
                  {/* Subtle WhatsApp Dark Wallpaper Doodle Pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
                    style={{
                      backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0B141B 1px)`,
                      backgroundSize: '24px 24px',
                      backgroundPosition: '0 0, 12px 12px'
                    }}
                  />

                  {/* WhatsApp iOS Header Matching Reference Screenshot */}
                  <div className="bg-[#0B141B] border-b border-[#202C33]/80 px-2.5 py-2 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-2 min-w-0">
                      <button 
                        onClick={() => setCurrentScene('store_or_bank')} 
                        className="text-[#25D366] hover:opacity-80 p-0.5 cursor-pointer -ml-1 transition-opacity flex items-center shrink-0"
                        title="Back"
                      >
                        <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
                      </button>

                      {/* Contact Profile Photo Avatar (Dynamic Nike vs HDFC) */}
                      {selectedScenarioId === 'bill_due_disconnect' ? (
                        <div className="relative w-8.5 h-8.5 rounded-full bg-[#004c8f] border border-blue-400/40 shrink-0 shadow-xs flex items-center justify-center text-white font-black text-[10px] tracking-tight">
                          <span>HDFC</span>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] rounded-full border border-[#0B141B] flex items-center justify-center">
                            <CheckCheck className="w-2 h-2 text-white" />
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-8.5 h-8.5 rounded-full bg-black border border-slate-700/80 shrink-0 shadow-xs flex items-center justify-center text-white font-extrabold text-[11px] tracking-tighter">
                          <span>NIKE</span>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] rounded-full border border-[#0B141B] flex items-center justify-center">
                            <CheckCheck className="w-2 h-2 text-white" />
                          </span>
                        </div>
                      )}

                      {/* Contact Name and Online Status */}
                      <div className="min-w-0 flex-1 pl-0.5">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-[13.5px] text-white leading-tight truncate">
                            {selectedScenarioId === 'bill_due_disconnect' ? 'HDFC Bank' : 'Nike'}
                          </h3>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8696A0] font-normal leading-tight">online</p>
                      </div>
                    </div>

                    {/* WhatsApp Top Right Action Icons */}
                    <div className="flex items-center gap-3.5 text-[#25D366] shrink-0 pr-1">
                      <Video className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                      <Phone className="w-4.5 h-4.5 cursor-pointer hover:opacity-80 transition-opacity" />
                      <MoreVertical className="w-4.5 h-4.5 cursor-pointer hover:opacity-80 transition-opacity" />
                    </div>
                  </div>

                  {/* WhatsApp Chat Body */}
                  <div className="flex-1 p-3 space-y-2.5 overflow-y-auto font-sans text-xs scrollbar-thin z-10 flex flex-col">
                    
                    {/* Date Pill: Today */}
                    <div className="text-center my-1">
                      <span className="px-3.5 py-1 rounded-lg bg-[#182229] text-[11px] font-medium text-[#8696A0] shadow-xs">
                        Today
                      </span>
                    </div>

                    {/* End-to-End Encryption Notice Matching Reference Image */}
                    <div className="p-2.5 rounded-xl bg-[#182229]/95 border border-white/5 text-[11px] text-[#FFD279] text-center leading-snug shadow-xs mx-1 my-1 flex items-center justify-center gap-1.5 font-normal">
                      <Lock className="w-3.5 h-3.5 text-[#FFD279] shrink-0" />
                      <span>
                        Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.{' '}
                        <span className="text-[#53BDEB] hover:underline cursor-pointer">Learn more</span>
                      </span>
                    </div>

                    {/* Voice Call Log Record */}
                    <div className="flex justify-end my-1">
                      <div className="p-2.5 rounded-2xl rounded-tr-xs bg-[#005C4B] text-white max-w-[85%] shadow-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                            selectedScenarioId === 'bill_due_disconnect' ? 'bg-rose-500/80' : 'bg-emerald-600'
                          }`}>
                            {selectedScenarioId === 'bill_due_disconnect' ? <PhoneOff className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="font-bold text-xs">
                              {selectedScenarioId === 'bill_due_disconnect' ? 'Call Disconnected' : 'Voice call'}
                            </p>
                            <p className="text-[10px] text-emerald-100/70">
                              {selectedScenarioId === 'bill_due_disconnect' ? '0:04 (Customer disconnected)' : formatTimer(callTimer || 32)}
                            </p>
                          </div>
                          <span className="text-[9.5px] text-emerald-200/80 ml-auto">9:42 AM</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic WhatsApp Messages */}
                    {waMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex animate-in fade-in slide-in-from-bottom-1 duration-200 ${
                          msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl shadow-xs space-y-2 max-w-[88%] ${
                            msg.sender === 'customer'
                              ? 'bg-[#005C4B] rounded-tr-xs text-white'
                              : 'bg-[#1F2C34] rounded-tl-xs text-[#E9EDEF]'
                          }`}
                        >
                          <p className="text-[13px] leading-snug">{msg.text}</p>

                          {/* Scenario 1: Interactive Payment Link Card & Google Pay Option */}
                          {msg.isLinkCard && selectedScenarioId === 'nike_cart_recovery' && (
                            <div className="space-y-2 pt-1">
                              <div
                                onClick={handleSelectGPay}
                                className="p-2.5 rounded-xl bg-[#111B21] border border-[#2A3942] hover:border-[#00A884] transition-all cursor-pointer space-y-1.5"
                              >
                                <div className="flex items-center gap-2.5">
                                  {currentScenario.productImg ? (
                                    <img
                                      src={currentScenario.productImg}
                                      alt="Product"
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-slate-700/60"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                                      <CreditCard className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs text-white truncate">{currentScenario.productName}</p>
                                    <p className="text-[11px] font-bold text-[#53BDEB] font-mono">
                                      Discounted: {currentScenario.currencySymbol}{appliedPrice.toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-1 border-t border-slate-700/60 text-[10px]">
                                  <span className="text-[#53BDEB] hover:underline font-bold font-mono truncate flex items-center gap-1">
                                    <ExternalLink className="w-3.5 h-3.5 text-[#53BDEB] shrink-0" />
                                    <span className="truncate">https://{currentScenario.paymentShortLink}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Google Pay 1-Tap Payment Option Button */}
                              <button
                                onClick={handleSelectGPay}
                                className="w-full py-2.5 px-3 rounded-xl bg-[#111B21] hover:bg-[#182229] border border-[#2A3942] hover:border-[#00A884] font-semibold text-xs text-white flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.98] transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  {/* Official Google G Logo */}
                                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                  </svg>
                                  <span className="font-bold text-white text-[11px]">Pay via Google Pay</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#53BDEB] bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 font-mono">
                                  {currentScenario.currencySymbol}{appliedPrice.toLocaleString('en-IN')} ↗
                                </span>
                              </button>
                            </div>
                          )}

                          {/* Scenario 2: Interactive Date Option Chips (Only for Bill Due) */}
                          {msg.isDateSelector && selectedScenarioId === 'bill_due_disconnect' && !selectedPtpDate && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 block">
                                Choose convenient payment date:
                              </span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { label: '5th Sep' },
                                  { label: 'This Friday' },
                                  { label: 'Next Monday' },
                                  { label: 'End of Month' },
                                ].map((d) => (
                                  <button
                                    key={d.label}
                                    onClick={() => handleSelectPtpDate(d.label)}
                                    className="p-2 rounded-xl bg-[#111B21] hover:bg-[#005C4B] border border-[#2A3942] hover:border-[#00A884] font-semibold text-[11px] text-[#E9EDEF] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                                  >
                                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    <span>{d.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Timestamp and Read Receipts */}
                          <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696A0] font-medium pt-0.5">
                            <span>{msg.time}</span>
                            {msg.sender === 'customer' && (
                              <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp Bottom Input Bar Matching Reference Screenshot */}
                  <div className="bg-[#111B21] border-t border-white/5 px-2.5 pt-2 pb-2.5 shrink-0 z-20">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-[#202C33] text-[#8696A0] hover:text-white flex items-center justify-center text-xl font-light cursor-pointer transition-colors shrink-0">
                        +
                      </button>
                      <div className="flex-1 bg-[#202C33] rounded-full px-3.5 py-2 text-[#E9EDEF] flex items-center justify-between text-[13px] shadow-2xs">
                        <span className="text-[#8696A0]">Message</span>
                        <Smile className="w-4.5 h-4.5 text-[#8696A0] hover:text-white cursor-pointer transition-colors" />
                      </div>
                      <Camera className="w-5 h-5 text-[#8696A0] hover:text-white cursor-pointer shrink-0 transition-colors" />
                      <button 
                        onClick={() => {
                          if (onShowBanner) onShowBanner('Voice recording ready', 'info');
                        }}
                        className="w-8.5 h-8.5 rounded-full bg-[#00A884] hover:bg-[#008f6f] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                      >
                        <Mic className="w-4.5 h-4.5" />
                      </button>
                    </div>
                    {/* iOS Home Indicator Bar */}
                    <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 5A: OFFICIAL RAZORPAY MERCHANT IN-PHONE WEB CHECKOUT */}
              {/* ========================================================== */}
              {currentScene === 'official_razorpay_web' && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 text-slate-900 bg-[#f8fafc] -mx-3 -mb-4 px-3 pt-1 pb-3 rounded-b-[38px] overflow-hidden">
                  
                  {/* In-Phone Browser Navigation Bar */}
                  <div className="bg-white px-2.5 py-1.5 -mx-3 -mt-1 mb-2 border-b border-slate-200 flex items-center justify-between shadow-2xs">
                    <button
                      onClick={() => setCurrentScene('whatsapp_chat')}
                      className="p-1 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full text-[9px] font-mono text-slate-600 max-w-[170px] truncate border border-slate-200">
                      <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                      <span className="truncate">rzp.io/i/{currentScenario.caseNumber.toLowerCase()}</span>
                    </div>
                    <span className="text-[8.5px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      SSL
                    </span>
                  </div>

                  {/* Razorpay Merchant Header */}
                  <div className="bg-[#0c2340] text-white p-3 rounded-2xl shadow-md space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-[#0284c7] flex items-center justify-center font-black text-[10px] text-white">
                          R
                        </div>
                        <span className="font-extrabold text-xs tracking-tight">Razorpay</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          VERIFIED
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-300">
                        {currentScenario.caseNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <div>
                        <p className="text-[9px] text-slate-300 font-medium">{currentScenario.merchantName}</p>
                        <p className="text-[10px] font-bold text-white truncate">{currentScenario.productName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8.5px] text-slate-300 block">Total Due</span>
                        <p className="text-sm font-black font-mono text-emerald-400">
                          {currentScenario.currencySymbol}{appliedPrice.toLocaleString('en-IN')}.00
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options (Compact & No-Scroll) */}
                  <div className="flex-1 py-2 space-y-2 font-sans text-xs">
                    
                    {/* 1-Tap UPI Apps */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                        Preferred UPI Apps
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={handleSelectGPay}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-blue-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                          <span className="text-[9px] font-bold text-slate-800">Google Pay</span>
                        </button>

                        <button
                          onClick={handleAuthorizePayment}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-purple-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#5f259f] flex items-center justify-center text-white text-[7.5px] font-black">
                            पे
                          </div>
                          <span className="text-[9px] font-bold text-purple-800">PhonePe</span>
                        </button>

                        <button
                          onClick={handleAuthorizePayment}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-sky-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#00b9f1] flex items-center justify-center text-white text-[7px] font-black">
                            Paytm
                          </div>
                          <span className="text-[9px] font-bold text-sky-800">Paytm</span>
                        </button>
                      </div>
                    </div>

                    {/* Saved Card / NetBanking Mock */}
                    <div className="bg-white p-2 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-[9px] text-slate-500">
                        <span className="font-bold uppercase tracking-wider">Saved Payment Option</span>
                        <span className="text-blue-600 font-semibold">Auto-detected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-4 rounded bg-blue-900 text-white text-[7px] font-black flex items-center justify-center">
                            VISA
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-800 leading-tight">HDFC Bank Debit Card</p>
                            <p className="text-[8.5px] text-slate-400 font-mono">•••• 9012 • 08/29</p>
                          </div>
                        </div>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Dual Action Buttons: Pay & Razorpay */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleAuthorizePayment}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pay {currentScenario.currencySymbol}{appliedPrice.toLocaleString('en-IN')}</span>
                      </button>

                      <button
                        onClick={handleAuthorizePayment}
                        className="py-2.5 px-3 rounded-xl bg-[#0c2340] hover:bg-[#13335a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <div className="w-3.5 h-3.5 rounded bg-[#0284c7] flex items-center justify-center font-black text-[7.5px] text-white">
                          R
                        </div>
                        <span>Razorpay</span>
                      </button>
                    </div>

                    <p className="text-[8px] text-slate-400 text-center font-medium">
                      🔒 Secured by Razorpay 256-Bit SSL Payment Engine
                    </p>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 5B: EXACT GOOGLE PAY PIN SCREEN (Matching image.png)*/}
              {/* ========================================================== */}
              {currentScene === 'gpay' && (
                <div 
                  className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 text-slate-900 bg-white -mx-3 -mb-4 px-4 pt-1 pb-4 rounded-b-[38px]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif' }}
                >
                  
                  {/* Top Bar with ✕ on Left and Help on Right */}
                  <div>
                    <div className="flex items-center justify-between pt-1 pb-2">
                      <button 
                        onClick={() => setCurrentScene('whatsapp_chat')}
                        className="text-slate-900 hover:text-slate-600 cursor-pointer p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button className="text-[#1a73e8] font-semibold text-xs cursor-pointer hover:underline">
                        Help
                      </button>
                    </div>

                    {/* Google Pay Official Logo */}
                    <div className="flex items-center justify-center gap-1.5 pt-4 pb-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span className="text-xl font-bold text-slate-700 tracking-tight">Pay</span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="text-center space-y-1.5 px-2">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Enter your PIN
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                        Enter the 6-digit PIN used to access your Google Pay account
                      </p>
                    </div>

                    {/* 6 Circular Outline Indicators */}
                    <div className="flex items-center justify-center gap-3.5 my-5">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                            idx < pin.length
                              ? 'bg-slate-900 border-2 border-slate-900 scale-110'
                              : 'border-2 border-slate-400 bg-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Forgot PIN Link */}
                    <div className="text-center">
                      <button className="text-xs font-semibold text-[#1a73e8] hover:underline cursor-pointer">
                        Forgot PIN?
                      </button>
                    </div>
                  </div>

                  {/* Native iOS Style Numeric Keypad */}
                  <div className="pb-1">
                    <div className="grid grid-cols-3 gap-2 px-1">
                      {[
                        { num: '1', sub: '' },
                        { num: '2', sub: 'ABC' },
                        { num: '3', sub: 'DEF' },
                        { num: '4', sub: 'GHI' },
                        { num: '5', sub: 'JKL' },
                        { num: '6', sub: 'MNO' },
                        { num: '7', sub: 'PQRS' },
                        { num: '8', sub: 'TUV' },
                        { num: '9', sub: 'WXYZ' },
                        { num: '', sub: '' },
                        { num: '0', sub: '' },
                        { num: 'back', sub: '' },
                      ].map((item, i) => {
                        if (item.num === '') {
                          return <div key={i} className="h-11"></div>;
                        }
                        if (item.num === 'back') {
                          return (
                            <button
                              key={i}
                              onClick={() => handleKeypadPress('back')}
                              className="h-11 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                            >
                              <div className="w-7 h-6 border-2 border-slate-700 rounded-sm relative flex items-center justify-center text-xs font-bold">
                                ✕
                              </div>
                            </button>
                          );
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => handleKeypadPress(item.num)}
                            className="h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
                          >
                            <span className="text-base font-bold text-slate-900 leading-none">
                              {item.num}
                            </span>
                            {item.sub && (
                              <span className="text-[7.5px] font-bold text-slate-500 tracking-wider mt-0.5 leading-none">
                                {item.sub}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* SCREEN 6: CLEAN FULL PHONE SCREEN WITH DOTLOTTIE TICK      */}
              {/* ========================================================== */}
              {currentScene === 'success' && (
                <div className="flex-1 flex flex-col justify-between py-6 text-center animate-in fade-in duration-300 text-slate-900 bg-white -mx-3 -mb-4 px-4 rounded-b-[38px]">
                  
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                    {/* Full Screen Centered DotLottie Animated Checkmark */}
                    <div className="w-36 h-36 mx-auto">
                      <DotLottieReact
                        src="https://lottie.host/3a9e8ced-2201-45df-96c4-098e7f7ceddd/23Nl1Ss2r2.lottie"
                        loop
                        autoplay
                      />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Payment Successful
                    </h3>

                    {/* Exact Recovered Amount */}
                    <p className="text-3xl font-black font-mono text-emerald-600">
                      {currentScenario.currencySymbol}{appliedPrice.toLocaleString('en-IN')}.00
                    </p>

                    <p className="text-xs font-semibold text-slate-600">
                      Paid to <b className="text-slate-900">{currentScenario.merchantName}</b>
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Razorpay Captured • 100% Recovered</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Live Terminal Log Console (7 Cols, Optimized Sizing)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col h-[660px]">
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <h2 className={`text-xs font-bold tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Autonomous Telemetry &amp; Execution Logs
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className={`p-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLog ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleClearLogs}
                className={`p-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="flex-1 rounded-2xl bg-[#0a0d14] border border-[#1c2536] shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            
            {/* Titlebar */}
            <div className="px-4 py-2.5 bg-[#0f1522] border-b border-[#1c2536] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-2 text-slate-400 text-[11px]">revora-ai • telemetry.log</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE TELEMETRY</span>
              </div>
            </div>

            {/* Terminal Logs Container (Scrolls independently without page scrolling) */}
            <div 
              ref={terminalLogsContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-2.5 text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
            >
              {terminalLogs.map((item) => (
                <div key={item.id} className="flex items-start gap-2 animate-in fade-in duration-200">
                  <span className="text-slate-500 select-none">[{item.time}]</span>
                  <span
                    className={`font-bold uppercase px-1.5 py-0.2 rounded text-[10px] shrink-0 ${
                      item.tagType === 'ok'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.tagType === 'warn'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : item.tagType === 'err'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span
                    className="flex-1 text-slate-200 font-sans text-xs"
                    dangerouslySetInnerHTML={{ __html: item.msg }}
                  />
                </div>
              ))}
              
              {/* Blinking Cursor */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
                <span className="text-emerald-400 font-bold">$</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block"></span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Official Razorpay Merchant Checkout Modal */}
      {isRazorpayModalOpen && checkoutCaseData && (
        <RazorpayCheckoutModal
          caseData={checkoutCaseData}
          onClose={handleCloseRazorpayWithoutPaying}
          onPaymentSuccess={handleRazorpayPaymentSuccess}
        />
      )}
    </div>
  );
};

export default AgentStudioView;
