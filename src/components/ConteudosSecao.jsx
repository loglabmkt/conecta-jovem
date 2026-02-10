import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ConteudosSecao() {
  const [visibleCount, setVisibleCount] = useState(8);

  const { data: conteudos = [] } = useQuery({
    queryKey: ['conteudos-active'],
    queryFn: async () => {
      const data = await base44.entities.Conteudo.filter({ ativo: true }, '-data_publicacao');
      return data;
    }
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  if (conteudos.length === 0) return null;

  return (
    <section id="conteudos" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 title">
            Conteúdos e <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Notícias</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fique por dentro de novidades, histórias e oportunidades do Conecta Jovem.
          </p>
        </motion.div>

        {/* Grid - 4 colunas desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conteudos.slice(0, visibleCount).map((conteudo, index) => (
            <Link
              key={conteudo.id}
              to={`${createPageUrl('ConteudoDetalhes')}?slug=${conteudo.slug}`}
              className="block"
            >
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
              >
                {/* Image Container - 306x172px */}
                <div className="relative w-full h-[172px] overflow-hidden rounded-t-lg border border-gray-200">
                  <img
                    src={conteudo.imagem_capa}
                    alt={conteudo.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Categorias Badge */}
                  {conteudo.categorias && conteudo.categorias.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold shadow-lg">
                        {conteudo.categorias[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {conteudo.data_publicacao && format(new Date(conteudo.data_publicacao), 'dd/MM/yy', { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {conteudo.autor}
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {conteudo.titulo}
                  </h3>

                  {/* Subtítulo */}
                  {conteudo.subtitulo && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
                      {conteudo.subtitulo}
                    </p>
                  )}

                  {/* Tags */}
                  {conteudo.tags && conteudo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {conteudo.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="text-orange-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ler mais
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < conteudos.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={loadMore}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-6 rounded-full text-lg shadow-lg"
            >
              Ver mais conteúdos
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}