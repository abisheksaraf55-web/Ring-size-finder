import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Gift,
  ArrowRight,
  Info,
  Layers,
  Heart,
  Eye,
  Feather
} from 'lucide-react';
import { ATELIER_RINGS, METAL_CONFIG, RING_SIZE_DATA, getBandWidthAdjustedSize } from '../data/ringSizes';
import { JewelryRing, MetalType } from '../types/ring';

interface AtelierCollectionProps {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onOpenDropHintWithRing: (ring: JewelryRing, metal: MetalType, size: string) => void;
  onNavigateToTryOnWithRing: (ringId: string) => void;
}

export const AtelierCollection: React.FC<AtelierCollectionProps> = ({
  selectedSize,
  setSelectedSize,
  onOpenDropHintWithRing,
  onNavigateToTryOnWithRing
}) => {
  const [activeRing, setActiveRing] = useState<JewelryRing>(ATELIER_RINGS[0]); // Minimal Luxe Bar Ring default
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('yellow-gold');
  const [selectedWidth, setSelectedWidth] = useState<number>(activeRing.defaultWidthMm);
  const [engravingText, setEngravingText] = useState<string>('ROMA · MMXXVI');
  const [engravingFont, setEngravingFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);

  const metalConfig = METAL_CONFIG[selectedMetal];
  const finalPrice = Math.round(activeRing.basePrice * metalConfig.multiplier);

  // Sizing adjustment based on width
  const { adjustedUs, note: widthNote } = getBandWidthAdjustedSize(selectedSize, selectedWidth);

  const handleSelectRing = (ring: JewelryRing) => {
    setActiveRing(ring);
    setSelectedWidth(ring.defaultWidthMm);
  };

  return (
    <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-300 font-medium mb-2">
          <span>Bespoke Italian Goldsmithing</span>
          <span aria-hidden="true">·</span>
          <span>Vicenza & Firenze</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-100 font-normal">
          The Italian Minimal Gold Collection
        </h2>
        <p className="mt-3 text-sm md:text-base text-stone-400 font-light leading-relaxed">
          Inspired by the viral rectangular bar ring and self-adjusting gift bands. Cast in solid 18K Italian gold and hand-finished for seamless comfort.
        </p>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 2D/3D Ring Visualizer & Atelier Viewer (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-b from-stone-900/90 to-stone-950 border border-stone-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center justify-between min-h-[440px]">
            {/* Badges */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-xs uppercase tracking-widest text-amber-300/90 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {activeRing.highlight}
              </span>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400' : ''}`} />
              </button>
            </div>

            {/* High-Fidelity Vector Jewelry Ring Rendering */}
            <div className="my-8 relative flex items-center justify-center w-full h-[260px]">
              {/* Ambient Gold Radial Glow */}
              <div
                style={{
                  background: `radial-gradient(circle, ${metalConfig.colorHex}22 0%, transparent 70%)`
                }}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Ring Structure */}
              <div className="relative flex items-center justify-center transition-all duration-300">
                {/* Outer Ring Shadow & Body */}
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    borderColor: metalConfig.colorHex,
                    borderWidth: `${Math.max(8, selectedWidth * 2.2)}px`,
                    boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 35px ${metalConfig.colorHex}33`
                  }}
                  className="rounded-full relative border flex items-center justify-center transition-all duration-300"
                >
                  {/* Inner Ring Wall (Comfort Fit curve) */}
                  <div className="w-full h-full rounded-full border border-white/25 flex items-center justify-center relative overflow-hidden bg-stone-950/60">
                    {/* Live Inside Engraving Preview */}
                    {engravingText && (
                      <div
                        className={`text-[9px] tracking-widest text-amber-100/60 uppercase select-none transition-all ${
                          engravingFont === 'serif'
                            ? 'font-serif'
                            : engravingFont === 'script'
                            ? 'italic font-serif'
                            : 'font-mono'
                        }`}
                      >
                        {engravingText}
                      </div>
                    )}
                  </div>

                  {/* Minimal Luxe Bar Accent (Featured in Pinterest pin!) */}
                  {activeRing.style === 'bar' && (
                    <div
                      style={{
                        backgroundColor: metalConfig.colorHex,
                        boxShadow: `0 4px 15px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.6)`
                      }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 rounded-sm border border-white/30 flex items-center justify-center transition-all"
                    >
                      <div className="w-16 h-[1px] bg-white/40" />
                    </div>
                  )}

                  {/* Adjustable Open Gap Accent for Vicenza Flexi-Cuff */}
                  {activeRing.style === 'adjustable' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-stone-950 rounded-full border-b-2 border-amber-300/40" />
                  )}

                  {/* Pavé Diamond Shimmer Accent */}
                  {activeRing.style === 'pave' && (
                    <div className="absolute inset-0 rounded-full pointer-events-none flex items-center justify-center">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-white/70 animate-pulse" />
                    </div>
                  )}

                  {/* Signet Flat Top Face Accent */}
                  {activeRing.style === 'signet' && (
                    <div
                      style={{
                        backgroundColor: metalConfig.colorHex,
                        boxShadow: `0 6px 20px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.5)`
                      }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-9 rounded-md border border-white/40 flex items-center justify-center"
                    >
                      <span className="text-[10px] font-serif tracking-widest text-stone-900/60 uppercase font-semibold">
                        Aura
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Spec Bar */}
            <div className="w-full flex items-center justify-between text-xs pt-4 border-t border-stone-800/80 text-stone-400 z-10">
              <span className="flex items-center gap-1 font-mono">
                <span>{selectedWidth}mm Band</span>
                <span>·</span>
                <span>US {activeRing.isAdjustable ? '5–9 (Adjustable)' : adjustedUs}</span>
              </span>
              <span className="text-amber-200 font-medium">
                {activeRing.italianRegion}
              </span>
            </div>
          </div>

          {/* Quick Try-On Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTryOnWithRing(activeRing.id)}
              className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl text-xs font-medium text-stone-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Simulate on Hand in Try-On Studio</span>
            </button>
          </div>
        </div>

        {/* Right: Ring Customizer & Details (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
          {/* Ring Selector Tabs */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2 font-medium">
              Select Design Silhouette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ATELIER_RINGS.map((ring) => {
                const isSelected = activeRing.id === ring.id;
                return (
                  <button
                    key={ring.id}
                    onClick={() => handleSelectRing(ring)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 text-stone-100 shadow-md'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-medium text-stone-200 truncate">
                      {ring.name}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate mt-0.5">
                      ${ring.basePrice}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Description */}
          <div className="pb-4 border-b border-stone-800">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-serif text-stone-100 font-medium">
                {activeRing.name}
              </h3>
              <div className="text-2xl font-serif font-bold text-amber-300">
                ${finalPrice}
              </div>
            </div>
            <p className="text-xs text-amber-400/90 mt-0.5">
              {activeRing.subtitle} · {metalConfig.name}
            </p>
            <p className="text-sm text-stone-300 mt-2 font-light leading-relaxed">
              {activeRing.description}
            </p>
          </div>

          {/* Metal Finish Selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-400 block mb-2.5 font-medium">
              Precious Metal: <span className="text-stone-200 font-semibold">{metalConfig.name}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(METAL_CONFIG) as MetalType[]).map((mKey) => {
                const config = METAL_CONFIG[mKey];
                const isCurrent = selectedMetal === mKey;
                return (
                  <button
                    key={mKey}
                    onClick={() => setSelectedMetal(mKey)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-stone-850 border-amber-400 shadow-sm ring-1 ring-amber-400/30'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: config.colorHex }}
                        className="w-3.5 h-3.5 rounded-full border border-stone-700 shrink-0"
                      />
                      <span className="text-xs font-medium text-stone-200 truncate">
                        {config.name.replace('18K ', '')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Band Width Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                Band Width: <span className="text-stone-200 font-semibold">{selectedWidth} mm</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              {activeRing.availableWidths.map((width) => (
                <button
                  key={width}
                  onClick={() => setSelectedWidth(width)}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-all cursor-pointer ${
                    selectedWidth === width
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {width} mm
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Selector (Synced with Sizer) */}
          <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-stone-300">
                Ring Size Selection:
              </label>
              {activeRing.isAdjustable ? (
                <span className="text-xs font-mono text-emerald-300 font-semibold">
                  Fits US 5 to 9 (Adjustable)
                </span>
              ) : (
                <span className="text-xs font-mono text-amber-300 font-semibold">
                  Selected: US {adjustedUs}
                </span>
              )}
            </div>

            {!activeRing.isAdjustable && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
                >
                  {RING_SIZE_DATA.map((r) => (
                    <option key={r.us} value={r.us}>
                      US {r.us} (UK {r.uk} · EU {r.eu} · {r.diameterMm}mm)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <p className="text-[11px] text-stone-400 flex items-start gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{widthNote}</span>
            </p>
          </div>

          {/* Custom Laser Engraving */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-stone-400 font-medium flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-amber-400" />
                Complimentary Inside Engraving
              </label>
              <span className="text-[10px] text-stone-500 font-mono">Max 20 chars</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={20}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                placeholder="e.g. AMORE · 25.09"
                className="flex-1 bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-lg px-3 py-2 uppercase tracking-widest focus:outline-none focus:border-amber-400"
              />
              <div className="flex gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
                <button
                  onClick={() => setEngravingFont('serif')}
                  className={`px-2 py-1 text-xs rounded font-serif ${
                    engravingFont === 'serif' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setEngravingFont('sans')}
                  className={`px-2 py-1 text-xs rounded font-sans ${
                    engravingFont === 'sans' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => setEngravingFont('script')}
                  className={`px-2 py-1 text-xs rounded italic font-serif ${
                    engravingFont === 'script' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                  }`}
                >
                  Script
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onOpenDropHintWithRing(activeRing, selectedMetal, adjustedUs)}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>Drop a Hint For This Ring</span>
            </button>

            <button
              onClick={() => setOrderModalOpen(true)}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Order Handcrafted (${finalPrice})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Confirmation Mock Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-stone-100">
                Bespoke Atelier Order Request
              </h3>
              <p className="text-xs text-stone-400">
                Your ring specification has been recorded with your exact calibrated ring size.
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between text-stone-300">
                <span>Model:</span>
                <span className="text-amber-200">{activeRing.name}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Metal:</span>
                <span>{metalConfig.name}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Band Width:</span>
                <span>{selectedWidth} mm</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>Calibrated Size:</span>
                <span className="text-amber-300 font-bold">
                  US {activeRing.isAdjustable ? '5–9 Adjustable' : adjustedUs}
                </span>
              </div>
              {engravingText && (
                <div className="flex justify-between text-stone-300">
                  <span>Inside Engraving:</span>
                  <span className="tracking-widest">{engravingText}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-100 pt-2 border-t border-stone-800 font-bold">
                <span>Total:</span>
                <span>${finalPrice} USD</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="w-full py-2.5 bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close & Return to Atelier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
