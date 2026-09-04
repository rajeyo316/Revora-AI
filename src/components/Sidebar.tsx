"use client";

import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  Mic,
  Calendar,
  Zap,
  PlusCircle,
  FileCheck,
  CreditCard,
  ShieldCheck,
  Sliders,
  Settings as SettingsIcon,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UserProfile } from '../types';
import { SidebarToggleIcon } from './SidebarToggleIcon';
import { RevoraLogo } from './RevoraLogo';

export type NavTabId =
  | 'dashboard'
  | 'agent_studio'
  | 'queue'
  | 'razorpay_api'
  | 'ingest'
  | 'diag'
  | 'voice'
  | 'p2p'
  | 'batch'
  | 'audit'
  | 'settings';

interface SidebarProps {
  currentUser?: UserProfile | null;
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  selectedScenario?: string;
  onSelectScenario?: (scenario: string) => void;
  onOpenRazorpayModal: () => void;
  onOpenComplianceModal: () => void;
  onOpenSuggestionsModal?: () => void;
  onGenerateDummyCases?: (count?: number) => void;
  onResetSeed?: () => void;
  totalRecovered?: number;
  atRiskAmount?: number;
  casesCountByScenario?: Record<string, number>;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenRazorpayModal,
  onOpenComplianceModal,
  isOpen = true,
  onToggleSidebar,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Navigation workspaces
  const navItems: { id: NavTabId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'agent_studio', label: 'Revora Agent', icon: <Mic className="w-4.5 h-4.5" /> },
    { id: 'queue', label: 'Recovery Queue', icon: <Layers className="w-4.5 h-4.5" /> },
    { id: 'ingest', label: 'Ingest Failed Case', icon: <PlusCircle className="w-4.5 h-4.5" /> },
    { id: 'p2p', label: 'Promise-to-Pay (P2P)', icon: <Calendar className="w-4.5 h-4.5" /> },
    { id: 'batch', label: 'Batch Execution & Safety', icon: <Zap className="w-4.5 h-4.5" /> },
    { id: 'settings', label: 'Settings & Rails', icon: <Sliders className="w-4.5 h-4.5" /> },
  ];

  const handleSelectTab = (id: NavTabId) => {
    setActiveTab(id);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  /* ----------------------------------------------------
   * COLLAPSED / ICON-ONLY RAIL STATE
   * Comfortable width (72px), min 44px touch targets,
   * perfectly visible and tappable icon buttons
   * ---------------------------------------------------- */
  if (!isOpen && !isMobileDrawer) {
    return (
      <aside
        id="sidebar-collapsed-rail"
        className={`w-[72px] shrink-0 h-full flex flex-col justify-between items-center py-3 border-r z-30 transition-all duration-300 ease-in-out select-none ${
          isDark
            ? 'bg-[#050811]/95 border-white/[0.08] text-slate-300 backdrop-blur-xl'
            : 'bg-white/95 border-slate-200 text-slate-700 backdrop-blur-xl shadow-sm'
        }`}
      >
        {/* Icon Navigation Column */}
        <nav className="flex flex-col gap-2 items-center w-full px-2" aria-label="Primary Icon Rail">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/30'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : isDark
                    ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="scale-110">{item.icon}</span>

                {/* Tooltip on Hover */}
                <span className="absolute left-15 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-950 text-white border border-white/15 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile Indicator */}
        <div className="flex flex-col items-center gap-2 pb-1 px-2">
          <div
            onClick={() => handleSelectTab('settings')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 ring-2 ring-cyan-400/30 text-white font-black text-xs shadow-md shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform"
            title={`${currentUser?.name || 'Revora Workspace'} - Go to Settings`}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'R'}
          </div>
        </div>
      </aside>
    );
  }

  /* ----------------------------------------------------
   * EXPANDED FULL SIDEBAR / MOBILE DRAWER STATE
   * Clean, sleek, uncluttered workspace menu
   * ---------------------------------------------------- */
  return (
    <aside
      id="sidebar-expanded-panel"
      className={`w-full h-full flex flex-col justify-between border-r z-30 font-sans select-none transition-all duration-300 ease-in-out ${
        isDark
          ? 'bg-[#050811]/95 border-white/[0.08] text-slate-300 backdrop-blur-xl'
          : 'bg-white/95 border-slate-200 text-slate-700 backdrop-blur-xl shadow-sm'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto sidebar-scrollbar min-h-0 flex flex-col">
        <div className={`px-2 pt-1 pb-2 text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-700 font-bold'} uppercase tracking-wider flex items-center justify-between`}>
          <span>Workspaces</span>
          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-700'} cursor-pointer text-xs`}
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer min-h-[44px] group ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 ring-1 ring-white/20'
                      : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
