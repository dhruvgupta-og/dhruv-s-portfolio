"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { 
  CANDIDATE_INFO, 
  PROJECTS, 
  SKILLS_CATEGORIES,
  SKILLS 
} from '@/data/portfolioData';
import { ModalContent } from '@/types/portfolio';
import { sounds } from '@/lib/sound';
import BroadsheetDock from './BroadsheetDock';
import InspectionModal from './InspectionModal';
import EditorialCursor from './EditorialCursor';
import { 
  Mail, 
  Terminal, 
  Code2, 
  Share2, 
  Orbit, 
  RotateCcw, 
  ExternalLink, 
  School, 
  Send, 
  Copy, 
  Check, 
  ArrowUp, 
  Newspaper,
  CheckCircle2
} from 'lucide-react';

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface FloatingStateItem {
  id: string;
  x: number;
  y: number;
  angle: number;
}

export default function PhysicsGazette() {
  const [isZeroG, setIsZeroG] = useState(false);
  const [floatingList, setFloatingList] = useState<FloatingStateItem[]>([]);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const activeBodiesRef = useRef<Map<string, Matter.Body>>(new Map());

  // Measure static DOM elements for physics transition
  const getElementScreenRect = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  };

  // Launch Anti-Gravity Sandbox
  const startZeroG = useCallback(() => {
    sounds.playZeroGRelease();
    setIsZeroG(true);

    const { Engine, World, Bodies } = Matter;

    const engine = Engine.create({
      gravity: {
        x: 0,
        y: -0.012,
        scale: 0.001
      }
    });
    engineRef.current = engine;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Viewport Boundary Cushions
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      restitution: 0.85,
      friction: 0.05
    };

    const ground = Bodies.rectangle(vw / 2, vh + 50, vw * 2, 100, wallOptions);
    const ceiling = Bodies.rectangle(vw / 2, -50, vw * 2, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, vh / 2, 100, vh * 2, wallOptions);
    const rightWall = Bodies.rectangle(vw + 50, vh / 2, 100, vh * 2, wallOptions);

    World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Curated Physics Targets
    const targets = [
      { id: 'phys-ticket-stub', w: 300, h: 360 },
      { id: 'phys-project-zappit', w: 340, h: 300 },
      { id: 'phys-project-codexa', w: 320, h: 280 },
      { id: 'phys-project-rgpv', w: 320, h: 280 },
      { id: 'phys-credential-itm', w: 280, h: 180 },
      { id: 'phys-chip-cpp', w: 140, h: 48 },
      { id: 'phys-chip-react', w: 140, h: 48 },
      { id: 'phys-chip-firebase', w: 160, h: 48 },
      { id: 'phys-chip-node', w: 140, h: 48 }
    ];

    targets.forEach((t, i) => {
      const rect = getElementScreenRect(t.id);
      const posX = rect ? Math.min(Math.max(rect.x, 120), vw - 120) : 140 + (i % 3) * (vw / 3.2);
      const posY = rect ? Math.min(Math.max(rect.y, 100), vh - 100) : 180 + Math.floor(i / 3) * 160;

      const body = Bodies.rectangle(posX, posY, t.w, t.h, {
        restitution: 0.8,
        frictionAir: 0.025,
        density: 0.001,
        angle: (Math.random() - 0.5) * 0.15,
        label: t.id
      });

      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2.0,
        y: -1.0 - Math.random() * 1.5
      });

      activeBodiesRef.current.set(t.id, body);
      World.add(engine.world, body);
    });

    let lastTime = performance.now();
    const updatePhysics = (now: number) => {
      const delta = Math.min(now - lastTime, 32);
      lastTime = now;

      Engine.update(engine, delta);

      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const snapshot: FloatingStateItem[] = [];

      activeBodiesRef.current.forEach((body, id) => {
        // Gentle drift turbulence
        const windX = Math.sin(now * 0.001 + body.id) * 0.0001;
        const windY = Math.cos(now * 0.0008 + body.id) * 0.00008;
        Matter.Body.applyForce(body, body.position, { x: windX, y: windY });

        // Mouse cursor repulsion
        const dx = body.position.x - mx;
        const dy = body.position.y - my;
        const distSq = dx * dx + dy * dy;
        const repulsionRadius = 150;

        if (distSq < repulsionRadius * repulsionRadius && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / repulsionRadius) * 0.006;
          Matter.Body.applyForce(body, body.position, {
            x: (dx / dist) * force,
            y: (dy / dist) * force
          });
        }

        snapshot.push({
          id,
          x: body.position.x,
          y: body.position.y,
          angle: body.angle
        });
      });

      setFloatingList(snapshot);
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  // Stop Zero-G and snap back
  const stopZeroG = useCallback(() => {
    sounds.playPressReset();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
    }
    activeBodiesRef.current.clear();
    setFloatingList([]);
    setIsZeroG(false);
  }, []);

  // Fling bodies in zero-g
  const handleToss = useCallback(() => {
    sounds.playPaperRustle();
    activeBodiesRef.current.forEach((body) => {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.035,
        y: -0.02 - Math.random() * 0.035
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
    });
  }, []);

  // Mouse position tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  // Inspect modal handler
  const openEntityModal = (id: string) => {
    sounds.playTicketPunch();
    if (id.includes('zappit')) {
      setModalContent({
        type: 'project',
        title: PROJECTS[0].title,
        subtitle: PROJECTS[0].subtitle,
        stampText: 'CO-FOUNDER',
        data: PROJECTS[0]
      });
    } else if (id.includes('codexa')) {
      setModalContent({
        type: 'project',
        title: PROJECTS[1].title,
        subtitle: PROJECTS[1].subtitle,
        stampText: 'DSA ENGINE',
        data: PROJECTS[1]
      });
    } else if (id.includes('rgpv')) {
      setModalContent({
        type: 'project',
        title: PROJECTS[2].title,
        subtitle: PROJECTS[2].subtitle,
        stampText: '10K+ REACH',
        data: PROJECTS[2]
      });
    } else if (id.includes('ticket')) {
      setModalContent({
        type: 'ticket',
        title: 'Candidate Profile · Dhruv Gupta',
        subtitle: 'B.Tech CSE at ITM Gwalior · SDE Intern Pipeline 2025',
        stampText: 'VERIFIED',
        data: CANDIDATE_INFO
      });
    }
  };

  // Drag interaction in zero-g
  const handleEntityPointerDown = (id: string, e: React.PointerEvent) => {
    if (!isZeroG) return;
    const body = activeBodiesRef.current.get(id);
    if (!body) return;

    sounds.playPaperRustle();
    const startX = e.clientX;
    const startY = e.clientY;
    let prevX = startX;
    let prevY = startY;
    let vx = 0;
    let vy = 0;

    const onPointerMove = (moveEvt: PointerEvent) => {
      vx = (moveEvt.clientX - prevX) * 0.35;
      vy = (moveEvt.clientY - prevY) * 0.35;
      prevX = moveEvt.clientX;
      prevY = moveEvt.clientY;

      Matter.Body.setPosition(body, {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      Matter.Body.setVelocity(body, {
        x: Math.max(-10, Math.min(10, vx)),
        y: Math.max(-10, Math.min(10, vy))
      });

      if (Math.abs(prevX - startX) < 5 && Math.abs(prevY - startY) < 5) {
        openEntityModal(id);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(CANDIDATE_INFO.email);
    setCopiedEmail(true);
    sounds.playStamp();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCarriageBell();
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 6000);
  };

  return (
    <div className="relative min-h-screen bg-[#F9F8F6] text-[#18181B] selection:bg-[#E4E1DA] selection:text-[#18181B]" ref={containerRef}>
      <EditorialCursor isZeroG={isZeroG} />
      
      {/* ========================================================= */}
      {/* 1. TOP STATUS TICKER STRIP                                */}
      {/* ========================================================= */}
      <aside className="w-full bg-[#18181B] text-[#F9F8F6] px-4 md:px-8 py-2 font-mono text-xs tracking-wider flex flex-wrap items-center justify-between border-b border-[#18181B]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#991B1B] animate-pulse"></span>
          <span className="font-bold tracking-widest text-[#F9F8F6]">DHRUV GUPTA</span>
          <span className="text-[#71717A] hidden sm:inline">·</span>
          <span className="text-[#A1A1AA] hidden sm:inline">FULL-STACK ENGINEER &amp; CO-FOUNDER OF ZAPPIT</span>
        </div>

        <button 
          onClick={handleCopyEmail}
          className="text-[#E4E1DA] hover:text-white flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
          title="Click to copy email address"
        >
          {copiedEmail ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Mail className="w-3.5 h-3.5 text-[#E4E1DA]" />
          )}
          <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : CANDIDATE_INFO.email}</span>
        </button>
      </aside>

      {/* ========================================================= */}
      {/* 2. MASTHEAD HEADER                                        */}
      {/* ========================================================= */}
      <header className="w-full bg-[#F9F8F6] border-b border-[#18181B]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-7 pb-4">
          
          {/* Dateline */}
          <div className="border-b border-[#E4E1DA] pb-2 mb-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#52525B] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span>ESTABLISHED 2024</span>
              <span>•</span>
              <span className="text-[#991B1B] font-bold">GWALIOR, M.P., INDIA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0F4C64] font-bold">SDE CANDIDATE PIPELINE</span>
              <span>•</span>
              <span>SUMMER / FALL 2025</span>
            </div>
          </div>

          {/* Grand Masthead Title */}
          <div className="text-center relative py-2">
            <p className="font-mono text-xs tracking-[0.25em] text-[#0F4C64] uppercase font-bold mb-1">
              An Editorial Engineering Portfolio
            </p>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#18181B] font-black uppercase">
              The Gupta Gazette
            </h1>

            <p className="font-sans text-[#52525B] text-sm md:text-base mt-2 max-w-2xl mx-auto italic">
              “Scalable Web Platforms · Real-Time Campus Systems · Algorithmic Rigor”
            </p>

            {/* Red Stamp Accent */}
            <div className="absolute right-0 top-0 hidden md:block">
              <span className="inline-block border border-[#991B1B] text-[#991B1B] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                {CANDIDATE_INFO.badge}
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="border-t border-b border-[#18181B] py-2.5 mt-5 flex flex-wrap items-center justify-between gap-3 text-[#18181B]">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider font-semibold">
              <a href="#lead-profile" className="text-[#991B1B] hover:underline font-bold">
                § Profile
              </a>
              <a href="#systems" className="hover:text-[#0F4C64] transition-colors">
                § Production Systems
              </a>
              <a href="#arsenal" className="hover:text-[#0F4C64] transition-colors">
                § Technical Arsenal
              </a>
              <a href="#education" className="hover:text-[#0F4C64] transition-colors">
                § Education
              </a>
              <a href="#contact" className="hover:text-[#0F4C64] transition-colors">
                § Inquiries
              </a>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <a
                href={CANDIDATE_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F0EDE6] border border-[#18181B] rounded-sm flex items-center gap-1.5 font-bold transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GITHUB</span>
              </a>

              <a
                href={CANDIDATE_INFO.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F0EDE6] border border-[#18181B] rounded-sm flex items-center gap-1.5 font-bold transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LEETCODE</span>
              </a>

              <a
                href={CANDIDATE_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F0EDE6] border border-[#18181B] rounded-sm flex items-center gap-1.5 font-bold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LINKEDIN</span>
              </a>

              <button
                onClick={() => {
                  if (!isZeroG) startZeroG();
                  else stopZeroG();
                }}
                className={`px-3 py-1 font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#18181B] ${
                  isZeroG 
                    ? 'bg-[#991B1B] text-white hover:bg-[#18181B]' 
                    : 'bg-[#18181B] text-white hover:bg-[#0F4C64]'
                }`}
              >
                {isZeroG ? (
                  <RotateCcw className="w-3.5 h-3.5" />
                ) : (
                  <Orbit className="w-3.5 h-3.5" />
                )}
                <span>{isZeroG ? 'RESET GRID' : 'ZERO-G MODE'}</span>
              </button>
            </div>
          </nav>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MAIN BROADSHEET BODY                                   */}
      {/* ========================================================= */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 flex flex-col gap-14" id="lead-profile">
        
        {/* SECTION 1: LEAD HERO & CANDIDATE TICKET */}
        <section className="border-b border-[#18181B] pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Candidate Admission Ticket Stub */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div 
                id="phys-ticket-stub"
                onClick={() => openEntityModal('phys-ticket-stub')}
                className={`p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] relative cursor-pointer hover:-translate-y-0.5 transition-transform ${
                  isZeroG ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="border-b border-dashed border-[#18181B] pb-2 mb-4 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#991B1B] tracking-wider uppercase">
                    CANDIDATE ADMISSION STUB
                  </span>
                  <span className="font-mono text-[9px] bg-[#18181B] text-[#F9F8F6] px-1.5 py-0.5 font-bold uppercase">
                    PASS 2025
                  </span>
                </div>

                <div className="text-center my-3">
                  <span className="font-mono text-[10px] text-[#0F4C64] uppercase font-bold tracking-wider block mb-0.5">
                    Full-Stack Software Engineer
                  </span>
                  <h2 className="font-serif text-3xl font-black text-[#18181B] uppercase tracking-tight">
                    {CANDIDATE_INFO.name}
                  </h2>
                  <p className="font-mono text-xs text-[#991B1B] font-bold mt-0.5">
                    CO-FOUNDER AT ZAPPIT
                  </p>
                  <p className="font-sans text-xs text-[#52525B] mt-1">
                    ITM Gwalior · B.Tech CSE (2024–2028)
                  </p>
                </div>

                {/* Key Metrics Ledger */}
                <div className="space-y-2 border-t border-b border-[#E4E1DA] py-3 my-3 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[#52525B]">PRODUCTION SYSTEMS:</span>
                    <span className="font-bold text-[#18181B] bg-[#F0EDE6] px-1.5 py-0.5 border border-[#18181B]/20">
                      3 LIVE APPS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#52525B]">STUDENT REACH:</span>
                    <span className="font-bold text-[#991B1B]">10,000+ USERS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#52525B]">CORE STACK:</span>
                    <span className="font-bold text-[#0F4C64]">REACT · NODE · FIREBASE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#52525B]">DSA DISCIPLINE:</span>
                    <span className="font-bold text-[#18181B]">C++ (LEETCODE)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button 
                    onClick={handleCopyEmail}
                    className="w-full py-2 bg-[#18181B] text-white hover:bg-[#0F4C64] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>COPY CANDIDATE EMAIL</span>
                  </button>
                  <a
                    href={CANDIDATE_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#F0EDE6] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>INSPECT GITHUB REPOSITORIES</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Article */}
            <div className="lg:col-span-8 flex flex-col gap-4 lg:pl-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#991B1B] uppercase tracking-wider">
                  FOUNDER ARCHITECTURE // CANDIDATE DOSSIER
                </span>
                <span className="text-[#A1A1AA]">·</span>
                <span className="font-mono text-[11px] text-[#52525B]">SUMMER / FALL 2025</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#18181B] tracking-tight leading-tight font-black">
                {CANDIDATE_INFO.headline}
              </h2>

              <p className="font-sans text-base md:text-lg text-[#27272A] leading-relaxed">
                <strong className="font-serif font-black text-xl text-[#0F4C64] pr-1">GWALIOR, M.P. —</strong>
                {CANDIDATE_INFO.leadParagraph}
              </p>

              <p className="font-sans text-sm md:text-base text-[#52525B] leading-relaxed">
                {CANDIDATE_INFO.secondaryParagraph}
              </p>

              {/* Editorial Quote */}
              <blockquote className="my-2 p-4 border-l-2 border-[#991B1B] bg-[#FFFFFF] border-y border-r border-[#E4E1DA]">
                <p className="font-serif text-base md:text-lg italic font-medium text-[#18181B] leading-relaxed">
                  {CANDIDATE_INFO.quote}
                </p>
                <cite className="block font-mono text-[11px] uppercase text-[#71717A] mt-2 tracking-wider not-italic">
                  — Dhruv Gupta, Co-Founder at Zappit
                </cite>
              </blockquote>

              {/* Core Skill Chips */}
              <div className="flex flex-wrap gap-2 pt-2 items-center">
                <span className="font-mono text-xs font-bold text-[#52525B] uppercase tracking-wider mr-1">
                  CORE ARSENAL:
                </span>
                <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#18181B] text-xs font-mono font-bold text-[#18181B]">
                  C++ (DSA)
                </span>
                <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#18181B] text-xs font-mono font-bold text-[#18181B]">
                  REACT.JS &amp; NEXT.JS
                </span>
                <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#18181B] text-xs font-mono font-bold text-[#18181B]">
                  FIREBASE FIRESTORE
                </span>
                <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#18181B] text-xs font-mono font-bold text-[#0F4C64]">
                  NODE.JS &amp; EXPRESS
                </span>
                <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#18181B] text-xs font-mono font-bold text-[#991B1B]">
                  SYSTEM DESIGN
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: PRODUCTION SYSTEMS (3 CORE PROJECTS)          */}
        {/* ========================================================= */}
        <section className="border-b border-[#18181B] pb-12 flex flex-col gap-8" id="systems">
          <div className="border-t border-b border-[#18181B] py-2.5 flex flex-wrap items-center justify-between text-xs font-mono uppercase tracking-wider text-[#18181B]">
            <span className="font-bold flex items-center gap-2 text-[#991B1B]">
              <Newspaper className="w-4 h-4 text-[#991B1B]" />
              PRODUCTION SYSTEMS &amp; LIVE PLATFORMS
            </span>
            <span className="text-[#52525B]">3 VERIFIED ARCHITECTURES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Project 1: Zappit */}
            <article 
              id="phys-project-zappit"
              onClick={() => openEntityModal('phys-project-zappit')}
              className={`p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] relative cursor-pointer hover:shadow-[5px_5px_0px_#18181B] hover:-translate-y-0.5 transition-all flex flex-col justify-between ${
                isZeroG ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
                    FLAGSHIP STARTUP
                  </span>
                  <span className="font-mono text-[10px] bg-[#0F4C64] text-white px-1.5 py-0.5 font-bold uppercase">
                    LIVE AT ZAPPIT.SHOP
                  </span>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#18181B] mb-2">
                  Zappit — Food Delivery
                </h3>

                <p className="font-sans text-xs text-[#52525B] leading-relaxed mb-4">
                  Hyper-local campus ordering engine connecting university students directly with campus dining merchants in real time.
                </p>

                <ul className="space-y-2 font-sans text-xs text-[#27272A] border-t border-[#E4E1DA] pt-3 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Real-time cart &amp; sub-150ms order fulfillment queue via Firebase Firestore.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Multi-store architecture with zero-lag cafe kitchen display terminal.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Role-based access control protecting student orders and merchant inventory.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 border-t border-[#E4E1DA]">
                <a
                  href="https://zappit.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-[#0F4C64] text-white hover:bg-[#18181B] font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1"
                >
                  <span>Visit zappit.shop</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEntityModal('phys-project-zappit');
                  }}
                  className="px-3 py-1.5 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#F0EDE6] font-mono text-xs font-bold uppercase transition-colors"
                >
                  Architecture Spec
                </button>
              </div>
            </article>

            {/* Project 2: Codexa */}
            <article 
              id="phys-project-codexa"
              onClick={() => openEntityModal('phys-project-codexa')}
              className={`p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] relative cursor-pointer hover:shadow-[5px_5px_0px_#18181B] hover:-translate-y-0.5 transition-all flex flex-col justify-between ${
                isZeroG ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#0F4C64] uppercase tracking-wider">
                    DEVELOPER TOOLING
                  </span>
                  <span className="font-mono text-[10px] border border-[#991B1B] text-[#991B1B] px-1.5 py-0.5 font-bold uppercase">
                    84% DSA BENCHMARK
                  </span>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#18181B] mb-2">
                  Codexa — Placement Tracker
                </h3>

                <p className="font-sans text-xs text-[#52525B] leading-relaxed mb-4">
                  Interactive developer dashboard engineered to structure algorithmic problem-solving routines and track interview readiness.
                </p>

                <ul className="space-y-2 font-sans text-xs text-[#27272A] border-t border-[#E4E1DA] pt-3 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Visualized mastery across Arrays, Trees, Graphs, DP, and System Design.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Spaced repetition intervals flagging complex LeetCode problems for review.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Clean local persistence engine with zero slow external dependencies.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 border-t border-[#E4E1DA]">
                <a
                  href={CANDIDATE_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-[#18181B] text-white hover:bg-[#0F4C64] font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>GitHub Repo</span>
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEntityModal('phys-project-codexa');
                  }}
                  className="px-3 py-1.5 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#F0EDE6] font-mono text-xs font-bold uppercase transition-colors"
                >
                  Architecture Spec
                </button>
              </div>
            </article>

            {/* Project 3: RGPV Resources */}
            <article 
              id="phys-project-rgpv"
              onClick={() => openEntityModal('phys-project-rgpv')}
              className={`p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] relative cursor-pointer hover:shadow-[5px_5px_0px_#18181B] hover:-translate-y-0.5 transition-all flex flex-col justify-between ${
                isZeroG ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2 mb-3">
                  <span className="font-mono text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
                    ACADEMIC PLATFORM
                  </span>
                  <span className="font-mono text-[10px] bg-[#991B1B] text-white px-1.5 py-0.5 font-bold uppercase">
                    10,000+ STUDENTS
                  </span>
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#18181B] mb-2">
                  RGPV Resources Hub
                </h3>

                <p className="font-sans text-xs text-[#52525B] leading-relaxed mb-4">
                  High-traffic academic repository providing semester-wise curricula, vetted professor notes, and previous year question papers.
                </p>

                <ul className="space-y-2 font-sans text-xs text-[#27272A] border-t border-[#E4E1DA] pt-3 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Over 10,000+ collegiate students served across engineering semesters.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Hierarchical Firestore schema reducing read operations by 70%.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C64] shrink-0 mt-0.5" />
                    <span>Firebase Auth RBAC securing vetted professor and admin syllabus uploads.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 border-t border-[#E4E1DA]">
                <a
                  href="https://rgpvpaper.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-[#0F4C64] text-white hover:bg-[#18181B] font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1"
                >
                  <span>Visit rgpvpaper.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEntityModal('phys-project-rgpv');
                  }}
                  className="px-3 py-1.5 bg-[#FFFFFF] border border-[#18181B] hover:bg-[#F0EDE6] font-mono text-xs font-bold uppercase transition-colors"
                >
                  Architecture Spec
                </button>
              </div>
            </article>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: TECHNICAL ARSENAL (4 CLEAN CATEGORIES)        */}
        {/* ========================================================= */}
        <section className="border-b border-[#18181B] pb-12 flex flex-col gap-6" id="arsenal">
          <div className="border-t border-b border-[#18181B] py-2.5 flex flex-wrap items-center justify-between text-xs font-mono uppercase tracking-wider text-[#18181B]">
            <span className="font-bold text-[#0F4C64]">
              SECTION III: TECHNICAL ARSENAL &amp; COMPETENCIES
            </span>
            <span className="text-[#52525B]">INDEXED BY SYSTEM LAYER</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS_CATEGORIES.map((category) => (
              <div 
                key={category.code}
                className="p-5 bg-[#FFFFFF] border border-[#18181B] shadow-[2px_2px_0px_#18181B] flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-[10px] font-bold text-[#991B1B] uppercase tracking-wider mb-1">
                    LAYER {category.code} //
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#18181B] mb-3">
                    {category.title}
                  </h4>
                  <div className="space-y-2.5 font-sans text-xs">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="border-b border-[#F0EDE6] pb-1.5 last:border-none">
                        <strong className="font-mono text-xs text-[#18181B] block font-bold">
                          {skill.name}
                        </strong>
                        <span className="text-[#52525B] text-[11px] leading-tight block">
                          {skill.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: EDUCATION & ACADEMIC CREDENTIALS               */}
        {/* ========================================================= */}
        <section className="border-b border-[#18181B] pb-12 flex flex-col gap-6" id="education">
          <div className="border-t border-b border-[#18181B] py-2.5 flex flex-wrap items-center justify-between text-xs font-mono uppercase tracking-wider text-[#18181B]">
            <span className="font-bold text-[#991B1B]">
              SECTION IV: ACADEMIC CREDENTIALS
            </span>
            <span className="text-[#52525B]">INSTITUTIONAL RECORD</span>
          </div>

          <div 
            id="phys-credential-itm"
            className={`p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex flex-wrap items-center justify-between gap-6 ${
              isZeroG ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] font-bold text-[#0F4C64] uppercase tracking-wider block mb-1">
                UNDERGRADUATE DEGREE PROGRAM
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#18181B]">
                ITM Gwalior — B.Tech in Computer Science &amp; Engineering
              </h3>
              <p className="font-sans text-xs text-[#52525B] mt-1">
                Gwalior, Madhya Pradesh, India · Period: 2024 — 2028 (Expected)
              </p>
              <p className="font-sans text-xs text-[#27272A] mt-3 leading-relaxed">
                Core coursework in Data Structures &amp; Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, and Operating Systems. Combining academic fundamentals with independent software product delivery.
              </p>
            </div>

            <div className="text-right border-l border-[#18181B] pl-6 hidden md:block">
              <span className="font-mono text-[10px] font-bold text-[#991B1B] uppercase tracking-wider block">
                STATUS
              </span>
              <span className="font-mono text-sm font-bold text-[#18181B] block mt-0.5">
                ACTIVE SDE CANDIDATE
              </span>
              <span className="font-mono text-xs text-[#52525B] block mt-1">
                SUMMER / FALL 2025
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: INQUIRIES & DIRECT CONTACT                    */}
        {/* ========================================================= */}
        <section className="pb-16 flex flex-col gap-6" id="contact">
          <div className="border-t border-b border-[#18181B] py-2.5 flex flex-wrap items-center justify-between text-xs font-mono uppercase tracking-wider text-[#18181B]">
            <span className="font-bold text-[#0F4C64]">
              SECTION V: INQUIRIES &amp; DIRECT TRANSMISSION
            </span>
            <span className="text-[#52525B]">OPEN FOR INTERNSHIPS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Direct Contact Channels */}
            <div className="p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#18181B] mb-2">
                  Direct Communication Channels
                </h4>
                <p className="font-sans text-xs text-[#52525B] leading-relaxed mb-6">
                  I am available for Software Development Engineer (SDE) internships for Summer and Fall 2025. Feel free to copy my direct email or connect through my public developer profiles:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-[#E4E1DA] pb-2">
                    <span className="text-[#52525B]">DIRECT EMAIL:</span>
                    <button 
                      onClick={handleCopyEmail}
                      className="font-bold text-[#991B1B] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{CANDIDATE_INFO.email}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#E4E1DA] pb-2">
                    <span className="text-[#52525B]">GITHUB:</span>
                    <a 
                      href={CANDIDATE_INFO.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0F4C64] hover:underline flex items-center gap-1"
                    >
                      <span>@{CANDIDATE_INFO.githubUser}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#E4E1DA] pb-2">
                    <span className="text-[#52525B]">LEETCODE:</span>
                    <a 
                      href={CANDIDATE_INFO.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0F4C64] hover:underline flex items-center gap-1"
                    >
                      <span>@{CANDIDATE_INFO.leetcodeUser}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#52525B]">LINKEDIN:</span>
                    <a 
                      href={CANDIDATE_INFO.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#0F4C64] hover:underline flex items-center gap-1"
                    >
                      <span>/in/{CANDIDATE_INFO.linkedinUser}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleCopyEmail}
                  className="w-full py-2.5 bg-[#991B1B] text-white hover:bg-[#18181B] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL ADDRESS'}</span>
                </button>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="p-6 bg-[#FFFFFF] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B]">
              <h4 className="font-serif text-2xl font-bold text-[#18181B] mb-2">
                Send Direct Message
              </h4>
              <p className="font-sans text-xs text-[#52525B] leading-relaxed mb-4">
                Have a question or role inquiry? Send a quick message and I will reply to your email promptly.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#18181B] uppercase tracking-wider mb-1">
                    Your Name / Organization
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sarah Jenkins · Engineering Director"
                    className="w-full p-2.5 bg-[#F9F8F6] border border-[#18181B] font-mono text-xs focus:outline-none focus:border-[#991B1B]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#18181B] uppercase tracking-wider mb-1">
                    Your Email Address
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="sarah.jenkins@company.com"
                    className="w-full p-2.5 bg-[#F9F8F6] border border-[#18181B] font-mono text-xs focus:outline-none focus:border-[#991B1B]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-[#18181B] uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="Discussing SDE opportunities for Summer 2025..."
                    className="w-full p-2.5 bg-[#F9F8F6] border border-[#18181B] font-mono text-xs focus:outline-none focus:border-[#991B1B]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#18181B] text-white hover:bg-[#0F4C64] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>

              {contactSuccess && (
                <div className="mt-3 p-2.5 bg-[#ECFDF5] border border-[#059669] text-[#065F46] font-mono text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Message dispatched. Thank you for reaching out!</span>
                </div>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* ========================================================= */}
      {/* 4. ZERO-GRAVITY FLOATING OVERLAY                          */}
      {/* ========================================================= */}
      {isZeroG && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {floatingList.map((item) => {
            const { id } = item;
            let innerContent: React.ReactNode = null;
            let cardWidth = 260;

            if (id === 'phys-ticket-stub') {
              innerContent = (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#18181B] shadow-2xl text-center">
                  <span className="font-mono text-[9px] font-bold text-[#991B1B] uppercase tracking-wider block">
                    CANDIDATE PASS
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#18181B] uppercase mt-0.5">
                    {CANDIDATE_INFO.name}
                  </h4>
                  <p className="font-mono text-[10px] text-[#0F4C64] font-bold">Co-founder at Zappit</p>
                  <p className="font-sans text-[10px] text-[#52525B] mt-1">ITM Gwalior CSE · 2024–2028</p>
                </div>
              );
              cardWidth = 260;
            } else if (id === 'phys-project-zappit') {
              innerContent = (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#18181B] shadow-2xl">
                  <span className="font-mono text-[9px] bg-[#0F4C64] text-white px-1.5 py-0.5 font-bold uppercase inline-block mb-1">
                    zappit.shop
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#18181B]">Zappit — Food Delivery</h4>
                  <p className="font-sans text-xs text-[#52525B] mt-1">Real-time campus order queues on React &amp; Firestore.</p>
                </div>
              );
              cardWidth = 280;
            } else if (id === 'phys-project-codexa') {
              innerContent = (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#18181B] shadow-2xl">
                  <span className="font-mono text-[9px] border border-[#991B1B] text-[#991B1B] px-1.5 py-0.5 font-bold uppercase inline-block mb-1">
                    84% DSA GAUGE
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#18181B]">Codexa Placement Tracker</h4>
                  <p className="font-sans text-xs text-[#52525B] mt-1">Algorithmic progress visualizer across 450+ problems.</p>
                </div>
              );
              cardWidth = 280;
            } else if (id === 'phys-project-rgpv') {
              innerContent = (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#18181B] shadow-2xl">
                  <span className="font-mono text-[9px] bg-[#991B1B] text-white px-1.5 py-0.5 font-bold uppercase inline-block mb-1">
                    10K+ STUDENTS
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#18181B]">RGPV Resources Hub</h4>
                  <p className="font-sans text-xs text-[#52525B] mt-1">Collegiate exam portal at rgpvpaper.in.</p>
                </div>
              );
              cardWidth = 280;
            } else if (id === 'phys-credential-itm') {
              innerContent = (
                <div className="p-4 bg-[#FFFFFF] border-2 border-[#18181B] shadow-2xl text-center">
                  <span className="font-mono text-[9px] text-[#0F4C64] font-bold uppercase block">ACADEMIC DEGREE</span>
                  <h5 className="font-serif text-sm font-bold text-[#18181B]">ITM GWALIOR B.TECH</h5>
                  <p className="font-sans text-[10px] text-[#52525B]">Computer Science &amp; Engineering</p>
                </div>
              );
              cardWidth = 240;
            } else if (id.startsWith('phys-chip-')) {
              const chipName = id.replace('phys-chip-', '').toUpperCase();
              innerContent = (
                <div className="px-3.5 py-2 bg-[#18181B] text-white border border-[#18181B] shadow-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]"></span>
                  <span>{chipName}</span>
                </div>
              );
              cardWidth = 140;
            }

            return (
              <div
                key={id}
                onPointerDown={(e) => handleEntityPointerDown(id, e)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${cardWidth}px`,
                  transform: `translate3d(${item.x - cardWidth / 2}px, ${item.y - 40}px, 0px) rotate(${item.angle}rad)`,
                  transformOrigin: 'center center',
                  pointerEvents: 'auto',
                }}
                className="cursor-grab active:cursor-grabbing select-none"
              >
                {innerContent}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FLOATING BOTTOM DOCK                                   */}
      {/* ========================================================= */}
      <BroadsheetDock
        isZeroG={isZeroG}
        onToggleZeroG={() => {
          if (!isZeroG) startZeroG();
          else stopZeroG();
        }}
        onToss={handleToss}
        floatingCount={floatingList.length}
      />

      {/* ========================================================= */}
      {/* 6. INSPECTION MODAL                                       */}
      {/* ========================================================= */}
      <InspectionModal
        content={modalContent}
        onClose={() => setModalContent(null)}
      />

      {/* ========================================================= */}
      {/* 7. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#F0EDE6] border-t border-[#18181B] py-8 text-xs font-mono text-[#52525B]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#18181B]">THE GUPTA GAZETTE</span>
            <span>·</span>
            <span>DHRUV GUPTA · SDE CANDIDATE 2025</span>
          </div>

          <a 
            href="#lead-profile" 
            className="hover:text-[#18181B] flex items-center gap-1 font-bold text-[#991B1B]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>

    </div>
  );
}
