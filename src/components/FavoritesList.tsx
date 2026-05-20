import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Copy, 
  Code, 
  Sparkles, 
  Layers, 
  Palette, 
  Download,
  Terminal,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { SavedGradient, SavedPalette } from '../types';

interface FavoritesListProps {
  savedPalettes: SavedPalette[];
  savedGradients: SavedGradient[];
  onDeletePalette: (id: string) => void;
  onDeleteGradient: (id: string) => void;
  onCopyToast: (message: string) => void;
}

export default function FavoritesList({
  savedPalettes,
  savedGradients,
  onDeletePalette,
  onDeleteGradient,
  onCopyToast,
}: FavoritesListProps) {
  const [subTab, setSubTab] = useState<'palettes' | 'gradients'>('palettes');

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copy entire palette list of hexes
  const copyPaletteHexList = (palette: SavedPalette) => {
    const text = palette.colors.join(', ');
    navigator.clipboard.writeText(text);
    onCopyToast("Barcha ranglar roʻyxati nusxalandi!");
  };

  // Copy CSS Variables code of the palette
  const copyPaletteCssVars = (palette: SavedPalette) => {
    const cssVars = `/* HueCraft Custom Palette CSS variables */\n:root {\n${palette.colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}\n}`;
    navigator.clipboard.writeText(cssVars);
    onCopyToast("CSS oʻzgaruvchilari nusxalandi!");
  };

  // Copy Tailwind Array code of the palette
  const copyPaletteTailwind = (palette: SavedPalette) => {
    const twColors = `colors: {\n  palette: {\n${palette.colors.map((color, index) => `    ${index + 1}00: '${color}',`).join('\n')}\n  }\n}`;
    navigator.clipboard.writeText(twColors);
    onCopyToast("Tailwind CSS ranglari nusxalandi!");
  };

  // Copy CSS Gradient command
  const copyGradientCss = (gradient: SavedGradient) => {
    let css = `background: linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')});`;
    if (gradient.type === 'radial') {
      css = `background: radial-gradient(circle, ${gradient.colors.join(', ')});`;
    }
    navigator.clipboard.writeText(css);
    onCopyToast("CSS Gradient kodi nusxalandi!");
  };

  // Export as JSON array
  const exportAllToJSON = () => {
    const data = {
      palettes: savedPalettes,
      gradients: savedGradients,
      exportedAt: Date.now()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `huecraft-favorites-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onCopyToast("Barcha saqlanganlar JSON fayl shaklida yuklab olindi!");
  };

  return (
    <div className="w-full flex flex-col gap-6" id="favorites-list-container">
      
      {/* Sub tabs + global export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-none">
        <div className="flex p-0.5 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200/50 dark:border-white/10 self-start">
          <button
            id="subtab-palettes-btn"
            onClick={() => setSubTab('palettes')}
            className={`flex items-center gap-2 px-4 py-1.8 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              subTab === 'palettes'
                ? 'bg-white dark:bg-white/10 text-indigo-650 dark:text-indigo-400 shadow-sm border border-zinc-200/35 dark:border-white/10'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Palitralar ({savedPalettes.length})</span>
          </button>
          
          <button
            id="subtab-gradients-btn"
            onClick={() => setSubTab('gradients')}
            className={`flex items-center gap-2 px-4 py-1.8 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
              subTab === 'gradients'
                ? 'bg-white dark:bg-white/10 text-indigo-650 dark:text-indigo-400 shadow-sm border border-zinc-200/35 dark:border-white/10'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gradientlar ({savedGradients.length})</span>
          </button>
        </div>

        {(savedPalettes.length > 0 || savedGradients.length > 0) && (
          <button
            id="export-json-btn"
            onClick={exportAllToJSON}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-850 dark:hover:bg-zinc-50 rounded-xl text-xs font-bold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Eksport qilish (JSON)</span>
          </button>
        )}
      </div>

      {/* Grid displays */}
      <div>
        {subTab === 'palettes' ? (
          /* Palettes Gallery */
          savedPalettes.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white/40 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                <Palette className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-250">Saqlangan palitralar mavjud emas</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                  “Rang Palitrasi” generatoridan foydalanib oʻzingizga yoqqan ajoyib uygʻun ranglar barini saqlang va bu yerda boshqaring.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="saved-palettes-gallery">
              <AnimatePresence initial={false}>
                {savedPalettes.map((palette) => (
                  <motion.div
                    key={palette.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition duration-300"
                  >
                    {/* Visual 5 strips */}
                    <div className="h-16 flex items-stretch">
                      {palette.colors.map((color, idx) => (
                        <button
                          key={`${palette.id}-${idx}`}
                          onClick={() => {
                            navigator.clipboard.writeText(color);
                            onCopyToast(`Nusxalandi: ${color}`);
                          }}
                          className="flex-1 cursor-pointer transition-transform hover:scale-y-[1.1] relative group"
                          style={{ backgroundColor: color }}
                          title={`Click copy hex: ${color}`}
                        >
                          <span className="absolute bottom-1.5 inset-x-0 mx-auto w-max max-w-full px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {color}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 flex flex-col gap-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(palette.createdAt)}</span>
                        </div>
                        
                        <button
                          id={`delete-palette-btn-${palette.id}`}
                          onClick={() => onDeletePalette(palette.id)}
                          className="p-1.5 rounded-lg text-zinc-405 hover:text-red-500 hover:bg-red-50 dark:hover:bg-white/10 transition cursor-pointer"
                          title="Ushbu palitrani o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bulk actions */}
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-extrabold uppercase tracking-wide">
                        <button
                          id={`copy-colors-btn-${palette.id}`}
                          onClick={() => copyPaletteHexList(palette)}
                          className="py-1.8 bg-zinc-50 hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg flex items-center justify-center gap-1.5 border border-zinc-200/20 dark:border-white/5 cursor-pointer transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Ranglar</span>
                        </button>

                        <button
                          id={`copy-css-btn-${palette.id}`}
                          onClick={() => copyPaletteCssVars(palette)}
                          className="py-1.8 bg-zinc-50 hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg flex items-center justify-center gap-1.5 border border-zinc-200/20 dark:border-white/5 cursor-pointer transition"
                        >
                          <Code className="w-3 h-3" />
                          <span>CSS</span>
                        </button>

                        <button
                          id={`copy-tw-btn-${palette.id}`}
                          onClick={() => copyPaletteTailwind(palette)}
                          className="py-1.8 bg-zinc-50 hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-lg flex items-center justify-center gap-1.5 border border-zinc-200/20 dark:border-white/5 cursor-pointer transition"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Tailwind</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        ) : (
          /* Gradients Gallery */
          savedGradients.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white/40 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-250">Saqlangan gradientlar mavjud emas</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                  “Gradient” generatoridan foydalanib oʻzingizga yoqqan mo''jizaviy gradientlarni saqlang va bu yerda boshqaring.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="saved-gradients-gallery">
              <AnimatePresence initial={false}>
                {savedGradients.map((gradient) => {
                  const backgroundStr = gradient.type === 'radial'
                    ? `radial-gradient(circle, ${gradient.colors.join(', ')})`
                    : `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`;
                  
                  return (
                    <motion.div
                      key={gradient.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition duration-300"
                    >
                      {/* Live display */}
                      <div 
                        className="h-28 w-full block transition relative group border-b border-zinc-100 dark:border-white/10"
                        style={{ background: backgroundStr }}
                      >
                        <span className="absolute top-2 right-2 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-black/60 text-white rounded-md select-none">
                          {gradient.type === 'linear' ? `${gradient.angle}°` : 'Radial'}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(gradient.createdAt)}</span>
                          </div>
                          
                          <button
                            id={`delete-gradient-btn-${gradient.id}`}
                            onClick={() => onDeleteGradient(gradient.id)}
                            className="p-1.5 rounded-lg text-zinc-405 hover:text-red-500 hover:bg-red-50 dark:hover:bg-white/10 transition cursor-pointer"
                            title="Ushbu gradientni o'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Colors swatches preview row */}
                        <div className="flex items-center gap-1 overflow-x-auto py-1">
                          {gradient.colors.map((c, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md text-zinc-550 dark:text-zinc-450 bg-zinc-100 dark:bg-white/10 border border-zinc-200/20 dark:border-white/10"
                              title={c}
                            >
                              {c}
                            </span>
                          ))}
                        </div>

                        <button
                          id={`copy-gradient-inline-btn-${gradient.id}`}
                          onClick={() => copyGradientCss(gradient)}
                          className="w-full mt-1.5 py-1.8 bg-indigo-50 dark:bg-white/10 hover:bg-indigo-100 dark:hover:bg-white/20 text-indigo-650 dark:text-indigo-400 rounded-lg flex items-center justify-center gap-2 text-xs font-bold border border-indigo-100/30 dark:border-white/15 cursor-pointer transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>CSS Kodi</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )
        )}
      </div>

    </div>
  );
}
