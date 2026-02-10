
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, FileText, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  const { data: sliders = [] } = useQuery({
    queryKey: ['sliders'],
    queryFn: () => base44.entities.Slider.list()
  });

  const { data: conteudos = [] } = useQuery({
    queryKey: ['conteudos'],
    queryFn: () => base44.entities.Conteudo.list()
  });

  const { data: paginas = [] } = useQuery({
    queryKey: ['paginas'],
    queryFn: () => base44.entities.Pagina.list()
  });

  const activeSliders = sliders.filter(s => s.ativo).length;
  const activeConteudos = conteudos.filter(c => c.ativo).length;
  const activePaginas = paginas.filter(p => p.ativo).length;

  const stats = [
    {
      title: 'Slides Ativos',
      value: activeSliders,
      total: sliders.length,
      icon: Image,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Conteúdos Ativos',
      value: activeConteudos,
      total: conteudos.length,
      icon: FileText,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Páginas Ativas',
      value: activePaginas,
      total: paginas.length,
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${stat.color} text-white pb-4`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{stat.title}</CardTitle>
                  <stat.icon className="w-8 h-8 opacity-80" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.total !== undefined && ( // Check for total existence
                    <span className="text-lg text-gray-500 ml-2">/ {stat.total}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Slides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sliders.slice(0, 5).map((slider) => (
                <div key={slider.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <img 
                    src={slider.url_midia} 
                    alt={slider.titulo}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{slider.titulo}</p>
                    <p className="text-sm text-gray-500">{slider.tipo_midia}</p>
                  </div>
                  {slider.ativo ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Conteúdos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conteudos.slice(0, 5).map((conteudo) => (
                <div key={conteudo.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <img 
                    src={conteudo.imagem_capa} 
                    alt={conteudo.titulo}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{conteudo.titulo}</p>
                    <p className="text-sm text-gray-500">{conteudo.autor}</p>
                  </div>
                  {conteudo.ativo ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Páginas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginas.slice(0, 5).map((pagina) => (
                <div key={pagina.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <img 
                    src={pagina.imagem_capa} 
                    alt={pagina.titulo}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{pagina.titulo}</p>
                    <p className="text-sm text-gray-500">/{pagina.slug}</p>
                  </div>
                  {pagina.ativo ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
