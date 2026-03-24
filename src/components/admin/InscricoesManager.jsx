import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ORIGEM_LABEL = {
  hero_desktop: 'Hero Desktop',
  modal_mobile: 'Modal Mobile',
  modal_cta: 'Botão CTA',
  modal_flutuante: 'Botão Flutuante',
};

const ORIGEM_COLOR = {
  hero_desktop: 'bg-blue-100 text-blue-700',
  modal_mobile: 'bg-purple-100 text-purple-700',
  modal_cta: 'bg-orange-100 text-orange-700',
  modal_flutuante: 'bg-green-100 text-green-700',
};

function exportCSV(data) {
  const headers = ['Nome', 'E-mail', 'WhatsApp', 'Origem', 'Data'];
  const rows = data.map(d => [
    d.nome, d.email, d.whatsapp,
    ORIGEM_LABEL[d.origem] || d.origem,
    d.created_at ? format(parseISO(d.created_at), 'dd/MM/yyyy HH:mm') : ''
  ].map(v => `"${v || ''}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'inscricoes.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function InscricoesManager() {
  const [search, setSearch] = useState('');

  const { data: inscricoes = [], isLoading } = useQuery({
    queryKey: ['inscricoes'],
    queryFn: () => base44.entities.Inscricao.list('-created_at', 2000),
  });

  const filtered = inscricoes.filter(i =>
    (i.nome || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.whatsapp || '').includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: inscricoes.length, color: 'from-orange-500 to-yellow-500' },
          { label: 'Desktop', value: inscricoes.filter(i => i.origem === 'hero_desktop').length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Mobile', value: inscricoes.filter(i => i.origem === 'modal_mobile').length, color: 'from-purple-500 to-pink-500' },
          { label: 'Via CTA', value: inscricoes.filter(i => ['modal_cta','modal_flutuante'].includes(i.origem)).length, color: 'from-green-500 to-emerald-500' },
        ].map(s => (
          <Card key={s.label} className="overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${s.color} text-white py-3 px-4`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold">{s.label}</CardTitle>
                <Users className="w-4 h-4 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Lista de Inscrições</CardTitle>
            <div className="flex gap-2">
              <input
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-orange-400 w-48"
              />
              <Button size="sm" variant="outline" onClick={() => exportCSV(filtered)}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Carregando...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nome', 'E-mail', 'WhatsApp', 'Origem', 'Data'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs text-gray-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr key={i.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{i.nome}</td>
                      <td className="px-4 py-2.5 text-gray-600">{i.email}</td>
                      <td className="px-4 py-2.5 text-gray-600">{i.whatsapp}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORIGEM_COLOR[i.origem] || 'bg-gray-100 text-gray-600'}`}>
                          {ORIGEM_LABEL[i.origem] || i.origem}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                        {i.created_at ? format(parseISO(i.created_at), 'dd/MM/yy HH:mm', { locale: ptBR }) : '—'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhuma inscrição encontrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}