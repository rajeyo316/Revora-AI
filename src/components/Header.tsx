import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ShieldCheck,
  Zap,
  Activity,
  CreditCard,
  Radio,
  User,
  LogOut,
  Sliders,
  Cpu,
  RefreshCw,
  TrendingUp,
  PlusCircle,
  Sun,
  Moon,
  ChevronDown,
  Lock,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { RevoraLogo } from './RevoraLogo';
import { SidebarToggleIcon } from './SidebarToggleIcon';

interface HeaderProps {
  currentUser?: UserProfile | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onSwitchUserRole?: (role: 'fintech_admin' | 'recovery_manager') => void;
  onOpenRazorpayModal: () => void;
  onOpenComplianceModal: () => void;
  onOpenWebhookSimulator: () => void;
  onOpenIngestTab?: () => void;
  onNavigateDashboard?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalRecovered?: number;
  recoveryRate?: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuthModal,
  onSignOut,
  onSwitchUserRole,
  onOpenRazorpayModal,
  onOpenComplianceModal,
  onOpenWebhookSimulator,
  onOpenIngestTab,
  onNavigateDashboard,
  onRefresh,
  isRefreshing = false,
  totalRecovered = 845200,
  recoveryRate = 78.4,
  onToggleSidebar,
  isSidebarOpen = true,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-2xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#050811]/90 border-white/[0.08] text-slate-100 shadow-xl shadow-black/40'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-15">
          {/* Left: Menu Toggle + Brand Identity (Gemini style) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  isDark
                    ? 'hover:bg-white/10 text-slate-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-label="Toggle sidebar navigation"
              >
                <SidebarToggleIcon isOpen={isSidebarOpen} className="w-5 h-5" strokeWidth={1.75} />
              </button>
            )}

            <button
              onClick={onNavigateDashboard}
              className="flex items-center space-x-2.5 cursor-pointer bg-transparent border-0 p-0 group"
              title="Revora AI - Return to Dashboard"
            >
              <RevoraLogo size="sm" interactive />
              <div className="flex items-center gap-1.5">
                <span className={`text-base sm:text-lg font-extrabold tracking-tight font-sans ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`}>
                  Revora
                </span>
                <span className="text-base sm:text-lg font-extrabold tracking-tight font-sans text-cyan-400">
                  AI
                </span>
              </div>
            </button>
          </div>

          {/* Quick Metrics Ticker */}
          <div
            className={`hidden xl:flex items-center space-x-4 px-3 py-1 rounded-lg border text-xs ${
              isDark ? 'bg-[#080d18]/90 border-white/[0.07]' : 'bg-slate-50 border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-700 font-semibold'} text-[11px]`}>Recovered:</span>
              <span className="font-bold text-emerald-500 font-sans text-xs tracking-tight">
                ₹{totalRecovered.toLocaleString('en-IN')}
              </span>
            </div>
            <div className={`h-3.5 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-700 font-semibold'} text-[11px]`}>Win Rate:</span>
              <span className="font-bold text-indigo-600 font-sans text-xs">{recoveryRate}%</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Theme Toggle (Dark/Light mode) beside User Profile */}
            <ThemeToggle />

            {/* User Profile / Persona Dropdown */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2.5 rounded-xl px-3 py-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] border ${
                    isDark
                      ? 'bg-slate-900/95 hover:bg-slate-800/90 border-white/15 text-white shadow-black/40'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-slate-100'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-blue-500/20">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-bold leading-tight tracking-tight">{currentUser.name}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl p-3 space-y-3 z-50 border ${
                        isDark
                          ? 'bg-[#0a0f1d] border-white/15 text-white shadow-black/90'
                          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                      }`}
                    >
                      {/* User Profile Info */}
                      <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="font-bold text-sm flex items-center justify-between">
                          <span>{currentUser.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active Session
                          </span>
                        </div>
                        <div className={`text-xs truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {currentUser.email}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-mono">Workspace: ws_revora_ind_09</div>
                      </div>

                      {/* Quick Persona Switcher */}
                      {onSwitchUserRole && (
                        <div className="space-y-1.5">
                          <div className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
                            Enterprise Access Level:
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            <button
                              onClick={() => {
                                onSwitchUserRole('fintech_admin');
                                setIsUserMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                currentUser.role === 'fintech_admin'
                                  ? 'bg-blue-600 text-white font-bold'
                                  : isDark
                                  ? 'hover:bg-white/5 text-slate-300'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span>Fintech Executive Admin</span>
                              {currentUser.role === 'fintech_admin' && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => {
                                onSwitchUserRole('recovery_manager');
                                setIsUserMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                currentUser.role === 'recovery_manager'
                                  ? 'bg-blue-600 text-white font-bold'
                                  : isDark
                                  ? 'hover:bg-white/5 text-slate-300'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span>Lead Recovery Strategist</span>
                              {currentUser.role === 'recovery_manager' && <Check className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Modal Shortcuts */}
                      <div className="pt-1 border-t border-white/10 space-y-1 text-sm">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenRazorpayModal();
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-400" />
                            <span>Razorpay API Settings</span>
                          </span>
                          <span className="text-xs text-emerald-400 font-mono">Live Keys</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenComplianceModal();
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>RBI Compliance Rules</span>
                          </span>
                          <span className="text-xs text-amber-400 font-mono">Active</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onSignOut();
                          }}
                          className="w-full py-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out of Session</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
