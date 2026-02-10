import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/conectajovem.tec/", color: "from-pink-500 to-purple-500" }];

  // Contador de cliques secreto para acesso admin
  const [clickCount, setClickCount] = React.useState(0);
  const clickTimeoutRef = React.useRef(null);

  const handleLogoClick = () => {
    // Clear any existing timeout to restart the 3-second window
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    setClickCount(prev => {
      const newCount = prev + 1;
      
      // Se clicar 5 vezes no logo, redireciona para login admin
      if (newCount === 5) {
        window.location.href = window.location.origin + window.location.pathname + '?admin=true';
        return 0; // Reset count after successful redirection
      }
      
      // Reset após 3 segundos se no 4º clique, ou se o contador não atingir 5
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);

      return newCount;
    });
  };

  React.useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and once on unmount


  return (
    <>
      {/* Mobile-specific styles */}
      <style>{`
        .section-footer {
        margin-top: -30px !important;
        }
        @media (max-width: 768px) {
          .mobile-instagram-button {
            width: clamp(88%, 94vw, 420px);
            max-width: 420px;
            min-height: 48px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            transition: all 180ms ease-out;
            text-decoration: none;
            color: white;
          }
          
          .mobile-instagram-button:hover,
          .mobile-instagram-button:active {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transform: scale(0.99);
          }
          
          .mobile-instagram-button:active {
            transform: scale(0.985);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
          }
          
          .mobile-instagram-button:focus-visible {
            outline: 2px solid rgba(255, 255, 255, 0.6);
            outline-offset: 2px;
          }
          
          .mobile-instagram-icon {
            width: 26px;
            height: 26px;
            background: linear-gradient(135deg, #e1306c, #fd1d1d, #f56040, #f77737, #fcaf45, #ffdc80);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          
          .mobile-instagram-label {
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          

        }
      `}</style>
      
      <footer className="section-footer bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12">

            {/* Logo e Descrição */}
            <div className="mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block mb-6"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}>

                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/b7aa5a616_PERFIL_02.png"
                  alt="Conecta Jovem"
                  className="h-20 w-auto object-contain mx-auto" />

              </motion.div>
              <p className="text-gray-300 mx-auto text-sm max-w-2xl leading-relaxed">Transformando vidas através da tecnologia. Conectando jovens ao futuro digital com formação gratuita e de qualidade.

              </p>
            </div>

            {/* Grid de 3 Colunas */}
            <div className="grid md:grid-cols-3 gap-12 items-start">
              
              {/* Primeira Coluna - Apresentado por */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-4">

                <h3 className="text-xl font-semibold text-white mb-4">Apresentado por:</h3>
                <a href="https://loglabdigital.com.br" target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center justify-center min-h-[112px]">

                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/db1a171e0_LOGLAB.png"
                      alt="LogLab"
                      className="h-16 w-auto object-contain mx-auto" />

                  </motion.div>
                </a>
              </motion.div>

              {/* Segunda Coluna - Nossos Parceiros */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4">

                <h3 className="text-xl font-semibold text-white mb-4">Nossos Parceiros:</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                  {
                    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/47ddf6a55_UFMT.png",
                    alt: "UFMT",
                    href: "https://www.ufmt.br/"
                  },
                  {
                    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/4843db59d_ic_branco.png",
                    alt: "Instituto de Computação UFMT",
                    href: "https://www.ic.ufmt.br"
                  },
                  {
                    src: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/c5b69013b_YUMIT.png",
                    alt: "Yumit Hub",
                    href: "#"
                  }].
                  map((partner, index) =>
                  <a href={partner.href} key={index} target="_blank" rel="noopener noreferrer" className={partner.href === '#' ? 'pointer-events-none' : ''}>
                      <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[72px]">

                        <img
                        src={partner.src}
                        alt={partner.alt}
                        className="h-12 w-auto object-contain mx-auto" />

                      </motion.div>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Terceira Coluna - Siga-nos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-4">

                <h3 className="text-xl font-semibold text-white mb-4">Siga-nos:</h3>
                
                <a href="https://www.instagram.com/conectajovem.tec/" target="_blank" rel="noopener noreferrer" className="w-full" aria-label="Abrir Instagram do Conecta Jovem">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center justify-center gap-4 min-h-[112px] h-full">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                         <Instagram className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-semibold text-lg text-white">@conectajovem.tec</span>
                  </motion.div>
                </a>
              </motion.div>

            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-gray-400">
                © 2024 Conecta Jovem. Todos os direitos reservados. 
                <br className="md:hidden" />
                <span className="text-blue-400"> Construindo o futuro, um jovem por vez.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </>);

}