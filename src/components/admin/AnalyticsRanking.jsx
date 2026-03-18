import React, { useMemo } from 'react';

const BADGE = {
  CTA_PRIMARY: { label: 'CTA', color: 'bg-orange-500' },
  CTA_SECONDARY: { label: 'CTA', color: 'bg-yellow-500' },
  NAV_CLICK: { label: 'NAV', color: 'bg-blue-500' },
  CARD_CLICK: { label: 'CARD', color: 'bg-purple-500' },
  GENERAL_CLICK: { label: 'GERAL', color: 'bg-gray-400' },
};

export default function AnalyticsRanking({ events }) {
  const ranking = useMemo(() => {
    const map = {};
    events.forEach(e => {
      const key = (e.element_text?.trim().slice(0, 60) || e.element_tag || 'desconhecido');
      if (!map[key]) map[key] = { text: key, count: 0, type: e.event_type };
      map[key].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [events]);

  const maxCount = ranking[0]?.count || 1;

  return (
    <div className="space-y-3">
      {ranking.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhum dado disponível</p>}
      {ranking.map((item, i) => {
        const badge = BADGE[item.type] || BADGE.GENERAL_CLICK;
        const pct = ((item.count / maxCount) * 100).toFixed(0);
        const totalPct = ((item.count / events.length) * 100).toFixed(1);
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-5 text-right font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded text-white font-bold ${badge.color}`}>{badge.label}</span>
                <span className="text-sm text-gray-700 truncate">{item.text}</span>
                <span className="ml-auto text-xs text-gray-500 shrink-0">{item.count} ({totalPct}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}