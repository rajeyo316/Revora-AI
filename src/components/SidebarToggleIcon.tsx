"use client";

import React from 'react';

export interface SidebarToggleIconProps {
  isOpen: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * SidebarToggleIcon
 * Smooth animated SVG icon that morphs between open (wide panel) and closed (narrow column) sidebar panel states.
 */
export const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({
  isOpen,
  strokeWidth = 1.5,
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Outer container box */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Internal sidebar partition path that animates */}
      <line
        x1={isOpen ? '9' : '7'}
        y1="3"
        x2={isOpen ? '9' : '7'}
        y2="21"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Arrow chevron indicator indicating collapse/expand direction */}
      <path
        d={isOpen ? 'M15 9l-3 3 3 3' : 'M13 9l3 3-3 3'}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </svg>
  );
};

export default SidebarToggleIcon;
