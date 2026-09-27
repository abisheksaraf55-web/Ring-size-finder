import React, { useState } from 'react';
import { CreditCard, Check, RotateCcw, X, Info, Coins, ShieldCheck } from 'lucide-react';
import { POPULAR_COINS } from '../data/ringSizes';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixelsPerMm: number;
  setPixelsPerMm: (ppm: number) => void;
  setIsCalibrated: (c: boolean) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  pixelsPerMm,
  setPixelsPerMm,
  setIsCalibrated
}) => {
  const [activeMode, setActiveMode] = useState<'card' | 'coin'>('card');
  const [selectedCoin, setSelectedCoin] = useState(POPULAR_COINS[1]); // US quarter default
  
  // Credit card standard ISO 7810 ID-1 is 85.60 mm wide x 53.98 mm high
  const CARD_WIDTH_MM = 85.60;
  
  // Current pixel width calculated from pixelsPerMm
  const [sliderWidthPx, setSliderWidthPx] = useState(
    Math.round(pixelsPerMm * (activeMode === 'card' ? CARD_WIDTH_MM : selectedCoin.widthMm))
  );

  if (!isOpen) return null;

  const handleWidthChange = (newPx: number) => {
    setSliderWidthPx(newPx);
    const targetMm = activeMode === 'card' ? CARD_WIDTH_MM : selectedCoin.widthMm;
    const computedPpm = newPx / targetMm;
    setPixelsPerMm(computedPpm);
  };

  const handleCoinChange = (coinName: string) => {
    const coin = POPULAR_COINS.find(c => c.name === coinName) || POPULAR_COINS[1];
    setSelectedCoin(coin);
    setSliderWidthPx(Math.round(pixelsPerMm * coin.widthMm));
  };

  const handleSwitchMode = (mode: 'card' | 'coin') => {
    setActiveMode(mode);
    const targetMm = mode === 'card' ? CARD_WIDTH_MM : selectedCoin.widthMm;
    setSliderWidthPx(Math.round(pixelsPerMm * targetMm));
  };

  const handleResetDefault = () => {
    // Standard standard web display fallback is ~3.78 px/mm (~96 DPI)
    const defaultPpm = 3.78;
    setPixelsPerMm(defaultPpm);
    const targetMm = activeMode === 'card' ? CARD_WIDTH_MM : selectedCoin.widthMm;
    setSliderWidthPx(Math.round(defaultPpm * targetMm));
  };

  const handleConfirm = () => {
    setIsCalibrated(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-slate-900">
                1:1 True-Scale Screen Calibration
              </h2>
              <p className="text-xs text-slate-500">
                Calibrate once so physical rings placed on your screen match 100% in millimeters.
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

        {/* Mode Selector */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => handleSwitchMode('card')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Standard Bank / ID Card (Recommended)
            </button>
            <button
              onClick={() => handleSwitchMode('coin')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeMode === 'coin'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              Standard Coin
            </button>
          </div>

          {activeMode === 'coin' && (
            <select
              value={selectedCoin.name}
              onChange={(e) => handleCoinChange(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-400"
            >
              {POPULAR_COINS.filter(c => c.type === 'coin').map(c => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.widthMm}mm)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-5 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p>
              {activeMode === 'card' ? (
                <>
                  Hold any standard credit, debit, or driver's license card against the rectangular outline below. Adjust the slider until the outline matches your card's outer edges exactly.
                </>
              ) : (
                <>
                  Hold a <strong>{selectedCoin.name}</strong> against the circle below. Adjust the slider until the outline matches your coin's perimeter.
                </>
              )}
            </p>
            <p className="text-slate-500">
              Current scale factor: <span className="font-mono text-slate-900 font-semibold">{pixelsPerMm.toFixed(2)} px/mm</span>.
            </p>
          </div>
        </div>

        {/* Interactive Calibration Guide Surface */}
        <div className="min-h-[180px] bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
          {activeMode === 'card' ? (
            <div
              style={{
                width: `${sliderWidthPx}px`,
                height: `${Math.round(sliderWidthPx * (53.98 / 85.60))}px`,
                maxWidth: '100%'
              }}
              className="border-2 border-dashed border-slate-800 rounded-xl bg-white flex flex-col items-center justify-between p-3 transition-all relative shadow-sm"
            >
              <div className="w-full flex items-center justify-between text-[11px] text-slate-700 font-mono">
                <span className="flex items-center gap-1 font-medium">
                  <CreditCard className="w-3.5 h-3.5" /> ISO Standard Card
                </span>
                <span>85.60 mm</span>
              </div>
              <div className="text-xs text-slate-800 font-medium text-center">
                Align physical card here
              </div>
              <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{sliderWidthPx} px</span>
                <span>53.98 mm</span>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: `${sliderWidthPx}px`,
                height: `${sliderWidthPx}px`
              }}
              className="border-2 border-dashed border-slate-800 rounded-full bg-white flex flex-col items-center justify-center text-center p-2 transition-all relative shadow-sm"
            >
              <div className="text-[10px] text-slate-900 font-mono font-semibold">
                {selectedCoin.widthMm} mm
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                {sliderWidthPx} px
              </div>
            </div>
          )}
        </div>

        {/* Calibration Slider & Controls */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Fine-tune guide size:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleWidthChange(sliderWidthPx - 1)}
                className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-sm cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-slate-900 font-bold px-2 min-w-[50px] text-center">
                {sliderWidthPx} px
              </span>
              <button
                onClick={() => handleWidthChange(sliderWidthPx + 1)}
                className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <input
            type="range"
            min={activeMode === 'card' ? 200 : 50}
            max={activeMode === 'card' ? 500 : 180}
            value={sliderWidthPx}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-200">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to standard screen estimate
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Calibrated & Saved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
