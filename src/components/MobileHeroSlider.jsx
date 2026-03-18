import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mobileSlides = [
  {
    url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/588a91c5f_bannerfull_site.jpg',
    alt: 'Formando jovens, transformando futuros'
  },
  {
    url: 'https://media.base44.com/images/public/68c833941e7874dfa03c2a0b/0add1e36b_conecta_Jovem_post_feed002.png',
    alt: 'Formando jovens, transformando futuros'
  },
  {
    url: 'https://media.base44.com/images/public/68c833941e7874dfa03c2a0b/f79a156e2_conecta_Jovem_post_feed003.png',
    alt: 'Mais do que um curso. Uma ponte entre talento e oportunidade.'
  }
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function MobileHeroSlider() {
  const [[current, direction], setCurrent] = useState([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(([prev]) => [(prev + 1) % mobileSlides.length, 1]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'tween', duration: 0.6, ease: [0.77, 0, 0.175, 1] },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <motion.img
            src={mobileSlides[current].url}
            alt={mobileSlides[current].alt}
            className="w-full h-full object-cover"
            draggable={false}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 z-10">
        {mobileSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="transition-all duration-500 rounded-full"
            style={{
              width: idx === current ? 24 : 8,
              height: 8,
              background: idx === current
                ? 'linear-gradient(90deg, #e6ae4d, #d3733e)'
                : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      {/* CTA sobre a imagem */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10 px-6">
        <a
          href="https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #e6ae4d 0%, #d3733e 100%)' }}
        >
          <span
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{ background: 'linear-gradient(135deg, #e6ae4d, #d3733e)' }}
          />
          <span className="relative">🚀 Inscreva-se agora</span>
        </a>
        <p className="mt-2 text-white/70 text-xs font-medium">Gratuito · Vagas limitadas</p>
      </div>
    </div>
  );
}