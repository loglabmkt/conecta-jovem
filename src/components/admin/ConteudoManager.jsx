import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConteudoForm from './ConteudoForm';

export default function ConteudoManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConteudo, setEditingConteudo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: conteudos = [], isLoading } = useQuery({
    queryKey: ['conteudos'],
    queryFn: async () => {
      const data = await base44.entities.Conteudo.list('-data_publicacao');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Conteudo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['conteudos']);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, ativo }) => base44.entities.Conteudo.update(id, { ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['conteudos']);
    }
  });

  const handleEdit = (conteudo) => {
    setEditingConteudo(conteudo);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (conteudo) => {
    toggleActiveMutation.mutate({ id: conteudo.id, ativo: !conteudo.ativo });
  };

  const filteredConteudos = conteudos.filter(c => 
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.autor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciar Conteúdos</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Crie e edite notícias, artigos e conteúdos institucionais
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingConteudo(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Conteúdo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conteúdos..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <ConteudoForm
          conteudo={editingConteudo}
          onClose={() => {
            setIsFormOpen(false);
            setEditingConteudo(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredConteudos.map((conteudo, index) => (
            <motion.div
              key={conteudo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full ${!conteudo.ativo ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <img 
                      src={conteudo.imagem_capa}
                      alt={conteudo.titulo}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{conteudo.titulo}</h3>
                      {conteudo.subtitulo && (
                        <p className="text-sm text-gray-600 mb-2">{conteudo.subtitulo}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {conteudo.texto}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {conteudo.categorias?.map((cat, i) => (
                          <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            {cat}
                          </span>
                        ))}
                        {conteudo.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Por: {conteudo.autor}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(conteudo)}
                        className="flex-1"
                      >
                        {conteudo.ativo ? (
                          <><Eye className="w-4 h-4 mr-1" /> Ativo</>
                        ) : (
                          <><EyeOff className="w-4 h-4 mr-1" /> Inativo</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(conteudo)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(conteudo.id)}
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

      {filteredConteudos.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum conteúdo cadastrado'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro conteúdo'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Conteúdo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}