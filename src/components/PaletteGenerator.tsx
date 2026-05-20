import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Copy, 
  RefreshCw, 
  Heart, 
  Pipette, 
  SlidersHorizontal,
  Info,
  Check
} from 'lucide-react';
import { ColorFormat, HarmonyMode, PaletteColor } from '../types';
import { 
  getRandomHex, 
  hexToRgb, 
  hexToHsl, 
  getHarmonyPalette, 
  formatRgbString, 
  formatHslString, 
  isValidHex, 
  normalizeHex,
  getContrastRatio,
  hslToHex
} from '../utils/colorUtils';

interface PaletteGeneratorProps {
  colorFormat: ColorFormat;
  onCopyToast: (message: string) => void;
  onSavePalette: (colors: string[]) => void;
  savedPalettes: string[][]; // to check if already saved
}

const HARMONY_OPTIONS: { value: HarmonyMode; label: string; desc: string }[] = [
  { value: 'random', label: 'Tasodifiy', desc: 'Mutloq tasodifiy va qiziqarli ranglar jamlanmasi' },
  { value: 'analogous', label: 'Analog (Yaqin)', desc: 'Rang doirasida bir-biriga qoʻshni boʻlgan uygʻundosh ranglar' },
  { value: 'monochromatic', label: 'Monoxromatik', desc: 'Bitta rangning turli xil toʻqlik va yorqinlik darajalari' },
  { value: 'triadic', label: 'Triada (Uchlik)', desc: 'Rang doirasida bir xil masofadagi uchta muvozanatli rang' },
  { value: 'complementary', label: 'Komplementar', desc: 'Bir-biriga qarama-qarshi boʻlgan yuqori kontrastli juftliklar' },
  { value: 'tetradic', label: 'Tetrada (Toʻrtlik)', desc: 'Ikki juft komplementar rangdan tashkil topgan boy palitra' },
];

export default function PaletteGenerator({
  colorFormat,
  onCopyToast,
  onSavePalette,
  savedPalettes,
}: PaletteGeneratorProps) {
  // Main local state for our 5-color palette
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
  const [seedColorIndex, setSeedColorIndex] = useState<number>(0);
  const [activeAdjustIndex, setActiveAdjustIndex] = useState<number | null>(null);

  // Initialize palette
  const generatePalette = useCallback((forceAll = false, customMode: HarmonyMode = harmonyMode) => {
    setColors(prev => {
      // If empty, generate fully initial random
      if (prev.length === 0) {
        const initialHexes: string[] = [];
        for (let i = 0; i < 5; i++) {
          initialHexes.push(getRandomHex());
        }
        return initialHexes.map((hex, index) => {
          const rgb = hexToRgb(hex);
          const hsl = hexToHsl(hex);
          return {
            id: `color-${index}-${Date.now()}`,
            hex,
            rgb: formatRgbString(rgb),
            hsl: formatHslString(hsl),
            isLocked: false,
          };
        });
      }

      // Check which colors are locked
      const updated = [...prev];
      const lockedIndices = updated.map((c, i) => c.isLocked || (!forceAll && i === seedColorIndex) ? i : -1).filter(i => i !== -1);
      
      let seedHex = updated[seedColorIndex]?.hex || prev[0].hex;
      
      // If selected seed index is locked, use it. Otherwise, if there is another locked color, use it as seed
      if (lockedIndices.length > 0 && !lockedIndices.includes(seedColorIndex)) {
        seedHex = updated[lockedIndices[0]].hex;
      }

      // Generate base pallet hex codes
      let hexList: string[] = [];
      if (customMode === 'random') {
        hexList = updated.map((item, idx) => {
          if (item.isLocked && !forceAll) return item.hex;
          return getRandomHex();
        });
      } else {
        // Harmony modes generate all 5 from seed
        const rawHarmony = getHarmonyPalette(seedHex, customMode);
        let harmonyPointer = 0;
        
        hexList = updated.map((item, idx) => {
          if (item.isLocked && !forceAll) return item.hex;
          // grab next harmony color that doesn't override existing locked ones if possible
          const candidate = rawHarmony[harmonyPointer % 5];
          harmonyPointer++;
          return candidate;
        });
      }

      return updated.map((item, idx) => {
        const hex = hexList[idx];
        const rgb = hexToRgb(hex);
        const hsl = hexToHsl(hex);
        return {
          ...item,
          hex,
          rgb: formatRgbString(rgb),
          hsl: formatHslString(hsl),
        };
      });
    });
  }, [harmonyMode, seedColorIndex]);

  // Generate on mount
  useEffect(() => {
    generatePalette(true, 'random');
  }, []);

  // Keyboard spacebar listener to generate colors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable')
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatePalette]);

  // Handle color toggle lock
  const toggleLock = (index: number) => {
    setColors(prev => prev.map((item, idx) => 
      idx === index ? { ...item, isLocked: !item.isLocked } : item
    ));
  };

  // Set as Seed color for harmonies
  const selectSeedColor = (index: number) => {
    setSeedColorIndex(index);
    if (harmonyMode !== 'random') {
      // Re-trigger harmony palette based on the new seed immediately
      setColors(prev => {
        const seedHex = prev[index].hex;
        const rawHarmony = getHarmonyPalette(seedHex, harmonyMode);
        let harmonyPointer = 0;

        return prev.map((item, idx) => {
          if (item.isLocked && idx !== index) return item;
          if (idx === index) return item; // keep seed
          
          const hex = rawHarmony[harmonyPointer === index ? ++harmonyPointer : harmonyPointer] || getRandomHex();
          harmonyPointer++;
          const rgb = hexToRgb(hex);
          const hsl = hexToHsl(hex);
          return {
            ...item,
            hex,
            rgb: formatRgbString(rgb),
            hsl: formatHslString(hsl),
          };
        });
      });
    }
    onCopyToast(`“${colors[index]?.hex}” asosiy tayanch rang sifatida belgilandi!`);
  };

  // Handle color input manual text changes
  const handleHexChange = (index: number, val: string) => {
    let cleanVal = val.trim();
    if (!cleanVal.startsWith('#') && cleanVal.length > 0) {
      cleanVal = '#' + cleanVal;
    }

    setColors(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      
      const newHex = isValidHex(cleanVal) ? normalizeHex(cleanVal) : cleanVal;
      const rgb = hexToRgb(isValidHex(newHex) ? newHex : '#FFFFFF');
      const hsl = hexToHsl(isValidHex(newHex) ? newHex : '#FFFFFF');
      
      return {
        ...item,
        hex: newHex,
        rgb: formatRgbString(rgb),
        hsl: formatHslString(hsl),
      };
    }));
  };

  // Adjust sliders helper (H, S, or L change)
  const handleSliderChange = (index: number, parameter: 'h' | 's' | 'l', value: number) => {
    setColors(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      
      const originalHsl = hexToHsl(item.hex);
      const newHsl = { ...originalHsl, [parameter]: value };
      const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
      
      const rgb = hexToRgb(newHex);
      const hslStr = formatHslString(newHsl);
      
      return {
        ...item,
        hex: newHex,
        rgb: formatRgbString(rgb),
        hsl: hslStr
      };
    }));
  };

  // Copy color code helper
  const copyColorCode = (color: PaletteColor) => {
    let textToCopy = color.hex;
    if (colorFormat === 'RGB') textToCopy = color.rgb;
    if (colorFormat === 'HSL') textToCopy = color.hsl;

    navigator.clipboard.writeText(textToCopy);
    onCopyToast(`Rang kodi nusxalandi: ${textToCopy}`);
  };

  // Save full palette to favorites
  const handleSavePaletteLocal = () => {
    const rawCodes = colors.map(c => c.hex);
    onSavePalette(rawCodes);
  };

  // Check if current palette is already saved
  const isPaletteSaved = savedPalettes.some(saved => 
    saved.length === colors.length && saved.every((c, i) => c === colors[i].hex)
  );

  return (
    <div className="w-full flex flex-col gap-6" id="palette-generator-container">
      
      {/* Harmony controls row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl gap-4 shadow-xl shadow-black/5 dark:shadow-none relative z-10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="min-w-[140px]">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Uygʻunlik Rejimi
            </span>
            <select
              id="harmony-select"
              value={harmonyMode}
              onChange={(e) => {
                const mode = e.target.value as HarmonyMode;
                setHarmonyMode(mode);
                generatePalette(false, mode);
              }}
              className="w-full px-3 py-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {HARMONY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-[#0A0A0C] dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="hidden sm:block border-l border-zinc-200 dark:border-white/10 h-8 self-center" />

          <div className="flex-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {HARMONY_OPTIONS.find(o => o.value === harmonyMode)?.desc}
            </p>
            {harmonyMode !== 'random' && (
              <p className="text-[11px] text-indigo-500 dark:text-indigo-400 mt-1 font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Tanlangan tayanch rang: <strong className="font-mono">{colors[seedColorIndex]?.hex}</strong> (oʻzgartirish uchun rang kartasidagi tugmani bosing)</span>
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Space bar suggestion pill */}
          <span className="hidden xl:inline-flex items-center text-xs text-zinc-400 bg-zinc-100/60 dark:bg-white/5 font-medium px-3 py-2 rounded-xl border border-zinc-200/40 dark:border-white/10 gap-1.5 backdrop-blur-md">
            Kompyuterda <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 border border-zinc-300 dark:border-white/10 rounded text-[10px] font-mono shadow-sm">Space</kbd> tugmasini bosing
          </span>

          <button
            id="generate-palette-btn"
            onClick={() => generatePalette(false, harmonyMode)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-650/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generatsiya qilish</span>
          </button>

          <button
            id="save-palette-btn"
            onClick={handleSavePaletteLocal}
            disabled={isPaletteSaved}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border cursor-pointer ${
              isPaletteSaved 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-800/20'
                : 'bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-slate-200 hover:bg-zinc-50 dark:hover:bg-white/10'
            }`}
          >
            {isPaletteSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Saqlandi</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500/10" />
                <span className="hidden sm:inline">Palitrani Saqlash</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Colors Cards Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-5 gap-3.5 h-[55vh] md:h-[62vh] min-h-[460px] md:min-h-[500px]"
        id="colors-cards-canvas"
      >
        <AnimatePresence mode="popLayout">
          {colors.map((color, index) => {
            if (!color) return null;
            // Contrast checkers
            const contrOnWhite = getContrastRatio(color.hex, '#FFFFFF');
            const contrOnBlack = getContrastRatio(color.hex, '#000000');
            const useWhiteText = contrOnWhite < contrOnBlack;
            const textClass = useWhiteText ? 'text-white' : 'text-zinc-900';
            const textMutedClass = useWhiteText ? 'text-white/60' : 'text-zinc-500/90';
            const btnBgClass = useWhiteText ? 'bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border-white/10' : 'bg-black/5 hover:bg-black/10 active:bg-black/15 text-zinc-800 border-black/5';

            const activeAdjust = activeAdjustIndex === index;

            return (
              <motion.div
                key={color.id}
                layoutId={`card-${color.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="relative rounded-3xl overflow-hidden flex flex-col group h-full shadow-lg shadow-black/5 border border-zinc-200/10"
                style={{ backgroundColor: color.hex }}
              >
                {/* Visual Glass Header with card controls */}
                <div className="p-3 flex items-center justify-between z-10">
                  <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-lg ${
                    useWhiteText ? 'bg-white/10 text-white/90' : 'bg-black/10 text-zinc-700'
                  }`}>
                    #{index + 1}
                  </span>

                  <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Lock Button */}
                    <button
                      id={`lock-color-btn-${index}`}
                      onClick={() => toggleLock(index)}
                      className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 border ${
                        color.isLocked
                          ? 'bg-pink-500 border-pink-600/30 text-white'
                          : btnBgClass
                      }`}
                      title={color.isLocked ? "Rangni blokdan chiqarish" : "Generatsiya paytida rangni qulflash"}
                    >
                      {color.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>

                    {/* Harmony anchor picker */}
                    {harmonyMode !== 'random' && (
                      <button
                        id={`seed-select-btn-${index}`}
                        onClick={() => selectSeedColor(index)}
                        className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 border ${
                          seedColorIndex === index
                            ? 'bg-violet-600 border-violet-700/30 text-white shadow-md'
                            : btnBgClass
                        }`}
                        title="Uyg'unlashtirish tayanvhi"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Fine adjustments menu trigger */}
                    <button
                      id={`adjust-toggle-btn-${index}`}
                      onClick={() => setActiveAdjustIndex(activeAdjust ? null : index)}
                      className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 border ${
                        activeAdjust ? 'bg-indigo-600/20 text-indigo-100 border-indigo-500' : btnBgClass
                      }`}
                      title="RGB / HSL Tahrirlagich"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Color Info Panel */}
                <div className="flex-1 flex flex-col justify-end p-5 z-10">
                  {/* Fine sliders Drawer */}
                  <AnimatePresence>
                    {activeAdjust && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className={`mb-4 p-3 rounded-2xl border backdrop-blur-md ${
                          useWhiteText 
                            ? 'bg-black/40 border-white/10 text-white' 
                            : 'bg-white/80 border-black/10 text-zinc-900 border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-inherit/80">
                            HSL Nozik Sozlash
                          </span>
                          <button 
                            id={`close-adjust-btn-${index}`}
                            onClick={() => setActiveAdjustIndex(null)}
                            className="text-[10px] font-bold opacity-70 hover:opacity-100"
                          >
                            Yopish
                          </button>
                        </div>

                        {/* HSL sliders */}
                        <div className="flex flex-col gap-2">
                          <div>
                            <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                              <span>Tus (Hue)</span>
                              <span>{hexToHsl(color.hex).h}°</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="359"
                              value={hexToHsl(color.hex).h}
                              onChange={(e) => handleSliderChange(index, 'h', parseInt(e.target.value))}
                              className="w-full accent-indigo-500 h-1 bg-zinc-300 dark:bg-zinc-750 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                              <span>Toʻyinganlik (Saturation)</span>
                              <span>{hexToHsl(color.hex).s}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={hexToHsl(color.hex).s}
                              onChange={(e) => handleSliderChange(index, 's', parseInt(e.target.value))}
                              className="w-full accent-indigo-500 h-1 bg-zinc-300 dark:bg-zinc-750 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] opacity-80 mb-0.5">
                              <span>Yorqinlik (Lightness)</span>
                              <span>{hexToHsl(color.hex).l}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={hexToHsl(color.hex).l}
                              onChange={(e) => handleSliderChange(index, 'l', parseInt(e.target.value))}
                              className="w-full accent-indigo-500 h-1 bg-zinc-300 dark:bg-zinc-750 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Contrast ratio details inside card */}
                  <div className={`mb-3 flex items-center gap-1.5 opacity-80 md:opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs ${textClass}`}>
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${contrOnBlack >= 4.5 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>Aa/Aaa: {contrOnBlack.toFixed(1)}x</span>
                    </span>
                  </div>

                  {/* Hex Text input and Pickers overlay */}
                  <div className="flex items-center gap-2">
                    <input
                      id={`color-hex-input-${index}`}
                      type="text"
                      value={color.hex}
                      onChange={(e) => handleHexChange(index, e.target.value)}
                      className={`w-full max-w-[120px] bg-transparent border-b-2 font-mono text-xl font-bold tracking-wider uppercase focus:outline-none focus:border-indigo-505 transition-colors ${
                        isValidHex(color.hex) 
                          ? (useWhiteText ? 'border-white/30 text-white' : 'border-black/20 text-zinc-900') 
                          : 'border-red-500 text-red-500'
                      }`}
                      placeholder="#000000"
                    />

                    {/* Integrated system color picker input */}
                    <label id={`color-picker-label-${index}`} className={`p-2 rounded-xl cursor-pointer ${btnBgClass} active:scale-95 transition-all duration-200 border`}>
                      <Pipette className="w-4 h-4" />
                      <input
                        id={`color-picker-native-${index}`}
                        type="color"
                        value={color.hex.startsWith('#') && isValidHex(color.hex) ? color.hex : '#FFFFFF'}
                        onChange={(e) => handleHexChange(index, e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {/* Format details display */}
                  <div className={`mt-2.5 font-mono text-xs flex flex-col gap-0.5 ${textMutedClass}`}>
                    {colorFormat === 'HEX' && (
                      <span className="truncate">{color.hex}</span>
                    )}
                    {colorFormat === 'RGB' && (
                      <span className="truncate">{color.rgb}</span>
                    )}
                    {colorFormat === 'HSL' && (
                      <span className="truncate">{color.hsl}</span>
                    )}
                  </div>

                  {/* Copy button */}
                  <button
                    id={`copy-color-card-btn-${index}`}
                    onClick={() => copyColorCode(color)}
                    className={`mt-4 w-full py-2.5 rounded-2xl border text-xs font-bold font-sans flex items-center justify-center gap-2 tracking-wide transition-all duration-200 cursor-pointer ${btnBgClass}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxalash</span>
                  </button>
                </div>

                {/* Subtle gradient backdrop to ensure text is legible on color items */}
                <div 
                  className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-55"
                  style={{
                    background: useWhiteText 
                      ? 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' 
                      : 'linear-gradient(to top, rgba(255,255,255,0.4), transparent)'
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dynamic UX Tips overlay */}
      <div className="text-center font-medium text-xs text-zinc-400 dark:text-zinc-500 mt-2">
        💡 Toʻliq palitrani bir tugma orqali nusxalash yoki ssenariylarga koʻra gradient generatsiya qilishingiz mumkin!
      </div>
    </div>
  );
}
