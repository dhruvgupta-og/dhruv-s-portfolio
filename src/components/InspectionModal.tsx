"use client";

import React, { useEffect } from 'react';
import { ModalContent, ProjectItem } from '@/types/portfolio';
import { sounds } from '@/lib/sound';
import { ExternalLink, X } from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface InspectionModalProps {
  content: ModalContent | null;
  onClose: () => void;
}

export default function InspectionModal({ content, onClose }: InspectionModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playPaperRustle();
        onClose();
      }
    };
    if (content) {
      sounds.playStamp();
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, onClose]);

  if (!content) return null;

  const { type, title, subtitle, stampText, data } = content;
  const project = type === 'project' ? (data as ProjectItem) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18181B]/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => {
        sounds.playPaperRustle();
        onClose();
      }}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F9F8F6] border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#18181B] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#991B1B] uppercase tracking-wider">
              SYSTEM DOSSIER //
            </span>
            <span className="font-mono text-[10px] bg-[#18181B] text-[#F9F8F6] px-2 py-0.5 uppercase font-bold">
              {type}
            </span>
            {stampText && (
              <span className="font-mono text-[10px] border border-[#991B1B] text-[#991B1B] px-1.5 py-0.5 font-bold uppercase">
                {stampText}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              sounds.playTypewriter();
              onClose();
            }}
            className="p-1 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#18181B] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#18181B] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-sans text-sm text-[#52525B] mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Project Specific Details */}
        {project && (
          <div className="space-y-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-[#E4E1DA] bg-[#FFFFFF] px-3">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="text-center py-1">
                  <span className="block font-mono text-[10px] text-[#71717A] uppercase font-bold">METRIC 0{idx + 1}</span>
                  <span className="font-mono text-xs font-bold text-[#0F4C64]">{metric}</span>
                </div>
              ))}
            </div>

            {/* Architectural Highlights */}
            <div className="space-y-3 font-sans text-xs md:text-sm text-[#27272A] leading-relaxed">
              {project.bulletPoints.map((pt, idx) => (
                <div key={idx} className="p-3 bg-[#FFFFFF] border border-[#E4E1DA]">
                  <strong className="block font-mono text-xs text-[#18181B] font-bold mb-1">
                    • {pt.heading}
                  </strong>
                  <p className="text-[#52525B]">{pt.description}</p>
                </div>
              ))}
            </div>

            {/* Architecture Flow */}
            {project.architectureDiagram && (
              <div className="p-3 bg-[#18181B] text-[#93C5FD] font-mono text-[11px] overflow-x-auto rounded-sm leading-relaxed">
                <span className="text-[#71717A] block text-[9px] mb-1 uppercase font-bold tracking-wider">// System Data Flow</span>
                {project.architectureDiagram}
              </div>
            )}

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-[#FFFFFF] border border-[#18181B] font-mono text-[10px] font-semibold text-[#18181B]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-[#18181B]">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0F4C64] text-white hover:bg-[#18181B] font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
                >
                  <span>Visit Production Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#18181B] hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Inspect Code</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Generic Content Fallback */}
        {!project && (
          <div className="p-4 bg-[#FFFFFF] border border-[#E4E1DA] font-sans text-sm text-[#27272A] leading-relaxed">
            <p className="font-medium text-[#18181B]">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
