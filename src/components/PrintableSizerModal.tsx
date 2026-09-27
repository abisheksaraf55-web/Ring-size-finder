import React from 'react';
import { Printer, X, Download, ShieldCheck, Info } from 'lucide-react';
import { RING_SIZE_DATA } from '../data/ringSizes';

interface PrintableSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableSizerModal: React.FC<PrintableSizerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden my-8 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-800">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-slate-900">
                1:1 Scale Printable Ring Sizing Guide
              </h2>
              <p className="text-xs text-slate-500">
                Print on 100% scale (no scaling) to check sizes with paper cut-outs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print instructions */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg my-4 text-xs text-slate-600 space-y-1">
          <p className="flex items-center gap-1.5 text-slate-900 font-medium">
            <Info className="w-3.5 h-3.5" />
            Important Printer Scaling Setting:
          </p>
          <p>
            When the print dialog opens, set page scaling to <strong>"100%" or "Actual Size"</strong> (do NOT select "Fit to Page" or "Shrink to Fit"). Verify the scale against the 85.6mm credit card box once printed.
          </p>
        </div>

        {/* Printable Preview Sheet (Light background for crisp home printing) */}
        <div className="bg-white text-stone-900 p-6 rounded-xl border border-stone-300 space-y-6 max-h-[460px] overflow-y-auto">
          {/* Sheet Header */}
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
            <div>
              <div className="font-serif text-2xl font-bold tracking-widest uppercase">
                AURA ORO
              </div>
              <div className="text-[10px] tracking-widest uppercase text-stone-600">
                Vicenza Goldsmiths Atelier · 1:1 Ring Measurement Chart
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-stone-700">
              ISO 8653 Jewelry Calibration Sheet
            </div>
          </div>

          {/* Verification Box: Standard Card */}
          <div className="border-2 border-dashed border-stone-700 rounded-lg p-3 text-center bg-stone-50 flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs font-bold text-stone-900">
                Print Scale Verification Guide
              </div>
              <div className="text-[11px] text-stone-600">
                Place any standard bank card inside this box. It should fit the exact boundary (85.60 mm wide).
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-stone-800 border-l border-stone-300 pl-4">
              85.60 mm
            </div>
          </div>

          {/* Circular Ring Gauge Circles (US 4 to 12) */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-stone-800">
              Circle Sizer: Place your ring over circles until it covers the black ring with zero gap
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 text-center">
              {RING_SIZE_DATA.filter((r) =>
                ['4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(r.us)
              ).map((size) => (
                <div
                  key={size.us}
                  className="flex flex-col items-center justify-center p-2 border border-stone-200 rounded-lg bg-stone-50"
                >
                  <div
                    style={{
                      width: `${size.diameterMm * 2.2}px`,
                      height: `${size.diameterMm * 2.2}px`
                    }}
                    className="rounded-full border-2 border-stone-900 flex items-center justify-center font-bold text-[10px]"
                  >
                    US {size.us}
                  </div>
                  <div className="text-[9px] font-mono text-stone-600 mt-1">
                    {size.diameterMm}mm
                  </div>
                  <div className="text-[9px] text-stone-500 font-mono">
                    UK {size.uk}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cut-Out Finger Strip Sizer */}
          <div className="pt-2 border-t border-stone-200">
            <div className="text-xs font-bold uppercase tracking-wider mb-2 text-stone-800">
              Printable Cut-Out Finger Sizer Strip
            </div>
            <div className="p-3 border-2 border-dashed border-stone-400 rounded bg-stone-100/60 text-center text-xs text-stone-600">
              ✂️ Cut along outer line. Make a small slit at the arrow. Wrap around finger and read number through slit.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Aura Oro Atelier · Handcrafted in Italy
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sizing Sheet (100% Scale)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
