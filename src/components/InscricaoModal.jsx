import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import InscricaoForm from './InscricaoForm';

function SuccessMessage({ onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="text-center py-6 px-2">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black text-gray-900 mb-2">Inscrição realizada!</h3>
      <p className="text-sm text-gray-500">Em breve entraremos em contato pelo WhatsApp 🎉</p>
    </div>
  );
}

export default function InscricaoModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origem, setOrigem] = useState('modal_cta');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    // Auto-abre no mobile após 1.5s
    const alreadyShown = sessionStorage.getItem('inscricao_modal_shown');
    if (window.innerWidth < 768 && !alreadyShown) {
      const t = setTimeout(() => {
        setOrigem('modal_mobile');
        setOpen(true);
        sessionStorage.setItem('inscricao_modal_shown', '1');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    // Escuta evento global para abrir modal
    const handler = (e) => {
      setOrigem(e.detail?.origem || 'modal_cta');
      setSuccess(false);
      setOpen(true);
    };
    window.addEventListener('open-inscricao', handler);
    return () => window.removeEventListener('open-inscricao', handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setDismissed(false);
      setSuccess(false);
    }, 3200);
  };

  const handleFloatingClick = () => {
    setOrigem('modal_flutuante');
    setSuccess(false);
    setOpen(true);
    setDismissed(false);
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
            onClick={handleFloatingClick}
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
              className="relative w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl"
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

              <div className="px-6 pt-5 pb-7">
                {success ? (
                  <SuccessMessage onClose={() => { setOpen(false); setSuccess(false); setDismissed(false); }} />
                ) : (
                  <>
                    {/* Badge */}
                    <div className="mb-3">
                      <span className="inline-block text-xs font-bold text-white uppercase px-3 py-1 rounded-full tracking-wide" style={{ background: '#F97316' }}>
                        🎓 2ª Edição — Inscrições Abertas
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-1">Garanta sua vaga!</h2>
                    <p className="text-xs text-slate-500 mb-5">Formação gratuita em tecnologia para jovens de Cuiabá</p>

                    <InscricaoForm origem={origem} theme="light" onSuccess={handleSuccess} />

                    <p className="text-center text-xs text-gray-400 mt-4">🔒 Gratuito · Sem spam · Vagas limitadas</p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}