import { RingSizeEntry } from '../types/ring';
import { getRingSizeFunFact } from '../data/ringFunFacts';

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
 * Generates a clean, simple white bill / receipt slip for the measured ring.
 * Features classic receipt typography, itemized specifications, clean line art ring diagram,
 * size fun facts, barcode, and clear diameter and size details.
 */
export function generateRingSlipImage(data: RingSlipData): Promise<string> {
  return new Promise((resolve) => {
    const {
      entry,
      measuredDiameterMm,
      measuredCircumferenceMm,
      dateStr,
      isCalibrated,
      primaryStandard = 'US',
      funFact
    } = data;
    const isUkPrimary = primaryStandard === 'UK';

    // High resolution canvas for sharp receipt printing & display (width: 600, height: 1040)
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1040;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Pure White Background like a paper bill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 1040);

    // Subtle crisp border around the bill paper
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 580, 1020);

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
    ctx.fillText('AURA ORO JEWELERS', 300, 55);

    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.letterSpacing = '1px';
    ctx.fillText('RING SIZING & MEASUREMENT STUDIO', 300, 78);
    ctx.fillText('1:1 SCALE PHYSICAL ACCURACY', 300, 96);

    // Bill title
    ctx.font = 'bold 15px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('*** MEASUREMENT BILL / SLIP ***', 300, 126);

    drawDashedLine(142);

    // 3. Bill Metadata (Receipt number, Date, Calibrated status)
    const billNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#1e293b';

    ctx.textAlign = 'left';
    ctx.fillText(`BILL NO:  ${billNumber}`, 36, 168);
    ctx.fillText(`DATE:     ${dateStr}`, 36, 188);

    ctx.textAlign = 'right';
    ctx.fillText('STATUS: UNIVERSAL 1:1 SCALE', 564, 168);
    ctx.fillText('TYPE:   DIGITAL GAUGE', 564, 188);

    drawDashedLine(205);

    // 4. Itemized Bill Table Header
    ctx.font = 'bold 12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText('DESCRIPTION', 36, 226);
    ctx.textAlign = 'right';
    ctx.fillText('VALUE', 564, 226);

    drawDashedLine(238);

    // 5. Line Items with dot leaders or receipt alignment
    const items = isUkPrimary ? [
      { label: 'Primary Ring Size (UK)', val: `Size ${entry.uk} (US ${entry.us})`, bold: true },
      { label: 'Inside Diameter (Ø)', val: `${measuredDiameterMm.toFixed(2)} mm  (${(measuredDiameterMm / 25.4).toFixed(3)}″)`, bold: true },
      { label: 'Inside Circumference', val: `${measuredCircumferenceMm.toFixed(2)} mm  (${(measuredCircumferenceMm / 25.4).toFixed(3)}″)`, bold: false },
      { label: 'USA & Canada Standard', val: `US ${entry.us}`, bold: false },
      { label: 'Europe (EU / ISO)', val: `${entry.eu}`, bold: false },
      { label: 'Italy & Spain (IT/ES)', val: `${entry.it}`, bold: false },
      { label: 'Japan & China (JP/CH)', val: `${entry.jpCh || entry.jp}`, bold: false },
      { label: 'Tolerance Standard', val: '±0.05 mm', bold: false }
    ] : [
      { label: 'Primary Ring Size', val: `US ${entry.us}`, bold: true },
      { label: 'Inside Diameter (Ø)', val: `${measuredDiameterMm.toFixed(2)} mm  (${(measuredDiameterMm / 25.4).toFixed(3)}″)`, bold: true },
      { label: 'Inside Circumference', val: `${measuredCircumferenceMm.toFixed(2)} mm  (${(measuredCircumferenceMm / 25.4).toFixed(3)}″)`, bold: false },
      { label: 'UK & Australia (GB)', val: `${entry.uk}`, bold: false },
      { label: 'Europe (EU / ISO)', val: `${entry.eu}`, bold: false },
      { label: 'Italy & Spain (IT/ES)', val: `${entry.it}`, bold: false },
      { label: 'Japan & China (JP/CH)', val: `${entry.jpCh || entry.jp}`, bold: false },
      { label: 'Tolerance Standard', val: '±0.05 mm', bold: false }
    ];

    let currentY = 264;
    items.forEach((item) => {
      ctx.textAlign = 'left';
      ctx.font = item.bold ? 'bold 13px "Courier New", Courier, monospace' : '12px "Courier New", Courier, monospace';
      ctx.fillStyle = item.bold ? '#0f172a' : '#334155';
      ctx.fillText(item.label, 36, currentY);

      ctx.textAlign = 'right';
      ctx.font = item.bold ? 'bold 13px "Courier New", Courier, monospace' : '12px "Courier New", Courier, monospace';
      ctx.fillText(item.val, 564, currentY);

      currentY += 26;
    });

    drawDashedLine(currentY);
    currentY += 24;

    // 6. Clean Minimal Ring Technical Drawing Box (White Bill Style)
    // Box for the ring diagram
    ctx.fillStyle = '#fafafa';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(36, currentY, 528, 160, 6);
    ctx.fill();
    ctx.stroke();

    const ringCenterX = 150;
    const ringCenterY = currentY + 80;
    const drawRadius = 52;

    // Center Crosshairs
    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(ringCenterX - drawRadius - 20, ringCenterY);
    ctx.lineTo(ringCenterX + drawRadius + 20, ringCenterY);
    ctx.moveTo(ringCenterX, ringCenterY - drawRadius - 20);
    ctx.lineTo(ringCenterX, ringCenterY + drawRadius + 20);
    ctx.stroke();
    ctx.restore();

    // The Ring Outer & Inner Circle (Clean line art)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, drawRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, drawRadius - 6, 0, Math.PI * 2);
    ctx.stroke();

    // Center point
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Diameter Dimension Arrow inside diagram
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ringCenterX - drawRadius + 6, ringCenterY);
    ctx.lineTo(ringCenterX + drawRadius - 6, ringCenterY);
    ctx.stroke();

    // Dimension Arrowheads
    const drawArrowhead = (x: number, y: number, dir: -1 | 1) => {
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dir * 6, y - 4);
      ctx.lineTo(x + dir * 6, y + 4);
      ctx.closePath();
      ctx.fill();
    };
    drawArrowhead(ringCenterX - drawRadius + 6, ringCenterY, 1);
    drawArrowhead(ringCenterX + drawRadius - 6, ringCenterY, -1);

    // Dimension Label on right of diagram
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px "Courier New", Courier, monospace';
    ctx.fillText(`MEASURED RING Ø: ${measuredDiameterMm.toFixed(2)} mm`, 270, currentY + 52);

    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Inside Radius:    ${(measuredDiameterMm / 2).toFixed(2)} mm`, 270, currentY + 76);
    ctx.fillText(`Circumference:    ${measuredCircumferenceMm.toFixed(2)} mm`, 270, currentY + 98);
    ctx.fillText(`International:    US ${entry.us} / UK ${entry.uk} / EU ${entry.eu}`, 270, currentY + 120);

    currentY += 175;

    // 7. TOTAL / HIGHLIGHT SECTION (Classic Receipt Bold Block)
    drawDoubleLine(currentY);
    currentY += 22;

    ctx.font = 'bold 16px "Courier New", Courier, monospace';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText(isUkPrimary ? 'CONFIRMED SIZE (UK):' : 'CONFIRMED SIZE:', 36, currentY);
    ctx.textAlign = 'right';
    ctx.font = 'bold 22px "Courier New", Courier, monospace';
    ctx.fillText(isUkPrimary ? `UK ${entry.uk}` : `US ${entry.us}`, 564, currentY);

    currentY += 26;
    ctx.font = 'bold 14px "Courier New", Courier, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CONFIRMED DIAMETER:', 36, currentY);
    ctx.textAlign = 'right';
    ctx.fillText(`${measuredDiameterMm.toFixed(2)} MM`, 564, currentY);

    if (isUkPrimary) {
      currentY += 20;
      ctx.font = '12px "Courier New", Courier, monospace';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'left';
      ctx.fillText('EQUIVALENT US SIZE:', 36, currentY);
      ctx.textAlign = 'right';
      ctx.fillText(`US ${entry.us}`, 564, currentY);
    }

    currentY += 16;
    drawDoubleLine(currentY);
    currentY += 22;

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
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
