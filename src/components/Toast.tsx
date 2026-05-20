import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="toast-notification-banner"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-55 max-w-sm w-full bg-zinc-900 border border-zinc-750 text-white rounded-2xl shadow-xl shadow-black/35 p-4 flex items-center justify-between gap-3.5 backdrop-blur-xl bg-zinc-900/95"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {message}
            </p>
          </div>

          <button
            id="close-toast-btn"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
