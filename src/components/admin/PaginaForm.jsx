import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaginaForm({ pagina, onClose }) {
  const [formData, setFormData] = useState({
    titulo: pagina?.titulo || '',
    subtitulo: pagina?.subtitulo || '',
    slug: pagina?.slug || '',
    imagem_capa: pagina?.imagem_capa || '',
    video_ou_imagem_coluna: pagina?.video_ou_imagem_coluna || '',
    tipo_midia_coluna: pagina?.tipo_midia_coluna || 'imagem',
    texto_coluna_direita: pagina?.texto_coluna_direita || '',
    texto_adicional: pagina?.texto_adicional || '',
    ativo: pagina?.ativo !== undefined ? pagina.ativo : true,
    data_publicacao: pagina?.data_publicacao || new Date().toISOString()
  });

  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [uploadingMidia, setUploadingMidia] = useState(false);
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

      if (pagina) {
        return base44.entities.Pagina.update(pagina.id, data);
      } else {
        return base44.entities.Pagina.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['paginas']);
      onClose();
    }
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = field === 'imagem_capa' ? setUploadingCapa : setUploadingMidia;
    setUploading(true);
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, [field]: file_url });
    } catch (error) {
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{pagina ? 'Editar Página' : 'Nova Página'}</CardTitle>
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
              placeholder="Título da página"
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
            <label className="block text-sm font-medium mb-2">Slug (URL)</label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="sera-gerado-automaticamente"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para gerar automaticamente a partir do título
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Imagem de Capa *</label>
            <div className="flex gap-2">
              <Input
                value={formData.imagem_capa}
                onChange={(e) => setFormData({ ...formData, imagem_capa: e.target.value })}
                placeholder="URL da imagem de capa"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('capa-upload').click()} 
                disabled={uploadingCapa}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingCapa ? 'Enviando...' : 'Upload'}
              </Button>
              <input
                id="capa-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'imagem_capa')}
              />
            </div>
            {formData.imagem_capa && (
              <div className="mt-2">
                <img src={formData.imagem_capa} alt="Capa" className="w-full h-48 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Mídia na Coluna</label>
            <Select
              value={formData.tipo_midia_coluna}
              onValueChange={(value) => setFormData({ ...formData, tipo_midia_coluna: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imagem">Imagem</SelectItem>
                <SelectItem value="video">Vídeo (YouTube)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.tipo_midia_coluna === 'video' ? 'URL do Vídeo YouTube' : 'Imagem da Coluna'}
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.video_ou_imagem_coluna}
                onChange={(e) => setFormData({ ...formData, video_ou_imagem_coluna: e.target.value })}
                placeholder={formData.tipo_midia_coluna === 'video' ? 'https://youtube.com/watch?v=...' : 'URL da imagem'}
              />
              {formData.tipo_midia_coluna === 'imagem' && (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('midia-upload').click()} 
                    disabled={uploadingMidia}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingMidia ? 'Enviando...' : 'Upload'}
                  </Button>
                  <input
                    id="midia-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'video_ou_imagem_coluna')}
                  />
                </>
              )}
            </div>
            {formData.video_ou_imagem_coluna && (
              <div className="mt-2">
                {formData.tipo_midia_coluna === 'video' ? (
                  <iframe
                    src={getYouTubeEmbedUrl(formData.video_ou_imagem_coluna)}
                    className="w-full h-64 rounded"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img src={formData.video_ou_imagem_coluna} alt="Mídia" className="w-full h-48 object-cover rounded" />
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Texto da Coluna Direita *</label>
            <ReactQuill
              value={formData.texto_coluna_direita}
              onChange={(value) => setFormData({ ...formData, texto_coluna_direita: value })}
              className="bg-white rounded"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Texto Adicional (Abaixo das Colunas)</label>
            <ReactQuill
              value={formData.texto_adicional}
              onChange={(value) => setFormData({ ...formData, texto_adicional: value })}
              className="bg-white rounded"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ]
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pagina-ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="pagina-ativo" className="text-sm font-medium">Página ativa</label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Página'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}