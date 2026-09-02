import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position references for smooth interpolation (inertia)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch / coarse pointer devices or reduced motion preference
    const checkTouch = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return isCoarse || isTouch || prefersReducedMotion;
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if mouse is hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-interactive="true"]');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      if (rippleRef.current) {
        rippleRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(1)`;
        rippleRef.current.style.opacity = '0.5';
        setTimeout(() => {
          if (rippleRef.current) {
            rippleRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(2.4)`;
            rippleRef.current.style.opacity = '0';
          }
        }, 10);
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth inertia loop for trailing ring
    const renderLoop = () => {
      // Lerp ring towards mouse position (factor 0.18 for silky smooth lag)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Click Ripple Effect */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-cyan-400/80 bg-cyan-500/10 pointer-events-none transition-all duration-300 ease-out opacity-0 will-change-transform"
      />

      {/* Smooth Trailing Glow Ring with Inertia */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform transition-[width,height,margin,border-color,background-color] duration-200 ease-out ${
          isHovered
            ? '-ml-6 -mt-6 w-12 h-12 rounded-full border border-cyan-400/60 bg-cyan-400/[0.07] backdrop-blur-[0.5px] shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : isClicking
            ? '-ml-4 -mt-4 w-8 h-8 rounded-full border border-blue-400/80 bg-blue-500/20'
            : '-ml-4 -mt-4 w-8 h-8 rounded-full border border-indigo-400/40 bg-indigo-500/[0.03]'
        }`}
      />

      {/* Center High-Precision Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform transition-[width,height,margin,background-color] duration-150 ease-out ${
          isHovered
            ? '-ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            : isClicking
            ? '-ml-1 -mt-1 w-2 h-2 rounded-full bg-blue-300'
            : '-ml-1 -mt-1 w-2 h-2 rounded-full bg-indigo-400'
        }`}
      />
    </div>
  );
};

export default CustomCursor;
