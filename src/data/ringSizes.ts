import { RingSizeEntry, JewelryRing, MetalType } from '../types/ring';

// Standard international ring conversion table
// Diameters and circumferences according to ISO 8653 and standard US/UK jeweler standards
export const RING_SIZE_DATA: RingSizeEntry[] = [
  { us: '0', usNumeric: 0.0, uk: 'A', eu: 36.5, it: -3.5, jp: 1, jpCh: '1', diameterMm: 11.63, circumferenceMm: 36.5 },
  { us: '½', usNumeric: 0.5, uk: 'A ½', eu: 37.8, it: -2.2, jp: 1, jpCh: '1.5', diameterMm: 12.04, circumferenceMm: 37.8 },
  { us: '1', usNumeric: 1.0, uk: 'B', eu: 39.1, it: -0.9, jp: 1, jpCh: '2', diameterMm: 12.45, circumferenceMm: 39.1 },
  { us: '1 ½', usNumeric: 1.5, uk: 'C', eu: 40.4, it: 0.4, jp: 2, jpCh: '2.5', diameterMm: 12.85, circumferenceMm: 40.4 },
  { us: '2', usNumeric: 2.0, uk: 'D', eu: 41.7, it: 1.7, jp: 2, jpCh: '3', diameterMm: 13.26, circumferenceMm: 41.7 },
  { us: '2 ½', usNumeric: 2.5, uk: 'E', eu: 42.9, it: 2.9, jp: 3, jpCh: '3.5', diameterMm: 13.67, circumferenceMm: 42.9 },
  { us: '3', usNumeric: 3.0, uk: 'F', eu: 44.2, it: 4.2, jp: 4, jpCh: '4', diameterMm: 14.07, circumferenceMm: 44.2 },
  { us: '3 ½', usNumeric: 3.5, uk: 'G', eu: 45.5, it: 5.5, jp: 5, jpCh: '5.5', diameterMm: 14.48, circumferenceMm: 45.5 },
  { us: '4', usNumeric: 4.0, uk: 'H', eu: 46.8, it: 6.8, jp: 7, jpCh: '7', diameterMm: 14.88, circumferenceMm: 46.8 },
  { us: '4 ½', usNumeric: 4.5, uk: 'I', eu: 48.0, it: 8.0, jp: 8, jpCh: '8', diameterMm: 15.29, circumferenceMm: 48.0 },
  { us: '5', usNumeric: 5.0, uk: 'J ½', eu: 49.3, it: 9.3, jp: 9, jpCh: '9', diameterMm: 15.70, circumferenceMm: 49.3 },
  { us: '5 ½', usNumeric: 5.5, uk: 'K ½', eu: 50.6, it: 10.6, jp: 10, jpCh: '10', diameterMm: 16.10, circumferenceMm: 50.6 },
  { us: '6', usNumeric: 6.0, uk: 'L ½', eu: 51.9, it: 11.9, jp: 11, jpCh: '11.5', diameterMm: 16.51, circumferenceMm: 51.9 },
  { us: '6 ½', usNumeric: 6.5, uk: 'M ½', eu: 53.1, it: 13.1, jp: 13, jpCh: '13', diameterMm: 16.92, circumferenceMm: 53.1 },
  { us: '7', usNumeric: 7.0, uk: 'N ½', eu: 54.4, it: 14.4, jp: 14, jpCh: '14', diameterMm: 17.32, circumferenceMm: 54.4 },
  { us: '7 ½', usNumeric: 7.5, uk: 'O ½', eu: 55.7, it: 15.7, jp: 15, jpCh: '15.5', diameterMm: 17.73, circumferenceMm: 55.7 },
  { us: '8', usNumeric: 8.0, uk: 'P ½', eu: 57.0, it: 17.0, jp: 16, jpCh: '16.5', diameterMm: 18.14, circumferenceMm: 57.0 },
  { us: '8 ½', usNumeric: 8.5, uk: 'Q ½', eu: 58.3, it: 18.3, jp: 17, jpCh: '17.5', diameterMm: 18.54, circumferenceMm: 58.3 },
  { us: '9', usNumeric: 9.0, uk: 'R ½', eu: 59.5, it: 19.5, jp: 18, jpCh: '19', diameterMm: 18.95, circumferenceMm: 59.5 },
  { us: '9 ½', usNumeric: 9.5, uk: 'S ½', eu: 60.8, it: 20.8, jp: 20, jpCh: '20', diameterMm: 19.35, circumferenceMm: 60.8 },
  { us: '10', usNumeric: 10.0, uk: 'T ½', eu: 62.1, it: 22.1, jp: 21, jpCh: '21.5', diameterMm: 19.76, circumferenceMm: 62.1 },
  { us: '10 ½', usNumeric: 10.5, uk: 'U ½', eu: 63.4, it: 23.4, jp: 22, jpCh: '22.5', diameterMm: 20.17, circumferenceMm: 63.4 },
  { us: '11', usNumeric: 11.0, uk: 'V ½', eu: 64.6, it: 24.6, jp: 23, jpCh: '24', diameterMm: 20.57, circumferenceMm: 64.6 },
  { us: '11 ½', usNumeric: 11.5, uk: 'W ½', eu: 65.9, it: 25.9, jp: 24, jpCh: '25', diameterMm: 20.98, circumferenceMm: 65.9 },
  { us: '12', usNumeric: 12.0, uk: 'X ½', eu: 67.2, it: 27.2, jp: 25, jpCh: '26', diameterMm: 21.39, circumferenceMm: 67.2 },
  { us: '12 ½', usNumeric: 12.5, uk: 'Y ½', eu: 68.5, it: 28.5, jp: 26, jpCh: '27.5', diameterMm: 21.79, circumferenceMm: 68.5 },
  { us: '13', usNumeric: 13.0, uk: 'Z ½', eu: 69.7, it: 29.7, jp: 27, jpCh: '28.5', diameterMm: 22.20, circumferenceMm: 69.7 },
  { us: '13 ½', usNumeric: 13.5, uk: 'Z+1', eu: 71.0, it: 31.0, jp: 28, jpCh: '29.5', diameterMm: 22.61, circumferenceMm: 71.0 },
  { us: '14', usNumeric: 14.0, uk: 'Z+2', eu: 72.3, it: 32.3, jp: 29, jpCh: '31', diameterMm: 23.01, circumferenceMm: 72.3 },
  { us: '14 ½', usNumeric: 14.5, uk: 'Z+3', eu: 73.6, it: 33.6, jp: 30, jpCh: '32.5', diameterMm: 23.42, circumferenceMm: 73.6 },
  { us: '15', usNumeric: 15.0, uk: 'Z+4', eu: 74.9, it: 34.9, jp: 31, jpCh: '34', diameterMm: 23.83, circumferenceMm: 74.9 },
  { us: '15 ½', usNumeric: 15.5, uk: 'Z+5', eu: 76.1, it: 36.1, jp: 32, jpCh: '35.5', diameterMm: 24.23, circumferenceMm: 76.1 },
  { us: '16', usNumeric: 16.0, uk: 'Z+6', eu: 77.4, it: 37.4, jp: 33, jpCh: '37', diameterMm: 24.64, circumferenceMm: 77.4 }
];

export const POPULAR_COINS = [
  { name: 'Credit / Bank Card', widthMm: 85.60, heightMm: 53.98, type: 'card' },
  { name: 'US Quarter (25¢)', widthMm: 24.26, heightMm: 24.26, type: 'coin' },
  { name: 'Euro 1€ Coin', widthMm: 23.25, heightMm: 23.25, type: 'coin' },
  { name: 'Euro 2€ Coin', widthMm: 25.75, heightMm: 25.75, type: 'coin' },
  { name: 'UK £1 Coin', widthMm: 23.03, heightMm: 23.03, type: 'coin' },
  { name: 'US Nickel (5¢)', widthMm: 21.21, heightMm: 21.21, type: 'coin' }
];

// Find closest ring size from inside diameter in mm
export function getClosestSizeByDiameter(diameterMm: number): RingSizeEntry {
  let closest = RING_SIZE_DATA[0];
  let minDiff = Math.abs(RING_SIZE_DATA[0].diameterMm - diameterMm);

  for (let i = 1; i < RING_SIZE_DATA.length; i++) {
    const diff = Math.abs(RING_SIZE_DATA[i].diameterMm - diameterMm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = RING_SIZE_DATA[i];
    }
  }
  return closest;
}

// Find closest ring size from inside circumference in mm
export function getClosestSizeByCircumference(circMm: number): RingSizeEntry {
  const diam = circMm / Math.PI;
  return getClosestSizeByDiameter(diam);
}

// Calculate advised size when band is wide (> 5mm) or comfort fit
export function getBandWidthAdjustedSize(baseUs: string, bandWidthMm: number): { adjustedUs: string; note: string } {
  const numeric = parseFloat(baseUs);
  if (isNaN(numeric)) return { adjustedUs: baseUs, note: 'Standard true-to-size fit.' };

  if (bandWidthMm >= 6) {
    const adjusted = (numeric + 0.5).toString();
    return {
      adjustedUs: adjusted,
      note: 'Wide bands (≥6mm) bind tightly on skin; sizing up +½ US size ensures effortless glide over the knuckle.'
    };
  } else if (bandWidthMm >= 4.5) {
    const adjusted = (numeric + 0.25).toString();
    return {
      adjustedUs: adjusted,
      note: 'Medium-wide band (4.5–5.5mm); order ¼ size up if you prefer a relaxed comfort fit.'
    };
  }
  return {
    adjustedUs: baseUs,
    note: 'Delicate band (2–4mm); perfectly true-to-size.'
  };
}

// Curated Italian Jewelry Atelier rings matching the Pinterest pin's exact motifs
export const ATELIER_RINGS: JewelryRing[] = [
  {
    id: 'minimal-luxe-bar',
    name: 'Il Rettangolo Bar Ring',
    subtitle: 'Minimal Luxe Architectural Ring',
    italianRegion: 'Vicenza, Italia',
    description: 'The iconic ring from the Pinterest showcase. Cast in solid Italian gold with an elongated crisp rectangular bar accent, precision beveling, and silky comfort-fit interior.',
    basePrice: 580,
    featuredInPin: true,
    isAdjustable: false,
    defaultWidthMm: 4.5,
    availableWidths: [3.0, 4.5, 6.0, 8.0],
    style: 'bar',
    highlight: 'Featured in Pinterest Showcase'
  },
  {
    id: 'vicenza-cuff-adjustable',
    name: 'Vicenza Flexi-Cuff Ring',
    subtitle: 'Self-Adjusting Contoured Band',
    italianRegion: 'Vicenza, Italia',
    description: 'Engineered with Italian spring-tempered gold alloy for effortless gift giving. Seamlessly self-adjusts between US sizes 5 to 9 without distorting its elegant sculptural curve.',
    basePrice: 420,
    featuredInPin: true,
    isAdjustable: true,
    defaultWidthMm: 3.5,
    availableWidths: [2.5, 3.5, 5.0],
    style: 'adjustable',
    highlight: 'Foolproof Gift Sizing (Fits US 5–9)'
  },
  {
    id: 'florentine-pave-band',
    name: 'Firenze Pavé Eternity',
    subtitle: 'Micro-Set Scalloped Band',
    italianRegion: 'Firenze, Italia',
    description: 'Hand-set VS1 lab-grown diamonds in an unbroken loop of brilliance. Ultra-low profile prongs engineered in Florence for everyday velvet comfort.',
    basePrice: 890,
    featuredInPin: false,
    isAdjustable: false,
    defaultWidthMm: 2.2,
    availableWidths: [1.8, 2.2, 3.2],
    style: 'pave',
    highlight: 'Timeless Everyday Sparkle'
  },
  {
    id: 'milano-knife-edge',
    name: 'Milano Minimalist Band',
    subtitle: 'Sculpted Knife-Edge Wedding Band',
    italianRegion: 'Milano, Italia',
    description: 'Crisp central ridge that catches ambient light at every angle. A masterclass in Milanese industrial minimalism and refined ergonomics.',
    basePrice: 460,
    featuredInPin: false,
    isAdjustable: false,
    defaultWidthMm: 3.0,
    availableWidths: [2.0, 3.0, 4.5],
    style: 'band',
    highlight: 'Sleek Modern Profile'
  },
  {
    id: 'roma-signet-cielo',
    name: 'Roma Monolithic Signet',
    subtitle: 'Brushed Italian Heritage Signet',
    italianRegion: 'Roma, Italia',
    description: 'Heavy solid gold weighting with flat satin top face ready for bespoke monograms or left clean for a pure modern sculpture statement.',
    basePrice: 720,
    featuredInPin: false,
    isAdjustable: false,
    defaultWidthMm: 7.0,
    availableWidths: [5.5, 7.0, 9.0],
    style: 'signet',
    highlight: 'Heirloom Solid Cast'
  }
];

export const METAL_CONFIG: Record<
  MetalType,
  {
    name: string;
    purity: string;
    colorHex: string;
    gradient: string;
    multiplier: number;
    description: string;
  }
> = {
  'yellow-gold': {
    name: '18K Yellow Gold',
    purity: '750/1000 Fine Gold (Rich Italian Warmth)',
    colorHex: '#D4AF37',
    gradient: 'from-[#FBE9B9] via-[#E2B755] to-[#A87E1F]',
    multiplier: 1.0,
    description: 'Classic warm Vicenza luster with 18-karat alloy balance'
  },
  'rose-gold': {
    name: '18K Rose Gold',
    purity: '750/1000 Fine Gold with Italian Copper Hue',
    colorHex: '#E0A899',
    gradient: 'from-[#F8D2C7] via-[#E2A694] to-[#B06B56]',
    multiplier: 1.05,
    description: 'Warm romantic sunset glow with subtle copper depth'
  },
  'white-gold': {
    name: '18K White Gold',
    purity: '750/1000 with Palladium Luster',
    colorHex: '#E5E4E2',
    gradient: 'from-[#FFFFFF] via-[#E2E1DF] to-[#9E9D9B]',
    multiplier: 1.08,
    description: 'Brilliant mirror rhodium sheen crafted for cool elegance'
  },
  'platinum': {
    name: 'Platinum 950',
    purity: '95% Pure Noble Platinum',
    colorHex: '#DFDFDF',
    gradient: 'from-[#FFFFFF] via-[#D5D7DA] to-[#8C8F96]',
    multiplier: 1.25,
    description: 'Substantial heirloom weight and indestructible natural white tone'
  }
};
