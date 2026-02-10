import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaginaForm from './PaginaForm';
import { createPageUrl } from '@/utils';

export default function PaginaManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPagina, setEditingPagina] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: paginas = [], isLoading } = useQuery({
    queryKey: ['paginas'],
    queryFn: async () => {
      const data = await base44.entities.Pagina.list('-data_publicacao');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Pagina.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['paginas']);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, ativo }) => base44.entities.Pagina.update(id, { ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['paginas']);
    }
  });

  const handleEdit = (pagina) => {
    setEditingPagina(pagina);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta página?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (pagina) => {
    toggleActiveMutation.mutate({ id: pagina.id, ativo: !pagina.ativo });
  };

  const handlePreview = (slug) => {
    window.open(`${createPageUrl('PaginaInstitucional')}?slug=${slug}`, '_blank');
  };

  const filteredPaginas = paginas.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciar Páginas Institucionais</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Crie e edite páginas fixas como Sobre, Parceiros, etc.
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingPagina(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar páginas..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <PaginaForm
          pagina={editingPagina}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPagina(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredPaginas.map((pagina, index) => (
            <motion.div
              key={pagina.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full ${!pagina.ativo ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <img 
                      src={pagina.imagem_capa}
                      alt={pagina.titulo}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{pagina.titulo}</h3>
                      {pagina.subtitulo && (
                        <p className="text-sm text-gray-600 mb-2">{pagina.subtitulo}</p>
                      )}
                      <p className="text-xs text-gray-500 mb-2">
                        URL: /{pagina.slug}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          pagina.tipo_midia_coluna === 'video' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {pagina.tipo_midia_coluna === 'video' ? 'Vídeo' : 'Imagem'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(pagina)}
                        className="flex-1"
                      >
                        {pagina.ativo ? (
                          <><Eye className="w-4 h-4 mr-1" /> Ativo</>
                        ) : (
                          <><EyeOff className="w-4 h-4 mr-1" /> Inativo</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(pagina.slug)}
                        title="Visualizar página"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pagina)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(pagina.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPaginas.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhuma página cadastrada'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando sua primeira página institucional'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Página
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}