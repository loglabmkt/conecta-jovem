import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

export default function SliderForm({ slider, onClose }) {
  const [formData, setFormData] = useState({
    imagem_desktop: slider?.imagem_desktop || '',
    imagem_mobile: slider?.imagem_mobile || '',
    link_destino: slider?.link_destino || '',
    ordem: slider?.ordem || 0,
    ativo: slider?.ativo !== undefined ? slider.ativo : true
  });

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (slider) {
        return base44.entities.Slider.update(slider.id, data);
      } else {
        return base44.entities.Slider.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
      onClose();
    }
  });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'desktop') {
      setUploadingDesktop(true);
    } else {
      setUploadingMobile(true);
    }

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'desktop') {
        setFormData({ ...formData, imagem_desktop: file_url });
      } else {
        setFormData({ ...formData, imagem_mobile: file_url });
      }
    } catch (error) {
      alert('Erro ao fazer upload do arquivo');
    } finally {
      if (type === 'desktop') {
        setUploadingDesktop(false);
      } else {
        setUploadingMobile(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{slider ? 'Editar Slide' : 'Novo Slide'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Imagem Desktop */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagem Desktop * <span className="text-xs text-gray-500">(Hero Widescreen)</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.imagem_desktop}
                onChange={(e) => setFormData({ ...formData, imagem_desktop: e.target.value })}
                placeholder="URL da imagem desktop ou faça upload"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('desktop-upload').click()} 
                disabled={uploadingDesktop}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingDesktop ? 'Enviando...' : 'Upload'}
              </Button>
              <input
                id="desktop-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'desktop')}
              />
            </div>
            {formData.imagem_desktop && (
              <div className="mt-3">
                <img 
                  src={formData.imagem_desktop} 
                  alt="Preview Desktop" 
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" 
                />
                <p className="text-xs text-gray-500 mt-1">Preview: Imagem Desktop</p>
              </div>
            )}
          </div>

          {/* Imagem Mobile */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Imagem Mobile <span className="text-xs text-gray-500">(Opcional - Referência: 1350px)</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.imagem_mobile}
                onChange={(e) => setFormData({ ...formData, imagem_mobile: e.target.value })}
                placeholder="URL da imagem mobile (deixe vazio para usar desktop)"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('mobile-upload').click()} 
                disabled={uploadingMobile}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingMobile ? 'Enviando...' : 'Upload'}
              </Button>
              <input
                id="mobile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'mobile')}
              />
            </div>
            {formData.imagem_mobile && (
              <div className="mt-3">
                <img 
                  src={formData.imagem_mobile} 
                  alt="Preview Mobile" 
                  className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200 mx-auto" 
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Preview: Imagem Mobile</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              💡 Se não enviar imagem mobile, será usada a imagem desktop adaptada responsivamente.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Link Destino */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Link de Destino <span className="text-xs text-gray-500">(Opcional)</span>
              </label>
              <Input
                value={formData.link_destino}
                onChange={(e) => setFormData({ ...formData, link_destino: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">Se preenchido, o slide será clicável</p>
            </div>

            {/* Ordem */}
            <div>
              <label className="block text-sm font-medium mb-2">Ordem</label>
              <Input
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
            </div>
          </div>

          {/* Ativo */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="ativo" className="text-sm font-medium">
              Slide ativo (visível no site)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Slide'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}