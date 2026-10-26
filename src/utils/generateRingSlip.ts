import { RingSizeEntry } from '../types/ring';
import { getRingSizeFunFact } from '../data/ringFunFacts';
import { RING_SIZE_DATA } from '../data/ringSizes';

export interface RingSlipData {
  entry: RingSizeEntry;
  measuredDiameterMm: number;
  measuredCircumferenceMm: number;
  dateStr: string;
  isCalibrated: boolean;
  primaryStandard?: 'US' | 'UK';
  funFact?: string;
}

/**
 * Generates an all-inclusive white bill / receipt slip for the measured ring.
 * Features classic receipt typography, all international size standards (US, UK, EU, IT, JP, DIN),
 * visual badges card, technical ring diagram, international size conversion table,
 * size fun facts, barcode, and jeweler crafting specifications.
 */
export function generateRingSlipImage(data: RingSlipData): Promise<string> {
  return new Promise((resolve) => {
    const {
      entry,
      measuredDiameterMm,
      measuredCircumferenceMm,
      dateStr,
      primaryStandard = 'US',
      funFact
    } = data;
    const isUkPrimary = primaryStandard === 'UK';

    // High resolution canvas for sharp receipt printing & display (width: 600, height: 1400)
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Pure White Background like a paper bill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 1400);

    // Subtle crisp border around the bill paper
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 580, 1380);

    // Helper: Draw classic dashed receipt divider line
    const drawDashedLine = (y: number) => {
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(570, y);
      ctx.stroke();
      ctx.restore();
    };

    // Helper: Draw double solid line for receipt totals
    const drawDoubleLine = (y: number) => {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(570, y);
      ctx.moveTo(30, y + 4);
      ctx.lineTo(570, y + 4);
      ctx.stroke();
      ctx.restore();
    };

    // 2. Receipt Header (Centered, bold store name)
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Courier New", Courier, monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('AURA ORO JEWELERS', 300, 52);

    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.letterSpacing = '1px';
    ctx.fillText('RING SIZING & MEASUREMENT STUDIO', 300, 74);
    ctx.fillText('1:1 SCALE PHYSICAL ACCURACY · ISO 8653', 300, 92);

    // Bill title
    ctx.font = 'bold 15px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('*** OFFICIAL ALL-SIZE MEASUREMENT SLIP ***', 300, 120);

    drawDashedLine(136);

    // 3. Bill Metadata (Receipt number, Date, Calibrated status)
    const billNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#1e293b';

    ctx.textAlign = 'left';
    ctx.fillText(`BILL NO:  ${billNumber}`, 36, 160);
    ctx.fillText(`DATE:     ${dateStr}`, 36, 178);

    ctx.textAlign = 'right';
    ctx.fillText('STATUS: UNIVERSAL 1:1 SCALE', 564, 160);
    ctx.fillText('TYPE:   PRECISION CALIPER', 564, 178);

    drawDashedLine(194);

    // 4. Itemized All Size Specifications Header
    ctx.font = 'bold 12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('ALL SIZE STANDARDS & SPECS', 36, 214);
    ctx.textAlign = 'right';
    ctx.fillText('CONFIRMED VALUE', 564, 214);

    drawDashedLine(224);

    // 5. Line Items covering ALL sizing standards
    const items = [
      { label: 'Primary Confirmed Size', val: isUkPrimary ? `UK Size ${entry.uk} (US ${entry.us})` : `US Size ${entry.us} (UK ${entry.uk})`, bold: true },
      { label: 'Inside Diameter (Ø)', val: `${measuredDiameterMm.toFixed(2)} mm  (${(measuredDiameterMm / 25.4).toFixed(3)}″)`, bold: true },
      { label: 'Inside Circumference', val: `${measuredCircumferenceMm.toFixed(2)} mm  (${(measuredCircumferenceMm / 25.4).toFixed(3)}″)`, bold: false },
      { label: 'USA & Canada Standard (US)', val: `US ${entry.us}`, bold: false },
      { label: 'UK, Australia & NZ (AU/GB)', val: `UK ${entry.uk}`, bold: false },
      { label: 'Europe / ISO 8653 (EU)', val: `EU ${entry.eu} mm`, bold: false },
      { label: 'Italy & Spain (IT / ES)', val: `IT ${entry.it}`, bold: false },
      { label: 'Japan & China (JP / CH)', val: `JP ${entry.jpCh || entry.jp}`, bold: false },
      { label: 'Germany Standard (DIN)', val: `Ø ${entry.diameterMm} mm`, bold: false },
      { label: 'Tolerance Standard', val: '±0.05 mm (Grade A)', bold: false }
    ];

    let currentY = 246;
    items.forEach((item) => {
      ctx.textAlign = 'left';
      ctx.font = item.bold ? 'bold 12px "Courier New", Courier, monospace' : '11px "Courier New", Courier, monospace';
      ctx.fillStyle = item.bold ? '#0f172a' : '#334155';
      ctx.fillText(item.label, 36, currentY);

      ctx.textAlign = 'right';
      ctx.font = item.bold ? 'bold 12px "Courier New", Courier, monospace' : '11px "Courier New", Courier, monospace';
      ctx.fillText(item.val, 564, currentY);

      currentY += 21;
    });

    drawDashedLine(currentY);
    currentY += 16;

    // 5B. VISUAL ALL-STANDARDS BADGES GRID CARD (Matches Live App)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(36, currentY, 528, 88, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 10px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText('--- ALL INTERNATIONAL MEASUREMENT STANDARDS ---', 300, currentY + 16);

    // 8 Badges in 2 rows of 4 columns
    const colWidth = 528 / 4;
    const badgesRow1 = [
      { std: 'USA / CA', val: `US ${entry.us}` },
      { std: 'UK / AU', val: `UK ${entry.uk}` },
      { std: 'EU / ISO', val: `${entry.eu}` },
      { std: 'IT / ES', val: `${entry.it}` }
    ];
    const badgesRow2 = [
      { std: 'JP / CH', val: `${entry.jpCh || entry.jp}` },
      { std: 'GERMAN', val: `Ø${entry.diameterMm}` },
      { std: 'INSIDE Ø', val: `${measuredDiameterMm.toFixed(2)}mm` },
      { std: 'CIRCUMF', val: `${measuredCircumferenceMm.toFixed(1)}mm` }
    ];

    badgesRow1.forEach((b, idx) => {
      const bx = 36 + idx * colWidth + colWidth / 2;
      ctx.font = '9px "Courier New", Courier, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(b.std, bx, currentY + 34);
      ctx.font = 'bold 13px "Courier New", Courier, monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(b.val, bx, currentY + 49);
    });

    badgesRow2.forEach((b, idx) => {
      const bx = 36 + idx * colWidth + colWidth / 2;
      ctx.font = '9px "Courier New", Courier, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(b.std, bx, currentY + 67);
      ctx.font = 'bold 12px "Courier New", Courier, monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(b.val, bx, currentY + 80);
    });

    currentY += 102;
    drawDashedLine(currentY);
    currentY += 18;

    // 6. Clean Minimal Ring Technical Drawing Box
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(36, currentY, 528, 140, 6);
    ctx.fill();
    ctx.stroke();

    const ringCenterX = 135;
    const ringCenterY = currentY + 70;
    const drawRadius = 46;

    // Center Crosshairs
    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(ringCenterX - drawRadius - 18, ringCenterY);
    ctx.lineTo(ringCenterX + drawRadius + 18, ringCenterY);
    ctx.moveTo(ringCenterX, ringCenterY - drawRadius - 18);
    ctx.lineTo(ringCenterX, ringCenterY + drawRadius + 18);
    ctx.stroke();
    ctx.restore();

    // The Ring Outer & Inner Circle
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, drawRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, drawRadius - 5, 0, Math.PI * 2);
    ctx.stroke();

    // Center point
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Diameter Dimension Arrow inside diagram
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ringCenterX - drawRadius + 5, ringCenterY);
    ctx.lineTo(ringCenterX + drawRadius - 5, ringCenterY);
    ctx.stroke();

    // Dimension Arrowheads
    const drawArrowhead = (x: number, y: number, dir: -1 | 1) => {
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dir * 5, y - 3.5);
      ctx.lineTo(x + dir * 5, y + 3.5);
      ctx.closePath();
      ctx.fill();
    };
    drawArrowhead(ringCenterX - drawRadius + 5, ringCenterY, 1);
    drawArrowhead(ringCenterX + drawRadius - 5, ringCenterY, -1);

    // Dimension Label on right of diagram
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px "Courier New", Courier, monospace';
    ctx.fillText(`MEASURED RING Ø: ${measuredDiameterMm.toFixed(2)} mm`, 245, currentY + 44);

    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Inside Radius:    ${(measuredDiameterMm / 2).toFixed(2)} mm`, 245, currentY + 66);
    ctx.fillText(`Circumference:    ${measuredCircumferenceMm.toFixed(2)} mm`, 245, currentY + 86);
    ctx.fillText(`All Sizes: US ${entry.us} | UK ${entry.uk} | EU ${entry.eu}`, 245, currentY + 106);

    currentY += 152;

    // 7. TOTAL / HIGHLIGHT SECTION (Classic Receipt Bold Block)
    drawDoubleLine(currentY);
    currentY += 20;

    ctx.font = 'bold 15px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('CONFIRMED PRIMARY SIZE:', 36, currentY);
    ctx.textAlign = 'right';
    ctx.font = 'bold 21px "Courier New", Courier, monospace';
    ctx.fillText(isUkPrimary ? `UK ${entry.uk} (US ${entry.us})` : `US ${entry.us} (UK ${entry.uk})`, 564, currentY);

    currentY += 24;
    ctx.font = 'bold 13px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CONFIRMED DIAMETER (Ø):', 36, currentY);
    ctx.textAlign = 'right';
    ctx.fillText(`${measuredDiameterMm.toFixed(2)} MM  (${(measuredDiameterMm / 25.4).toFixed(3)}″)`, 564, currentY);

    currentY += 16;
    drawDoubleLine(currentY);
    currentY += 18;

    // 7B. COMPLETE INTERNATIONAL REFERENCE CONVERSION MATRIX (Surrounding Sizes)
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Courier New", Courier, monospace';
    ctx.fillText('★ INTERNATIONAL SIZE CONVERSION MATRIX ★', 300, currentY);
    currentY += 16;

    // Table Header
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('US      UK      EU      IT      JP      DIAMETER     CIRCUMF', 36, currentY);
    currentY += 10;
    drawDashedLine(currentY);
    currentY += 14;

    // Find surrounding entries to print accurate reference table on slip
    const entryIndex = RING_SIZE_DATA.findIndex((r) => r.us === entry.us);
    const centerIdx = entryIndex >= 0 ? entryIndex : 14;
    const startIdx = Math.max(0, Math.min(RING_SIZE_DATA.length - 5, centerIdx - 2));
    const referenceWindow = RING_SIZE_DATA.slice(startIdx, startIdx + 5);

    referenceWindow.forEach((row) => {
      const isSelected = row.us === entry.us;
      const isWideBand = row.usNumeric === entry.usNumeric + 0.5;

      ctx.textAlign = 'left';
      if (isSelected) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px "Courier New", Courier, monospace';
      } else {
        ctx.fillStyle = '#475569';
        ctx.font = '10px "Courier New", Courier, monospace';
      }

      const colUs = row.us.padEnd(8, ' ');
      const colUk = row.uk.padEnd(8, ' ');
      const colEu = String(row.eu).padEnd(8, ' ');
      const colIt = String(row.it).padEnd(8, ' ');
      const colJp = String(row.jpCh || row.jp).padEnd(8, ' ');
      const colDiam = `${row.diameterMm.toFixed(2)}mm`.padEnd(13, ' ');
      const colCirc = `${row.circumferenceMm}mm`;

      const rowText = `${colUs}${colUk}${colEu}${colIt}${colJp}${colDiam}${colCirc}`;
      const suffix = isSelected ? '  ◄ YOUR FIT' : isWideBand ? '  (+½ Wide)' : '';

      ctx.fillText(rowText + suffix, 36, currentY);
      currentY += 16;
    });

    currentY += 6;
    drawDashedLine(currentY);
    currentY += 18;

    // 8. Size Trivia & Fun Fact Box (Special Highlight on Bill Slip)
    const rawFact = funFact || getRingSizeFunFact(entry.us, entry.uk);

    // Word wrap helper for canvas receipt typography
    const wrapLines = (text: string, maxW: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let cur = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const w = words[i];
        if (ctx.measureText(cur + ' ' + w).width < maxW) {
          cur += ' ' + w;
        } else {
          lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    ctx.font = '11px "Courier New", Courier, monospace';
    const factLines = wrapLines(rawFact, 500);
    const boxHeight = 34 + factLines.length * 16;

    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(36, currentY, 528, boxHeight, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText(`★ DID YOU KNOW? (SIZE ${isUkPrimary ? `UK ${entry.uk}` : `US ${entry.us}`} FUN FACT) ★`, 48, currentY + 18);

    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillStyle = '#334155';
    let lineY = currentY + 34;
    factLines.forEach((line) => {
      ctx.fillText(line, 48, lineY);
      lineY += 16;
    });

    currentY += boxHeight + 16;
    drawDashedLine(currentY);
    currentY += 18;

    // 9. Notes & Jeweler Advice (Monospace Receipt Style)
    ctx.font = '10px "Courier New", Courier, monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('* For wide rings (>6mm), consider ordering 1/2 size up.', 36, currentY);
    currentY += 14;
    ctx.fillText('* Temperature: Fingers swell in heat and shrink when cold.', 36, currentY);
    currentY += 14;
    ctx.fillText('* Present this slip to any fine jeweler for custom crafting.', 36, currentY);

    currentY += 20;
    drawDashedLine(currentY);
    currentY += 18;

    // 10. Authentic Receipt Barcode (Clean black lines on white paper)
    ctx.fillStyle = '#0f172a';
    const barcodeStartX = 110;
    const barcodeWidth = 380;
    const barcodeHeight = 38;

    // Deterministic striped pattern based on bill data
    ctx.save();
    for (let x = barcodeStartX; x < barcodeStartX + barcodeWidth; x += 4) {
      const bit = Math.sin((x + measuredDiameterMm) * 9.8) > -0.25;
      if (bit) {
        ctx.fillRect(x, currentY, (x % 7 === 0 ? 3.2 : 1.6), barcodeHeight);
      }
    }
    ctx.restore();

    currentY += barcodeHeight + 14;

    // Barcode number text
    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(`* ${billNumber} · Ø${Math.round(measuredDiameterMm * 100)} · US${entry.us} *`, 300, currentY);

    currentY += 22;

    // 10. Receipt Footer Message
    ctx.font = 'bold 11px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.letterSpacing = '1px';
    ctx.fillText('THANK YOU FOR MEASURING WITH US', 300, currentY);

    // Export to crisp PNG data URL
    const pngDataUrl = canvas.toDataURL('image/png', 1.0);
    resolve(pngDataUrl);
  });
}

/**
 * Helper to trigger automatic file download in the browser
 */
export function downloadPngFile(dataUrl: string, fileName: string) {
  // Strip any illegal characters or path traversal markers
  const sanitizedFileName = fileName.replace(/[/\\?%*:|"<>]/g, '_');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = sanitizedFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
