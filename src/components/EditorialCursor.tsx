"use client";

import React, { useEffect, useState, useRef } from 'react';

interface EditorialCursorProps {
  isZeroG?: boolean;
}

export default function EditorialCursor({ isZeroG = false }: EditorialCursorProps) {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ringPosRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .physics-draggable');
      setIsPointer(!!interactive);

      // Contextual cursor labels for editorial cards
      const projectCard = target.closest('[id*="phys-project"]');
      const ticketCard = target.closest('[id*="phys-ticket"]');
      const credentialCard = target.closest('[id*="phys-credential"]');

      if (projectCard) {
        setCursorLabel('VIEW ↗');
      } else if (ticketCard) {
        setCursorLabel('ADMIT');
      } else if (credentialCard) {
        setCursorLabel('VERIFY');
      } else if (isZeroG && target.closest('.physics-draggable')) {
        setCursorLabel('FLING');
      } else {
        setCursorLabel(null);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop for the outer trailing ring
    const loop = () => {
      const speed = 0.22;
      ringPosRef.current.x += (targetPosRef.current.x - ringPosRef.current.x) * speed;
      ringPosRef.current.y += (targetPosRef.current.y - ringPosRef.current.y) * speed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0px) translate(-50%, -50%)`;
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, isZeroG]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Precision Center Ink Dot */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0px) translate(-50%, -50%) scale(${isClicking ? 0.7 : isPointer ? 1.4 : 1})`,
        }}
      >
        <div className={`w-2 h-2 rounded-full transition-colors duration-150 ${
          isPointer || isZeroG ? 'bg-[#991B1B]' : 'bg-[#18181B]'
        }`} />
      </div>

      {/* 2. Trailing Editorial Reticle Ring */}
      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center transition-all duration-150 ${
          cursorLabel
            ? 'w-16 h-16 bg-[#18181B] text-white border border-[#18181B] rounded-full shadow-lg'
            : isPointer
              ? 'w-10 h-10 border-2 border-[#991B1B] rounded-full bg-[#991B1B]/10'
              : isZeroG
                ? 'w-12 h-12 border border-dashed border-[#0F4C64] rounded-full animate-spin-slow'
                : 'w-7 h-7 border border-[#18181B]/50 rounded-full'
        }`}
      >
        {cursorLabel && (
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase select-none animate-in fade-in zoom-in-75 duration-100">
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}

