import { hsbToHex, getContrastRatio } from '../src/utils/color';

const scales = [
  { name: 'YELLOW', h: 45, s: 81 },
  { name: 'LIME', h: 85, s: 97 },
  { name: 'GREEN', h: 140, s: 76 },
  { name: 'TEAL', h: 170, s: 80 },
  { name: 'CYAN', h: 190, s: 76 },
  { name: 'LIGHT_BLUE', h: 200, s: 90 },
  { name: 'BLUE', h: 220, s: 80 },
  { name: 'INDIGO', h: 250, s: 63 },
  { name: 'VIOLET', h: 270, s: 65 },
  { name: 'PINK', h: 330, s: 64 },
  { name: 'CRIMSON', h: 345, s: 65 },
  { name: 'RED', h: 0, s: 64 },
  { name: 'ORANGE', h: 25, s: 97 },
  { name: 'GRAY', h: 0, s: 0 },
  { name: 'ACCENT_GRAY', h: 210, s: 20 },
];

for (const scale of scales) {
  let bestB = 0;
  let bestDiff = 100;
  for (let b = 0; b <= 100; b++) {
    const hex = hsbToHex(scale.h, scale.s, b);
    const crBlack = getContrastRatio(hex, '#000000');
    const crWhite = getContrastRatio(hex, '#FFFFFF');
    
    // We want both to be >= 4.5, or as close to equal as possible
    const diff = Math.abs(crBlack - crWhite);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestB = b;
    }
  }
  
  const hex = hsbToHex(scale.h, scale.s, bestB);
  const crBlack = getContrastRatio(hex, '#000000');
  const crWhite = getContrastRatio(hex, '#FFFFFF');
  console.log(`${scale.name}: B=${bestB}, CR Black=${crBlack.toFixed(2)}, CR White=${crWhite.toFixed(2)}`);
}
