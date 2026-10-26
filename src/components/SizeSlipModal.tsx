import React from 'react';
import { X, Download, Check, Sparkles, FileImage, ShieldCheck, Globe } from 'lucide-react';
import { downloadPngFile } from '../utils/generateRingSlip';
import { RingSizeEntry } from '../types/ring';

interface SizeSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slipImageUrl: string;
  sizeName: string;
  ukSizeName?: string;
  diameterMm: number;
  standard?: 'UK' | 'US';
  funFact?: string;
  entry?: RingSizeEntry;
}

export const SizeSlipModal: React.FC<SizeSlipModalProps> = ({
  isOpen,
  onClose,
  slipImageUrl,
  sizeName,
  ukSizeName,
  diameterMm,
  standard = 'US',
  funFact,
  entry
}) => {
  if (!isOpen || !slipImageUrl) return null;

  const isUk = standard === 'UK';
  const displayTitle = isUk && (entry?.uk || ukSizeName) ? `UK ${entry?.uk || ukSizeName}` : `US ${entry?.us || sizeName}`;

  const handleDownloadAgain = () => {
    const filename = isUk && (entry?.uk || ukSizeName)
      ? `Ring-Measurement-Slip-UK-${(entry?.uk || ukSizeName || '').replace(/[\s/]+/g, '_')}-${diameterMm.toFixed(2)}mm.png`
      : `Ring-Measurement-Slip-US-${(entry?.us || sizeName).replace(/[\s/]+/g, '_')}-${diameterMm.toFixed(2)}mm.png`;
    downloadPngFile(slipImageUrl, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <span>Measurement Slip Generated</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-mono bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  <Check className="w-2.5 h-2.5" /> Saved
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {displayTitle} · {diameterMm.toFixed(2)} mm diameter · All Sizes Included
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* All International Sizing Standards Badges Grid */}
        <div className="mx-4 mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-700" />
              All International Sizes on Slip
            </span>
            <span className="font-mono text-slate-600">Ø {diameterMm.toFixed(2)} mm</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center font-mono">
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">USA / CA</div>
              <div className="text-xs font-bold text-slate-900">US {entry?.us || sizeName}</div>
            </div>
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">UK / AU</div>
              <div className="text-xs font-bold text-slate-900">{entry?.uk || ukSizeName || '-'}</div>
            </div>
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">EU / ISO</div>
              <div className="text-xs font-bold text-slate-800">{entry?.eu || '-'}</div>
            </div>
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">IT / ES</div>
              <div className="text-xs font-bold text-slate-800">{entry?.it || '-'}</div>
            </div>
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">JP / CH</div>
              <div className="text-xs font-bold text-slate-800">{entry?.jpCh || entry?.jp || '-'}</div>
            </div>
            <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-400 font-sans uppercase">CIRCUMF</div>
              <div className="text-[11px] font-bold text-slate-800 pt-0.5">{(diameterMm * Math.PI).toFixed(1)}mm</div>
            </div>
          </div>
        </div>

        {/* Fun Fact Callout Card */}
        {funFact && (
          <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-amber-50/90 to-amber-100/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <div className="text-[11px] font-bold text-amber-950 uppercase tracking-wider font-sans">
                Did You Know? · Size {displayTitle} Fun Fact
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed mt-0.5 font-sans">
                {funFact}
              </p>
            </div>
          </div>
        )}

        {/* Slip Image Preview Scroll Area */}
        <div className="p-4 overflow-y-auto flex flex-col items-center bg-slate-50">
          <div className="relative group max-w-[340px] rounded-lg overflow-hidden shadow-xl border border-slate-200 bg-white">
            <img
              src={slipImageUrl}
              alt={`Ring Measurement Bill for ${displayTitle}`}
              className="w-full h-auto object-contain block select-none pointer-events-auto"
            />
          </div>

          <p className="mt-3 text-[11px] text-slate-500 text-center flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Measurement slip saved with fun fact & specs</span>
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>

          <button
            onClick={handleDownloadAgain}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Re-download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
