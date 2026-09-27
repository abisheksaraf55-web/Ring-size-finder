import React, { useState } from 'react';
import {
  Search,
  Printer,
  Check,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Info
} from 'lucide-react';
import { RING_SIZE_DATA } from '../data/ringSizes';
import { RingSizeEntry } from '../types/ring';

interface SizeConversionTableProps {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onOpenPrintModal: () => void;
}

export const SizeConversionTable: React.FC<SizeConversionTableProps> = ({
  selectedSize,
  setSelectedSize,
  onOpenPrintModal
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>('metric');

  // Filter rows based on search input
  const filteredRows = RING_SIZE_DATA.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      row.us.toLowerCase().includes(q) ||
      row.uk.toLowerCase().includes(q) ||
      row.eu.toString().includes(q) ||
      row.it.toString().includes(q) ||
      row.jp.toString().includes(q) ||
      row.diameterMm.toFixed(2).includes(q) ||
      row.circumferenceMm.toFixed(1).includes(q)
    );
  });

  return (
    <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase text-amber-300 font-medium mb-2">
          <span>Official Jewelers' Standard</span>
          <span aria-hidden="true">·</span>
          <span>ISO 8653 International</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-stone-100 font-normal">
          International Ring Size Matrix
        </h2>
        <p className="mt-3 text-sm md:text-base text-stone-400 font-light leading-relaxed">
          Comprehensive conversion between North American, British Commonwealth, European ISO, Italian, and East Asian sizing scales. Click any row to sync your atelier size.
        </p>
      </div>

      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-800">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by size, UK letter, or mm..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Unit Toggle & Print Sheet CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setUnitMode('metric')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  unitMode === 'metric'
                    ? 'bg-amber-400/20 text-amber-200 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Metric (mm)
              </button>
              <button
                onClick={() => setUnitMode('imperial')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  unitMode === 'imperial'
                    ? 'bg-amber-400/20 text-amber-200 font-medium'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Inches (in)
              </button>
            </div>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Printable 1:1 Scale Sheet</span>
            </button>
          </div>
        </div>

        {/* Scrollable Data Table with Strict Tabular Numerals */}
        <div className="overflow-x-auto rounded-xl border border-stone-800 no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider text-[10px] font-mono border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">US & Canada</th>
                <th className="py-3 px-4">UK & Australia</th>
                <th className="py-3 px-4">Europe / ISO</th>
                <th className="py-3 px-4">Italy & Spain</th>
                <th className="py-3 px-4">Japan / Asia</th>
                <th className="py-3 px-4">Inside Diameter</th>
                <th className="py-3 px-4">Circumference</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-850/60 font-mono tabular-nums">
              {filteredRows.map((row) => {
                const isSelected = selectedSize === row.us;
                return (
                  <tr
                    key={row.us}
                    onClick={() => setSelectedSize(row.us)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-400/15 text-stone-100 font-medium'
                        : 'hover:bg-stone-850/50 text-stone-300'
                    }`}
                  >
                    <td className="py-3 px-4 font-serif font-bold text-sm text-amber-200">
                      US {row.us}
                    </td>
                    <td className="py-3 px-4 text-stone-200">
                      {row.uk}
                    </td>
                    <td className="py-3 px-4 text-stone-300">
                      {row.eu}
                    </td>
                    <td className="py-3 px-4 text-stone-300">
                      {row.it}
                    </td>
                    <td className="py-3 px-4 text-stone-300">
                      {row.jp}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {unitMode === 'metric'
                        ? `${row.diameterMm.toFixed(2)} mm`
                        : `${(row.diameterMm / 25.4).toFixed(3)} in`}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {unitMode === 'metric'
                        ? `${row.circumferenceMm.toFixed(1)} mm`
                        : `${(row.circumferenceMm / 25.4).toFixed(3)} in`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-500 hover:text-stone-300">
                          Select
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Global Sizing Advisory */}
        <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl flex items-start gap-3 text-xs text-stone-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="text-stone-200">Italian Sizing Standard Note:</strong> In Italy, ring sizes represent the inner circumference in millimeters minus 40 (e.g., Italian size 14 = 54 mm circumference).
            </p>
            <p>
              When between two sizes, we always advise selecting the larger size, particularly if purchasing rings wider than 4mm or with solid flat bars.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
