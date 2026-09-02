"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  CreditCard,
  Radio,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  Sparkles,
  PhoneCall,
  Activity,
  ChevronRight,
  ChevronLeft,
  Database,
  ChevronDown,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  LayoutDashboard,
  Layers,
  FileCheck2,
  Settings as SettingsIcon,
  Search,
  ExternalLink,
  Bot,
  Bell,
  UserCheck,
} from 'lucide-react';
import { RecoveryLineSection } from './RecoveryLineSection';
import { RecoveryRailSection } from './RecoveryRailSection';
import { HeroRevenueCard } from './HeroRevenueCard';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { RevoraLogo } from './RevoraLogo';
import { TextAnimate } from '@/registry/magicui/text-animate';

interface LandingViewProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onEnterWorkspaceDirectly?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenAuth,
  onEnterWorkspaceDirectly,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Interactive Product Mockup Tab State with Directional Transitions
  const [mockupTab, setMockupTab] = useState<'queue' | 'diagnostics' | 'compliance'>('queue');
  const [mockupDirection, setMockupDirection] = useState<number>(1);
  const [mockupSimulatedCaseSettled, setMockupSimulatedCaseSettled] = useState(false);
  const [mockupCase2Settled, setMockupCase2Settled] = useState(false);

  const MOCKUP_TABS: Array<'queue' | 'diagnostics' | 'compliance'> = ['queue', 'diagnostics', 'compliance'];

  const handleSelectMockupTab = (nextTab: 'queue' | 'diagnostics' | 'compliance') => {
    if (nextTab === mockupTab) return;
    const currentIndex = MOCKUP_TABS.indexOf(mockupTab);
    const nextIndex = MOCKUP_TABS.indexOf(nextTab);
    setMockupDirection(nextIndex >= currentIndex ? 1 : -1);
    setMockupTab(nextTab);
  };

  const handleNextMockupTab = () => {
    const currentIndex = MOCKUP_TABS.indexOf(mockupTab);
    const nextIndex = (currentIndex + 1) % MOCKUP_TABS.length;
    setMockupDirection(1);
    setMockupTab(MOCKUP_TABS[nextIndex]);
  };

  const handlePrevMockupTab = () => {
    const currentIndex = MOCKUP_TABS.indexOf(mockupTab);
    const prevIndex = (currentIndex - 1 + MOCKUP_TABS.length) % MOCKUP_TABS.length;
    setMockupDirection(-1);
    setMockupTab(MOCKUP_TABS[prevIndex]);
  };

  // Live animated counter for Revenue Recovered in mockup
  const [displayedRecovered, setDisplayedRecovered] = useState(845200);
  const [floatingPill, setFloatingPill] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    const target = 845200 + (mockupSimulatedCaseSettled ? 18500 : 0) + (mockupCase2Settled ? 9400 : 0);
    if (displayedRecovered === target) return;

    const diff = target - displayedRecovered;
    const step = diff > 0 ? Math.max(250, Math.ceil(diff / 6)) : Math.min(-250, Math.floor(diff / 6));

    const timer = setTimeout(() => {
      if (Math.abs(target - displayedRecovered) <= Math.abs(step)) {
        setDisplayedRecovered(target);
      } else {
        setDisplayedRecovered(prev => prev + step);
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [displayedRecovered, mockupSimulatedCaseSettled, mockupCase2Settled]);

  // ROI Calculator State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(2500000); // 25 Lakhs
  const [failureRate, setFailureRate] = useState<number>(14); // 14%
  const [recoveryEfficiency, setRecoveryEfficiency] = useState<number>(72); // 72%

  // Calculated ROI figures
  const revenueAtRisk = (monthlyVolume * failureRate) / 100;
  const estimatedRecovered = (revenueAtRisk * recoveryEfficiency) / 100;
  const annualRecovered = estimatedRecovered * 12;

  // Active section scroll spy tracking for navbar
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const sectionIds = ['workflow', 'preview', 'use-cases', 'compliance', 'roi-calculator'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // Offset for navbar
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const useCases = [
    {
      id: 'failed-payments',
      title: 'Payment Failures & Switch Outages',
      badge: 'Bank 504 & 3DS Drops',
      icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
      description:
        'When customer bank servers timeout or 3D-Secure OTP verification drops off, Revora waits for issuer recovery and dispatches an instant 1-click UPI intent link.',
      stats: '68.4% Recovery Rate',
      features: ['Bank Switch Outage Detection', 'Smart UPI Intent Routing', 'Zero Re-entry of Card Info'],
    },
    {
      id: 'checkout-abandonment',
      title: 'Checkout & Cart Abandonment',
      badge: 'Frictionless Razorpay Links',
      icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
      description:
        'Recovers customers who exited payment modals before completing payment by delivering personalized dynamic payment links with order metadata.',
      stats: '4.2x Faster Recovery',
      features: ['Instant Dynamic Razorpay URLs', 'WhatsApp Interactive Pay Buttons', 'Personalized Discount Locks'],
    },
    {
      id: 'failed-subscriptions',
      title: 'Failed Subscriptions & Recurring e-Mandates',
      badge: 'Auto-Debit Retries',
      icon: <Calendar className="w-6 h-6 text-indigo-400" />,
      description:
        'Synchronizes failed recurring debits with customer salary cycles and sends proactive payment update reminders before subscription freeze.',
      stats: '82% Churn Reduction',
      features: ['Salary-Day Aligned Retries', 'Grace Period Auto-Hold', 'Card Expiry Pre-Nudge'],
    },
    {
      id: 'overdue-receivables',
      title: 'Overdue Invoices & B2B Receivables',
      badge: 'Hinglish Voice AI & P2P',
      icon: <PhoneCall className="w-6 h-6 text-emerald-400" />,
      description:
        'Conversational Hinglish AI Voice Bot negotiates Promise-to-Pay (P2P) dates, auto-pauses alerts during grace periods, and respects strict RBI quiet hours.',
      stats: '99.4% Dispute Resolution',
      features: ['Hinglish Natural Voice Agent', 'Promise-to-Pay (P2P) Calendar Pause', 'Strict RBI Anti-Spam Compliance'],
    },
  ];

  const faqs = [
    {
      q: 'How does Revora connect to our existing Razorpay account?',
      a: 'Revora connects directly using Razorpay Key ID, Key Secret, and Webhook Secret configured securely server-side. Once connected, Revora listens to payment.failed, order.paid, and invoice.expired events to initiate autonomous recovery in real-time.',
    },
    {
      q: 'How does Revora comply with RBI Fair Practices & Anti-Harassment rules?',
      a: 'Revora enforces hard mathematical stopping rules: maximum 3 contact attempts per case, strict quiet hours cooling windows (8:00 PM to 8:00 AM IST), mandatory 24-48h cooldowns between contacts, and instant dunning freeze upon Promise-to-Pay (P2P) or customer dispute.',
    },
    {
      q: 'What is the difference between Automated and Human Approval modes?',
      a: 'You can configure safety thresholds. Standard low-risk failed transactions execute autonomous 1-click recovery instantly. High-value enterprise receivables or sensitive accounts can require manager one-click approval before any outbound message or call is made.',
    },
    {
      q: 'Is customer payment data secure?',
      a: 'Yes. Revora never stores raw credit card details or bank credentials. All payment operations utilize official Razorpay Payment Links and Checkout SDKs with PCI-DSS Level 1 compliance and HMAC-SHA256 webhook cryptographic verification.',
    },
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-[#635bff] selection:text-white relative overflow-x-hidden ${
      isDark ? 'bg-[#05070E] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Ambient Glows & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isDark && (
          <>
            <div className="bg-ambient w-[600px] h-[600px] bg-[#635bff]/20 top-[-200px] left-[-200px]" />
            <div className="bg-ambient w-[800px] h-[800px] bg-[#22d3ee]/15 top-[20%] right-[-300px]" />
            <div className="bg-ambient w-[650px] h-[650px] bg-[#10b981]/12 bottom-[-200px] left-[30%]" />
            <div className="absolute inset-0 fintech-grid-bg opacity-25" />
          </>
        )}
        {!isDark && (
          <div className="absolute inset-0 fintech-grid-bg-light opacity-30" />
        )}
      </div>

      {/* FIXED SMOOTHUI GLASS NAVBAR */}
      <header className="fixed top-2 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-1rem)] sm:max-w-6xl transition-all duration-500">
        <div
          id="header-container"
          className={`flex items-center justify-between rounded-full border px-3 sm:px-5 py-1.5 sm:py-2.5 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${
            isDark
              ? 'bg-[#080d19]/90 border-white/10 shadow-black/70'
              : 'bg-white/95 border-slate-200 shadow-slate-200/80'
          }`}
        >
          {/* Logo & Brand (Clicks scroll to top) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity bg-transparent border-0 p-0 text-left shrink-0"
            title="Revora AI - Return to Top"
          >
            <RevoraLogo size="xs" interactive />
            <div className="flex items-center gap-1 font-sans">
              <span className={`text-sm sm:text-base lg:text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-500 transition-colors`}>
                Revora
              </span>
              <span className="text-sm sm:text-base lg:text-lg font-extrabold tracking-tight text-cyan-400">
                AI
              </span>
            </div>
          </button>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm tracking-wide">
            <a
              href="#workflow"
              className={`transition-colors duration-200 py-1 font-medium ${
                activeSection === 'workflow'
                  ? isDark
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-600 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workflow
            </a>
            <a
              href="#preview"
              className={`transition-colors duration-200 py-1 font-medium ${
                activeSection === 'preview'
                  ? isDark
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-600 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Product Preview
            </a>
            <a
              href="#use-cases"
              className={`transition-colors duration-200 py-1 font-medium ${
                activeSection === 'use-cases'
                  ? isDark
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-600 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Use Cases
            </a>
            <a
              href="#compliance"
              className={`transition-colors duration-200 py-1 font-medium ${
                activeSection === 'compliance'
                  ? isDark
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-600 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RBI Rules
            </a>
            <a
              href="#roi-calculator"
              className={`transition-colors duration-200 py-1 font-medium ${
                activeSection === 'roi-calculator'
                  ? isDark
                    ? 'text-emerald-400 font-semibold'
                    : 'text-emerald-600 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ROI Calculator
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle size="sm" className="shrink-0" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => onOpenAuth('signin')}
              className={`hidden sm:inline-flex text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isDark ? 'text-slate-200 hover:text-white hover:bg-white/5' : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => onOpenAuth('signup')}
              className="btn-premium py-1.5 px-3 sm:px-4.5 shadow-md text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
            >
              <div className="points_wrapper">
                <i className="point" /><i className="point" /><i className="point" /><i className="point" /><i className="point" />
              </div>
              <span className="btn-premium-inner text-xs sm:text-sm font-bold text-white flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#22d3ee] transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* MAIN HERO & SECTIONS */}
      <main className="relative z-10 pt-20 sm:pt-28 lg:pt-32 space-y-14 sm:space-y-20 lg:space-y-24 pb-16 sm:pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
            
            {/* LEFT COLUMN: Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl xs:text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold tracking-tight font-metric leading-[1.15] sm:leading-[1.1]"
              >
                Turn Revenue at Risk into <br className="hidden sm:block" />
                <span className={`font-editorial italic font-normal tracking-tight text-[1.15em] block sm:inline mt-1 sm:mt-0 ${
                  isDark
                    ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.45)]'
                    : 'text-emerald-600'
                }`}>
                  <TextAnimate animation="slideUp" by="word" delay={0.25} duration={0.65} className="font-editorial italic font-normal tracking-tight">
                    Revenue Recovered...
                  </TextAnimate>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`mt-3.5 sm:mt-5 max-w-xl text-xs sm:text-base lg:text-lg leading-relaxed font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Autonomous recovery engine that intercepts failed payments, classifies root causes via deep neural telemetry, and converts drop-offs into settled capital through 1-click Razorpay payment rails.
              </motion.p>

              {/* Primary Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-md sm:max-w-none sm:w-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => onOpenAuth('signup')}
                  className="btn-premium w-full sm:w-auto py-3 px-6 sm:px-7 text-xs sm:text-sm font-bold shadow-lg cursor-pointer"
                >
                  <div className="points_wrapper">
                    <i className="point" /><i className="point" /><i className="point" /><i className="point" /><i className="point" />
                  </div>
                  <span className="btn-premium-inner text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5 text-[#22d3ee] transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => onOpenAuth('signin')}
                  className={`group relative inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                    isDark
                      ? 'border-white/15 text-slate-200 hover:text-white hover:bg-white/5'
                      : 'border-slate-300 text-slate-800 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#22d3ee]" />
                    Sign In to Account
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Revenue Recovered Card (Adapted Uiverse component) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <HeroRevenueCard isDark={isDark} />
            </div>

          </div>
        </section>

        {/* THE RECOVERY LINE SECTION (Autonomous Continuous Flow) */}
        <RecoveryLineSection />

        {/* AUTONOMOUS RECOVERY RAIL WORKFLOW (1-2-3-4 Scroll Pipeline) */}
        <RecoveryRailSection />

        {/* REALISTIC PRODUCT PREVIEW / MOCKUP SHOWCASE */}
        <section id="preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 -top-8 mx-auto h-72 max-w-5xl rounded-[36px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/25 to-teal-500/20 blur-3xl pointer-events-none" />

            {/* Radiant Border Light Aura (Light radiating outward from borders) */}
            <div className="absolute -inset-1 sm:-inset-1.5 rounded-[32px] sm:rounded-[36px] bg-gradient-to-r from-emerald-500/50 via-teal-400/40 to-cyan-500/50 blur-xl opacity-75 animate-pulse pointer-events-none" />
            <div className="absolute -inset-[1px] sm:-inset-[2px] rounded-[30px] sm:rounded-[34px] bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 opacity-60 blur-[3px] pointer-events-none" />

            <div className="rounded-3xl sm:rounded-[28px] overflow-hidden relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.3),0_0_100px_rgba(6,182,212,0.18)] ring-1 ring-emerald-400/50 border border-emerald-400/40 bg-[#070b14]/95 backdrop-blur-2xl">
              
              {/* Product Window Header Bar */}
              <div className="flex items-center justify-between border-b border-emerald-500/30 px-5 py-3.5 bg-gradient-to-r from-emerald-950/40 via-[#080d19]/95 to-cyan-950/30 backdrop-blur-md shadow-[0_2px_15px_rgba(16,185,129,0.06)]">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    <span className="text-slate-500">app.revora.ai</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-300 font-semibold">dashboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Daemon Live</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>RBI Guard Active</span>
                  </div>
                </div>
              </div>

              {/* Product Workspace Mockup Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] bg-gradient-to-br from-[#0a0f1d] via-[#080d19] to-[#050811]">
                
                {/* Left Navigation Rail Preview */}
                <div className="hidden lg:flex lg:col-span-3 border-r border-emerald-500/20 p-5 flex-col justify-between bg-black/40">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                          INTERACTIVE WORKSPACE
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handlePrevMockupTab}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Previous View"
                            aria-label="Previous View"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleNextMockupTab}
                            className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Next View"
                            aria-label="Next View"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleSelectMockupTab('queue')}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer relative group ${
                            mockupTab === 'queue'
                              ? 'bg-emerald-500/20 text-white border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <LayoutDashboard className={`w-4 h-4 transition-colors ${mockupTab === 'queue' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            <span>Executive Queue</span>
                          </span>
                          {mockupTab === 'queue' ? (
                            <motion.span
                              layoutId="mockupActiveDot"
                              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400">01</span>
                          )}
                        </button>

                        <button
                          onClick={() => handleSelectMockupTab('diagnostics')}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer relative group ${
                            mockupTab === 'diagnostics'
                              ? 'bg-emerald-500/20 text-white border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Bot className={`w-4 h-4 transition-colors ${mockupTab === 'diagnostics' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                            <span>AI Root-Cause</span>
                          </span>
                          {mockupTab === 'diagnostics' ? (
                            <motion.span
                              layoutId="mockupActiveDot"
                              className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400">02</span>
                          )}
                        </button>

                        <button
                          onClick={() => handleSelectMockupTab('compliance')}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer relative group ${
                            mockupTab === 'compliance'
                              ? 'bg-emerald-500/20 text-white border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <ShieldCheck className={`w-4 h-4 transition-colors ${mockupTab === 'compliance' ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            <span>RBI Safeguards</span>
                          </span>
                          {mockupTab === 'compliance' ? (
                            <motion.span
                              layoutId="mockupActiveDot"
                              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                            />
                          ) : (
                            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400">03</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-3">
                        CONNECTED RAILS
                      </div>
                      <div className="space-y-2 text-xs font-mono text-slate-300">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-[#22d3ee]" />
                            <span>Razorpay Gateway</span>
                          </span>
                          <span className="text-emerald-400 font-bold">Synced</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="flex items-center gap-2">
                            <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Voice & WhatsApp</span>
                          </span>
                          <span className="text-emerald-400 font-bold">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-xs">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Interactive Live Demo</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Tap "Simulate 1-Click Pay" below to see real-time revenue recovery in action.
                    </p>
                  </div>
                </div>

                {/* Main Interactive Screen Content */}
                <div className="lg:col-span-9 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
                  
                  {/* Mobile Screen Tab Switcher */}
                  <div className="flex lg:hidden items-center justify-between gap-1.5 p-1.5 rounded-xl bg-black/40 border border-emerald-500/20">
                    <button
                      onClick={handlePrevMockupTab}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Previous Option"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 justify-center">
                      <button
                        onClick={() => handleSelectMockupTab('queue')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                          mockupTab === 'queue' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Recovery Queue
                      </button>
                      <button
                        onClick={() => handleSelectMockupTab('diagnostics')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                          mockupTab === 'diagnostics' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        AI Root-Cause
                      </button>
                      <button
                        onClick={() => handleSelectMockupTab('compliance')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                          mockupTab === 'compliance' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        RBI Safeguards
                      </button>
                    </div>

                    <button
                      onClick={handleNextMockupTab}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      aria-label="Next Option"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Top 3 Metric Highlight Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-rose-500/20 bg-rose-500/[0.02] backdrop-blur-md">
                      <div className="text-[11px] sm:text-xs font-mono font-semibold text-slate-400 uppercase">Revenue at Risk</div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-metric text-rose-400 mt-1">
                        ₹{(184500 - (mockupSimulatedCaseSettled ? 18500 : 0) - (mockupCase2Settled ? 9400 : 0)).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-slate-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{18 - (mockupSimulatedCaseSettled ? 1 : 0) - (mockupCase2Settled ? 1 : 0)} Invoices at Risk</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/[0.08] backdrop-blur-md relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.12)]">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] sm:text-xs font-mono font-semibold text-emerald-300 uppercase">Revenue Recovered</div>
                        <AnimatePresence>
                          {floatingPill && (
                            <motion.span
                              key={floatingPill.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.5 }}
                              className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{floatingPill.text}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="text-2xl sm:text-3xl font-extrabold font-metric text-emerald-400 mt-1.5 flex flex-wrap items-baseline gap-2">
                        <span>₹{displayedRecovered.toLocaleString('en-IN')}</span>
                        {(mockupSimulatedCaseSettled || mockupCase2Settled) && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/40 shadow-sm"
                          >
                            +₹{((mockupSimulatedCaseSettled ? 18500 : 0) + (mockupCase2Settled ? 9400 : 0)).toLocaleString('en-IN')}
                          </motion.span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-emerald-300 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>+₹{((mockupSimulatedCaseSettled ? 18500 : 0) + (mockupCase2Settled ? 9400 : 0) + 18500).toLocaleString('en-IN')} today</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 bg-cyan-500/[0.02] backdrop-blur-md">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono font-semibold text-slate-400 uppercase">
                        <span>Win Rate</span>
                        <span className="text-[#22d3ee] font-bold">
                          {(78.4 + (mockupSimulatedCaseSettled ? 2.1 : 0) + (mockupCase2Settled ? 1.4 : 0)).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-metric text-white mt-1">
                        {(78.4 + (mockupSimulatedCaseSettled ? 2.1 : 0) + (mockupCase2Settled ? 1.4 : 0)).toFixed(1)}%
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-[#22d3ee] h-full rounded-full transition-all duration-500"
                          style={{ width: `${78.4 + (mockupSimulatedCaseSettled ? 2.1 : 0) + (mockupCase2Settled ? 1.4 : 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Step Navigator Toolbar with Smooth Next / Previous Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        View {MOCKUP_TABS.indexOf(mockupTab) + 1} of 3
                      </span>
                      <span className="text-slate-200 font-semibold hidden sm:inline">
                        {mockupTab === 'queue' ? 'Executive Recovery Queue' : mockupTab === 'diagnostics' ? 'Autonomous AI Failure Diagnostic' : 'RBI Anti-Harassment Safeguards'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevMockupTab}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                        title="Previous Option"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={handleNextMockupTab}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/50 text-emerald-300 hover:text-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 shadow-sm shadow-emerald-950"
                        title="Next Option"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Mockup View Based on Selected Tab with Smooth Directional Slide */}
                  <AnimatePresence mode="wait" custom={mockupDirection}>
                    <motion.div
                      key={mockupTab}
                      custom={mockupDirection}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? 32 : -32,
                          opacity: 0,
                          filter: 'blur(3px)',
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          filter: 'blur(0px)',
                          transition: {
                            duration: 0.32,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                        exit: (dir: number) => ({
                          x: dir > 0 ? -32 : 32,
                          opacity: 0,
                          filter: 'blur(3px)',
                          transition: {
                            duration: 0.22,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full"
                    >
                      {mockupTab === 'queue' && (
                        <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span>Active Recovery Queue</span>
                        </div>
                        <span className="text-[11px] sm:text-xs font-mono text-emerald-400/80 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Razorpay Ingestion Feed
                        </span>
                      </div>

                      <div className="space-y-2.5 sm:space-y-3">
                        {/* Case 1: Interactive Simulation Target */}
                        <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                          mockupSimulatedCaseSettled
                            ? 'bg-gradient-to-r from-emerald-950/40 via-[#0a1813] to-[#080d19] border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                            : 'bg-gradient-to-r from-emerald-500/[0.04] via-white/[0.02] to-cyan-500/[0.03] border-emerald-500/35 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-start sm:items-center gap-3 min-w-0">
                              <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 transition-colors ${
                                mockupSimulatedCaseSettled
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                              }`}>
                                {mockupSimulatedCaseSettled ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="font-bold text-sm sm:text-base text-white">
                                    Deepak Sharma
                                  </span>
                                  <span className="text-xs font-mono text-slate-400 font-normal">(CASE-4821)</span>
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono text-slate-400 mt-0.5">
                                  Root Cause: <span className="text-[#a5b4fc]">UPI 504 Bank Switch Timeout</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                              <div className="text-left sm:text-right">
                                <div className={`font-extrabold font-metric text-sm sm:text-base transition-colors ${
                                  mockupSimulatedCaseSettled ? 'text-emerald-400' : 'text-white'
                                }`}>
                                  {mockupSimulatedCaseSettled ? '+₹18,500' : '₹18,500'}
                                </div>
                                <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                                  {mockupSimulatedCaseSettled ? 'Settled via Webhook' : 'Attempt 1 / 3'}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const next = !mockupSimulatedCaseSettled;
                                  setMockupSimulatedCaseSettled(next);
                                  if (next) {
                                    setFloatingPill({ id: Date.now(), text: '+₹18,500 Recovered' });
                                  }
                                }}
                                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ${
                                  mockupSimulatedCaseSettled
                                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black hover:from-emerald-400 hover:to-teal-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                }`}
                              >
                                {mockupSimulatedCaseSettled ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Settled via Webhook</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                                    <span>Simulate 1-Click Pay</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Instant Animated Text When 1-Click Pay Tapped */}
                          <AnimatePresence>
                            {mockupSimulatedCaseSettled && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -6 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -6 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="mt-3.5 pt-3.5 border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-2.5 bg-emerald-500/10 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl border-x-0 border-b-0"
                              >
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 min-w-0">
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 animate-bounce" />
                                  <span className="truncate">Payment Successful! +₹18,500 Recovered via Webhook</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                                    Settled #INV-4821
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-300">Zero Churn</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Case 2: Interactive Simulation Target */}
                        <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                          mockupCase2Settled
                            ? 'bg-gradient-to-r from-cyan-950/40 via-[#0a151b] to-[#080d19] border-cyan-500/70 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                            : 'bg-gradient-to-r from-cyan-500/[0.04] via-white/[0.02] to-emerald-500/[0.03] border-cyan-500/35 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-start sm:items-center gap-3 min-w-0">
                              <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 transition-colors ${
                                mockupCase2Settled
                                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                  : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'
                              }`}>
                                {mockupCase2Settled ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="font-bold text-sm sm:text-base text-white">
                                    Anjali Roy
                                  </span>
                                  <span className="text-xs font-mono text-slate-400 font-normal">(CASE-4822)</span>
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono text-slate-400 mt-0.5">
                                  Root Cause: <span className="text-cyan-300">3DS OTP Drop-off • P2P Grace Hold</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                              <div className="text-left sm:text-right">
                                <div className={`font-extrabold font-metric text-sm sm:text-base transition-colors ${
                                  mockupCase2Settled ? 'text-cyan-400' : 'text-white'
                                }`}>
                                  {mockupCase2Settled ? '+₹9,400' : '₹9,400'}
                                </div>
                                <div className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold">
                                  {mockupCase2Settled ? 'Settled via Webhook' : 'Paused till 1st'}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const next = !mockupCase2Settled;
                                  setMockupCase2Settled(next);
                                  if (next) {
                                    setFloatingPill({ id: Date.now(), text: '+₹9,400 Recovered' });
                                  }
                                }}
                                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 ${
                                  mockupCase2Settled
                                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                                }`}
                              >
                                {mockupCase2Settled ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Settled via Webhook</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
                                    <span>Simulate 1-Click Pay</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Instant Animated Text When 1-Click Pay Tapped */}
                          <AnimatePresence>
                            {mockupCase2Settled && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -6 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -6 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="mt-3.5 pt-3.5 border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-2.5 bg-cyan-500/10 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl border-x-0 border-b-0"
                              >
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 min-w-0">
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 animate-bounce" />
                                  <span className="truncate">Payment Successful! +₹9,400 Recovered via Instant UPI Smart Link</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                                    Settled #INV-4822
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-300">Grace Honored</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {mockupTab === 'diagnostics' && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3 sm:space-y-4 font-mono text-xs overflow-x-auto">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-[#a5b4fc] font-bold text-xs sm:text-sm">Neural AI Diagnostic Matrix</span>
                        <span className="text-emerald-400 text-[11px] sm:text-xs font-bold">● 96% Recovery Propensity</span>
                      </div>
                      <div className="space-y-2 text-slate-300 text-xs">
                        <p><span className="text-slate-400">Input Signature:</span> Bank Switch Error Code NPCI_U30 (Issuer Unavailable)</p>
                        <p><span className="text-slate-400">AI Diagnosis:</span> Temporary Gateway Degradation on HDFC UPI node. Intent to purchase is HIGH.</p>
                        <p><span className="text-slate-400">Autonomous Action:</span> Generated 1-Click Multi-Bank Razorpay Smart Link with PhonePe / GPay deep-link.</p>
                        <p><span className="text-slate-400">Dispatch Channel:</span> Interactive WhatsApp Pay Button + Auto-Retry Window: 18 min.</p>
                      </div>
                    </div>
                  )}

                  {mockupTab === 'compliance' && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-black/40 border border-emerald-500/30 bg-emerald-500/5 space-y-3 sm:space-y-4 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-emerald-300 font-bold text-xs sm:text-sm">RBI Compliance Guardrails Enforced</span>
                        <span className="text-cyan-400 text-[11px] sm:text-xs font-bold">SHA-256 Audit Chain</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-slate-300">
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                          <div className="text-slate-400 text-[11px]">Max Attempts</div>
                          <div className="text-white font-bold text-sm mt-0.5">3 Attempts Hard Stop</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                          <div className="text-slate-400 text-[11px]">Quiet Hours Window</div>
                          <div className="text-white font-bold text-sm mt-0.5">8:00 PM – 8:00 AM IST</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                          <div className="text-slate-400 text-[11px]">P2P Grace Pause</div>
                          <div className="text-white font-bold text-sm mt-0.5">100% Automated Hold</div>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                          <div className="text-slate-400 text-[11px]">Dispute Suppression</div>
                          <div className="text-white font-bold text-sm mt-0.5">Instant Permanent Halt</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-white/[0.08]">
                    <div className="text-[11px] sm:text-xs text-slate-400 font-mono text-center sm:text-left">
                      Integrated with official Razorpay API & Webhooks
                    </div>
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-[#635bff] hover:bg-[#5349eb] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                    >
                      <span>Connect Your Razorpay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        </section>

        {/* USE CASES SECTION */}
        <section id="use-cases" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1 text-xs font-semibold font-sans uppercase tracking-wider text-[#22d3ee]">
              Failure Modes
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-metric">
              Engineered for Every Drop-Off Scenario
            </h2>
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Targeted recovery rails designed specifically for Indian UPI timeouts, 3DS drops, recurring e-mandates, and overdue invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((uc) => (
              <motion.div
                key={uc.id}
                whileHover={{ y: -4 }}
                className={`p-8 rounded-3xl border transition-all space-y-6 shadow-xl ${
                  isDark
                    ? 'bg-white/[0.02] border-white/10 hover:border-[#635bff]/40'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-slate-200/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10">{uc.icon}</div>
                  <span className="text-xs font-sans font-bold px-3.5 py-1 rounded-full bg-[#635bff]/20 text-[#a5b4fc] border border-[#635bff]/30">
                    {uc.badge}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className={`text-2xl font-bold font-metric ${isDark ? 'text-white' : 'text-slate-900'}`}>{uc.title}</h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{uc.description}</p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  {uc.features.map((feat, idx) => (
                    <div key={idx} className={`flex items-center gap-2.5 text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-sm font-sans text-emerald-400">
                  <span className="font-medium">Benchmark Result:</span>
                  <span className="font-bold text-base sm:text-lg">{uc.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMPLIANCE & SAFETY SECTION */}
        <section id="compliance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0c1324] via-[#080d19] to-[#070b16] border border-white/10 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-sans border border-emerald-500/30 uppercase font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strict RBI Anti-Harassment Compliance</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold font-metric leading-tight text-white">
                  Zero Spam. Strict Cooldowns. Bounded Autonomous Actions.
                </h2>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Revora guarantees safety with mathematical boundaries: hard stop after maximum 3 attempts, quiet hours suppression (8:00 PM to 8:00 AM IST), and instant pause upon Promise-to-Pay (P2P).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="font-bold text-white text-base">3-Attempt Hard Ceiling</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Caps outreach contact attempts per case.</div>
                  </div>
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="font-bold text-white text-base">Quiet Hours (8 PM - 8 AM)</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Guaranteed night cooldown window.</div>
                  </div>
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="font-bold text-white text-base">P2P Grace Hold</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Auto-suspends nudges till promised date.</div>
                  </div>
                  <div className="p-4.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="font-bold text-white text-base">Instant Dispute Freeze</div>
                    <div className="text-slate-400 text-xs sm:text-sm">Halts recovery instantly on dispute flag.</div>
                  </div>
                </div>
              </div>

              {/* Policy JSON Visualizer */}
              <div className="lg:col-span-5">
                <div className="p-7 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs sm:text-sm space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[#a5b4fc] font-bold">compliance_guardrails.json</span>
                    <span className="text-emerald-400 text-xs font-semibold">● ACTIVE ENFORCEMENT</span>
                  </div>

                  <div className="space-y-2.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">max_contact_attempts:</span>
                      <span className="text-[#22d3ee] font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">quiet_hours_ist:</span>
                      <span className="text-[#22d3ee] font-bold">&quot;20:00 - 08:00&quot;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">cooldown_window_hours:</span>
                      <span className="text-[#22d3ee] font-bold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">auto_pause_on_p2p:</span>
                      <span className="text-emerald-400 font-bold">true</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">dispute_freeze_immediate:</span>
                      <span className="text-emerald-400 font-bold">true</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">audit_hash_chain:</span>
                      <span className="text-[#a5b4fc] font-bold">&quot;SHA-256 Verified&quot;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI CALCULATOR SECTION */}
        <section id="roi-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#635bff]/30 bg-[#635bff]/10 px-4 py-1 text-xs font-semibold font-sans uppercase tracking-wider text-[#a5b4fc]">
              Interactive ROI Engine
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-metric">
              Calculate Your Recoverable Revenue
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Adjust your monthly processed volume to estimate the monthly and annual capital Revora can rescue.
            </p>
          </div>

          <div className={`max-w-4xl mx-auto rounded-3xl border p-8 sm:p-12 shadow-2xl space-y-10 ${
            isDark ? 'bg-[#0a0f1d] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-8">
              {/* Monthly Volume Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-base sm:text-lg">
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Monthly Processing Volume:
                  </span>
                  <span className="font-bold font-metric text-2xl text-[#22d3ee]">
                    ₹{(monthlyVolume / 100000).toFixed(1)} Lakhs / month
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[#635bff] ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />
                <div className={`flex justify-between text-xs font-sans font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>₹5 Lakhs</span>
                  <span>₹2.5 Crore</span>
                  <span>₹5.0 Crore</span>
                </div>
              </div>

              {/* Sliders Grid: Failure Rate & Recovery Efficiency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>Payment Failure Rate:</span>
                    <span className="font-bold text-rose-500 text-lg">{failureRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={failureRate}
                    onChange={(e) => setFailureRate(Number(e.target.value))}
                    className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-rose-500 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>Revora Recovery Rate:</span>
                    <span className="font-bold text-emerald-500 text-lg">{recoveryEfficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={recoveryEfficiency}
                    onChange={(e) => setRecoveryEfficiency(Number(e.target.value))}
                    className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results Banner */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 border-t ${
              isDark ? 'border-white/[0.08]' : 'border-slate-200'
            }`}>
              <div className={`p-5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-black/40 border-white/5' : 'bg-rose-50/70 border-rose-200/80'
              }`}>
                <div className={`text-xs font-sans uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Monthly Revenue at Risk
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-metric text-rose-500">
                  ₹{Math.round(revenueAtRisk).toLocaleString('en-IN')}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-[#635bff]/15 border-[#635bff]/30' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <div className={`text-xs font-sans uppercase font-bold tracking-wider ${isDark ? 'text-[#a5b4fc]' : 'text-indigo-800'}`}>
                  Monthly Rescued
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-metric text-emerald-500">
                  ₹{Math.round(estimatedRecovered).toLocaleString('en-IN')}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-[#22d3ee]/10 border-[#22d3ee]/30' : 'bg-cyan-50 border-cyan-200'
              }`}>
                <div className={`text-xs font-sans uppercase font-bold tracking-wider ${isDark ? 'text-[#22d3ee]' : 'text-cyan-800'}`}>
                  Projected Annual Rescued
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold font-metric ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ₹{Math.round(annualRecovered).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onOpenAuth('signup')}
                className="btn-premium px-10 py-4 text-base font-bold shadow-xl cursor-pointer"
              >
                <div className="points_wrapper">
                  <i className="point" /><i className="point" /><i className="point" />
                </div>
                <span className="btn-premium-inner text-base font-bold text-white">
                  Get Started with Revora AI
                  <ArrowRight className="w-4.5 h-4.5 text-[#22d3ee] transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.button>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-metric">Frequently Asked Questions</h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Everything you need to know about Revora integration, Razorpay connectivity, and compliance.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isDark ? 'border-white/10 bg-[#080d19]' : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className={`w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg cursor-pointer ${
                      isDark ? 'text-white hover:text-cyan-300' : 'text-slate-900 hover:text-indigo-600'
                    }`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={`px-6 pb-6 text-sm sm:text-base leading-relaxed border-t pt-4 ${
                          isDark ? 'text-slate-300 border-white/5' : 'text-slate-700 border-slate-100 font-normal'
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#635bff] via-[#5349eb] to-[#22d3ee] p-10 sm:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-metric">
                Ready to Rescue Your Revenue?
              </h2>
              <p className="text-base sm:text-lg text-white/95 leading-relaxed">
                Connect your Razorpay account in 2 minutes and start converting failed transactions into settled capital autonomously.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onOpenAuth('signup')}
                className="px-9 py-4 rounded-full bg-white text-slate-900 font-extrabold text-base shadow-xl hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 text-[#635bff]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onOpenAuth('signin')}
                className="px-8 py-4 rounded-full bg-black/30 hover:bg-black/40 text-white font-bold text-base border border-white/20 transition-all cursor-pointer"
              >
                Sign In
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 mt-20 ${
        isDark ? 'border-white/10 bg-[#050811] text-slate-400' : 'border-slate-200 bg-white text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left group"
            title="Return to top"
          >
            <RevoraLogo size="xs" interactive />
            <span className={`font-bold tracking-tight ${isDark ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'} transition-colors`}>
              Revora AI
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
              Autonomous Dunning & Revenue Recovery
            </span>
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenAuth('signin')}
              className={`${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900 font-semibold'} transition-colors cursor-pointer`}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className={`${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-700 font-bold'} transition-colors cursor-pointer`}
            >
              Get Started
            </button>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              &copy; {new Date().getFullYear()} Revora Technologies Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
