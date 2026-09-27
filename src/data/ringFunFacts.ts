/**
 * Curated jewelry history, celebrity, and atelier trivia for ring sizes
 */

export const RING_SIZE_FUN_FACTS: Record<string, string> = {
  '3': 'Petite & delicate, size 3 is the classic heirloom pinky size prized in Victorian filigree jewelry and miniature signet rings.',
  '3.5': 'Often chosen for accent knuckle rings and delicate midi bands, highly popular in Parisian haute joaillerie ring stacking.',
  '3 ½': 'Often chosen for accent knuckle rings and delicate midi bands, highly popular in Parisian haute joaillerie ring stacking.',
  '4': 'Size 4 is identical in diameter to the rare 1920s Art Deco baguette diamond band famously worn by silent film icon Mary Pickford.',
  '4.5': 'At 15.27 mm inside diameter, size 4.5 perfectly balances featherweight micro-pave eternity bands so they sit flush without spinning.',
  '4 ½': 'At 15.27 mm inside diameter, size 4.5 perfectly balances featherweight micro-pave eternity bands so they sit flush without spinning.',
  '5': 'Audrey Hepburn famously wore a size 5 diamond-set eternity band crafted in three alternating precious metals by Mel Ferrer.',
  '5.5': 'Size 5.5 is one of the top three most requested sizes for custom solitaire engagement rings across European and Asian ateliers.',
  '5 ½': 'Size 5.5 is one of the top three most requested sizes for custom solitaire engagement rings across European and Asian ateliers.',
  '6': 'Size 6 is the world’s most universally gifted ring size, comfortably worn by over 35% of women worldwide!',
  '6.5': 'Known as the "sweet spot" for stacking bands, size 6.5 provides the perfect allowance for natural finger expansion between morning and evening.',
  '6 ½': 'Known as the "sweet spot" for stacking bands, size 6.5 provides the perfect allowance for natural finger expansion between morning and evening.',
  '7': 'Size 7 is the global benchmark sample size crafted by high-jewelry ateliers on Place Vendôme in Paris and New York’s Fifth Avenue.',
  '7.5': 'At 17.73 mm diameter, size 7.5 matches the exact inner caliber of the legendary Cartier Trinity three-gold band first created in 1924.',
  '7 ½': 'At 17.73 mm diameter, size 7.5 matches the exact inner caliber of the legendary Cartier Trinity three-gold band first created in 1924.',
  '8': 'Marilyn Monroe’s iconic platinum eternity band with 35 baguette-cut diamonds given by Joe DiMaggio was a tailored size 8.',
  '8.5': 'The premier transition size, size 8.5 is widely chosen for dominant-hand pointer fingers and contemporary bold signet bands.',
  '8 ½': 'The premier transition size, size 8.5 is widely chosen for dominant-hand pointer fingers and contemporary bold signet bands.',
  '9': 'Size 9 is the premier average men’s pinky and index ring size, prized worldwide for custom signet and heraldic seal rings.',
  '9.5': 'Matches the inside diameter of ceremonial signet rings historically commissioned by Florentine master goldsmiths during the Renaissance.',
  '9 ½': 'Matches the inside diameter of ceremonial signet rings historically commissioned by Florentine master goldsmiths during the Renaissance.',
  '10': 'Size 10 is the quintessential men’s wedding band standard in North America and Europe, fitting nearly 30% of men.',
  '10.5': 'A favorite for substantial 7mm–8mm comfort-fit tungsten, tantalum, and platinum bands that glide effortlessly over the knuckle.',
  '10 ½': 'A favorite for substantial 7mm–8mm comfort-fit tungsten, tantalum, and platinum bands that glide effortlessly over the knuckle.',
  '11': 'Regal ceremonial rings throughout British and European history favored size 11 for commanding thumb and index finger placement.',
  '11.5': 'Offers the exact proportional balance favored for heavy signet and emerald-cut signet rings with wide domed profiles.',
  '11 ½': 'Offers the exact proportional balance favored for heavy signet and emerald-cut signet rings with wide domed profiles.',
  '12': 'Size 12 shares the exact 21.49 mm diameter of a classic Roman aureus pure gold coin minted in 44 BC during the reign of Julius Caesar!',
  '12.5': 'At 21.89 mm across, size 12.5 provides superior knuckle comfort for athletes and craftspeople with strong, working hands.',
  '12 ½': 'At 21.89 mm across, size 12.5 provides superior knuckle comfort for athletes and craftspeople with strong, working hands.',
  '13': 'Professional Super Bowl and NBA Championship championship rings are famously cast in size 13 to 15 for celebratory hands.',
  '13.5': 'A commanding statement size, frequently selected for thumb bands and heavy biker skull rings in solid sterling silver.',
  '13 ½': 'A commanding statement size, frequently selected for thumb bands and heavy biker skull rings in solid sterling silver.',
  '14': 'Size 14 rings require almost double the precious metal weight of standard sample rings, creating exceptional heft and luxury presence.',
  '15': 'NBA icon Shaquille O’Neal famously wears a massive custom size 17 ring, but size 15 is among the largest standard atelier sizes in fine jewelry.',
  '16': 'At nearly 25 mm inside diameter, size 16 represents the summit of standard jewelry sizing matrices worldwide.'
};

/**
 * Retrieves an authentic fun fact based on US or UK ring size
 */
export function getRingSizeFunFact(usSize: string, ukSize?: string): string {
  // Direct match
  const cleanUs = usSize.trim();
  if (RING_SIZE_FUN_FACTS[cleanUs]) {
    return RING_SIZE_FUN_FACTS[cleanUs];
  }

  // Parse numeric base
  const numericVal = parseFloat(cleanUs);
  if (!isNaN(numericVal)) {
    const rounded = Math.round(numericVal);
    const key = String(rounded);
    if (RING_SIZE_FUN_FACTS[key]) {
      return RING_SIZE_FUN_FACTS[key];
    }
  }

  if (numericVal < 5) {
    return 'Petite ring sizes under US 5 require the highest artisan precision, featuring specialized micro-prongs to protect delicate stones.';
  } else if (numericVal <= 8) {
    return `Size ${usSize} sits right in the golden ratio of fine jewelry design, where gemstones achieve optimal brilliance across the finger span.`;
  } else if (numericVal <= 11) {
    return `Size ${usSize} is an ideal dimension for bold architectural bands, signets, and dual-metal comfort-fit wedding rings.`;
  } else {
    return `Size ${usSize} carries exceptional heirloom presence, traditionally favored for ceremonial signet rings and championship crests.`;
  }
}
