import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Plus } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function ConteudoForm({ conteudo, onClose }) {
  const [formData, setFormData] = useState({
    titulo: conteudo?.titulo || '',
    subtitulo: conteudo?.subtitulo || '',
    texto: conteudo?.texto || '',
    imagem_capa: conteudo?.imagem_capa || '',
    categorias: conteudo?.categorias || [],
    tags: conteudo?.tags || [],
    autor: conteudo?.autor || 'Equipe Conecta Jovem',
    data_publicacao: conteudo?.data_publicacao || new Date().toISOString(),
    slug: conteudo?.slug || '',
    ativo: conteudo?.ativo !== undefined ? conteudo.ativo : true
  });

  const [newCategoria, setNewCategoria] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      // Generate slug from title if not exists
      if (!data.slug) {
        data.slug = data.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      if (conteudo) {
        return base44.entities.Conteudo.update(conteudo.id, data);
      } else {
        return base44.entities.Conteudo.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conteudos']);
      onClose();
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, imagem_capa: file_url });
    } catch (error) {
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const addCategoria = () => {
    if (newCategoria && !formData.categorias.includes(newCategoria)) {
      setFormData({ 
        ...formData, 
        categorias: [...formData.categorias, newCategoria] 
      });
      setNewCategoria('');
    }
  };

  const removeCategoria = (cat) => {
    setFormData({
      ...formData,
      categorias: formData.categorias.filter(c => c !== cat)
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ 
        ...formData, 
        tags: [...formData.tags, newTag] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{conteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título *</label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título do conteúdo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtítulo</label>
            <Input
              value={formData.subtitulo}
              onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
              placeholder="Subtítulo (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Imagem de Capa *</label>
            <div className="flex gap-2">
              <Input
                value={formData.imagem_capa}
                onChange={(e) => setFormData({ ...formData, imagem_capa: e.target.value })}
                placeholder="URL da imagem ou faça upload"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('conteudo-file-upload').click()} 
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : 'Upload'}
              </Button>
              <input
                id="conteudo-file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            {formData.imagem_capa && (
              <div className="mt-2">
                <img src={formData.imagem_capa} alt="Preview" className="w-full h-48 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Texto *</label>
            <div className="quill-editor-wrapper">
              <ReactQuill
                value={formData.texto}
                onChange={(value) => setFormData({ ...formData, texto: value })}
                className="bg-white rounded"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
            </div>
            <style>{`
              .quill-editor-wrapper .ql-container {
                min-height: 200px;
                font-size: 16px;
              }
              .quill-editor-wrapper .ql-editor {
                min-height: 200px;
              }
              .quill-editor-wrapper .ql-toolbar {
                background: #f9fafb;
                border-radius: 0.5rem 0.5rem 0 0;
              }
              .quill-editor-wrapper .ql-container {
                border-radius: 0 0 0.5rem 0.5rem;
              }
            `}</style>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Categorias</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value)}
                  placeholder="Nova categoria"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategoria())}
                />
                <Button type="button" size="icon" onClick={addCategoria}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categorias.map((cat) => (
                  <span 
                    key={cat} 
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-orange-200"
                    onClick={() => removeCategoria(cat)}
                  >
                    {cat} <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" size="icon" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Autor</label>
            <Input
              value={formData.autor}
              onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
              placeholder="Nome do autor"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="conteudo-ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="conteudo-ativo" className="text-sm font-medium">Conteúdo ativo</label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Conteúdo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}