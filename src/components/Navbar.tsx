import React from 'react';
import { SlidersHorizontal, Gift, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenCalibration: () => void;
  onOpenDropHint: () => void;
  isCalibrated: boolean;
  selectedSize: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCalibration,
  onOpenDropHint,
  isCalibrated,
  selectedSize
}) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-850 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="text-left select-none">
            <div className="font-serif text-xl sm:text-2xl tracking-widest text-amber-200 uppercase font-medium">
              Aura Oro
            </div>
            <div className="text-[10px] tracking-[0.2em] text-stone-400 uppercase -mt-0.5">
              1:1 True-Scale Ring Sizer & Measurement Studio
            </div>
          </div>
        </div>

        {/* Zone 2: Informational Active Measurement Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-300 bg-stone-900/90 border border-stone-800 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Active Size:</span>
          <strong className="text-amber-300 font-bold">US {selectedSize}</strong>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">1:1 Screen Physical Scale</span>
        </div>

        {/* Zone 3: Functional Actions (Calibrate & Share) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCalibration}
            title="Calibrate screen with credit card or coin for 100% accurate scale"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-stone-800 bg-stone-900/90 hover:bg-stone-850 hover:border-amber-400/40 text-stone-300 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">1:1 Calibrate</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCalibrated ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>

          <button
            onClick={onOpenDropHint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-100 hover:to-amber-300 rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Gift className="w-3.5 h-3.5 text-stone-950" />
            <span>Share Size</span>
            {selectedSize && (
              <span className="bg-stone-950/20 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                US {selectedSize}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
