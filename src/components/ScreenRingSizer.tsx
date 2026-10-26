import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Share2,
  Check,
  RotateCcw,
  Smartphone,
  Maximize2,
  Sparkles,
  HelpCircle,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileImage,
  Loader2
} from 'lucide-react';
import {
  getClosestSizeByDiameter,
  RING_SIZE_DATA
} from '../data/ringSizes';
import { RingSizeEntry } from '../types/ring';
import { generateRingSlipImage, downloadPngFile } from '../utils/generateRingSlip';
import { getRingSizeFunFact } from '../data/ringFunFacts';
import { SizeSlipModal } from './SizeSlipModal';

interface ScreenRingSizerProps {
  pixelsPerMm: number;
  onOpenCalibration: () => void;
  isCalibrated: boolean;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onOpenShareHint?: () => void;
}

export const ScreenRingSizer: React.FC<ScreenRingSizerProps> = ({
  pixelsPerMm,
  onOpenCalibration,
  isCalibrated,
  selectedSize,
  setSelectedSize,
  onOpenShareHint
}) => {
  // Current ring inside diameter in mm (default US 7 = 17.32 mm)
  const [diameterMm, setDiameterMm] = useState<number>(() => {
    const existing = RING_SIZE_DATA.find((r) => r.us === selectedSize);
    return existing ? existing.diameterMm : 17.32;
  });

  const [activeSubTab, setActiveSubTab] = useState<'sizer' | 'dimensions' | 'table'>('sizer');
  const [standard, setStandard] = useState<'UK' | 'US'>('UK'); // Support UK Letter sizes as requested
  const [showDemoRing, setShowDemoRing] = useState<boolean>(false); // Pure transparent ring gauge for physical ring placement
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isGeneratingSlip, setIsGeneratingSlip] = useState<boolean>(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);
  const [slipImageUrl, setSlipImageUrl] = useState<string>('');

  // Safe wrapper for HTML5 Vibration API on mobile devices with boosted tactile strength
  const triggerHaptic = useCallback((pattern: number | number[] = 35) => {
    try {
      if (
        typeof window !== 'undefined' &&
        'vibrate' in navigator &&
        typeof navigator.vibrate === 'function'
      ) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Silently catch if browser security/webview policy restricts vibration
    }
  }, []);

  // Dragging interaction state for on-screen circle
  const ringContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Track last haptic size to provide subtle detents only when crossing ring size boundaries
  const isMountedRef = useRef<boolean>(false);
  const lastHapticSizeRef = useRef<string>('');

  // Matched standard size
  const closestEntry: RingSizeEntry = getClosestSizeByDiameter(diameterMm);

  // Trigger boosted haptic vibration when user scrolls/slides between ring sizes
  useEffect(() => {
    if (isMountedRef.current) {
      if (closestEntry.us !== lastHapticSizeRef.current) {
        lastHapticSizeRef.current = closestEntry.us;
        // Whole sizes get a strong, punchy notch (45ms), half sizes get a solid distinct tick (30ms)
        const isWholeSize = !closestEntry.us.includes('½') && !closestEntry.us.includes('.');
        triggerHaptic(isWholeSize ? 45 : 30);
      }
    } else {
      isMountedRef.current = true;
      lastHapticSizeRef.current = closestEntry.us;
    }
  }, [closestEntry.us, triggerHaptic]);

  // Sync selected size if changed externally
  useEffect(() => {
    if (selectedSize && selectedSize !== closestEntry.us) {
      const match = RING_SIZE_DATA.find((r) => r.us === selectedSize);
      if (match) {
        setDiameterMm(match.diameterMm);
      }
    }
  }, [selectedSize]);

  // Auto-scroll the size table to keep the active row in view when diameter changes
  useEffect(() => {
    // Only auto-scroll when on the table sub-tab and not actively dragging to eliminate main-thread lag
    if (activeSubTab === 'table' && !isDragging && activeRowRef.current && tableContainerRef.current) {
      const container = tableContainerRef.current;
      const row = activeRowRef.current;
      const rowTop = row.offsetTop;
      const rowHeight = row.offsetHeight;
      const containerHeight = container.offsetHeight;

      container.scrollTo({
        top: rowTop - containerHeight / 2 + rowHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [closestEntry.us, activeSubTab, isDragging]);

  // Adjust diameter with clamp between 11.5mm and 24.8mm (supporting up to US Size 16)
  const handleDiameterChange = (val: number) => {
    const clamped = Math.min(24.8, Math.max(11.5, parseFloat(val.toFixed(2))));
    setDiameterMm(clamped);
    const matched = getClosestSizeByDiameter(clamped);
    setSelectedSize(matched.us);
    setIsSaved(false);
  };

  const handleFineTune = (delta: number) => {
    triggerHaptic(35);
    handleDiameterChange(diameterMm + delta);
  };

  const handleResetDiameter = () => {
    triggerHaptic([40, 50, 40]);
    handleDiameterChange(17.32);
  };

  const handleSelectRow = (entry: RingSizeEntry) => {
    triggerHaptic(45);
    handleDiameterChange(entry.diameterMm);
  };

  const handleSaveSize = async () => {
    // Celebratory high-intensity haptic pulse pattern on save
    triggerHaptic([60, 80, 80, 80, 120]);
    setSelectedSize(closestEntry.us);
    setIsSaved(true);
    setIsGeneratingSlip(true);
    try {
      localStorage.setItem('aura_oro_saved_size', closestEntry.us);
    } catch {
      // ignore
    }

    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const sizeFunFact = getRingSizeFunFact(closestEntry.us, closestEntry.uk);

      const pngDataUrl = await generateRingSlipImage({
        entry: closestEntry,
        measuredDiameterMm: diameterMm,
        measuredCircumferenceMm: diameterMm * Math.PI,
        dateStr,
        isCalibrated,
        primaryStandard: standard,
        funFact: sizeFunFact
      });

      if (pngDataUrl) {
        setSlipImageUrl(pngDataUrl);
        // Automatically download the PNG slip image file
        const sanitizedUk = closestEntry.uk.replace(/[\s/]+/g, '_');
        const sanitizedUs = closestEntry.us.replace(/[\s/]+/g, '_');
        const filename = standard === 'UK'
          ? `Ring-Measurement-Slip-UK-${sanitizedUk}-${diameterMm.toFixed(2)}mm.png`
          : `Ring-Measurement-Slip-US-${sanitizedUs}-${diameterMm.toFixed(2)}mm.png`;
        downloadPngFile(pngDataUrl, filename);
        setIsSlipModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to generate ring slip PNG:', err);
    } finally {
      setIsGeneratingSlip(false);
      setTimeout(() => setIsSaved(false), 3500);
    }
  };

  // Convert mm diameter to screen pixels with subpixel precision for analog smoothness
  const ringDiameterPx = Number((diameterMm * pixelsPerMm).toFixed(2));
  const radiusMm = diameterMm / 2;

  // Pointer drag to resize ring interactively on canvas/screen with 120fps/60fps smoothness
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    triggerHaptic(35);
    e.currentTarget.setPointerCapture(e.pointerId);

    // Cache center coordinates once at start of drag to avoid forced reflows during movement
    if (ringContainerRef.current) {
      const rect = ringContainerRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    if (centerRef.current.x === 0 && centerRef.current.y === 0 && ringContainerRef.current) {
      const rect = ringContainerRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }

    const { x: centerX, y: centerY } = centerRef.current;
    const distPx = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const newDiameterPx = distPx * 2;
    const computedMm = newDiameterPx / pixelsPerMm;

    // Throttle to display refresh cycle via requestAnimationFrame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      handleDiameterChange(computedMm);
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <section className="py-2 sm:py-6 px-2 sm:px-4 w-full flex flex-col items-center justify-center">
      {/* Main Sizer Screen Container - All White Theme */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col my-auto">
        {/* 1. APP HEADER - Clean Minimal White */}
        <div className="bg-white text-slate-800 border-b border-slate-200 select-none">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Ring Sizer Circle Icon */}
              <div className="w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                <div className="w-3.5 h-[1.5px] bg-slate-800 rotate-45" />
              </div>
              <span className="font-semibold tracking-wide text-base text-slate-900">
                Ring Sizer
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenShareHint}
                title="Share Size / Drop a Hint"
                className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1 text-xs"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs: SIZER | DIMENSIONS | ALL SIZES */}
          <div
            role="tablist"
            className="grid grid-cols-3 text-center text-xs font-semibold tracking-wider border-t border-slate-200 bg-white"
          >
            <button
              role="tab"
              aria-selected={activeSubTab === 'sizer'}
              onClick={() => {
                triggerHaptic(30);
                setActiveSubTab('sizer');
              }}
              className={`py-3 transition-all cursor-pointer relative font-medium ${
                activeSubTab === 'sizer'
                  ? 'text-slate-900 font-bold bg-slate-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              SIZER
              {activeSubTab === 'sizer' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              role="tab"
              aria-selected={activeSubTab === 'dimensions'}
              onClick={() => {
                triggerHaptic(30);
                setActiveSubTab('dimensions');
              }}
              className={`py-3 transition-all cursor-pointer relative font-medium ${
                activeSubTab === 'dimensions'
                  ? 'text-slate-900 font-bold bg-slate-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              DIMENSIONS
              {activeSubTab === 'dimensions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>

            <button
              role="tab"
              aria-selected={activeSubTab === 'table'}
              onClick={() => {
                triggerHaptic(30);
                setActiveSubTab('table');
              }}
              className={`py-3 transition-all cursor-pointer relative font-medium ${
                activeSubTab === 'table'
                  ? 'text-slate-900 font-bold bg-slate-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
              }`}
            >
              ALL SIZES
              {activeSubTab === 'table' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* --- SUBTAB 1: INTERACTIVE SIZER CANVAS & MEASURING GRID --- */}
        {activeSubTab === 'sizer' && (
          <>
            {/* 2. THE MILLIMETER GRAPH GRID MEASURING SURFACE (Photo Match) */}
            <div className="relative bg-graph-grid flex flex-col items-center justify-between border-b border-slate-200 select-none overflow-hidden min-h-[310px]">
              {/* Top Toolbar Overlay on Grid */}
              <div className="w-full px-3.5 pt-3 flex items-center justify-between z-20 text-[11px] text-slate-600 gap-1.5 flex-wrap">
                <div
                  title="Universal 1:1 true circle scale"
                  className="font-mono bg-white/95 px-2 py-0.5 rounded shadow-xs border border-slate-200 flex items-center gap-1.5 text-slate-700 select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <span>Universal Scale</span>
                </div>

                {/* Standard Selector Toggle: UK / AU vs US / CA */}
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shadow-xs font-sans">
                  <button
                    onClick={() => {
                      triggerHaptic(35);
                      setStandard('UK');
                    }}
                    title="Use UK & Australia Letter Sizes (A to Z+7)"
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      standard === 'UK'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    UK / AU
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic(35);
                      setStandard('US');
                    }}
                    title="Use USA & Canada Number Sizes"
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      standard === 'US'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    US / CA
                  </button>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic(35);
                    setShowDemoRing(!showDemoRing);
                  }}
                  className={`px-2.5 py-0.5 rounded-full border transition-all text-[11px] font-medium cursor-pointer ${
                    showDemoRing
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {showDemoRing ? 'Ring Demo: ON' : 'Place Real Ring'}
                </button>
              </div>

              {/* The Interactive Ring Target Canvas */}
              <div
                ref={ringContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-[250px] flex items-center justify-center relative touch-none cursor-crosshair group"
              >
                {/* 10mm Physical Reference Indicator */}
                <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-white/95 px-2 py-0.5 rounded shadow-2xs border border-slate-200 pointer-events-none select-none">
                  <div
                    style={{ width: `${Math.round(10 * pixelsPerMm)}px` }}
                    className="h-1 bg-slate-800 rounded-full"
                  />
                  <span className="font-semibold text-slate-700">10 mm reference</span>
                </div>

                {/* Concentric coordinate axes lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-full h-[1px] bg-slate-300" />
                  <div className="h-full w-[1px] bg-slate-300 absolute" />
                </div>

                {/* The Measured Ring Gauge Circle */}
                <div
                  style={{
                    width: `${ringDiameterPx}px`,
                    height: `${ringDiameterPx}px`,
                    transition: isDragging
                      ? 'none'
                      : 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1), height 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: isDragging ? 'width, height' : 'auto'
                  }}
                  className="relative rounded-full flex items-center justify-center transform-gpu"
                >
                  {/* DEMO: The Italian Minimal Luxe Bar Ring from Pinterest photo */}
                  {showDemoRing && (
                    <div
                      style={{
                        inset: `-${Math.max(6, Math.round(3.5 * pixelsPerMm * 0.35))}px`,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                        transition: isDragging
                          ? 'none'
                          : 'inset 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="absolute rounded-full border-2 border-amber-500 bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 pointer-events-none ring-shadow transition-all"
                    >
                      {/* The signature rectangular bar top from the Pinterest screenshot video! */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 rounded-xs shadow-md border border-amber-300/80" />
                    </div>
                  )}

                  {/* The Crisp Ring Circle Outline (content-box ensures exact inside diameter matches physical ring) */}
                  <div
                    style={{
                      boxSizing: 'content-box',
                      width: `${ringDiameterPx}px`,
                      height: `${ringDiameterPx}px`,
                      transition: isDragging
                        ? 'none'
                        : 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1), height 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: isDragging ? 'width, height' : 'auto'
                    }}
                    className="rounded-full border-2 border-slate-900 bg-transparent flex items-center justify-center relative shadow-xs transform-gpu"
                  >
                    {/* Center Target Point */}
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />

                    {/* Cardinal Alignment Crosshair Ticks for physical ring placement */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-slate-900 pointer-events-none" />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-slate-900 pointer-events-none" />
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-slate-900 pointer-events-none" />
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-[1px] w-3 bg-slate-900 pointer-events-none" />

                    {/* Full Inside Diameter Dimension Line & Exact Diameter Value */}
                    <div
                      style={{
                        width: '100%',
                        transition: isDragging
                          ? 'none'
                          : 'width 0.24s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-300 pointer-events-none flex items-center justify-center"
                    >
                      {/* Left and right inner rim dimension arrows */}
                      <div className="absolute left-1 w-1.5 h-1.5 border-l border-t border-slate-700 rotate-[-45deg]" />
                      <div className="absolute right-1 w-1.5 h-1.5 border-r border-t border-slate-700 rotate-[45deg]" />

                      {/* Clear Diameter Number & Active Size Badge */}
                      <div className="bg-white px-2 py-0.5 rounded shadow-xs border border-slate-300 flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-900 select-none z-10">
                        <span>Ø {diameterMm.toFixed(2)} mm</span>
                        <span className="text-slate-300 font-normal">|</span>
                        <span className="text-slate-700 font-semibold">
                          {standard === 'UK' ? `UK ${closestEntry.uk}` : `US ${closestEntry.us}`}
                        </span>
                      </div>
                    </div>

                    {/* Drag Resize Handle Knob */}
                    <div
                      title="Drag to resize ring"
                      className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-ew-resize z-30 touch-none select-none ring-4 ring-white"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                    </div>
                  </div>
                </div>

                {/* Placement instruction at bottom of grid */}
                <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between text-[11px] text-slate-600 font-mono pointer-events-none">
                  <span>Align inner edge</span>
                  <span className="bg-white px-2.5 py-0.5 rounded shadow-xs font-bold text-slate-900 border border-slate-300">
                    {standard === 'UK' ? `UK Size ${closestEntry.uk}` : `US Size ${closestEntry.us}`} · Ø {diameterMm.toFixed(2)} mm
                  </span>
                  <span>{(diameterMm * Math.PI).toFixed(1)} mm circ</span>
                </div>
              </div>

              {/* Micro Stepper & Slider Tray on Grid */}
              <div className="w-full px-4 pb-2.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFineTune(-0.1)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-xs cursor-pointer font-bold active:scale-95 transition-transform"
                  >
                    -0.1
                  </button>
                  <button
                    onClick={() => handleFineTune(0.1)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-xs cursor-pointer font-bold active:scale-95 transition-transform"
                  >
                    +0.1
                  </button>
                </div>

                <input
                  type="range"
                  min={11.5}
                  max={24.8}
                  step={0.02}
                  value={diameterMm}
                  onPointerDown={() => setIsDragging(true)}
                  onPointerUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onChange={(e) => handleDiameterChange(parseFloat(e.target.value))}
                  className="flex-1 accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none transition-none"
                />

                <button
                  onClick={handleResetDiameter}
                  title="Reset to default US 7 / UK N ½"
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* 3. THE SYNCHRONIZED INTERNATIONAL SIZING ROLLER / TABLE (Photo Match) */}
            <div className="bg-white text-slate-800 flex flex-col">
              {/* Live Measured Size in All International Standards (Focused Element) */}
              <div className="bg-white border-b border-slate-200 select-none">
                {/* All Measured Size Types Grid */}
                <div className="p-3 border-b border-slate-200/80 bg-slate-50/70">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-900" />
                      All Measured Size Standards
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      Ø {diameterMm.toFixed(2)} mm
                    </span>
                  </div>

                  {/* Badges for every international standard */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center font-mono text-xs">
                    {/* AU / GB (UK & Australia) - Highlighted if UK standard is active */}
                    <div className={`p-1.5 rounded-lg border shadow-xs ${
                      standard === 'UK'
                        ? 'bg-slate-100 border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">AU / GB (UK)</div>
                      <div className="text-sm font-bold text-slate-900">{closestEntry.uk}</div>
                    </div>

                    {/* USA & Canada */}
                    <div className={`p-1.5 rounded-lg border shadow-xs ${
                      standard === 'US'
                        ? 'bg-slate-100 border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">USA / CA</div>
                      <div className="text-sm font-bold text-slate-900 font-sans">US {closestEntry.us}</div>
                    </div>

                    {/* EU / ISO (Europe) */}
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">EU / ISO</div>
                      <div className="text-sm font-bold text-slate-800">{closestEntry.eu}</div>
                    </div>

                    {/* IT / ES (Italy & Spain) */}
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">IT / ES</div>
                      <div className="text-sm font-bold text-slate-800">{closestEntry.it}</div>
                    </div>

                    {/* JP / CH (Japan, China, Swiss) */}
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">JP / CH</div>
                      <div className="text-sm font-bold text-slate-800">{closestEntry.jpCh || closestEntry.jp}</div>
                    </div>

                    {/* Circumference (mm & inches) */}
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-sans font-medium uppercase">CIRCUMF</div>
                      <div className="text-xs font-bold text-slate-800 pt-0.5">{closestEntry.circumferenceMm}mm</div>
                    </div>
                  </div>

                  {/* Exact Physical Dimensions in Millimeters and Inches */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>
                      <strong className="text-slate-800">Inside Ø:</strong> {closestEntry.diameterMm} mm ({ (closestEntry.diameterMm / 25.4).toFixed(3) }″)
                    </span>
                    <span>
                      <strong className="text-slate-800">Circumference:</strong> {closestEntry.circumferenceMm} mm ({ (closestEntry.circumferenceMm / 25.4).toFixed(3) }″)
                    </span>
                  </div>
                </div>

                {/* Table Header Row with All Sizing Columns */}
                <div className="grid grid-cols-6 px-3 py-2 bg-slate-100 text-[11px] font-bold text-slate-700 tracking-wider text-center">
                  <div className="text-left pl-3">{standard === 'UK' ? 'UK/GB' : 'USA'}</div>
                  <div>{standard === 'UK' ? 'USA' : 'AU/GB'}</div>
                  <div>EU/ISO</div>
                  <div>IT/ES</div>
                  <div>JP/CH</div>
                  <div className="text-right pr-2">DIAMETER</div>
                </div>
              </div>

              {/* Scrollable Table Rows (Directly replicating the phone picker in the photo) */}
              <div
                ref={tableContainerRef}
                className="h-[230px] overflow-y-auto size-table-scroll divide-y divide-slate-100 font-mono text-xs select-none bg-white"
              >
                {RING_SIZE_DATA.map((row) => {
                  const isActive = closestEntry.us === row.us;
                  return (
                    <div
                      key={row.us}
                      ref={isActive ? activeRowRef : null}
                      onClick={() => handleSelectRow(row)}
                      className={`grid grid-cols-6 items-center px-3 py-2 cursor-pointer transition-colors text-center ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {/* Primary Standard Column with Circular Dot Indicator */}
                      <div className="flex items-center gap-1.5 text-left pl-1">
                        <div className="w-3.5 flex items-center justify-center shrink-0">
                          {isActive && (
                            <div className="w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow-xs" />
                          )}
                        </div>
                        <span className="text-xs font-semibold">
                          {standard === 'UK' ? row.uk : row.us}
                        </span>
                      </div>

                      {/* Secondary Column */}
                      <div className="text-slate-700 text-xs">
                        {standard === 'UK' ? row.us : row.uk}
                      </div>

                      {/* EU/ISO Column */}
                      <div className="text-slate-700 text-xs">
                        {row.eu}
                      </div>

                      {/* IT/ES Column */}
                      <div className="text-slate-700 text-xs">
                        {row.it}
                      </div>

                      {/* JP/CH Column */}
                      <div className="text-slate-700 text-xs">
                        {row.jpCh || row.jp}
                      </div>

                      {/* Diameter Column */}
                      <div className="text-right pr-2 text-slate-700 text-[11px]">
                        {row.diameterMm}mm
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* --- SUBTAB 2: DEDICATED PHYSICAL DIMENSIONS VIEW --- */}
        {activeSubTab === 'dimensions' && (
          <div className="p-4 bg-white flex flex-col gap-4 select-none">
            {/* Hero Dimension Overview */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                  Active Measured Size
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {standard === 'UK' ? 'UK Standard' : 'US Standard'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  {standard === 'UK' ? `UK ${closestEntry.uk}` : `US ${closestEntry.us}`}
                </span>
                <span className="text-sm font-semibold text-slate-600 font-mono">
                  {standard === 'UK' ? `(US ${closestEntry.us})` : `(UK ${closestEntry.uk})`}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Fine jewelry specification calibrated to 1:1 physical millimeter standard.
              </p>
            </div>

            {/* Dimensional Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block">Inside Diameter (Ø)</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">{diameterMm.toFixed(2)} mm</span>
                <span className="text-[11px] text-slate-500 font-sans">{(diameterMm / 25.4).toFixed(3)} inches</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block">Inside Circumference</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">{(diameterMm * Math.PI).toFixed(2)} mm</span>
                <span className="text-[11px] text-slate-500 font-sans">{((diameterMm * Math.PI) / 25.4).toFixed(3)} inches</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block">Inside Radius (r)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{(diameterMm / 2).toFixed(2)} mm</span>
                <span className="text-[11px] text-slate-500 font-sans">Center to inner edge</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold block">Tolerance Margin</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">±0.05 mm</span>
                <span className="text-[11px] text-slate-500 font-sans">ISO 8653 Jeweler Std</span>
              </div>
            </div>

            {/* Dynamic Slider on Dimensions Tab */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Adjust Diameter (mm):</span>
                <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  {diameterMm.toFixed(2)} mm
                </span>
              </div>
              <input
                type="range"
                min={11.5}
                max={24.8}
                step={0.05}
                value={diameterMm}
                onChange={(e) => handleDiameterChange(parseFloat(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Min: 11.50 mm (A)</span>
                <span>Max: 24.80 mm (Z+7)</span>
              </div>
            </div>

            {/* Fitting & Band Width Recommendations */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-2 text-slate-600">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-sans">
                Band Width Fitting Guide
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <strong className="text-slate-900 block font-semibold">Bands ≤ 5 mm:</strong>
                  <span>Order exact measured size.</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <strong className="text-slate-900 block font-semibold">Wide Bands (6–8 mm):</strong>
                  <span>Order ½ size larger.</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                * Note: Hands swell slightly in warm weather and after exercise. Measure at room temperature for maximum fit accuracy.
              </p>
            </div>
          </div>
        )}

        {/* --- SUBTAB 3: FULL CONVERSION TABLE VIEW --- */}
        {activeSubTab === 'table' && (
          <div className="bg-white flex flex-col select-none">
            {/* Header controls for Table */}
            <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                International Conversion Matrix
              </div>
              {/* Standard Selector Toggle */}
              <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shadow-xs font-sans">
                <button
                  onClick={() => setStandard('UK')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    standard === 'UK'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  UK First
                </button>
                <button
                  onClick={() => setStandard('US')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    standard === 'US'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  US First
                </button>
              </div>
            </div>

            {/* Quick Letter jump buttons for UK */}
            <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
              <span className="text-slate-500 font-sans mr-1 shrink-0 font-medium">Jump:</span>
              {['A', 'F', 'J', 'L', 'N', 'P', 'R', 'T', 'V', 'Z'].map((letter) => {
                const target = RING_SIZE_DATA.find((r) => r.uk.startsWith(letter));
                return (
                  <button
                    key={letter}
                    onClick={() => target && handleSelectRow(target)}
                    className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-200 text-slate-800 font-bold shrink-0 cursor-pointer"
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-6 px-3 py-2 bg-slate-200/70 text-[11px] font-bold text-slate-800 tracking-wider text-center border-b border-slate-200">
              <div className="text-left pl-2">{standard === 'UK' ? 'UK/AU' : 'USA/CA'}</div>
              <div>{standard === 'UK' ? 'USA' : 'UK'}</div>
              <div>EU/ISO</div>
              <div>IT/ES</div>
              <div>JP/CH</div>
              <div className="text-right pr-2">DIAMETER</div>
            </div>

            {/* Full Height Scrollable Table Rows */}
            <div className="h-[360px] overflow-y-auto size-table-scroll divide-y divide-slate-100 font-mono text-xs bg-white">
              {RING_SIZE_DATA.map((row) => {
                const isActive = closestEntry.us === row.us;
                return (
                  <div
                    key={row.us}
                    onClick={() => handleSelectRow(row)}
                    className={`grid grid-cols-6 items-center px-3 py-2.5 cursor-pointer transition-colors text-center ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-bold border-l-4 border-slate-900'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-left pl-1">
                      <span className="text-xs font-bold text-slate-900">
                        {standard === 'UK' ? row.uk : row.us}
                      </span>
                    </div>

                    <div className="text-slate-700 text-xs">
                      {standard === 'UK' ? row.us : row.uk}
                    </div>

                    <div className="text-slate-700 text-xs">
                      {row.eu}
                    </div>

                    <div className="text-slate-700 text-xs">
                      {row.it}
                    </div>

                    <div className="text-slate-700 text-xs">
                      {row.jpCh || row.jp}
                    </div>

                    <div className="text-right pr-2 text-slate-900 font-semibold text-[11px]">
                      {row.diameterMm} mm
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          {/* Bottom Active Summary Bar Showing All Types of Sizes */}
          <div className="px-3.5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="text-left w-full sm:w-auto">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-500">Measured:</span>
                {standard === 'UK' ? (
                  <>
                    <strong className="text-slate-900 font-bold text-sm">UK Size {closestEntry.uk}</strong>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-mono">US {closestEntry.us}</span>
                  </>
                ) : (
                  <>
                    <strong className="text-slate-900 font-bold text-sm">US Size {closestEntry.us}</strong>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-mono">UK {closestEntry.uk}</span>
                  </>
                )}
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-mono">EU {closestEntry.eu}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-mono">IT {closestEntry.it}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-mono">JP {closestEntry.jpCh || closestEntry.jp}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Diameter: {closestEntry.diameterMm}mm ({ (closestEntry.diameterMm / 25.4).toFixed(3) }″) · Circ: {closestEntry.circumferenceMm}mm
              </div>
            </div>

            <button
              onClick={handleSaveSize}
              disabled={isGeneratingSlip}
              title={`Save size and generate official PNG measurement slip for ${standard === 'UK' ? `UK ${closestEntry.uk}` : `US ${closestEntry.us}`}`}
              className={`px-3.5 py-1.5 font-medium rounded-lg shadow-xs transition-all cursor-pointer text-xs flex items-center gap-1.5 shrink-0 ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {isGeneratingSlip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Slip...
                </>
              ) : isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved & Slip Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Save {standard === 'UK' ? `UK ${closestEntry.uk}` : `US ${closestEntry.us}`} Slip
                </>
              )}
            </button>
          </div>
        </div>

      {/* Generated PNG Slip Preview & Download Modal */}
      <SizeSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        slipImageUrl={slipImageUrl}
        sizeName={closestEntry.us}
        ukSizeName={closestEntry.uk}
        diameterMm={diameterMm}
        standard={standard}
        funFact={getRingSizeFunFact(closestEntry.us, closestEntry.uk)}
      />
    </section>
  );
};
