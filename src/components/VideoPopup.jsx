import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function VideoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar se o popup já foi mostrado nesta sessão
    const hasSeenPopup = sessionStorage.getItem('video_popup_seen');
    
    if (!hasSeenPopup) {
      // Abrir após 2 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('video_popup_seen', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay/Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Lightbox Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
                aria-label="Fechar vídeo"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Container */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/b87PEFvck_I?autoplay=1&rel=0"
                  title="Vídeo Conecta Jovem"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Optional Footer */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-center">
                <p className="text-white font-semibold">Conecta Jovem - Transformando vidas através da tecnologia</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}