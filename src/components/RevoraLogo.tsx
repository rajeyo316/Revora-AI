import React from 'react';
import { motion } from 'motion/react';

interface RevoraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showText?: boolean;
  isDark?: boolean;
}

export const RevoraLogo: React.FC<RevoraLogoProps> = ({
  size = 'md',
  className = '',
  interactive = true,
  onClick,
  showText = false,
  isDark = true,
}) => {
  const getDimension = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 38;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      default:
        return 38;
    }
  };

  const dim = getDimension();

  const logoGraphic = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full transition-transform duration-300 ${
        interactive ? 'hover:scale-105 active:scale-95 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]' : ''
      }`}
      style={{
        width: dim,
        height: dim,
        boxShadow: '0 4px 14px 0 rgba(91, 97, 255, 0.35)',
      }}
    >
      <svg
        viewBox="0 0 512 512"
        width={dim}
        height={dim}
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="revoraBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C72FF" />
            <stop offset="50%" stopColor="#5B61FF" />
            <stop offset="100%" stopColor="#4F52E6" />
          </linearGradient>
          <filter id="revoraSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Circular Background */}
        <circle cx="256" cy="256" r="240" fill="url(#revoraBgGrad)" />

        {/* Heartbeat Growth Recovery Pulse Path (White with rounded stroke caps) */}
        <g filter="url(#revoraSoftGlow)">
          {/* Main Waveform Body */}
          <path
            d="M 108 268 H 182 L 222 176 C 228 162 242 162 248 176 L 278 358 C 283 372 297 372 302 358 L 338 252"
            stroke="#FFFFFF"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arrow Head Chevron pointing Up-Right */}
          <path
            d="M 326 264 L 372 254 C 382 251 388 260 384 270 L 366 312"
            stroke="#FFFFFF"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 text-left group ${className}`}
        aria-label="Revora AI - Go to Dashboard"
      >
        {logoGraphic}
        {showText && (
          <div className="flex items-center gap-1.5 font-sans">
            <span
              className={`font-extrabold tracking-tight ${
                dim >= 40 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
              } ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`}
            >
              Revora
            </span>
            <span
              className={`font-extrabold tracking-tight text-cyan-400 ${
                dim >= 40 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
              }`}
            >
              AI
            </span>
          </div>
        )}
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {logoGraphic}
      {showText && (
        <div className="flex items-center gap-1.5 font-sans">
          <span
            className={`font-extrabold tracking-tight ${
              dim >= 40 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
            } ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`}
          >
            Revora
          </span>
          <span
            className={`font-extrabold tracking-tight text-cyan-400 ${
              dim >= 40 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
            }`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default RevoraLogo;
