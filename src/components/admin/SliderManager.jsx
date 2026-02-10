import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, Image, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SliderForm from './SliderForm';

export default function SliderManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const queryClient = useQueryClient();

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const data = await base44.entities.Slider.list('ordem');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Slider.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, ativo }) => base44.entities.Slider.update(id, { ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, ordem }) => base44.entities.Slider.update(id, { ordem }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
    }
  });

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (slider) => {
    toggleActiveMutation.mutate({ id: slider.id, ativo: !slider.ativo });
  };

  const moveSlider = (index, direction) => {
    const newSliders = [...sliders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= sliders.length) return;
    
    [newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]];
    
    newSliders.forEach((slider, idx) => {
      updateOrderMutation.mutate({ id: slider.id, ordem: idx });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciar Slider da Home</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Banners full-screen sem texto sobreposto
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingSlider(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Slide
          </Button>
        </CardHeader>
      </Card>

      {isFormOpen && (
        <SliderForm
          slider={editingSlider}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSlider(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {sliders.map((slider, index) => (
            <motion.div
              key={slider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`${!slider.ativo ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Preview Desktop */}
                    <div className="flex-shrink-0">
                      <img 
                        src={slider.imagem_desktop}
                        alt="Preview Desktop"
                        className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">Desktop</p>
                    </div>

                    {/* Preview Mobile (se existir) */}
                    {slider.imagem_mobile && (
                      <div className="flex-shrink-0">
                        <img 
                          src={slider.imagem_mobile}
                          alt="Preview Mobile"
                          className="w-24 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-center">Mobile</p>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          Ordem: {slider.ordem}
                        </span>
                        {slider.link_destino && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            Clicável
                          </span>
                        )}
                        {!slider.imagem_mobile && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            Usa imagem desktop no mobile
                          </span>
                        )}
                      </div>
                      
                      {slider.link_destino && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Link:</strong> {slider.link_destino}
                        </p>
                      )}

                      <p className="text-xs text-gray-500">
                        ID: {slider.id}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleToggleActive(slider)}
                        title={slider.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {slider.ativo ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(slider)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(slider.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveSlider(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveSlider(index, 'down')}
                          disabled={index === sliders.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sliders.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum slide cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro banner para o slider da home
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}