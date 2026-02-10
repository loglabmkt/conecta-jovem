import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const hasAcceptedCookies = localStorage.getItem('cookies-accepted');
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    // Para simplificar, vou usar um placeholder. Em produção seria um link real para a política de privacidade
    window.open('#', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay para garantir visibilidade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[9998] pointer-events-none"
          />
          
          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.3 }
            }}
            className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-[#e6ae4d] via-[#d3733e] to-[#8b5cf6] shadow-2xl border-t border-white/20">
              <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  
                  {/* Cookie Icon & Text */}
                  <div className="flex items-start gap-3 flex-1">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <Cookie className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </motion.div>
                    
                    <div className="text-white">
                      <p className="text-sm md:text-base leading-relaxed friendly-text font-medium">
                        Usamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site. 
                        Ao continuar, você concorda com nossa Política de Privacidade e uso de cookies.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={acceptCookies}
                        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/20 w-full sm:w-auto min-w-[160px]"
                        aria-label="Aceitar cookies e continuar navegação"
                      >
                        Aceitar e continuar
                      </Button>
                    </motion.div>

                    <motion.button
                      onClick={handleLearnMore}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-white/90 hover:text-white underline decoration-white/50 hover:decoration-white text-sm md:text-base font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 w-full sm:w-auto text-center"
                      aria-label="Saiba mais sobre nossa política de privacidade"
                    >
                      Saiba mais
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}