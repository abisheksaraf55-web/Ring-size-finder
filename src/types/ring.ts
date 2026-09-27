export interface RingSizeEntry {
  us: string;
  usNumeric: number;
  uk: string; // AU/GB
  eu: number; // Circumference in mm (EU/ISO)
  it: number; // Italian standard
  jp: number; // Japanese standard
  jpCh?: string; // JP/CH representation
  diameterMm: number;
  circumferenceMm: number;
}

export type MetalType = 'yellow-gold' | 'rose-gold' | 'white-gold' | 'platinum';

export interface JewelryRing {
  id: string;
  name: string;
  subtitle: string;
  italianRegion: string;
  description: string;
  basePrice: number;
  featuredInPin?: boolean;
  isAdjustable?: boolean;
  defaultWidthMm: number;
  availableWidths: number[];
  style: 'bar' | 'adjustable' | 'signet' | 'band' | 'pave';
  highlight: string;
}

export interface CalibrationData {
  pixelsPerMm: number;
  method: 'card' | 'coin' | 'default';
  cardWidthPx: number;
  coinName?: string;
}

export interface UserMeasurement {
  diameterMm: number;
  circumferenceMm: number;
  usSize: string;
  ukSize: string;
  euSize: number;
  itSize: number;
  jpSize: number;
  measuredDate?: string;
  bandWidthAdjusted?: string;
}
