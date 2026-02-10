import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

export default function GaleriaImagens() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/fea359dc2_DSC01934.jpg',
      alt: 'Evento Conecta Jovem'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/8a671f0cf_DSC01941.jpg',
      alt: 'Participantes do programa'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/4e8fec542_DSC01950.jpg',
      alt: 'Atividades em grupo'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/51a7013df_DSC01958.jpg',
      alt: 'Mentoria e aprendizado'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/f86568a51_DSC01976.jpg',
      alt: 'Estudantes em aula'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/a0f46a1f3_DSC01977.jpg',
      alt: 'Aprendizado prático'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/c6560c5b0_DSC01979.jpg',
      alt: 'Sala de aula'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/f3be32e24_DSC01982.jpg',
      alt: 'Material didático'
    },
    {
      url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/07400615c_DSC01983.jpg',
      alt: 'Turma participante'
    }
  ];

  const imagesPerPage = 3;
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const getCurrentImages = () => {
    const start = currentIndex * imagesPerPage;
    return images.slice(start, start + imagesPerPage);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImage(null), 300);
  };

  return (
    <>
      <style>{`
        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gallery-card:hover .gallery-image {
          transform: scale(1.08);
        }
        
        .gallery-card {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .gallery-card:hover {
          box-shadow: 0 20px 60px rgba(249, 115, 22, 0.25);
          transform: translateY(-8px);
        }
        
        .gallery-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .gallery-card:hover::after {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .gallery-card:active {
            transform: scale(0.98);
          }
          
          .gallery-nav-button {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
          }
        }
      `}</style>

      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Sparkles className="w-7 h-7 text-orange-500" />
              <span className="friendly-text text-orange-600 font-semibold text-lg">NOSSA JORNADA</span>
              <Sparkles className="w-7 h-7 text-orange-500" />
            </div>
            
            <h2 className="title text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Momentos que <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Inspiram</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça um pouco mais sobre o Conecta Jovem através dos nossos momentos especiais
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="relative max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              >
                {getCurrentImages().map((image, idx) => (
                  <motion.div
                    key={`${currentIndex}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="gallery-card aspect-[4/3]"
                    onClick={() => openLightbox(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="gallery-image"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="gallery-nav-button w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-orange-300 flex items-center justify-center shadow-lg hover:bg-orange-50 hover:border-orange-500 transition-all duration-300"
                aria-label="Imagens anteriores"
              >
                <ChevronLeft className="w-6 h-6 text-orange-600" />
              </motion.button>

              {/* Page Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-gradient-to-r from-orange-500 to-yellow-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para página ${idx + 1}`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="gallery-nav-button w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-orange-300 flex items-center justify-center shadow-lg hover:bg-orange-50 hover:border-orange-500 transition-all duration-300"
                aria-label="Próximas imagens"
              >
                <ChevronRight className="w-6 h-6 text-orange-600" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && lightboxImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                  aria-label="Fechar imagem"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>

                <motion.img
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  src={lightboxImage.url}
                  alt={lightboxImage.alt}
                  className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}