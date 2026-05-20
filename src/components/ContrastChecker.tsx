import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Pipette, 
  RefreshCw, 
  Compass, 
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { getContrastRatio, hexToRgb, isValidHex, normalizeHex } from '../utils/colorUtils';

const CONTRAST_PRESETS = [
  { name: 'Tungi Moviy', bg: '#0F172A', text: '#38BDF8' },
  { name: 'Yalpizli Oq', bg: '#F0FDF4', text: '#15803D' },
  { name: 'Klassik Quyuq', bg: '#18181B', text: '#FAFAFA' },
  { name: 'Qahva Shokolad', bg: '#FEF3C7', text: '#78350F' },
  { name: 'Kibernetik Pushti', bg: '#03001e', text: '#ec38bc' },
];

export default function ContrastChecker() {
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#4F46E5');

  // Parse safety
  const safeBg = isValidHex(bgColor) ? normalizeHex(bgColor) : '#FFFFFF';
  const safeText = isValidHex(textColor) ? normalizeHex(textColor) : '#000000';

  const ratio = getContrastRatio(safeBg, safeText);

  // WCAG Criteria Checkers
  // Normal text (under 18pt or 14pt bold): AA limit is 4.5:1, AAA limit is 7:1
  const normalAA = ratio >= 4.5;
  const normalAAA = ratio >= 7.0;

  // Large text (18pt / 24px and above, or 14pt bold): AA limit is 3.0:1, AAA limit is 4.5:1
  const largeAA = ratio >= 3.0;
  const largeAAA = ratio >= 4.5;

  // Get status string and color rating
  const getRatingSummary = () => {
    if (ratio >= 7.0) {
      return { label: 'Aʼlo darajada!', description: 'Mutloq oʻqishli va barcha WCAG standartlariga toʻliq mos keladi.', color: 'text-emerald-500' };
    }
    if (ratio >= 4.5) {
      return { label: 'Yaxshi (AA)', description: 'Oʻqish oson, kichik va katta matnlar uchun javob beradi.', color: 'text-blue-500' };
    }
    if (ratio >= 3.0) {
      return { label: 'Cheklangan (Faqat katta matnlar)', description: 'Faqatgina sarlavhalar va katta hajmdagi matnlar uchun mos keladi.', color: 'text-amber-500' };
    }
    return { label: 'Past Kontrast!', description: 'Oʻqish juda qiyin. Standartlarga javob bermaydi, matn rangini toʻqroq/ochroq qiling.', color: 'text-red-500' };
  };

  const rating = getRatingSummary();

  const handleSwapColors = () => {
    setBgColor(textColor);
    setTextColor(bgColor);
  };

  return (
    <div className="w-full flex flex-col gap-8 text-zinc-800 dark:text-zinc-200" id="contrast-checker-container">
      
      {/* Intro info box */}
      <div className="p-4 bg-indigo-50/50 dark:bg-zinc-850/40 border border-indigo-100/40 dark:border-zinc-750/35 rounded-2xl flex items-start gap-4">
        <span className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mt-1 shrink-0">
          <Eye className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">Rang Kontrasti va WCAG Foydalanish</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Foydalanuvchilar (shu jumladan koʻrish qobiliyati zaif boʻlgan insonlar) uchun matn va uning foni orasidagi farqning oʻqilishi darajasini tekshiring. WCAG AA standarti normal matnlar uchun kamida <strong>4.5:1</strong> nisbatni talab qiladi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side editor controls (col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-5 p-5 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-none">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Ranglarni tahrirlash</span>
          </h4>

          {/* Background color input */}
          <div className="flex flex-col gap-1.5">
            <label id="contrast-bg-label" className="text-xs font-bold text-zinc-550 dark:text-zinc-400">Fon rangi</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-xl relative border border-black/10 shadow-inner shrink-0"
                style={{ backgroundColor: safeBg }}
              >
                <input
                  id="contrast-bg-picker-native"
                   type="color"
                  value={safeBg}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </div>

              <input
                id="contrast-bg-input"
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className={`flex-1 px-3 py-1.8 text-xs font-semibold font-mono border rounded-lg bg-white dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-indigo-550 ${
                  isValidHex(bgColor) 
                    ? 'border-zinc-200 dark:border-white/10 text-zinc-850 dark:text-zinc-200' 
                    : 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/10'
                }`}
                placeholder="#FFFFFF"
                maxLength={7}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2">
            <button
              id="contrast-swap-btn"
              onClick={handleSwapColors}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/20 bg-white dark:bg-white/10 text-zinc-500 hover:text-indigo-500 hover:scale-105 active:scale-95 shadow-sm transition cursor-pointer"
              title="Ranglarni almashtirish"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Color input */}
          <div className="flex flex-col gap-1.5">
            <label id="contrast-text-label" className="text-xs font-bold text-zinc-550 dark:text-zinc-400">Matn rangi</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-xl relative border border-black/10 shadow-inner shrink-0"
                style={{ backgroundColor: safeText }}
              >
                <input
                  id="contrast-text-picker-native"
                  type="color"
                  value={safeText}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </div>

              <input
                id="contrast-text-input"
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className={`flex-1 px-3 py-1.8 text-xs font-semibold font-mono border rounded-lg bg-white dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-indigo-550 ${
                  isValidHex(textColor) 
                    ? 'border-zinc-200 dark:border-white/10 text-zinc-850 dark:text-zinc-200' 
                    : 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/10'
                }`}
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>

          {/* Presets segment list */}
          <div className="border-t border-zinc-200 dark:border-white/10 pt-3 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tayyor kombinatsiyalar</span>
            <div className="flex flex-col gap-1.5 max-h-[145px] overflow-y-auto">
              {CONTRAST_PRESETS.map((preset) => (
                <button
                  id={`contrast-preset-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                  key={preset.name}
                  onClick={() => {
                    setBgColor(preset.bg);
                    setTextColor(preset.text);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg border border-zinc-100 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 hover:scale-[1.01] transition duration-200 text-left"
                >
                  <span className="text-xs font-semibold select-none">{preset.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md border border-black/10" style={{ backgroundColor: preset.bg }} />
                    <span className="w-4 h-4 rounded-md border border-black/10" style={{ backgroundColor: preset.text }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Live Interactive Preview & Scores Card (col 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main output indicators - Dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Contrast score circle */}
            <div className="p-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-black/5 dark:shadow-none">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                Matn Nisbati
              </span>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-indigo-650 dark:text-indigo-400">
                {ratio.toFixed(2)}:1
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                Kontrast balandligi
              </span>
            </div>

            {/* WCAG Compliance status box (col 2) */}
            <div className="md:col-span-2 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl flex flex-col justify-center shadow-lg shadow-black/5 dark:shadow-none">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">
                Foydalanuvchi Reytingi
              </span>
              <div className="flex flex-col gap-1">
                <span className={`text-base font-bold ${rating.color}`}>
                  {rating.label}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {rating.description}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Mock UI Preview section styled dynamically */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
              Jonli Vizual Namuna
            </span>

            <div 
              className="p-6 rounded-3xl border border-zinc-205/40 dark:border-zinc-800/30 min-h-[190px] flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-md"
              style={{ backgroundColor: safeBg }}
            >
              {/* Header Title mockup */}
              <h5 
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: safeText }}
              >
                HueCraft Toʻplami
              </h5>

              {/* Subtitle / Paragraph mockup */}
              <p 
                className="text-sm font-medium leading-relaxed max-w-[480px]"
                style={{ color: safeText, opacity: 0.85 }}
              >
                Bu matn fonga nisbatan aniq kontrastda koʻrinadi. Web dizaynda ranglarni uygʻun tanlash foydalanish qulayligining muhim siri hisoblanadi.
              </p>

              {/* Action buttons mockup */}
              <div className="flex flex-wrap gap-2.5 mt-2">
                <button 
                  id="mock-primary-btn"
                  className="px-4 py-2 rounded-xl text-xs font-bold shadow-md select-none pointer-events-none"
                  style={{ backgroundColor: safeText, color: safeBg }}
                >
                  Boshlash
                </button>

                <button 
                  id="mock-secondary-btn"
                  className="px-4 py-2 rounded-xl text-xs font-bold border select-none pointer-events-none"
                  style={{ borderColor: `${safeText}30`, color: safeText }}
                >
                  Loyihani sozlash
                </button>
              </div>

              {/* Grid abstract decoratives */}
              <div 
                className="absolute right-4 bottom-4 w-20 h-20 rounded-full opacity-10 pointer-events-none" 
                style={{ backgroundColor: safeText }}
              />
            </div>
          </div>

          {/* WCAG details checkmarks board */}
          <div className="p-4 bg-zinc-50 dark:bg-white/5 border border-zinc-200/40 dark:border-white/10 rounded-2xl flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              WCAG 2.1 Muvofiqlik Tekshiruvlari
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Normal Text Check */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Kichik Matnlar (Body text)</span>
                
                <div className="flex items-center gap-2">
                  {normalAA ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">AA Rejimi (Kamida 4.5:1) — {normalAA ? 'Ruxsat berilgan' : 'Mos kelmaydi'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {normalAAA ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">AAA Rejimi (Kamida 7.0:1) — {normalAAA ? 'Ruxsat berilgan' : 'Mos kelmaydi'}</span>
                </div>
              </div>

              {/* Large Text Check */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Katta Matnlar (Titles / Headings)</span>
                
                <div className="flex items-center gap-2">
                  {largeAA ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">AA Rejimi (Kamida 3.0:1) — {largeAA ? 'Ruxsat berilgan' : 'Mos kelmaydi'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {largeAAA ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs">AAA Rejimi (Kamida 4.5:1) — {largeAAA ? 'Ruxsat berilgan' : 'Mos kelmaydi'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
