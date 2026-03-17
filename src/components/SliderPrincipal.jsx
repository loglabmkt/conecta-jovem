import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MobileHeroSlider from './MobileHeroSlider';

export default function SliderPrincipal() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: slides = [] } = useQuery({
    queryKey: ['sliders-active'],
    queryFn: async () => {
      const data = await base44.entities.Slider.filter({ ativo: true }, 'ordem');
      return data;
    }
  });

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  
  // Decidir qual imagem usar
  const imagemAtual = isMobile && currentSlide.imagem_mobile 
    ? currentSlide.imagem_mobile 
    : currentSlide.imagem_desktop;

  // Verificar se tem link
  const hasLink = currentSlide.link_destino && currentSlide.link_destino.trim() !== '';

  const handleSlideClick = () => {
    if (hasLink) {
      window.open(currentSlide.link_destino, '_blank');
    }
  };

  return (
    <>
      <style>{`
        .slider-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* Desktop: Full viewport height */
        @media (min-width: 768px) {
          .slider-container {
            height: 100vh;
          }
        }
      `}</style>

      {/* Mobile: slider próprio com as imagens de campanha */}
      <div className="md:hidden">
        <MobileHeroSlider />
      </div>

      <section className="slider-container hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            onClick={handleSlideClick}
            style={{ cursor: hasLink ? 'pointer' : 'default' }}
          >
            {/* Imagem limpa, sem overlay */}
            <div
              className="slider-image absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imagemAtual})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Desktop only */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full items-center justify-center transition-all"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}