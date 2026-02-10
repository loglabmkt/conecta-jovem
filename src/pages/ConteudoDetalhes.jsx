import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ConteudoDetalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: conteudo, isLoading } = useQuery({
    queryKey: ['conteudo', slug],
    queryFn: async () => {
      const data = await base44.entities.Conteudo.filter({ slug, ativo: true });
      return data[0];
    },
    enabled: !!slug
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!conteudo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo não encontrado</h1>
          <Link to={createPageUrl('ConectaJovem')}>
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500">
              Voltar para o site
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hero-conteudo-v2 {
          position: relative;
          width: 100%;
          height: 450px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-conteudo-v2 {
            height: 320px;
          }
        }

        .hero-image-v2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay-v2 {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
          pointer-events: none;
        }

        .hero-content-v2 {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem 3rem;
          z-index: 10;
          display: flex;
          align-items: flex-end;
        }

        @media (min-width: 768px) {
          .hero-content-v2 {
            padding: 3rem 3rem 4rem;
          }
        }

        .metadata-section-v2 {
          background: #FFFFFF;
          padding: 40px 0 20px 0;
          border-bottom: 1px solid #E5E7EB;
        }

        @media (max-width: 768px) {
          .metadata-section-v2 {
            padding: 30px 0 15px 0;
          }
        }

        .title-conteudo-v2 {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2em;
          max-width: 900px;
          color: #FFFFFF;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .title-conteudo-v2 {
            font-size: 22px;
          }
        }

        .subtitle-conteudo-v2 {
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          line-height: 1.4em;
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .subtitle-conteudo-v2 {
            font-size: 16px;
          }
        }

        .metadata-info-v2 {
          font-size: 14px;
          color: #777777;
        }

        @media (max-width: 768px) {
          .metadata-info-v2 {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Navigation com position fixed sobre a imagem */}
        <div className="relative z-50">
          <Navigation />
        </div>

        {/* Hero com Imagem de Capa - 450px */}
        <div className="hero-conteudo-v2">
          {/* Imagem de fundo */}
          <img
            src={conteudo.imagem_capa}
            alt={conteudo.titulo}
            className="hero-image-v2"
          />
          
          {/* Overlay escuro mais intenso na base */}
          <div className="hero-overlay-v2" />
          
          {/* Conteúdo sobre a imagem - Apenas Categorias e Título */}
          <div className="hero-content-v2">
            <div className="container mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Categorias */}
                {conteudo.categorias && conteudo.categorias.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {conteudo.categorias.map((cat, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Título - Tamanho reduzido 32px */}
                <h1 className="title-conteudo-v2 title">
                  {conteudo.titulo}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Seção de Metadados - Abaixo da Imagem sobre Fundo Branco */}
        <div className="metadata-section-v2">
          <div className="container mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Subtítulo em Negrito */}
              {conteudo.subtitulo && (
                <p className="subtitle-conteudo-v2">
                  {conteudo.subtitulo}
                </p>
              )}

              {/* Meta Info - Data e Autor */}
              <div className="flex items-center gap-5 metadata-info-v2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {conteudo.data_publicacao && format(new Date(conteudo.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{conteudo.autor}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Conteúdo do Artigo */}
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Botão Voltar */}
            <Link to={createPageUrl('ConectaJovem') + '#conteudos'}>
              <Button variant="outline" className="mb-8 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar para Conteúdos
              </Button>
            </Link>

            {/* Texto do Conteúdo */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: conteudo.texto }}
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75',
                color: '#374151'
              }}
            />

            {/* Tags */}
            {conteudo.tags && conteudo.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag className="w-5 h-5 text-gray-500" />
                  {conteudo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compartilhar / Ações */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                Gostou deste conteúdo? Compartilhe com seus amigos!
              </p>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}