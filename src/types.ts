export type ColorFormat = 'HEX' | 'RGB' | 'HSL';

export interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface PaletteColor extends ColorInfo {
  id: string;
  isLocked: boolean;
}

export interface SavedPalette {
  id: string;
  colors: string[]; // hex codes
  createdAt: number;
  name?: string;
}

export interface SavedGradient {
  id: string;
  colors: string[]; // hex codes
  angle: number;
  type: 'linear' | 'radial';
  createdAt: number;
  name?: string;
}

export type TabType = 'palette' | 'gradient' | 'contrast' | 'favorites';

export type HarmonyMode = 'random' | 'analogous' | 'monochromatic' | 'triadic' | 'complementary' | 'tetradic';
