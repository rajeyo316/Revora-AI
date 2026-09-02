"use client";

import React from 'react';
import { motion } from 'motion/react';

export interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'icon';
  icons?: {
    off?: React.ReactNode;
    on?: React.ReactNode;
  };
  disabled?: boolean;
  className?: string;
  id?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-11 h-6 p-0.5',
    thumb: 'w-5 h-5',
    translate: 20,
    iconSize: 'w-3.5 h-3.5',
  },
  md: {
    container: 'w-12 h-7 p-0.5',
    thumb: 'w-6 h-6',
    translate: 20,
    iconSize: 'w-3.5 h-3.5',
  },
  lg: {
    container: 'w-14 h-8 p-1',
    thumb: 'w-6 h-6',
    translate: 24,
    iconSize: 'w-4 h-4',
  },
};

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  checked,
  onChange,
  label,
  size = 'sm',
  variant = 'default',
  icons,
  disabled = false,
  className = '',
  id,
}) => {
  const config = sizeConfig[size] || sizeConfig.sm;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${label ? 'gap-2' : ''} ${className}`}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle switch'}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2 ${
          config.container
        } ${
          checked
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-[0_0_14px_rgba(99,91,255,0.5)] border border-indigo-400/40 text-white'
            : 'bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border border-amber-300/80 shadow-[0_0_10px_rgba(245,158,11,0.25)] text-slate-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          animate={{
            x: checked ? config.translate : 0,
          }}
          className={`flex items-center justify-center rounded-full shadow-md transition-colors duration-200 ${
            checked
              ? 'bg-[#0b101e] text-indigo-300 border border-indigo-500/30'
              : 'bg-white text-amber-500 border border-amber-200/70 shadow-sm'
          } ${config.thumb}`}
        >
          {variant === 'icon' && icons && (
            <motion.div
              key={checked ? 'on' : 'off'}
              initial={{ scale: 0.5, rotate: checked ? -90 : 90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {checked ? icons.on : icons.off}
            </motion.div>
          )}
        </motion.div>
      </button>

      {label && variant === 'default' && (
        <span
          onClick={handleToggle}
          className="text-xs sm:text-sm font-medium text-slate-300 cursor-pointer"
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default AnimatedToggle;
