"use client";

import React from "react";
import { cn } from "@/lib/utils";

type TColorProp = string | string[];

export interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  shineColor?: TColorProp;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * @name Shine Border
 * @description An animated background border effect with shine animation using CSS radial gradient & masks.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 2,
  duration = 10,
  color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  shineColor,
  className,
  style,
  children,
  ...props
}: ShineBorderProps) {
  const activeColor = shineColor ?? color;
  const colors = Array.isArray(activeColor) ? activeColor : [activeColor];

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          "--background-radial-gradient": `radial-gradient(circle at center, ${colors.join(", ")}, transparent 80%)`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[var(--border-radius)] z-0",
        "before:absolute before:inset-0 before:size-full before:rounded-[var(--border-radius)] before:p-[var(--border-width)]",
        "before:[background-image:var(--background-radial-gradient)] before:[background-size:300%_300%]",
        "before:animate-[shine-pulse_var(--duration)_infinite_linear]",
        "before:[mask:var(--mask-linear-gradient)] before:[mask-composite:exclude] before:[-webkit-mask:var(--mask-linear-gradient)] before:[-webkit-mask-composite:xor]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default ShineBorder;
