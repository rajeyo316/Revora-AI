import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu,
  X,
  LayoutDashboard,
  Mic,
  Layers,
  PlusCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RecoveryCase,
  RecoveryAnalytics,
  RazorpaySettings,
  StoppingRulesConfig,
  UserProfile,
  AuditEntry,
} from './types';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { QueueView } from './components/QueueView';
import { DiagView } from './components/DiagView';
import { VoiceBotView } from './components/VoiceBotView';
import { P2PView } from './components/P2PView';
import { BatchView } from './components/BatchView';
import { IngestView } from './components/IngestView';
import { AuditView } from './components/AuditView';
import { RazorpayApiSandboxView } from './components/RazorpayApiSandboxView';
import { SettingsView } from './components/SettingsView';
import { AgentStudioView } from './components/AgentStudioView';

import { CaseDetailModal } from './components/CaseDetailModal';
import { P2PModal } from './components/P2PModal';
import { RazorpaySettingsModal } from './components/RazorpaySettingsModal';
import { ComplianceSettingsModal } from './components/ComplianceSettingsModal';
import { AuthModal } from './components/AuthModal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { RazorpayCheckoutModal } from './components/RazorpayCheckoutModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { LandingView } from './components/LandingView';
import revoraAmbientWallpaper from './assets/images/revora_ambient_wallpaper_1787771744730.jpg';

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { currentUser, signOut, switchUserRole } = useAuth();

  // Navigation & View
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('all');

  // Core Data
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [analytics, setAnalytics] = useState<RecoveryAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [razorpaySettings, setRazorpaySettings] = useState<RazorpaySettings | null>(null);
  const [stoppingRules, setStoppingRules] = useState<StoppingRulesConfig | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [inspectedCase, setInspectedCase] = useState<RecoveryCase | null>(null);
  const [p2pModalCase, setP2pModalCase] = useState<RecoveryCase | null>(null);
  const [checkoutModalCase, setCheckoutModalCase] = useState<RecoveryCase | null>(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);

  // Banner Notification
  const [banner, setBanner] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showBanner = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setBanner({ text, type });
    setTimeout(() => setBanner(null), 3500);
  };

  // Fetch all state from API safely
  const fetchData = useCallback(async () => {
    try {
      const fetchJsonSafely = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        } catch {
          return null;
        }
      };

      const [casesData, analyticsData, auditData, rzpData, rulesData] = await Promise.all([
        fetchJsonSafely('/api/cases'),
        fetchJsonSafely('/api/analytics'),
        fetchJsonSafely('/api/audit'),
        fetchJsonSafely('/api/razorpay/settings'),
        fetchJsonSafely('/api/compliance/rules'),
      ]);

      if (casesData?.cases && Array.isArray(casesData.cases)) {
        setCases(casesData.cases);
      }
      if (analyticsData) {
        setAnalytics(analyticsData);
      }
      if (Array.isArray(auditData)) {
        setAuditLogs(auditData);
      }
      if (rzpData) {
        setRazorpaySettings(rzpData);
      }
      if (rulesData?.stoppingRules) {
        setStoppingRules(rulesData.stoppingRules);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Deploy Action
  const handleDeployAction = async (caseId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/recover`, { method: 'POST' });
      const data = await res.json();
      if (data.stopped) {
        showBanner(`Stopped by RBI Compliance Rule: ${data.reason}`, 'warning');
      } else {
        showBanner(`Razorpay Smart Link Dispatched! Link: ${data.paymentUrl}`, 'success');
      }
      await fetchData();
    } catch (e) {
      console.error(e);
      showBanner('Failed to deploy action', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate Payment
  const handleSimulatePayment = async (caseId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/simulate-payment`, { method: 'POST' });
      if (res.ok) {
        showBanner(`Webhook Confirmed! Case marked as RECOVERED.`, 'success');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate Dummy Cases
  const handleGenerateDummyCases = async (count: number = 5) => {
    try {
      const res = await fetch('/api/cases/generate-dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok) {
        const data = await res.json();
        showBanner(`Ingested ${data.count} new realistic cases into Recovery Queue!`, 'success');
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to generate dummy cases:', e);
    }
  };

  // Reset Seed
  const handleResetSeed = async () => {
    try {
      const res = await fetch('/api/cases/reset-seed', { method: 'POST' });
      if (res.ok) {
        showBanner('Recovery pipeline reset to 24 pristine enterprise scenarios.', 'info');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Promise-to-Pay
  const handleSaveP2P = async (caseId: string, promiseDate: string, amount?: number) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/set-promise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promiseDate, amount }),
      });
      if (res.ok) {
        showBanner(`Promise-to-Pay registered for ${promiseDate}. Reminders paused!`, 'success');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch User Role
  const handleSwitchUserRole = (role: 'fintech_admin' | 'recovery_manager' | 'compliance_auditor') => {
    switchUserRole(role);
    showBanner(`Switched active profile to ${role.replace('_', ' ').toUpperCase()}`, 'info');
  };

  // Master Batch Execution
  const handleBatchRecover = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/cases/batch-recover', { method: 'POST' });
      const data = await res.json();
      showBanner(`Batch completed! Recovered ${data.recoveredCount} cases totaling ₹${data.recoveredAmount.toLocaleString('en-IN')}`, 'success');
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Ingest Single Case
  const handleAddCase = async (newCase: any) => {
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase),
      });
      if (res.ok) {
        showBanner('Case ingested into recovery pipeline!', 'success');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Ingest Cases from Uploaded Sheet
  const handleBulkAddCases = async (rawCases: any[]) => {
    try {
      const res = await fetch('/api/cases/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: rawCases }),
      });
      if (res.ok) {
        const data = await res.json();
        showBanner(`Successfully ingested ${data.count} cases (₹${Number(data.totalAmount || 0).toLocaleString('en-IN')}) from sheet!`, 'success');
        await fetchData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Save Razorpay Settings
  const handleSaveRazorpaySettings = async (settings: RazorpaySettings) => {
    try {
      const res = await fetch('/api/razorpay/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showBanner('Razorpay configuration updated successfully!', 'success');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      showBanner('Failed to update Razorpay settings', 'warning');
    }
  };

  // Save Compliance Rules
  const handleSaveComplianceRules = async (rules: StoppingRulesConfig) => {
    try {
      const res = await fetch('/api/compliance/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stoppingRules: rules }),
      });
      if (res.ok) {
        showBanner('RBI compliance & recovery guardrails updated!', 'success');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      showBanner('Failed to update compliance rules', 'warning');
    }
  };

  const casesCountByScenario = {
    all: cases.length,
    payment_failure: cases.filter((c) => c.scenario === 'payment_failure').length,
    checkout_abandonment: cases.filter((c) => c.scenario === 'checkout_abandonment').length,
    failed_subscription: cases.filter((c) => c.scenario === 'failed_subscription').length,
    overdue_invoice: cases.filter((c) => c.scenario === 'overdue_invoice').length,
    receivables: cases.filter((c) => c.scenario === 'receivables').length,
  };

  const atRiskAmount = cases.reduce((acc, c) => acc + (c.status !== 'recovered' ? c.amount : 0), 0);
  const totalRecovered = cases.reduce((acc, c) => acc + (c.recoveredAmount || 0), 0);

  // If user is not authenticated, show the AI-native LandingView with AuthModal
  if (!currentUser) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <LandingView
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden relative font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white ${
        isDark ? 'bg-[#030708] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Futuristic Revora Wallpaper Visual */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={revoraAmbientWallpaper}
            alt="Revora AI Neural Recovery Atmosphere"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              isDark ? 'opacity-20 mix-blend-screen scale-105 filter saturate-150' : 'opacity-10 mix-blend-multiply scale-105'
            }`}
          />
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-b from-[#030708]/85 via-[#030708]/75 to-[#030708]'
                : 'bg-gradient-to-b from-[#f8fafc]/85 via-[#f8fafc]/75 to-[#f8fafc]'
            }`}
          />
        </div>

        <div
          className={`absolute inset-0 ${
            isDark ? 'fintech-grid-bg opacity-25' : 'fintech-grid-bg-light opacity-35'
          }`}
        />
        {/* Luminous Gaussian Blur Orbs */}
        <div
          className={`absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-700 pointer-events-none ${
            isDark ? 'bg-cyan-600/15' : 'bg-blue-400/15'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full blur-[150px] transition-all duration-700 pointer-events-none ${
            isDark ? 'bg-indigo-600/15' : 'bg-indigo-400/15'
          }`}
        />
        <div
          className={`absolute -bottom-32 left-1/3 w-[550px] h-[550px] rounded-full blur-[160px] transition-all duration-700 pointer-events-none ${
            isDark ? 'bg-emerald-600/12' : 'bg-emerald-400/12'
          }`}
        />
      </div>

      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={async () => {
          await signOut();
          showBanner('You have signed out of your session.', 'info');
        }}
        onSwitchUserRole={handleSwitchUserRole}
        onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
        onOpenComplianceModal={() => setIsComplianceModalOpen(true)}
        onOpenWebhookSimulator={() => setActiveTab('razorpay_api')}
        onOpenIngestTab={() => setActiveTab('ingest')}
        onNavigateDashboard={() => setActiveTab('dashboard')}
        onRefresh={fetchData}
        isRefreshing={isLoading}
        totalRecovered={totalRecovered}
        recoveryRate={analytics?.recoveryRatePercent || 45}
        onToggleSidebar={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsMobileDrawerOpen(true);
          } else {
            setIsSidebarOpen(!isSidebarOpen);
          }
        }}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Workspace Frame: Responsive CSS Grid Layout with Gracefully Collapsing Side Panels */}
      <div
        className={`flex-1 grid overflow-hidden relative z-10 w-full transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? 'grid-cols-1 md:grid-cols-[256px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]'
            : 'grid-cols-1 md:grid-cols-[72px_minmax(0,1fr)]'
        }`}
      >
        {/* Desktop / Tablet Sidebar: Hidden on small mobile screens in favor of drawer & bottom nav */}
        <div className="hidden md:block h-full">
          <Sidebar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
            onOpenRazorpayModal={() => setIsRazorpayModalOpen(true)}
            onOpenComplianceModal={() => setIsComplianceModalOpen(true)}
            onOpenSuggestionsModal={() => setIsSuggestionsModalOpen(true)}
            onGenerateDummyCases={handleGenerateDummyCases}
            onResetSeed={handleResetSeed}
            totalRecovered={totalRecovered}
            atRiskAmount={atRiskAmount}
            casesCountByScenario={casesCountByScenario}
            isOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Content View Container: Smooth Animated Width Transition & Independent Scroll */}
        <main
          className={`min-w-0 h-full overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-6 lg:p-8 pb-24 md:pb-8 relative scrollbar-thin transition-all duration-300 ease-in-out ${
            isDark
              ? 'bg-[#030708]/70 backdrop-blur-md'
              : 'bg-[#f8fafc]/80 backdrop-blur-md'
          }`}
        >
          {/* Notification Toast */}
          {banner && (
            <div
              className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl border flex items-center gap-2 animate-in slide-in-from-top duration-300 ${
                banner.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-900/40'
                  : banner.type === 'warning'
                  ? 'bg-amber-950/90 text-amber-200 border-amber-500/50 shadow-amber-900/40'
                  : 'bg-blue-950/90 text-blue-200 border-blue-500/50 shadow-blue-900/40'
              }`}
            >
              {banner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : banner.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
              <span>{banner.text}</span>
            </div>
          )}

          {/* Tab Views with Smooth Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  analytics={analytics}
                  onNavigateTab={setActiveTab}
                  onGenerateDummyCases={handleGenerateDummyCases}
                  onOpenSuggestionsModal={() => setIsSuggestionsModalOpen(true)}
                />
              )}

              {activeTab === 'agent_studio' && (
                <AgentStudioView
                  onNavigateTab={setActiveTab}
                  onShowBanner={showBanner}
                  onRefreshData={fetchData}
                />
              )}

              {activeTab === 'queue' && (
                <QueueView
                  cases={cases}
                  onDeployAction={handleDeployAction}
                  onSimulatePayment={handleSimulatePayment}
                  onOpenP2PModal={setP2pModalCase}
                  onInspectCase={setInspectedCase}
                  onOpenRazorpayModal={(c) => setCheckoutModalCase(c)}
                  onOpenVoiceCall={(c) => {
                    setInspectedCase(c);
                    setActiveTab('voice');
                  }}
                  onOpenIngestModal={() => setActiveTab('ingest')}
                  onGenerateDummyCases={handleGenerateDummyCases}
                  onResetSeed={handleResetSeed}
                  isProcessing={isProcessing}
                />
              )}

              {activeTab === 'razorpay_api' && (
                <RazorpayApiSandboxView
                  cases={cases}
                  onOpenRazorpayModal={(c) => setCheckoutModalCase(c)}
                  onRefreshData={fetchData}
                />
              )}

              {activeTab === 'diag' && (
                <DiagView
                  cases={cases}
                  onOpenCaseModal={setInspectedCase}
                  onOpenRazorpayModal={(c) => setCheckoutModalCase(c)}
                  onRecoverCase={handleDeployAction}
                />
              )}

              {activeTab === 'voice' && (
                <VoiceBotView cases={cases} onOpenP2PModal={setP2pModalCase} />
              )}

              {activeTab === 'p2p' && (
                <P2PView
                  cases={cases}
                  onOpenP2PModal={setP2pModalCase}
                  onOpenRazorpayModal={(c) => setCheckoutModalCase(c)}
                />
              )}

              {activeTab === 'batch' && (
                <BatchView
                  cases={cases}
                  onBatchRecover={handleBatchRecover}
                  onOpenRazorpayModal={(c) => setCheckoutModalCase(c)}
                  onInspectCase={setInspectedCase}
                  isProcessing={isProcessing}
                />
              )}

              {activeTab === 'ingest' && (
                <IngestView
                  onAddCase={handleAddCase}
                  onBulkAddCases={handleBulkAddCases}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'audit' && <AuditView logs={auditLogs} />}

              {activeTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  razorpaySettings={razorpaySettings}
                  stoppingRules={stoppingRules}
                  auditLogs={auditLogs}
                  onSaveRazorpaySettings={handleSaveRazorpaySettings}
                  onSaveComplianceRules={handleSaveComplianceRules}
                  onSwitchUserRole={handleSwitchUserRole}
                  onOpenWebhookSimulator={() => setActiveTab('razorpay_api')}
                  onShowBanner={(text, type) => showBanner(text, type)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer (Slide-over on phone screens) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`relative z-10 w-72 max-w-[85vw] h-full shadow-2xl ${
                isDark ? 'bg-[#050811] text-white border-r border-white/10' : 'bg-white text-slate-900 border-r border-slate-200'
              }`}
            >
              <Sidebar
                currentUser={currentUser}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileDrawerOpen(false);
                }}
                selectedScenario={selectedScenario}
                onSelectScenario={setSelectedScenario}
                onOpenRazorpayModal={() => {
                  setIsMobileDrawerOpen(false);
                  setIsRazorpayModalOpen(true);
                }}
                onOpenComplianceModal={() => {
                  setIsMobileDrawerOpen(false);
                  setIsComplianceModalOpen(true);
                }}
                onOpenSuggestionsModal={() => {
                  setIsMobileDrawerOpen(false);
                  setIsSuggestionsModalOpen(true);
                }}
                onGenerateDummyCases={handleGenerateDummyCases}
                onResetSeed={handleResetSeed}
                totalRecovered={totalRecovered}
                atRiskAmount={atRiskAmount}
                casesCountByScenario={casesCountByScenario}
                isOpen={true}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Quick Navigation Bar (Sticky on phones, 44px+ min touch targets) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1 flex items-center justify-around select-none transition-colors ${
          isDark
            ? 'bg-[#050811]/95 border-white/10 text-slate-400'
            : 'bg-white/95 border-slate-200 text-slate-600 shadow-lg'
        }`}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-indigo-600 font-bold scale-105'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('agent_studio')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'agent_studio'
              ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-indigo-600 font-bold scale-105'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mic className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Voice Agent</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'queue'
              ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-indigo-600 font-bold scale-105'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('ingest')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ingest'
              ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-indigo-600 font-bold scale-105'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Ingest</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isMobileDrawerOpen
              ? isDark ? 'text-cyan-400 font-bold scale-105' : 'text-indigo-600 font-bold scale-105'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Menu</span>
        </button>
      </nav>

      {/* Modals */}
      {inspectedCase && (
        <CaseDetailModal
          caseData={inspectedCase}
          isOpen={!!inspectedCase}
          onClose={() => setInspectedCase(null)}
          onRecover={async (c) => handleDeployAction(c.id)}
          onVerifyManualPayment={async (id) => handleSimulatePayment(id)}
          onOpenVoiceCall={() => {
            setInspectedCase(null);
            setActiveTab('voice');
          }}
          isProcessing={isProcessing}
        />
      )}

      {p2pModalCase && (
        <P2PModal
          caseData={p2pModalCase}
          isOpen={!!p2pModalCase}
          onClose={() => setP2pModalCase(null)}
          onSaveP2P={handleSaveP2P}
        />
      )}

      <RazorpaySettingsModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        onSaved={fetchData}
      />

      <ComplianceSettingsModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        onSaved={fetchData}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SuggestionsModal
        isOpen={isSuggestionsModalOpen}
        onClose={() => setIsSuggestionsModalOpen(false)}
        onNavigateTab={setActiveTab}
      />

      <RazorpayCheckoutModal
        isOpen={!!checkoutModalCase}
        caseData={checkoutModalCase}
        onClose={() => setCheckoutModalCase(null)}
        onPaymentSuccess={async (caseId) => {
          setCheckoutModalCase(null);
          await handleSimulatePayment(caseId);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
