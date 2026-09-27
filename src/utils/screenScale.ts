/**
 * Universal Screen Scale Detection for 1:1 Physical Millimeter Accuracy
 *
 * Traditional desktop CSS uses 96 DPI (3.78 px/mm).
 * However, mobile smartphones (iPhone, Samsung Galaxy, Google Pixel) have much
 * higher physical pixel densities (typically ~150-165 CSS DPI = ~5.9 - 6.4 px/mm).
 *
 * This utility dynamically resolves the true physical millimeter density for the active device.
 */

export function getUniversalPixelsPerMm(): number {
  if (typeof window === 'undefined') return 3.78;

  const ua = navigator.userAgent || '';
  const screenWidth = Math.min(window.screen.width, window.screen.height);
  const screenHeight = Math.max(window.screen.width, window.screen.height);
  const dpr = window.devicePixelRatio || 1;
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  const isMobilePhone =
    /iPhone|iPod|Android.*Mobile/i.test(ua) ||
    (isTouchDevice && screenWidth <= 450);

  // Check if a valid, non-stale custom calibration was saved
  try {
    const saved = localStorage.getItem('aura_oro_ppm');
    if (saved) {
      const parsed = parseFloat(saved);
      // Discard legacy faulty 3.78 desktop default on mobile phones
      if (isMobilePhone && parsed < 4.8) {
        localStorage.removeItem('aura_oro_ppm');
      } else if (parsed >= 3.2 && parsed <= 8.5) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 1. iPhone physical screen density mapping
  // Apple iPhone OLED screens (iPhone X, 11 Pro, 12, 13, 14, 15, 16):
  // Physical hardware PPI: 460 PPI. Device Pixel Ratio: 3.
  // CSS PPI = 460 / 3 = 153.33. Millimeters per inch = 25.4.
  // CSS px per millimeter = 153.33 / 25.4 = 6.037 px/mm.
  if (/iPhone/i.test(ua)) {
    if (dpr >= 3) {
      return 6.04;
    }
    // iPhone SE, 8, 11 (2x Retina LCD): 326 PPI / 2 = 163 CSS PPI -> 163 / 25.4 = 6.42 px/mm
    return 6.42;
  }

  // 2. iPad physical screen density mapping
  // iPad Retina displays: 264 PPI / 2 = 132 CSS PPI -> 132 / 25.4 = 5.20 px/mm
  if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 5.20;
  }

  // 3. Android smartphones
  if (/Android/i.test(ua) && isMobilePhone) {
    // Modern Android phones have an active display width between 65mm and 70mm (average 67.5mm)
    if (screenWidth > 0) {
      const computed = screenWidth / 67.5;
      return Math.min(6.5, Math.max(5.4, parseFloat(computed.toFixed(2))));
    }
    return 5.85;
  }

  // 4. Other mobile / handheld touch devices
  if (isMobilePhone) {
    if (screenWidth > 0) {
      const computed = screenWidth / 67.5;
      return Math.min(6.5, Math.max(5.4, parseFloat(computed.toFixed(2))));
    }
    return 5.90;
  }

  // 5. Desktop / Laptop displays
  // High-DPI laptops (Retina MacBook, 4K laptops scaled at 150-200%)
  if (dpr > 1) {
    return 4.25;
  }

  // Standard 96 DPI desktop monitor (96 / 25.4 = 3.7795 px/mm)
  return 3.78;
}
