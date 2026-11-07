"use client";

import React from 'react';
import { Orbit, RotateCcw, Volume2, VolumeX, ArrowUp } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface BroadsheetDockProps {
  isZeroG: boolean;
  onToggleZeroG: () => void;
  onToss: () => void;
  floatingCount?: number;
}

export default function BroadsheetDock({
  isZeroG,
  onToggleZeroG,
  onToss,
}: BroadsheetDockProps) {
  const [isMuted, setIsMuted] = React.useState(false);

  const handleAudioToggle = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playTypewriter(0.7);
    }
  };

  const scrollToTop = () => {
    sounds.playPaperRustle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-[#F9F8F6]/95 backdrop-blur-md border border-[#18181B] shadow-[3px_3px_0px_#18181B] rounded-sm select-none"
      aria-label="Interactive Controls"
    >
      {/* Zero-G Mode Button */}
      <button
        onClick={() => {
          sounds.playZeroGRelease();
          onToggleZeroG();
        }}
        className={`px-3 py-1.5 flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer rounded-sm ${
          isZeroG 
            ? 'bg-[#991B1B] text-white hover:bg-[#18181B]' 
            : 'bg-[#18181B] text-white hover:bg-[#0F4C64]'
        }`}
        title={isZeroG ? "Reset elements to grid layout" : "Release elements into Zero-G physics sandbox"}
      >
        {isZeroG ? (
          <>
            <RotateCcw className="w-3.5 h-3.5 animate-spin-once" />
            <span>RESET GRID</span>
          </>
        ) : (
          <>
            <Orbit className="w-3.5 h-3.5" />
            <span>ZERO-G PHYSICS</span>
          </>
        )}
      </button>

      {/* Toss Action (Visible only when in Zero-G) */}
      {isZeroG && (
        <button
          onClick={onToss}
          className="px-2.5 py-1.5 bg-[#FFFFFF] border border-[#18181B] text-[#18181B] hover:bg-[#F0EDE6] text-xs font-mono font-bold uppercase transition-colors cursor-pointer rounded-sm"
          title="Fling floating bodies in random directions"
        >
          FLING
        </button>
      )}

      {/* Sound Toggle */}
      <button
        onClick={handleAudioToggle}
        className={`px-2.5 py-1.5 border border-[#18181B] flex items-center gap-1.5 text-xs font-mono font-semibold cursor-pointer transition-colors rounded-sm ${
          !isMuted 
            ? 'bg-[#FFFFFF] text-[#18181B] hover:bg-[#F0EDE6]' 
            : 'bg-[#FEE2E2] text-[#991B1B]'
        }`}
        title="Toggle subtle tactile sound effects"
      >
        {!isMuted ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">{!isMuted ? 'AUDIO' : 'MUTED'}</span>
      </button>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="p-1.5 bg-[#FFFFFF] border border-[#18181B] text-[#18181B] hover:bg-[#F0EDE6] transition-colors cursor-pointer rounded-sm"
        title="Back to Top"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
