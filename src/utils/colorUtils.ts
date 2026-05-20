// Color Utility functions for conversions, harmonies, and contrast calculations

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): RgbColor {
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Helper for component to hex
function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const clampedR = Math.max(0, Math.min(255, Math.round(r)));
  const clampedG = Math.max(0, Math.min(255, Math.round(g)));
  const clampedB = Math.max(0, Math.min(255, Math.round(b)));
  return '#' + componentToHex(clampedR) + componentToHex(clampedG) + componentToHex(clampedB);
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = 0;
  let g = 0;
  let b = 0;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Convert HEX to HSL
export function hexToHsl(hex: string): HslColor {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

// Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Generate aesthetic random color (using HSL for controlled saturation and lightness)
export function getRandomHex(): string {
  // We keep saturation between 45% and 85% and lightness between 40% and 75% for modern, vibrant colors
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 45; // 45% - 85%
  const l = Math.floor(Math.random() * 35) + 40; // 40% - 75%
  return hslToHex(h, s, l);
}

// Safe check if a hex code is valid
export function isValidHex(hex: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// Normalize short HEX codes to long ones (e.g. #333 -> #333333)
export function normalizeHex(hex: string): string {
  if (!isValidHex(hex)) return '#FFFFFF';
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  return '#' + cleanHex.toUpperCase();
}

// Format string getters
export function formatRgbString(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHslString(hsl: HslColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// WCAG relative luminance calculation
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate Contrast Ratio between two HEX colors (returns a value between 1 and 21)
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(normalizeHex(hex1));
  const rgb2 = hexToRgb(normalizeHex(hex2));
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (lightest + 0.05) / (darkest + 0.05);
}

// Generate color harmony list (returns 5 HEX colors based on a seed color)
export function getHarmonyPalette(seedHex: string, mode: string): string[] {
  const seedHexNormalized = normalizeHex(seedHex);
  const { h, s, l } = hexToHsl(seedHexNormalized);
  
  const palette: string[] = [seedHexNormalized];
  
  switch (mode) {
    case 'analogous':
      // Analogous: Seed + small shifting steps
      palette.push(hslToHex((h + 15) % 360, s, l));
      palette.push(hslToHex((h + 30) % 360, s, l));
      palette.push(hslToHex((h - 15 + 360) % 360, s, l));
      palette.push(hslToHex((h - 30 + 360) % 360, s, l));
      break;
      
    case 'monochromatic':
      // Monochromatic: Same hue, variation in lightness and saturation
      palette.push(hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 20)));
      palette.push(hslToHex(h, Math.min(100, s + 10), Math.max(15, l - 15)));
      palette.push(hslToHex(h, Math.max(10, s - 35), Math.min(95, l + 30)));
      palette.push(hslToHex(h, Math.min(100, s + 15), Math.max(10, l - 30)));
      break;
      
    case 'triadic':
      // Triadic: 3 equidistant hues (0, 120, 240) + variations
      const h2 = (h + 120) % 360;
      const h3 = (h + 240) % 360;
      palette.push(hslToHex(h2, s, l));
      palette.push(hslToHex(h2, Math.max(10, s - 15), Math.min(90, l + 15)));
      palette.push(hslToHex(h3, s, l));
      palette.push(hslToHex(h3, Math.max(10, s - 15), Math.min(90, l + 15)));
      break;
      
    case 'complementary':
      // Complementary: Seed + exact opposite (180 degrees) + variations
      const oppositeHue = (h + 180) % 360;
      palette.push(hslToHex(oppositeHue, s, l));
      palette.push(hslToHex(oppositeHue, Math.max(10, s - 20), Math.min(90, l + 15)));
      palette.push(hslToHex(h, s, Math.min(90, l + 20))); // lighter variation of seed
      palette.push(hslToHex(oppositeHue, s, Math.max(10, l - 20))); // darker opposite
      break;
      
    case 'tetradic':
      // Tetradic (Double complementary): Seed, opposite, and another pair (+60, +240)
      const tOpposite = (h + 180) % 360;
      const tPair2 = (h + 60) % 360;
      const tPair2Opposite = (tPair2 + 180) % 360;
      palette.push(hslToHex(tOpposite, s, l));
      palette.push(hslToHex(tPair2, s, l));
      palette.push(hslToHex(tPair2Opposite, s, l));
      // Add a nice dark accent
      palette.push(hslToHex(h, Math.max(20, s - 30), 20));
      break;
      
    case 'random':
    default:
      // Produce an aesthetically cohesive set of 4 more random colors
      for (let i = 0; i < 4; i++) {
        palette.push(getRandomHex());
      }
      break;
  }
  
  // Ensure we return exactly 5 items
  return palette.slice(0, 5);
}

// Preset gradients
export interface GradientPreset {
  name: string;
  colors: string[];
  angle: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Aurora', colors: ['#FF5E62', '#FF9966'], angle: 135 },
  { name: 'Sunset Glow', colors: ['#4E54C8', '#8F94FB'], angle: 90 },
  { name: 'Cyberpunk', colors: ['#F857A6', '#FF5858'], angle: 45 },
  { name: 'Emerald', colors: ['#11998e', '#38ef7d'], angle: 135 },
  { name: 'Oceanic Blue', colors: ['#00c6ff', '#0072ff'], angle: 180 },
  { name: 'Velvet Dream', colors: ['#654ea3', '#eaafc8'], angle: 120 },
  { name: 'Sunny Lemon', colors: ['#f8ff00', '#3ad59f'], angle: 90 },
  { name: 'Deep Space', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 135 },
];
