// HSB to RGB conversion
export function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  s /= 100;
  b /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1)),
  };
}

// RGB to Hex conversion
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

// HSB to Hex wrapper
export function hsbToHex(h: number, s: number, b: number): string {
  const { r, g, b: blue } = hsbToRgb(h, s, b);
  return rgbToHex(r, g, blue);
}

// Calculate relative luminance
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Hex to RGB helper
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Get WCAG Rating
export function getWcagRating(ratio: number, fontSize: 'normal' | 'large' = 'normal'): 'AAA' | 'AA' | 'Fail' {
  if (fontSize === 'normal') {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  } else {
    // Large text (18pt+ or 14pt+ bold)
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
}

/**
 * Get color name from Hue based on the palette size (8, 12, 24)
 * to provide a clear, hierarchical naming system.
 */
export function getHueName(h: number, count?: number): string {
  h = Math.round(h) % 360;
  if (h < 0) h += 360;

  // 1. Minimum Palette (8 Hues) - Uses most basic core names
  if (count === 8) {
    const names = ["Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Pink"];
    const index = Math.floor(((h + 22.5) % 360) / 45);
    return names[index];
  }

  // 2. Standard Palette (12 Hues) - Classic color wheel naming
  if (count === 12) {
    const names = [
      "Red", "Orange", "Yellow", "Lime", "Green", "Teal", 
      "Cyan", "Blue", "Indigo", "Violet", "Pink", "Rose"
    ];
    const index = Math.floor(((h + 15) % 360) / 30);
    return names[index];
  }

  // 3. Detailed Palette (24 Hues) or Manual Adjustments - Maximum precision
  const names = [
    "Red", "Red-Orange", "Orange", "Amber", "Yellow", "Lime", 
    "Chartreuse", "Green", "Emerald", "Teal", "Cyan", "Sky", 
    "Light Blue", "Blue", "Royal Blue", "Indigo", "Violet", "Purple", 
    "Fuchsia", "Magenta", "Pink", "Rose", "Crimson", "Ruby"
  ];
  
  // Each slice is 15 degrees. Offset by 7.5 so Red center is 0
  const index = Math.floor(((h + 7.5) % 360) / 15);
  return names[index];
}

// Find the brightness threshold for a given contrast ratio
// targetRatio: e.g. 4.5 or 7
// textColor: 'black' or 'white'
// h, s: current hue and saturation
// direction: 'min' (for light bg) or 'max' (for dark bg)
export function getBrightnessThreshold(
  h: number, 
  s: number, 
  targetRatio: number, 
  textColor: 'black' | 'white'
): number {
  // Binary search for B (0-100)
  let low = 0;
  let high = 100;
  let result = textColor === 'black' ? 100 : 0;

  const textHex = textColor === 'black' ? '#000000' : '#FFFFFF';

  // We want to find the boundary B where contrast >= targetRatio
  // If text is black, we need lighter background -> find min B
  // If text is white, we need darker background -> find max B

  for (let i = 0; i < 10; i++) { // 10 iterations is enough for integer precision
    const mid = (low + high) / 2;
    const hex = hsbToHex(h, s, mid);
    const ratio = getContrastRatio(hex, textHex);

    if (textColor === 'black') {
      // We need high brightness.
      // If ratio >= target, this B is valid (light enough). Try lower to find boundary.
      // If ratio < target, this B is invalid (too dark). Go higher.
      if (ratio >= targetRatio) {
        result = mid;
        high = mid;
      } else {
        low = mid;
      }
    } else {
      // We need low brightness.
      // If ratio >= target, this B is valid (dark enough). Try higher to find boundary.
      // If ratio < target, this B is invalid (too light). Go lower.
      if (ratio >= targetRatio) {
        result = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
  }
  return Math.round(result);
}
