import React from 'react';
import {
  CreditCard,
  ShoppingCart,
  Repeat,
  FileText,
  Briefcase,
  Layers,
  Search,
} from 'lucide-react';
import { ScenarioType } from '../types';

interface ScenarioFiltersProps {
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  casesCountByScenario: Record<string, number>;
}

export const ScenarioFilters: React.FC<ScenarioFiltersProps> = ({
  selectedScenario,
  onSelectScenario,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  casesCountByScenario,
}) => {
  const scenarios = [
    { id: 'all', label: 'All Scenarios', icon: Layers },
    { id: 'payment_failure', label: 'Payment Failures', icon: CreditCard },
    { id: 'checkout_abandonment', label: 'Checkout Drop-off', icon: ShoppingCart },
    { id: 'failed_subscription', label: 'Failed Subscriptions', icon: Repeat },
    { id: 'overdue_invoice', label: 'Overdue Invoices', icon: FileText },
    { id: 'receivables', label: 'B2B Receivables', icon: Briefcase },
  ];

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'identified', label: 'Identified', color: 'text-amber-400' },
    { id: 'intervention_active', label: 'In-Flight', color: 'text-blue-400' },
    { id: 'ptp_active', label: 'PTP Active', color: 'text-indigo-400' },
    { id: 'recovered', label: 'Recovered', color: 'text-emerald-400' },
    { id: 'stopped', label: 'Stopped by Rules', color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-3.5">
      {/* Top row: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customer, case #, or company..."
            className="w-full pl-10 pr-8 py-2 bg-[#080d14]/90 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/60 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedStatus === st.id
                  ? 'bg-white/10 text-white border-white/20 shadow-md'
                  : 'bg-white/[0.02] text-slate-400 hover:text-slate-200 border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <span className={st.color ? `${st.color} mr-1.5` : ''}>●</span>
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.08] scrollbar-none">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const count = casesCountByScenario[sc.id] ?? 0;
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              id={`filter-scenario-${sc.id}`}
              onClick={() => onSelectScenario(sc.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-900/30'
                  : 'bg-[#080d14]/80 text-slate-400 border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{sc.label}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.06] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default ScenarioFilters;
