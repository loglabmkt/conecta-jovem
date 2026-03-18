import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 20;

const EVENT_BADGE = {
  CTA_PRIMARY: 'bg-orange-100 text-orange-700',
  CTA_SECONDARY: 'bg-yellow-100 text-yellow-700',
  NAV_CLICK: 'bg-blue-100 text-blue-700',
  CARD_CLICK: 'bg-purple-100 text-purple-700',
  GENERAL_CLICK: 'bg-gray-100 text-gray-600',
};

export default function AnalyticsTable({ events }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter(e =>
      (e.event_type || '').toLowerCase().includes(q) ||
      (e.element_text || '').toLowerCase().includes(q) ||
      (e.element_tag || '').toLowerCase().includes(q)
    );
  }, [events, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ k }) => (
    <span className="inline-flex flex-col ml-1">
      {sortKey === k && sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 opacity-40" />}
    </span>
  );

  return (
    <div className="space-y-3">
      <Input
        placeholder="Buscar por tipo, elemento..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="max-w-xs"
      />

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {[
                { key: 'created_at', label: 'Data/Hora' },
                { key: 'event_type', label: 'Tipo' },
                { key: 'element_text', label: 'Elemento' },
                { key: 'device_type', label: 'Dispositivo' },
                { key: 'session_id', label: 'Sessão' },
                { key: 'x_percent', label: 'X%' },
                { key: 'y_percent', label: 'Y%' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2 text-left cursor-pointer hover:bg-gray-100 whitespace-nowrap select-none"
                >
                  {col.label}<SortIcon k={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(e => (
              <tr
                key={e.id}
                className={`border-t border-gray-100 hover:bg-gray-50 ${e.event_type === 'CTA_PRIMARY' ? 'bg-orange-50' : ''}`}
              >
                <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
                  {e.created_at ? format(parseISO(e.created_at), 'dd/MM HH:mm', { locale: ptBR }) : '—'}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${EVENT_BADGE[e.event_type] || 'bg-gray-100 text-gray-600'}`}>
                    {e.event_type}
                  </span>
                </td>
                <td className="px-3 py-2 max-w-[160px] truncate text-gray-700">
                  {e.element_text || e.element_tag || '—'}
                </td>
                <td className="px-3 py-2 text-gray-600 capitalize">{e.device_type || '—'}</td>
                <td className="px-3 py-2 text-gray-400 text-xs font-mono">
                  {e.session_id ? '…' + e.session_id.slice(-6) : '—'}
                </td>
                <td className="px-3 py-2 text-gray-500">{e.x_percent ?? '—'}</td>
                <td className="px-3 py-2 text-gray-500">{e.y_percent ?? '—'}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">Nenhum evento encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-40">← Ant</button>
          <span className="text-gray-600">Pág. {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-40">Próx →</button>
        </div>
      )}
    </div>
  );
}