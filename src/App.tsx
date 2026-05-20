import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import PaletteGenerator from './components/PaletteGenerator';
import GradientGenerator from './components/GradientGenerator';
import ContrastChecker from './components/ContrastChecker';
import FavoritesList from './components/FavoritesList';
import Toast from './components/Toast';
import { ColorFormat, TabType, SavedPalette, SavedGradient } from './types';

export default function App() {
  // Tab Routing & copy format state
  const [activeTab, setActiveTab] = useState<TabType>('palette');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('HEX');
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('huecraft_dark_mode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Saved favorites local persistence states
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    const data = localStorage.getItem('huecraft_palettes');
    return data ? JSON.parse(data) : [];
  });
  
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>(() => {
    const data = localStorage.getItem('huecraft_gradients');
    return data ? JSON.parse(data) : [];
  });

  // Popup Toast Notification alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync index.html root dark class with mode change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('huecraft_dark_mode', String(darkMode));
  }, [darkMode]);

  // Handle color palette saving
  const handleSavePalette = (rawColors: string[]) => {
    const isDuplicate = savedPalettes.some(saved => 
      saved.colors.length === rawColors.length && saved.colors.every((col, idx) => col === rawColors[idx])
    );

    if (isDuplicate) {
      setToastMessage("Ushbu palitra allaqachon saqlangan!");
      return;
    }

    const newPalette: SavedPalette = {
      id: `pal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      colors: rawColors,
      createdAt: Date.now(),
    };

    const updated = [newPalette, ...savedPalettes];
    setSavedPalettes(updated);
    localStorage.setItem('huecraft_palettes', JSON.stringify(updated));
    setToastMessage("Rang palitrasi saqlandi!");
  };

  // Handle gradient saving
  const handleSaveGradient = (newGradData: Omit<SavedGradient, 'id' | 'createdAt'>) => {
    const isDuplicate = savedGradients.some(saved => 
      saved.type === newGradData.type &&
      (newGradData.type === 'radial' || saved.angle === newGradData.angle) &&
      saved.colors.length === newGradData.colors.length &&
      saved.colors.every((c, idx) => c.toUpperCase() === (newGradData.colors[idx] || '').toUpperCase())
    );

    if (isDuplicate) {
      setToastMessage("Ushby gradient allaqachon saqlangan!");
      return;
    }

    const newGradient: SavedGradient = {
      id: `grad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...newGradData,
      createdAt: Date.now(),
    };

    const updated = [newGradient, ...savedGradients];
    setSavedGradients(updated);
    localStorage.setItem('huecraft_gradients', JSON.stringify(updated));
    setToastMessage("Gradient sevimli roʻyxatga qoʻshildi!");
  };

  // Handle deletion of Saved Palette
  const handleDeletePalette = (id: string) => {
    const updated = savedPalettes.filter(item => item.id !== id);
    setSavedPalettes(updated);
    localStorage.setItem('huecraft_palettes', JSON.stringify(updated));
    setToastMessage("Palitra oʻchirildi.");
  };

  // Handle deletion of Saved Gradient
  const handleDeleteGradient = (id: string) => {
    const updated = savedGradients.filter(item => item.id !== id);
    setSavedGradients(updated);
    localStorage.setItem('huecraft_gradients', JSON.stringify(updated));
    setToastMessage("Gradient oʻchirildi.");
  };

  // Trigger alert
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300 antialiased font-sans relative overflow-x-hidden">
      
      {/* Immersive UI Background Atmosphere Spotlights */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/15 dark:bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-fuchsia-600/10 dark:bg-fuchsia-600/25 rounded-full blur-[120px]" />
      </div>
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        colorFormat={colorFormat}
        setColorFormat={setColorFormat}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        favoritesCount={{
          palettes: savedPalettes.length,
          gradients: savedGradients.length,
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full"
          >
            {activeTab === 'palette' && (
              <PaletteGenerator
                colorFormat={colorFormat}
                onCopyToast={showToast}
                onSavePalette={handleSavePalette}
                savedPalettes={savedPalettes.map(p => p.colors)}
              />
            )}

            {activeTab === 'gradient' && (
              <GradientGenerator
                onCopyToast={showToast}
                onSaveGradient={handleSaveGradient}
                savedGradients={savedGradients}
              />
            )}

            {activeTab === 'contrast' && (
              <ContrastChecker />
            )}

            {activeTab === 'favorites' && (
              <FavoritesList
                savedPalettes={savedPalettes}
                savedGradients={savedGradients}
                onDeletePalette={handleDeletePalette}
                onDeleteGradient={handleDeleteGradient}
                onCopyToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Decorative footer */}
      <footer className="border-t border-zinc-200/40 dark:border-zinc-900/40 py-6 mt-12 bg-white/40 dark:bg-zinc-950/40 backdrop-blur w-full text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        <p>© 2026 HueCraft. Zamonaviy, minimalistik tarzda siz bilan yaratildi.</p>
      </footer>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
