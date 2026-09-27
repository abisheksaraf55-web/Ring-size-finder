import React, { useState } from 'react';
import { Sparkles, Eye, Layers, Palette, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { ATELIER_RINGS, METAL_CONFIG } from '../data/ringSizes';
import { JewelryRing, MetalType } from '../types/ring';

interface HandTryOnStudioProps {
  selectedSize: string;
  initialRingId?: string;
  onNavigateToAtelier: () => void;
}

type SkinTone = 'fair' | 'sand' | 'olive' | 'bronze';
type Finger = 'index' | 'middle' | 'ring' | 'pinky';

export const HandTryOnStudio: React.FC<HandTryOnStudioProps> = ({
  selectedSize,
  initialRingId,
  onNavigateToAtelier
}) => {
  const [selectedRingId, setSelectedRingId] = useState<string>(
    initialRingId || 'minimal-luxe-bar'
  );
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('yellow-gold');
  const [skinTone, setSkinTone] = useState<SkinTone>('sand');
  const [activeFinger, setActiveFinger] = useState<Finger>('ring');
  const [isStacked, setIsStacked] = useState<boolean>(false);
  const [stackedRingId, setStackedRingId] = useState<string>('florentine-pave-band');

  const currentRing = ATELIER_RINGS.find((r) => r.id === selectedRingId) || ATELIER_RINGS[0];
  const stackedRing = ATELIER_RINGS.find((r) => r.id === stackedRingId) || ATELIER_RINGS[2];
  const metalConfig = METAL_CONFIG[selectedMetal];

  // Skin tone hex palettes
  const skinPalettes: Record<SkinTone, { name: string; hex: string; shadow: string }> = {
    fair: { name: 'Porcelain Fair', hex: '#F9DFD2', shadow: '#E4B5A1' },
    sand: { name: 'Warm Sand', hex: '#E7BD9F', shadow: '#CFA07C' },
    olive: { name: 'Honey Olive', hex: '#BD8C6A', shadow: '#9F6F4C' },
    bronze: { name: 'Deep Bronze', hex: '#7A4F35', shadow: '#5B3722' }
  };

  // Finger coordinates on the realistic SVG hand
  const fingerPositions: Record<Finger, { x: number; y: number; width: number }> = {
    index: { x: 195, y: 195, width: 34 },
    middle: { x: 260, y: 170, width: 36 },
    ring: { x: 325, y: 190, width: 33 },
    pinky: { x: 385, y: 230, width: 28 }
  };

  const pos = fingerPositions[activeFinger];

  return (
    <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-300 font-medium mb-2">
          <span>Virtual Hand Simulator</span>
          <span aria-hidden="true">·</span>
          <span>True Proportion Preview</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-100 font-normal">
          Interactive Hand Try-On Studio
        </h2>
        <p className="mt-3 text-sm md:text-base text-stone-400 font-light leading-relaxed">
          See how the Minimal Luxe Bar Ring and Italian gold bands drape against your finger. Test different fingers, skin undertones, and curated stacking combinations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Hand Simulation Canvas (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Simulating:</span>
              <span className="text-amber-200 font-medium">{currentRing.name}</span>
              <span>·</span>
              <span className="font-mono">US {selectedSize}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStacked(!isStacked)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  isStacked
                    ? 'bg-amber-400/20 text-amber-200 border-amber-400'
                    : 'bg-stone-950/80 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{isStacked ? 'Stacking Active' : 'Stack Another Band'}</span>
              </button>
            </div>
          </div>

          {/* Realistic SVG Hand Canvas */}
          <div className="w-full max-w-[500px] h-[440px] bg-stone-950/80 border border-stone-800 rounded-xl relative flex items-center justify-center overflow-hidden shadow-inner">
            {/* Subtle background ambient spotlight */}
            <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <svg
              viewBox="0 0 520 480"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))' }}
            >
              {/* Defs for gradients & nail luster */}
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={skinPalettes[skinTone].hex} />
                  <stop offset="100%" stopColor={skinPalettes[skinTone].shadow} />
                </linearGradient>
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2D6" />
                  <stop offset="40%" stopColor={metalConfig.colorHex} />
                  <stop offset="100%" stopColor="#96701B" />
                </linearGradient>
              </defs>

              {/* Hand Palm and Wrist Silhouette */}
              <path
                d="M 170 480 C 160 380 150 320 170 260 C 175 230 185 160 195 90 C 200 60 215 60 220 90 C 228 140 230 200 235 240 C 240 180 248 110 258 50 C 265 20 280 20 288 50 C 295 110 300 180 302 240 C 310 180 318 120 328 80 C 335 50 348 50 355 80 C 362 130 365 200 365 250 C 375 210 382 170 395 140 C 402 120 415 120 420 140 C 430 200 425 280 415 340 C 400 420 380 480 370 480 Z"
                fill="url(#skinGrad)"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
              />

              {/* Thumb curve */}
              <path
                d="M 170 320 C 130 310 100 280 95 240 C 90 200 110 190 125 210 C 145 240 160 270 170 290 Z"
                fill="url(#skinGrad)"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
              />

              {/* Natural Fingernails */}
              <ellipse cx="208" cy="85" rx="7" ry="10" fill="#FFFFFF" fillOpacity="0.35" />
              <ellipse cx="273" cy="45" rx="8" ry="12" fill="#FFFFFF" fillOpacity="0.35" />
              <ellipse cx="342" cy="75" rx="7" ry="10" fill="#FFFFFF" fillOpacity="0.35" />
              <ellipse cx="408" cy="135" rx="6" ry="8" fill="#FFFFFF" fillOpacity="0.35" />

              {/* Knuckle Lines */}
              <path
                d="M 195 160 Q 210 165 220 160"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 258 135 Q 275 140 288 135"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 326 155 Q 342 160 354 155"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 388 195 Q 402 200 414 195"
                stroke={skinPalettes[skinTone].shadow}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />

              {/* Interactive Clickable Finger Selectors */}
              {[
                { finger: 'index' as Finger, cx: 208, cy: 195, label: 'Index' },
                { finger: 'middle' as Finger, cx: 273, cy: 170, label: 'Middle' },
                { finger: 'ring' as Finger, cx: 340, cy: 190, label: 'Ring' },
                { finger: 'pinky' as Finger, cx: 402, cy: 230, label: 'Pinky' }
              ].map((f) => (
                <circle
                  key={f.finger}
                  cx={f.cx}
                  cy={f.cy}
                  r="16"
                  fill={activeFinger === f.finger ? '#D4AF37' : 'transparent'}
                  fillOpacity={activeFinger === f.finger ? 0.3 : 0}
                  stroke={activeFinger === f.finger ? '#D4AF37' : '#FFFFFF'}
                  strokeOpacity={activeFinger === f.finger ? 1 : 0.2}
                  strokeDasharray={activeFinger === f.finger ? 'none' : '3 3'}
                  className="cursor-pointer hover:stroke-opacity-80 transition-all"
                  onClick={() => setActiveFinger(f.finger)}
                />
              ))}

              {/* RENDERED JEWELRY RING OVER FINGER */}
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Main Ring Band */}
                <rect
                  x="0"
                  y="0"
                  width={pos.width}
                  height="12"
                  rx="3"
                  fill="url(#metalGrad)"
                  stroke={metalConfig.colorHex}
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
                />

                {/* Minimal Luxe Bar Accent (Pinterest Pin Featured) */}
                {currentRing.style === 'bar' && (
                  <g>
                    <rect
                      x="-8"
                      y="-4"
                      width={pos.width + 16}
                      height="7"
                      rx="1.5"
                      fill={metalConfig.colorHex}
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
                    />
                    <line
                      x1="-4"
                      y1="-0.5"
                      x2={pos.width + 12}
                      y2="-0.5"
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      strokeOpacity="0.8"
                    />
                  </g>
                )}

                {/* Pavé Diamond Shimmer */}
                {currentRing.style === 'pave' && (
                  <g>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <circle
                        key={i}
                        cx={4 + i * 4.2}
                        cy="6"
                        r="1.4"
                        fill="#FFFFFF"
                        stroke="#D4AF37"
                        strokeWidth="0.3"
                      />
                    ))}
                  </g>
                )}

                {/* Second Stacked Ring */}
                {isStacked && (
                  <g transform="translate(0, 15)">
                    <rect
                      x="0"
                      y="0"
                      width={pos.width}
                      height="8"
                      rx="2"
                      fill="#FFFFFF"
                      fillOpacity="0.9"
                      stroke={metalConfig.colorHex}
                      strokeWidth="0.8"
                    />
                    {Array.from({ length: 6 }).map((_, i) => (
                      <circle
                        key={i}
                        cx={4 + i * 5}
                        cy="4"
                        r="1.2"
                        fill="#D4AF37"
                      />
                    ))}
                  </g>
                )}
              </g>
            </svg>

            {/* Click-to-choose prompt */}
            <div className="absolute bottom-3 left-4 text-[11px] text-stone-400 font-mono">
              Click any finger node to switch ring placement
            </div>
          </div>
        </div>

        {/* Right: Controls & Stack Selection (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
          {/* Finger Placement Buttons */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2 font-medium">
              Finger Position: <span className="text-stone-200 capitalize font-semibold">{activeFinger} Finger</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['index', 'middle', 'ring', 'pinky'] as Finger[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFinger(f)}
                  className={`py-2 px-1 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                    activeFinger === f
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-semibold'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Tone Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2 font-medium">
              Skin Undertone: <span className="text-stone-200 font-semibold">{skinPalettes[skinTone].name}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(skinPalettes) as SkinTone[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setSkinTone(st)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    skinTone === st
                      ? 'border-amber-400 bg-stone-850'
                      : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                  }`}
                >
                  <div
                    style={{ backgroundColor: skinPalettes[st].hex }}
                    className="w-5 h-5 rounded-full border border-stone-700 shadow-inner"
                  />
                  <span className="text-[10px] text-stone-300 capitalize">{st}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ring Model Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2 font-medium">
              Primary Ring Silhouette
            </label>
            <select
              value={selectedRingId}
              onChange={(e) => setSelectedRingId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-400"
            >
              {ATELIER_RINGS.map((ring) => (
                <option key={ring.id} value={ring.id}>
                  {ring.name} — {ring.subtitle} (${ring.basePrice})
                </option>
              ))}
            </select>
          </div>

          {/* Metal Finish Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2 font-medium">
              Precious Metal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(METAL_CONFIG) as MetalType[]).map((mKey) => (
                <button
                  key={mKey}
                  onClick={() => setSelectedMetal(mKey)}
                  className={`p-2 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    selectedMetal === mKey
                      ? 'bg-amber-400/15 border-amber-400 text-stone-100 font-medium'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div
                    style={{ backgroundColor: METAL_CONFIG[mKey].colorHex }}
                    className="w-3 h-3 rounded-full border border-stone-700 shrink-0"
                  />
                  <span className="truncate">{METAL_CONFIG[mKey].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Stack Ring Picker (if active) */}
          {isStacked && (
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2">
              <label className="text-xs text-amber-300 font-medium block">
                Secondary Ring for Stacking:
              </label>
              <select
                value={stackedRingId}
                onChange={(e) => setStackedRingId(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5"
              >
                {ATELIER_RINGS.map((ring) => (
                  <option key={ring.id} value={ring.id}>
                    {ring.name} (${ring.basePrice})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400">
                Stacking tip: Pairing the angular Minimal Luxe Bar Ring with the curved Firenze Pavé band creates the signature Italian high-low contrast.
              </p>
            </div>
          )}

          {/* Sizing Callout & Next Action */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-400">
              Selected size: <span className="text-amber-300 font-mono font-bold">US {selectedSize}</span>
            </div>
            <button
              onClick={onNavigateToAtelier}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Customize in Atelier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
