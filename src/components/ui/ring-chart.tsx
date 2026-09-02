"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export interface RingData {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  subLabel?: string;
  formattedValue?: string;
}

interface RingChartContextType {
  data: RingData[];
  size: number;
  strokeWidth: number;
  ringGap: number;
  baseInnerRadius: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  totalValue: number;
  totalMaxValue: number;
}

const RingChartContext = createContext<RingChartContextType | null>(null);

export function useRingChart() {
  const ctx = useContext(RingChartContext);
  if (!ctx) {
    throw new Error('useRingChart must be used within a RingChart component');
  }
  return ctx;
}

export interface RingChartProps {
  data: RingData[];
  size?: number;
  strokeWidth?: number;
  ringGap?: number;
  baseInnerRadius?: number;
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
  children?: React.ReactNode;
}

export const RingChart: React.FC<RingChartProps> = ({
  data,
  size = 280,
  strokeWidth = 12,
  ringGap = 6,
  baseInnerRadius = 60,
  hoveredIndex: controlledHoveredIndex,
  onHoverChange,
  className = '',
  children,
}) => {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);

  const activeHoveredIndex = controlledHoveredIndex !== undefined ? controlledHoveredIndex : internalHoveredIndex;

  const handleHoverChange = (index: number | null) => {
    if (controlledHoveredIndex === undefined) {
      setInternalHoveredIndex(index);
    }
    onHoverChange?.(index);
  };

  const totalValue = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);
  const totalMaxValue = useMemo(() => data.reduce((acc, curr) => acc + curr.maxValue, 0), [data]);

  return (
    <RingChartContext.Provider
      value={{
        data,
        size,
        strokeWidth,
        ringGap,
        baseInnerRadius,
        hoveredIndex: activeHoveredIndex,
        setHoveredIndex: handleHoverChange,
        totalValue,
        totalMaxValue,
      }}
    >
      <div
        className={cn('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
        onMouseLeave={() => handleHoverChange(null)}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible -rotate-90 origin-center"
        >
          <defs>
            {data.map((item, idx) => {
              const color = item.color || '#06b6d4';
              return (
                <filter key={`glow-${idx}`} id={`ring-glow-${idx}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              );
            })}
          </defs>

          {children}
        </svg>
      </div>
    </RingChartContext.Provider>
  );
};

export interface RingProps {
  index: number;
  color?: string;
  animate?: boolean;
  showGlow?: boolean;
  lineCap?: 'round' | 'butt';
}

export const Ring: React.FC<RingProps> = ({
  index,
  color: propColor,
  animate = true,
  showGlow = true,
  lineCap = 'round',
}) => {
  const { data, size, strokeWidth, ringGap, baseInnerRadius, hoveredIndex, setHoveredIndex } = useRingChart();

  const item = data[index];
  if (!item) return null;

  const color = propColor || item.color || '#3b82f6';
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;

  // Calculate radius: outermost is index 0 or index data.length - 1
  // Inner ring starts at baseInnerRadius, each subsequent ring adds (strokeWidth + ringGap)
  const radius = baseInnerRadius + (data.length - 1 - index) * (strokeWidth + ringGap);
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, item.value / (item.maxValue || 1)));
  const progressArc = circumference * progressRatio;

  const center = size / 2;

  return (
    <g
      className="cursor-pointer transition-opacity duration-200"
      style={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.35) : 1 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Background Track Circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke="currentColor"
        className="text-slate-200/50 dark:text-white/[0.08]"
        strokeWidth={strokeWidth}
      />

      {/* Animated Progress Arc */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
        strokeLinecap={lineCap}
        strokeDasharray={`${progressArc} ${circumference}`}
        initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: 1.1,
          delay: index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        filter={isHovered && showGlow ? `url(#ring-glow-${index})` : undefined}
        style={{
          transformOrigin: `${center}px ${center}px`,
        }}
      />
    </g>
  );
};

export interface RingCenterProps {
  defaultLabel?: string;
  formatValue?: (value: number) => string;
  children?: (props: { hoveredItem: RingData | null; totalValue: number; percent: number }) => React.ReactNode;
  className?: string;
}

export const RingCenter: React.FC<RingCenterProps> = ({
  defaultLabel = 'Total Velocity',
  formatValue = (val) => `₹${val.toLocaleString('en-IN')}`,
  children,
  className = '',
}) => {
  const { data, hoveredIndex, totalValue, totalMaxValue } = useRingChart();

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const displayLabel = hoveredItem ? hoveredItem.label : defaultLabel;
  const displayValue = hoveredItem ? hoveredItem.value : totalValue;
  const displayPercent = hoveredItem
    ? Math.round((hoveredItem.value / (hoveredItem.maxValue || 1)) * 100)
    : Math.min(100, Math.round((totalValue / (totalMaxValue || 1)) * 100));

  return (
    <foreignObject
      x="0"
      y="0"
      width="100%"
      height="100%"
      className="pointer-events-none rotate-90 origin-center"
    >
      <div className={cn('w-full h-full flex flex-col items-center justify-center text-center p-4', className)}>
        {children ? (
          children({ hoveredItem, totalValue, percent: displayPercent })
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={displayLabel}
              initial={{ opacity: 0, scale: 0.92, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -3 }}
              transition={{ duration: 0.18 }}
              className="space-y-0.5"
            >
              <span className="text-[10.5px] uppercase font-mono tracking-wider font-bold text-slate-400 block truncate max-w-[130px]">
                {displayLabel}
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans block">
                {hoveredItem?.formattedValue || formatValue(displayValue)}
              </span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 border"
                style={{
                  color: hoveredItem?.color || '#10b981',
                  borderColor: hoveredItem ? `${hoveredItem.color}40` : '#10b98140',
                  backgroundColor: hoveredItem ? `${hoveredItem.color}15` : '#10b98115',
                }}
              >
                {hoveredItem?.subLabel || `${displayPercent}% Target`}
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </foreignObject>
  );
};

export interface RingLegendProps {
  data: RingData[];
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  className?: string;
}

export const RingLegend: React.FC<RingLegendProps> = ({
  data,
  hoveredIndex,
  onHoverChange,
  className = '',
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-2.5', className)}>
      {data.map((item, idx) => {
        const isHovered = hoveredIndex === idx;
        const color = item.color || '#3b82f6';
        const percent = Math.round((item.value / (item.maxValue || 1)) * 100);

        return (
          <motion.div
            key={item.label}
            onMouseEnter={() => onHoverChange?.(idx)}
            onMouseLeave={() => onHoverChange?.(null)}
            whileHover={{ scale: 1.02 }}
            className={cn(
              'p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5',
              isHovered
                ? 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20 shadow-md'
                : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15'
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{
                  backgroundColor: color,
                  boxShadow: isHovered ? `0 0 10px ${color}` : 'none',
                }}
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.label}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {item.subLabel || `${percent}% of pipeline`}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-black font-mono text-slate-900 dark:text-white">
                {item.formattedValue || `₹${(item.value / 1000).toFixed(1)}k`}
              </div>
              <div className="text-[10px] font-mono font-bold" style={{ color }}>
                {percent}%
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
