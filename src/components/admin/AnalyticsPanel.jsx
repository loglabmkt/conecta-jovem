import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subDays, isAfter, parseISO } from 'date-fns';
import { RefreshCw, Download } from 'lucide-react';
import AnalyticsSummaryCards from './AnalyticsSummaryCards';
import AnalyticsHeatmap from './AnalyticsHeatmap';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsTable from './AnalyticsTable';
import AnalyticsRanking from './AnalyticsRanking';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
];

const DEVICE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
];

const EVENT_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'CTA_PRIMARY', label: 'Inscreva-se' },
  { value: 'CTA_SECONDARY', label: 'Saiba mais' },
  { value: 'NAV_CLICK', label: 'Navegação' },
  { value: 'CARD_CLICK', label: 'Cards' },
  { value: 'GENERAL_CLICK', label: 'Geral' },
];

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
        active ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
      }`}
    >
      {children}
    </button>
  );
}

function exportCSV(events) {
  const headers = ['created_at','event_type','element_text','element_tag','device_type','session_id','x_percent','y_percent','section'];
  const rows = events.map(e => headers.map(h => JSON.stringify(e[h] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'analytics_cliques.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsPanel() {
  const [period, setPeriod] = useState('today');
  const [device, setDevice] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [heatOpacity, setHeatOpacity] = useState(60);
  const queryClient = useQueryClient();

  const { data: allEvents = [], isFetching } = useQuery({
    queryKey: ['click_events'],
    queryFn: () => base44.entities.ClickEvent.list('-created_at', 2000),
    refetchInterval: 30000,
  });

  // Filtro por período
  const periodFiltered = allEvents.filter(e => {
    if (!e.created_at) return false;
    const d = parseISO(e.created_at);
    const now = new Date();
    if (period === 'today') return isAfter(d, subDays(now, 1));
    if (period === '7d') return isAfter(d, subDays(now, 7));
    if (period === '30d') return isAfter(d, subDays(now, 30));
    return true;
  });

  // Filtro por device
  const deviceFiltered = device === 'all' ? periodFiltered : periodFiltered.filter(e => e.device_type === device);

  // Filtro por tipo de evento
  const filtered = eventType === 'all' ? deviceFiltered : deviceFiltered.filter(e => e.event_type === eventType);

  // Usuários ativos (clique nos últimos 5 min)
  const now = new Date();
  const activeSessions = new Set(
    allEvents
      .filter(e => e.created_at && (now - new Date(e.created_at)) < 5 * 60 * 1000)
      .map(e => e.session_id)
  ).size;

  const handleReset = () => { setPeriod('today'); setDevice('all'); setEventType('all'); };

  return (
    <div className="space-y-6">
      {/* Header ao vivo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-sm font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
            Ao vivo
          </span>
          <span className="text-sm text-gray-500">
            {activeSessions} sessão{activeSessions !== 1 ? 'ões' : ''} ativa{activeSessions !== 1 ? 's' : ''} (últimos 5 min)
          </span>
          {isFetching && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['click_events'] })}>
            <RefreshCw className="w-4 h-4 mr-1" /> Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
            <Download className="w-4 h-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <AnalyticsSummaryCards events={periodFiltered} />

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Período</p>
              <div className="flex gap-1.5">
                {PERIOD_OPTIONS.map(o => (
                  <FilterBtn key={o.value} active={period === o.value} onClick={() => setPeriod(o.value)}>{o.label}</FilterBtn>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Dispositivo</p>
              <div className="flex gap-1.5">
                {DEVICE_OPTIONS.map(o => (
                  <FilterBtn key={o.value} active={device === o.value} onClick={() => setDevice(o.value)}>{o.label}</FilterBtn>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Tipo de evento</p>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_OPTIONS.map(o => (
                  <FilterBtn key={o.value} active={eventType === o.value} onClick={() => setEventType(o.value)}>{o.label}</FilterBtn>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-orange-500 underline">Resetar filtros</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap + Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mapa de Calor de Cliques</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">Opacidade: {heatOpacity}%</span>
                <input
                  type="range" min={10} max={90} value={heatOpacity}
                  onChange={e => setHeatOpacity(Number(e.target.value))}
                  className="w-32 accent-orange-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <AnalyticsHeatmap events={filtered} opacity={heatOpacity} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top 10 Elementos</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsRanking events={filtered} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico temporal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cliques ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart events={periodFiltered} period={period} />
        </CardContent>
      </Card>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Eventos Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsTable events={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}