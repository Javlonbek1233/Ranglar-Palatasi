import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Heart, 
  RefreshCw, 
  Check, 
  Layers, 
  Sliders, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { SavedGradient } from '../types';
import { GRADIENT_PRESETS, getRandomHex, isValidHex, normalizeHex } from '../utils/colorUtils';

interface GradientGeneratorProps {
  onCopyToast: (message: string) => void;
  onSaveGradient: (gradient: Omit<SavedGradient, 'id' | 'createdAt'>) => void;
  savedGradients: SavedGradient[];
}

export default function GradientGenerator({
  onCopyToast,
  onSaveGradient,
  savedGradients,
}: GradientGeneratorProps) {
  // Local state for gradient stops
  const [stops, setStops] = useState<string[]>(['#4E54C8', '#8F94FB']);
  const [angle, setAngle] = useState<number>(135);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  // Compute CSS background string depending on type
  const getGradientCss = () => {
    if (gradientType === 'radial') {
      return `radial-gradient(circle, ${stops.join(', ')})`;
    }
    return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
  };

  // Generate completely random gradient
  const handleRandomize = () => {
    const numStops = Math.floor(Math.random() * 2) + 2; // 2 or 3 stops
    const randomizedStops: string[] = [];
    for (let i = 0; i < numStops; i++) {
      randomizedStops.push(getRandomHex());
    }
    setStops(randomizedStops);
    setAngle(Math.floor(Math.random() * 8) * 45); // nice intervals like 45, 90, 135
  };

  // Update specific stop color
  const handleStopChange = (index: number, val: string) => {
    let cleanVal = val.trim();
    if (!cleanVal.startsWith('#') && cleanVal.length > 0) {
      cleanVal = '#' + cleanVal;
    }

    setStops(prev => prev.map((stop, idx) => {
      if (idx !== index) return stop;
      return cleanVal;
    }));
  };

  // Add extra color stop (max 5)
  const addStop = () => {
    if (stops.length >= 5) {
      onCopyToast("Ko'pi bilan 5 ta rang stop qo'shish mumkin!");
      return;
    }
    setStops(prev => [...prev, getRandomHex()]);
  };

  // Remove stop color (min 2)
  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      onCopyToast("Kamida 2 ta rang stop bo'lishi shart!");
      return;
    }
    setStops(prev => prev.filter((_, idx) => idx !== index));
  };

  // Load Preset
  const handleLoadPreset = (colors: string[], presetAngle: number) => {
    setStops(colors);
    setAngle(presetAngle);
    setGradientType('linear');
    onCopyToast("Gradient tayyor shabloni yuklandi!");
  };

  // Copy CSS code to clipboard
  const handleCopyCode = () => {
    const css = `background: ${getGradientCss()};`;
    navigator.clipboard.writeText(css);
    onCopyToast("CSS kod buferga nusxalandi!");
  };

  // Save current gradient to favorites/saved items
  const handleSaveGradientLocal = () => {
    // Check if valid hexes before saving
    const validColors = stops.map(c => isValidHex(c) ? normalizeHex(c) : '#FFFFFF');
    onSaveGradient({
      colors: validColors,
      angle,
      type: gradientType,
    });
  };

  // Check if current is already saved
  const isGradientSaved = savedGradients.some(saved => 
    saved.type === gradientType &&
    (gradientType === 'radial' || saved.angle === angle) &&
    saved.colors.length === stops.length &&
    saved.colors.every((c, idx) => c.toUpperCase() === (stops[idx] || '').toUpperCase())
  );

  return (
    <div className="w-full flex flex-col gap-8" id="gradient-generator-container">
      
      {/* Interactive editor dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Editor Settings (col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5 p-5 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Gradient Tahrirlagich</span>
            </h3>

            <button
              id="randomize-gradient-btn"
              onClick={handleRandomize}
              className="p-1.5 rounded-lg border border-zinc-200/50 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition duration-155"
              title="Tasodifiy gradient yaratish"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Type Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450">
              Yoʻnalish turi
            </span>
            <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200/60 dark:border-white/10 backdrop-blur-sm">
              <button
                id="type-linear-btn"
                onClick={() => setGradientType('linear')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  gradientType === 'linear'
                    ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/45 dark:border-white/10'
                    : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Linear (Chiziqli)
              </button>
              <button
                id="type-radial-btn"
                onClick={() => setGradientType('radial')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  gradientType === 'radial'
                    ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/45 dark:border-white/10'
                    : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Radial (Doira)
              </button>
            </div>
          </div>

          {/* Angle slider panel */}
          {gradientType === 'linear' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-450">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-zinc-400" />
                  Burchak burchagi
                </span>
                <span className="font-mono text-indigo-550 dark:text-indigo-400">
                  {angle}°
                </span>
              </div>
              <input
                id="gradient-angle-slider"
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-zinc-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[0, 90, 135, 180].map((deg) => (
                  <button
                    id={`angle-preset-${deg}`}
                    key={deg}
                    onClick={() => setAngle(deg)}
                    className={`py-1 text-[10px] font-mono font-semibold rounded-md border text-center transition ${
                      angle === deg
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400'
                        : 'border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color stops section */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-455">
                Rangler nuqtalari ({stops.length}/5)
              </span>
              <button
                id="add-stop-btn"
                onClick={addStop}
                disabled={stops.length >= 5}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Stop qoʻshish
              </button>
            </div>

            <div className="flex flex-col gap-2 bg-zinc-50 dark:bg-[#0A0A0C]/40 p-2.5 rounded-xl border border-zinc-200/30 dark:border-white/10 max-h-[175px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {stops.map((stop, index) => (
                  <motion.div
                    key={`stop-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    {/* Visual Color Preview block */}
                    <div 
                      className="w-10 h-10 rounded-xl relative border border-black/10 shadow-inner shrink-0"
                      style={{ backgroundColor: stop }}
                    >
                      <input
                        id={`stop-color-native-${index}`}
                        type="color"
                        value={isValidHex(stop) ? normalizeHex(stop) : '#FFFFFF'}
                        onChange={(e) => handleStopChange(index, e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </div>

                    <div className="flex-1 flex gap-2">
                      <input
                        id={`stop-color-input-${index}`}
                        type="text"
                        value={stop}
                        onChange={(e) => handleStopChange(index, e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs font-semibold font-mono border rounded-lg bg-white dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                          isValidHex(stop) 
                            ? 'border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200' 
                            : 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/10'
                        }`}
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>

                    {stops.length > 2 && (
                      <button
                        id={`remove-stop-btn-${index}`}
                        onClick={() => removeStop(index)}
                        className="p-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex gap-2.5">
            <button
              id="copy-gradient-btn"
              onClick={handleCopyCode}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/15 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>CSS Kodini Koʻchirish</span>
            </button>

            <button
              id="save-gradient-btn"
              onClick={handleSaveGradientLocal}
              disabled={isGradientSaved}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition border cursor-pointer ${
                isGradientSaved 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-800/20'
                  : 'bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-slate-200 hover:bg-zinc-50 dark:hover:bg-white/10'
              }`}
            >
              {isGradientSaved ? <Check className="w-4 h-4 text-emerald-500" /> : <Heart className="w-4 h-4 text-pink-500" />}
            </button>
          </div>
        </div>

        {/* Display Canvas (col 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div 
            className="w-full h-[320px] lg:h-[390px] rounded-3xl shadow-xl shadow-black/5 relative overflow-hidden group border border-white/5"
            style={{ background: getGradientCss() }}
          >
            {/* Ambient controls inside container */}
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-305 flex flex-col justify-between p-6 text-white backdrop-blur-[2px]">
              <div>
                <h4 className="text-sm font-bold tracking-wide">Gradient Visual Vizualizatsiya</h4>
                <p className="text-xs text-white/70 mt-1 font-mono">{getGradientCss()}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {stops.map((color, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-mono font-bold"
                    >
                      {color}
                    </span>
                  ))}
                </div>
                
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.2 py-1 bg-white/10 rounded-lg">
                  {gradientType}
                </span>
              </div>
            </div>

            {/* Subtle decorative dot grid on CSS layout */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-semibold">
            <span>🎨 Rang stoplar orasidagi silliq oʻtishlar taʼminlangan</span>
            <span>HEX kodi boyicha oʻzgartiring</span>
          </div>
        </div>
      </div>

      {/* Preset Library Grid */}
      <div className="border-t border-zinc-200/60 dark:border-white/10 pt-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          <span>Tayyor Gradient Shablonlari</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="gradient-presets-library">
          {GRADIENT_PRESETS.map((preset) => {
            const backgroundStr = `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`;
            return (
              <button
                id={`gradient-preset-card-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                key={preset.name}
                onClick={() => handleLoadPreset(preset.colors, preset.angle)}
                className="group flex flex-col hover:scale-[1.03] transition-all duration-300 text-left bg-white dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-none"
              >
                <div 
                  className="h-28 w-full block transition-transform group-hover:scale-105 duration-320"
                  style={{ background: backgroundStr }}
                />
                <div className="p-3">
                  <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors block">
                    {preset.name}
                  </span>
                  
                  <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                    {preset.colors.map((c, i) => (
                      <span 
                        key={i} 
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0" 
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0 select-none ml-auto flex items-center gap-0.5">
                      {preset.angle}° 
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
