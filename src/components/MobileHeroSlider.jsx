import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mobileSlides = [
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
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.95,
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
            x: { type: 'spring', stiffness: 300, damping: 35 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          <img
            src={mobileSlides[current].url}
            alt={mobileSlides[current].alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dot controls at the bottom */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 z-10">
        {mobileSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: idx === current ? 28 : 10,
              height: 10,
              background: idx === current
                ? 'linear-gradient(90deg, #e6ae4d, #d3733e)'
                : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
}