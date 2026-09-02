import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { DonutChart } from './ui/donut-chart';
import { RecoveryAnalytics } from '../types';

interface AnalyticsChartsProps {
  analytics: RecoveryAnalytics | null;
}

const COLORS = ['#10b981', '#6366f1', '#a855f7', '#f59e0b', '#06b6d4'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  const [hoveredRootCause, setHoveredRootCause] = useState<string | null>(null);
  if (!analytics) return null;

  const rootCauseData = (analytics.rootCauses || []).map((rc, idx) => ({
    label: rc.name,
    value: rc.amount,
    color: COLORS[idx % COLORS.length],
  }));

  const totalRootCauseAmount = rootCauseData.reduce((sum, d) => sum + d.value, 0);
  const activeSegment = rootCauseData.find((d) => d.label === hoveredRootCause);
  const displayLabel = activeSegment ? activeSegment.label : 'Diagnosed Impact';
  const displayValue = activeSegment
    ? `₹${(activeSegment.value / 1000).toFixed(0)}k`
    : `₹${(totalRootCauseAmount / 1000).toFixed(0)}k`;
  const displayPercent = activeSegment && totalRootCauseAmount > 0
    ? `${((activeSegment.value / totalRootCauseAmount) * 100).toFixed(0)}%`
    : '100%';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Recovery Velocity by Cohort */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs tracking-wide">Recovery Velocity by Cohort</span>
          <span className="text-[11px] font-sans text-emerald-400 font-bold">₹ Recovered vs At-Risk</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.cohortVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hourBucket" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#030708', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="recovered" name="Recovered" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atRisk" name="At-Risk" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Channel Success & Win Rate */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs tracking-wide">Win Rate by Channel Rail</span>
          <span className="text-[11px] font-sans text-indigo-400 font-bold">Autonomous Rails</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.channelBreakdown} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
              <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" domain={[0, 100]} />
              <YAxis dataKey="channel" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={85} />
              <Tooltip
                contentStyle={{ backgroundColor: '#030708', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                formatter={(val: any) => [`${val}% Success`, 'Win Rate']}
              />
              <Bar dataKey="successRate" fill="#6366f1" radius={[0, 4, 4, 0]}>
                {analytics.channelBreakdown.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Root Cause Classification - Modern Animated Donut */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs tracking-wide">Degradation Root Causes</span>
          <span className="text-[11px] font-sans text-purple-400 font-bold">Diagnosed</span>
        </div>
        <div className="h-48 w-full flex items-center justify-center my-1">
          <DonutChart
            data={rootCauseData}
            size={180}
            strokeWidth={18}
            animationDuration={1.1}
            animationDelayPerSegment={0.06}
            highlightOnHover={true}
            activeSegmentLabel={hoveredRootCause}
            onSegmentHover={(seg) => setHoveredRootCause(seg ? seg.label : null)}
            centerContent={
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayLabel}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.16 }}
                  className="flex flex-col items-center justify-center text-center px-1"
                >
                  <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[100px]">
                    {displayLabel}
                  </p>
                  <p className="text-lg font-black font-sans text-white tracking-tight">
                    {displayValue}
                  </p>
                  <p className="text-[10.5px] font-bold font-sans text-purple-400">
                    {displayPercent}
                  </p>
                </motion.div>
              </AnimatePresence>
            }
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-white/5">
          {rootCauseData.map((rc) => (
            <div
              key={rc.label}
              onMouseEnter={() => setHoveredRootCause(rc.label)}
              onMouseLeave={() => setHoveredRootCause(null)}
              className={`flex items-center gap-1.5 text-[10.5px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                hoveredRootCause === rc.label ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: rc.color }} />
              <span className="truncate max-w-[90px]">{rc.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCharts;
