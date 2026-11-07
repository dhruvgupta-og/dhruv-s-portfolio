"use client";

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '@/lib/sound';

export interface TypewriterProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'li' | 'strong' | 'b' | 'em';
  className?: string;
  speed?: number; // ms per tick
  delay?: number; // delay before starting in ms
  threshold?: number; // intersection threshold
  cursor?: string;
  soundEnabled?: boolean;
  prefix?: string;
  charsPerTick?: number;
  onComplete?: () => void;
  disabled?: boolean;
}

export function TypewriterOnScroll({
  text,
  as: Component = 'span',
  className = "",
  speed,
  delay = 0,
  threshold = 0.1,
  cursor = "█",
  soundEnabled = true,
  prefix = "",
  charsPerTick: forcedCharsPerTick,
  onComplete,
  disabled = false
}: TypewriterProps) {
  const len = text.length;
  const [revealedCount, setRevealedCount] = useState(disabled ? len : 0);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(disabled);
  const containerRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  // Adaptive speed and chars per tick based on length
  const charsPerTick = forcedCharsPerTick ?? (len > 250 ? 3 : len > 100 ? 2 : 1);
  const tickInterval = speed ?? (len > 250 ? 10 : len > 100 ? 14 : 18);

  useEffect(() => {
    if (disabled || isFinished) return;

    const el = containerRef.current;
    if (!el) return;

    const startTyping = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setIsTyping(true);
    };

    // Check if element is already within viewport on initial load
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;

    if (inView) {
      const timer = setTimeout(startTyping, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            const timer = setTimeout(startTyping, delay);
            observer.disconnect();
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, disabled, isFinished]);

  useEffect(() => {
    if (!isTyping || isFinished || disabled) return;

    let localCount = revealedCount;
    const interval = setInterval(() => {
      localCount += charsPerTick;
      if (soundEnabled && localCount % (charsPerTick * 2) === 0) {
        sounds.playTypewriter(0.35);
      }
      if (localCount >= len) {
        setRevealedCount(len);
        clearInterval(interval);
        setIsTyping(false);
        setIsFinished(true);
        if (onComplete) onComplete();
      } else {
        setRevealedCount(localCount);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [isTyping, isFinished, charsPerTick, tickInterval, len, soundEnabled, onComplete, disabled, revealedCount]);

  if (disabled) {
    return React.createElement(Component, { className }, prefix, text);
  }

  const revealed = text.slice(0, revealedCount);
  const hidden = text.slice(revealedCount);

  return React.createElement(
    Component,
    { ref: containerRef, className },
    prefix,
    <span key="rev">{revealed}</span>,
    isTyping ? (
      <span key="cur" className="inline-block text-[#b22a1d] font-mono animate-pulse select-none ml-0.5">
        {cursor}
      </span>
    ) : null,
    !isFinished ? (
      <span key="hid" className="opacity-0 select-none pointer-events-none" aria-hidden="true">
        {hidden}
      </span>
    ) : null
  );
}

export default TypewriterOnScroll;
