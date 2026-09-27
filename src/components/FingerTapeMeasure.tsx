import React, { useState } from 'react';
import {
  Ruler,
  Scissors,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { getClosestSizeByCircumference, RING_SIZE_DATA } from '../data/ringSizes';
import { RingSizeEntry } from '../types/ring';

interface FingerTapeMeasureProps {
  pixelsPerMm: number;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onNavigateToAtelier: () => void;
}

export const FingerTapeMeasure: React.FC<FingerTapeMeasureProps> = ({
  pixelsPerMm,
  selectedSize,
  setSelectedSize,
  onNavigateToAtelier
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [baseCircumferenceMm, setBaseCircumferenceMm] = useState<number>(54.4); // US 7 default
  const [hasProminentKnuckle, setHasProminentKnuckle] = useState<boolean>(false);
  const [knuckleCircumferenceMm, setKnuckleCircumferenceMm] = useState<number>(57.0);
  const [unit, setUnit] = useState<'mm' | 'in'>('mm');
  const [isApplied, setIsApplied] = useState<boolean>(false);

  // If prominent knuckle, take the average of base and knuckle
  const effectiveCircumference = hasProminentKnuckle
    ? (baseCircumferenceMm + knuckleCircumferenceMm) / 2
    : baseCircumferenceMm;

  const calculatedSize: RingSizeEntry = getClosestSizeByCircumference(effectiveCircumference);

  const handleApplySize = () => {
    setSelectedSize(calculatedSize.us);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2500);
  };

  return (
    <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
      {/* Editorial Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-300 font-medium mb-2">
          <span>Finger Ribbon & Knuckle Method</span>
          <span aria-hidden="true">·</span>
          <span>Zero Tools Required</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-100 font-normal">
          Measure Your Finger Circumference
        </h2>
        <p className="mt-3 text-sm md:text-base text-stone-400 font-light leading-relaxed">
          No existing ring on hand? Use a simple strip of paper or non-stretchy ribbon to find your exact millimeter circumference with knuckle compensation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 4-Step Ribbon Guide & On-Screen Ruler (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
          {/* Step Selector Header */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Cut Strip' },
              { num: 2, label: 'Wrap Base' },
              { num: 3, label: 'Mark Overlap' },
              { num: 4, label: 'Read Size' }
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  activeStep === s.num
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-semibold shadow-sm'
                    : activeStep > s.num
                    ? 'bg-stone-950/60 border-stone-800 text-emerald-400'
                    : 'bg-stone-950/40 border-stone-850 text-stone-500'
                }`}
              >
                <div className="font-mono text-sm">{s.num}</div>
                <div className="text-[11px] truncate mt-0.5">{s.label}</div>
              </button>
            ))}
          </div>

          {/* Interactive Visual Guide Content */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 min-h-[220px] flex flex-col justify-between">
            {activeStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <Scissors className="w-4 h-4" />
                  Step 1: Prepare a Paper Strip or Non-Stretchy Ribbon
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Cut a strip of plain printer paper approximately <strong>1 cm (0.4 in) wide</strong> and 10 cm long. Avoid stretchy strings or elastic bands, as stretch can skew your measurement by up to two full sizes.
                </p>
                <div className="p-3 bg-stone-900/80 rounded border border-stone-800 text-xs text-stone-400">
                  Tip: Measure at the end of the day when your hands are warm and at their natural resting size.
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <Ruler className="w-4 h-4" />
                  Step 2: Wrap Snugly Around the Finger Base
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Wrap the strip around the base of the finger you plan to wear the ring on. Ensure the strip sits flat against your skin with comfortable tension—not squeezing the flesh tightly, but without slack.
                </p>
                <div className="p-3 bg-stone-900/80 rounded border border-stone-800 text-xs text-stone-400">
                  Note: If ordering for your dominant hand, remember it is usually about half a size larger than your non-dominant hand.
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Step 3: Mark with a Fine-Tipped Pen
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Use a sharp pen or fine-point pencil to make a clean straight line across where the two ends of the paper strip overlap.
                </p>
                <div className="p-3 bg-stone-900/80 rounded border border-stone-800 text-xs text-stone-400">
                  Precision matters: A single millimeter difference is equal to half a ring size!
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Step 4: Align Against the Calibrated Screen Ruler Below
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Unwrap the strip and lay it flat against our on-screen millimeter ruler below, or use your physical metric ruler and enter the millimeters into the slider.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-900">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="text-xs text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous Step
              </button>
              <button
                disabled={activeStep === 4}
                onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                className="text-xs font-medium text-amber-300 hover:text-amber-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Calibrated On-Screen Ruler */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-stone-400">
              <span className="font-medium text-stone-300">1:1 Calibrated Screen Ruler (Metric)</span>
              <span className="font-mono text-amber-300/80">Lay your paper strip here</span>
            </div>

            {/* Simulated Millimeter Ruler */}
            <div className="w-full overflow-x-auto pb-2 no-scrollbar">
              <div
                style={{
                  width: `${80 * pixelsPerMm}px`,
                  minWidth: `${80 * pixelsPerMm}px`
                }}
                className="h-16 bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 rounded-lg relative flex items-end select-none"
              >
                {/* Millimeter Ticks */}
                {Array.from({ length: 81 }).map((_, mm) => {
                  const isCm = mm % 10 === 0;
                  const isFive = mm % 5 === 0 && !isCm;
                  return (
                    <div
                      key={mm}
                      style={{
                        left: `${mm * pixelsPerMm}px`,
                        height: isCm ? '28px' : isFive ? '18px' : '10px'
                      }}
                      className={`absolute bottom-0 w-[1px] ${
                        isCm ? 'bg-amber-300' : isFive ? 'bg-stone-400' : 'bg-stone-600'
                      }`}
                    >
                      {isCm && (
                        <span className="absolute -top-5 -left-2 text-[10px] font-mono text-amber-300">
                          {mm / 10}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Marker showing current base circumference */}
                <div
                  style={{ left: `${baseCircumferenceMm * pixelsPerMm}px` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_10px_#f59e0b] z-10 transition-all pointer-events-none"
                >
                  <div className="absolute -top-6 -left-6 bg-amber-400 text-stone-950 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    {baseCircumferenceMm.toFixed(1)}mm
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-stone-500 font-mono mt-1 text-right">
              Scale: Centimeters (0 to 8 cm)
            </div>
          </div>
        </div>

        {/* Right Column: Circumference Slider & Knuckle Calculation (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-serif text-stone-100 font-medium">
                Circumference Input
              </h3>
              <div className="flex items-center gap-1 p-0.5 bg-stone-950 rounded border border-stone-800 text-[11px]">
                <button
                  onClick={() => setUnit('mm')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unit === 'mm' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-stone-400'
                  }`}
                >
                  Millimeters (mm)
                </button>
                <button
                  onClick={() => setUnit('in')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unit === 'in' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-stone-400'
                  }`}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            {/* Base Finger Circumference Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-medium">Finger Base Circumference:</span>
                <span className="font-mono text-base font-bold text-amber-300">
                  {unit === 'mm'
                    ? `${baseCircumferenceMm.toFixed(1)} mm`
                    : `${(baseCircumferenceMm / 25.4).toFixed(2)} in`}
                </span>
              </div>
              <input
                type="range"
                min={44.0}
                max={72.0}
                step={0.2}
                value={baseCircumferenceMm}
                onChange={(e) => setBaseCircumferenceMm(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg appearance-none"
              />
              <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>44 mm (US 3)</span>
                <span>58 mm (US 8.5)</span>
                <span>72 mm (US 14)</span>
              </div>
            </div>

            {/* Knuckle Compensation Toggle */}
            <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-stone-200 flex items-center gap-1.5">
                    <span>Prominent Knuckle Check</span>
                    <span title="If your knuckle is wider than the base where the ring sits">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Does your knuckle feel wider than your finger base?
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasProminentKnuckle}
                  onChange={(e) => setHasProminentKnuckle(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>

              {hasProminentKnuckle && (
                <div className="pt-3 border-t border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Knuckle Circumference:</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {unit === 'mm'
                        ? `${knuckleCircumferenceMm.toFixed(1)} mm`
                        : `${(knuckleCircumferenceMm / 25.4).toFixed(2)} in`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={46.0}
                    max={74.0}
                    step={0.2}
                    value={knuckleCircumferenceMm}
                    onChange={(e) => setKnuckleCircumferenceMm(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none"
                  />
                  <p className="text-[11px] text-amber-200/80 bg-amber-500/10 p-2 rounded">
                    We calculate the ideal balanced size between your knuckle ({knuckleCircumferenceMm.toFixed(1)}mm) and finger base ({baseCircumferenceMm.toFixed(1)}mm) so the ring slides over smoothly without being loose.
                  </p>
                </div>
              )}
            </div>

            {/* Calculated Result Card */}
            <div className="bg-gradient-to-br from-stone-950 to-stone-900 border border-amber-500/40 rounded-xl p-5 space-y-4">
              <div className="text-[11px] uppercase tracking-wider text-amber-300 font-medium">
                Recommended Ring Size
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl md:text-4xl font-serif font-bold text-stone-100">
                    US {calculatedSize.us}
                  </div>
                  <div className="text-xs text-stone-400 mt-1 font-mono">
                    UK {calculatedSize.uk} · EU {calculatedSize.eu} · IT {calculatedSize.it}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400">Inside Diameter</div>
                  <div className="text-base font-mono text-amber-300 font-semibold">
                    {calculatedSize.diameterMm} mm
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                <button
                  onClick={handleApplySize}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied to Atelier
                    </>
                  ) : (
                    <>Apply to My Size (US {calculatedSize.us})</>
                  )}
                </button>

                <button
                  onClick={onNavigateToAtelier}
                  className="px-4 py-2 text-xs font-medium text-stone-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 rounded-lg shadow transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Rings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
