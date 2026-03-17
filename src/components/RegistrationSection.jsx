import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import FloatingElements from './FloatingElements';
import ParallaxSection from './ParallaxSection';

export default function RegistrationSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [3000, 4000], [0, 50]);

  const handleLearnMore = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView', { content_name: 'Ver passo a passo da inscrição' }); // Track click on "Ver passo a passo"
    }
    window.open('https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem', '_blank');
  };

  return (
    <>
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .registration-section-mobile {
            padding: 40px 0 !important;
            display: block;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .registration-title-mobile {
            margin-bottom: 32px !important;
          }
        }
      `}</style>
      
      <ParallaxSection className="md:pt-0 md:pb-0 py-14 registration-section-mobile bg-gray-900 relative overflow-hidden" parallaxOffset={-30}>
        
        <div className="hidden md:block">
          <FloatingElements sectionId="registration" />
        </div>

        {/* Dynamic glow effects with parallax - Desktop only */}
        <div className="hidden md:block">
          <motion.div
            className="absolute inset-0"
            style={{ y }}>
            
            {[...Array(15)].map((_, i) =>
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${
                ['rgba(59, 130, 246, 0.1)', 'rgba(168, 85, 247, 0.1)', 'rgba(249, 115, 22, 0.1)'][Math.floor(Math.random() * 3)]}, transparent 70%)`

              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }} />

            )}
          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Desktop version with animations */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block text-center mb-8 md:mb-12 registration-title-mobile">
            
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white mb-6 title"
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}>
              
              Pronto para <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">decolar</span> seu futuro?
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}>
              
              As inscrições são gratuitas e as vagas são limitadas. 
              Não perca a oportunidade de transformar sua vida através da tecnologia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}>

              {/* Glow pulse behind button */}
              <div className="relative inline-block">
                <motion.div
                  className="absolute inset-0 rounded-full blur-2xl opacity-60"
                  style={{ background: 'linear-gradient(135deg, #e6ae4d, #d3733e)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.button
                  onClick={handleLearnMore}
                  className="relative inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full text-white font-black text-xl tracking-wide shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #e6ae4d 0%, #d3733e 100%)' }}
                  whileHover={{ scale: 1.07, boxShadow: '0 0 40px rgba(230,174,77,0.7)' }}
                  whileTap={{ scale: 0.97 }}>
                  🚀 Inscreva-se agora
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    <ExternalLink className="w-5 h-5" />
                  </motion.span>
                </motion.button>
              </div>

              <p className="mt-4 text-gray-400 text-sm">Gratuito · Vagas limitadas</p>
            </motion.div>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center mb-8 registration-title-mobile">
            <h2 className="text-white mb-6 text-base font-bold title">Pronto para decolar seu futuro?</h2>
            
            <p className="text-gray-300 mb-12 mx-auto text-sm max-w-3xl leading-relaxed">
              As inscrições são gratuitas e as vagas são limitadas. Não perca a oportunidade de transformar sua vida através da tecnologia.
            </p>

            <div>
              <button
                onClick={handleLearnMore}
                className="text-cyan-400 hover:text-cyan-300 text-lg underline decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors duration-300 inline-flex items-center gap-2">
                Inscreva-se
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <ExternalLink className="w-4 h-4" />
                </motion.span>
              </button>
            </div>
          </div>
        </div>
      </ParallaxSection>
    </>);
}