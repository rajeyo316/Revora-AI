"use client";

import React, { useState, useEffect } from 'react';
import { AnimatedToggle } from '@/components/smoothui/components/animated-toggle';
import { useTheme } from '../context/ThemeContext';

export const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-amber-500"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-slate-100"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

interface ThemeToggleProps {
  showDualToggles?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showDualToggles = false,
  className = '',
  size = 'sm',
}) => {
  const { theme, setTheme } = useTheme();
  // checked: true when in dark mode, false in light mode
  const [checked, setChecked] = useState<boolean>(theme === 'dark');

  // Synchronize state with ThemeContext
  useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  const handleToggleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    setTheme(newChecked ? 'dark' : 'light');
  };

  if (showDualToggles) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Toggle 1: Default variant */}
        <AnimatedToggle
          checked={checked}
          label="Toggle"
          onChange={handleToggleChange}
          size={size}
          variant="default"
        />

        {/* Toggle 2: Icon variant with SunIcon and MoonIcon */}
        <AnimatedToggle
          checked={checked}
          icons={{
            off: <SunIcon />,
            on: <MoonIcon />,
          }}
          label="Theme toggle"
          onChange={handleToggleChange}
          size={size}
          variant="icon"
        />
      </div>
    );
  }

  // Single header navbar toggle with smooth AnimatedToggle icon variant
  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <AnimatedToggle
        checked={checked}
        icons={{
          off: <SunIcon />,
          on: <MoonIcon />,
        }}
        label="Theme toggle"
        onChange={handleToggleChange}
        size={size}
        variant="icon"
      />
    </div>
  );
};

export default ThemeToggle;
