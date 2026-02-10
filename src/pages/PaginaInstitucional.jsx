import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function PaginaInstitucional() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: pagina, isLoading } = useQuery({
    queryKey: ['pagina', slug],
    queryFn: async () => {
      const data = await base44.entities.Pagina.filter({ slug, ativo: true });
      return data[0];
    },
    enabled: !!slug
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!pagina) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
          <button
            onClick={() => window.location.href = createPageUrl('ConectaJovem')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg"
          >
            Voltar para o site
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hero-pagina {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-pagina {
            height: 320px;
          }
        }

        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }

        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem;
          z-index: 10;
        }

        @media (min-width: 768px) {
          .hero-content {
            padding: 3rem 3rem;
          }
        }

        .two-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .two-columns {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
        }

        .video-responsive {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }

        .video-responsive iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div className="relative z-50">
          <Navigation />
        </div>

        {/* Hero Section */}
        <div className="hero-pagina">
          <img
            src={pagina.imagem_capa}
            alt={pagina.titulo}
            className="hero-image"
          />
          <div className="hero-overlay" />
          
          <div className="hero-content">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 title">
                  {pagina.titulo}
                </h1>
                {pagina.subtitulo && (
                  <p className="text-lg md:text-xl text-white/90">
                    {pagina.subtitulo}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="two-columns"
          >
            {/* Left Column - Media */}
            <div>
              {pagina.tipo_midia_coluna === 'video' ? (
                <div className="video-responsive">
                  <iframe
                    src={getYouTubeEmbedUrl(pagina.video_ou_imagem_coluna)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={pagina.video_ou_imagem_coluna}
                  alt={pagina.titulo}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Right Column - Text */}
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: pagina.texto_coluna_direita }}
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#374151',
                  textAlign: 'justify'
                }}
              />
            </div>
          </motion.div>

          {/* Additional Text Section */}
          {pagina.texto_adicional && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16"
            >
              <div className="prose prose-lg max-w-4xl mx-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: pagina.texto_adicional }}
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    color: '#374151'
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}