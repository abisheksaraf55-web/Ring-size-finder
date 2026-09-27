/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenRingSizer } from './components/ScreenRingSizer';
import { CalibrationModal } from './components/CalibrationModal';
import { DropHintModal } from './components/DropHintModal';
import { PrintableSizerModal } from './components/PrintableSizerModal';
import { ATELIER_RINGS } from './data/ringSizes';
import { JewelryRing, MetalType } from './types/ring';
import { getUniversalPixelsPerMm } from './utils/screenScale';

export default function App() {
  // True Universal physical 1:1 physical millimeter scale detection
  const [pixelsPerMm, setPixelsPerMm] = useState<number>(() => {
    return getUniversalPixelsPerMm();
  });

  const [isCalibrated, setIsCalibrated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aura_oro_is_calibrated') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    // Check URL parameters first for "Drop a Hint" shared links
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSize = params.get('size');
      if (urlSize) return urlSize;
    }
    try {
      const saved = localStorage.getItem('aura_oro_saved_size');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '7';
  });

  // Modals state
  const [calibrationOpen, setCalibrationOpen] = useState<boolean>(false);
  const [dropHintOpen, setDropHintOpen] = useState<boolean>(false);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);

  // Active ring & metal selection for hints
  const [activeRingForHint, setActiveRingForHint] = useState<JewelryRing>(ATELIER_RINGS[0]);
  const [activeMetalForHint, setActiveMetalForHint] = useState<MetalType>('yellow-gold');

  // Check URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ringParam = params.get('ring');
    const metalParam = params.get('metal') as MetalType | null;

    if (ringParam) {
      const found = ATELIER_RINGS.find((r) => r.id === ringParam);
      if (found) {
        setActiveRingForHint(found);
      }
    }
    if (metalParam && ['yellow-gold', 'rose-gold', 'white-gold', 'platinum'].includes(metalParam)) {
      setActiveMetalForHint(metalParam);
    }
  }, []);

  const handleUpdatePpm = (newPpm: number) => {
    setPixelsPerMm(newPpm);
    try {
      localStorage.setItem('aura_oro_ppm', newPpm.toString());
    } catch {
      // ignore
    }
  };

  const handleSetIsCalibrated = (calibrated: boolean) => {
    setIsCalibrated(calibrated);
    try {
      localStorage.setItem('aura_oro_is_calibrated', calibrated.toString());
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-2 sm:p-4 font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Main Content: Pure Ring Size & Measurement Screen */}
      <main className="w-full flex flex-col items-center justify-center">
        <ScreenRingSizer
          pixelsPerMm={pixelsPerMm}
          onOpenCalibration={() => setCalibrationOpen(true)}
          isCalibrated={isCalibrated}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onOpenShareHint={() => setDropHintOpen(true)}
        />
      </main>

      {/* Calibration Modal */}
      <CalibrationModal
        isOpen={calibrationOpen}
        onClose={() => setCalibrationOpen(false)}
        pixelsPerMm={pixelsPerMm}
        setPixelsPerMm={handleUpdatePpm}
        setIsCalibrated={handleSetIsCalibrated}
      />

      {/* Drop a Hint & Stealth Gifting Modal */}
      <DropHintModal
        isOpen={dropHintOpen}
        onClose={() => setDropHintOpen(false)}
        selectedSize={selectedSize}
        activeRing={activeRingForHint}
        selectedMetal={activeMetalForHint}
      />

      {/* Printable 1:1 Scale Sheet Modal */}
      <PrintableSizerModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
