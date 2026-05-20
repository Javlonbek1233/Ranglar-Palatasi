import { Palette, Layers, Contrast, Heart, Sun, Moon, Sparkles } from 'lucide-react';
import { ColorFormat, TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  colorFormat: ColorFormat;
  setColorFormat: (format: ColorFormat) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  favoritesCount: { palettes: number; gradients: number };
}

export default function Navbar({
  activeTab,
  setActiveTab,
  colorFormat,
  setColorFormat,
  darkMode,
  toggleDarkMode,
  favoritesCount,
}: NavbarProps) {
  const totalFavorites = favoritesCount.palettes + favoritesCount.gradients;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'palette', label: 'Rang Palitrasi', icon: Palette },
    { id: 'gradient', label: 'Gradient', icon: Layers },
    { id: 'contrast', label: 'Kontrast Tekshiruvi', icon: Contrast },
    { id: 'favorites', label: 'Saqlanganlar', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-[#0A0A0C]/75 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4 md:h-20 md:py-0">
          
          {/* Logo element */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-zinc-100 dark:to-indigo-300 bg-clip-text text-transparent">
                HueCraft
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                Rang Palitrasi Generator
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center flex-wrap justify-center gap-1.5 p-1 bg-zinc-100/80 dark:bg-white/5 rounded-2xl border border-zinc-200/50 dark:border-white/10 backdrop-blur-md">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-black/5 dark:shadow-indigo-500/5 border border-zinc-200/50 dark:border-white/10'
                      : 'text-zinc-650 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'favorites' && totalFavorites > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-pink-500 dark:bg-pink-600 rounded-full animate-bounce">
                      {totalFavorites}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick controls panel */}
          <div className="flex items-center gap-4">
            
            {/* Format Selector */}
            <div className="flex items-center p-1 bg-zinc-100/50 dark:bg-white/5 rounded-xl border border-zinc-200/50 dark:border-white/10 gap-1 backdrop-blur-md">
              {(['HEX', 'RGB', 'HSL'] as ColorFormat[]).map((format) => (
                <button
                  id={`nav-format-${format}`}
                  key={format}
                  onClick={() => setColorFormat(format)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
                    colorFormat === format
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 dark:shadow-indigo-550/20'
                      : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>

            {/* Dark & Light mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-zinc-200/50 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-650 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all duration-300 hover:scale-105"
              aria-label="Loyihani rang rejimini o'zgartirish"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
