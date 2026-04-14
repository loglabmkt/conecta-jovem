import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
// InscricaoForm preservado mas não renderizado (substituído por link externo)
const INHIRE_URL = 'https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem';

export default function InscricaoModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Auto-abre no mobile após 1.5s
    const alreadyShown = sessionStorage.getItem('inscricao_modal_shown');
    if (window.innerWidth < 768 && !alreadyShown) {
      const t = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem('inscricao_modal_shown', '1');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    // Escuta evento global para abrir modal
    const handler = () => { setOpen(true); };
    window.addEventListener('open-inscricao', handler);
    return () => window.removeEventListener('open-inscricao', handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
  };

  return (
    <>
      {/* Botão flutuante mobile após fechar */}
      <AnimatePresence>
        {dismissed && !open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.open('https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem', '_blank')}
            className="fixed bottom-6 right-6 z-40 md:hidden flex items-center gap-2 px-4 py-3 rounded-full text-white font-bold text-sm shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
          >
            📝 Inscreva-se
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-[340px] bg-white rounded-2xl overflow-hidden shadow-2xl mt-[30px] md:mt-0"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Faixa colorida topo */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F97316, #3B82F6)' }} />

              {/* Botão fechar */}
              <button
                onClick={handleClose}
                aria-label="Fechar"
                className="absolute top-3 right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="px-5 pt-4 pb-5">
                {/* Badge */}
                <div className="mb-3">
                  <span className="inline-block text-xs font-bold text-white uppercase px-3 py-1 rounded-full tracking-wide" style={{ background: '#F97316' }}>
                    🎓 2ª Edição — Inscrições Abertas
                  </span>
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-1">Garanta sua vaga!</h2>
                <p className="text-xs text-slate-500 mb-4">Formação gratuita em tecnologia para jovens de Cuiabá</p>

                <a
                  href={INHIRE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg,#F97316,#EA580C)', color: 'white',
                    width: '100%', padding: '16px', borderRadius: 12, fontSize: 15,
                    fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                    display: 'block', boxShadow: '0 4px 16px rgba(249,115,22,0.4)'
                  }}>
                  🚀 Quero me inscrever agora
                </a>

                <p className="text-center text-xs text-gray-400 mt-3">🔒 Gratuito · Vagas limitadas</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}