import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCalibration: () => void;
  onOpenPrintModal: () => void;
  onOpenDropHint: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCalibration,
  onOpenPrintModal,
  onOpenDropHint
}) => {
  return (
    <footer className="border-t border-stone-900 bg-stone-950 text-stone-400 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-serif text-lg tracking-widest text-amber-200 uppercase font-medium">
            Aura Oro Atelier
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-sm">
            Interactive 1:1 true-scale ring sizer and bespoke Italian gold jeweler studio. Vicenza · Firenze · Milano.
          </p>
        </div>

        {/* Quiet Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
          <button
            onClick={onOpenCalibration}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Screen Calibration
          </button>
          <button
            onClick={onOpenPrintModal}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Printable Sheet (100% Scale)
          </button>
          <button
            onClick={onOpenDropHint}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Stealth Gifting Guide
          </button>
          <span className="text-stone-700">|</span>
          <span className="text-stone-500">
            Complimentary worldwide resizing guarantee
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-stone-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 gap-2">
        <div>
          © {new Date().getFullYear()} Aura Oro Goldsmiths S.r.l. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-stone-500">
          <span>Solid 18K Italian Gold & Lab-Grown Conflict-Free Diamonds</span>
        </div>
      </div>
    </footer>
  );
};
