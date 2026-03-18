import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format, startOfHour, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AnalyticsChart({ events, period }) {
  const data = useMemo(() => {
    const now = new Date();

    if (period === 'today') {
      // Agrupado por hora
      const hours = Array.from({ length: 24 }, (_, i) => {
        const d = new Date(now);
        d.setHours(i, 0, 0, 0);
        return { label: `${String(i).padStart(2, '0')}h`, total: 0, cta: 0, _hour: i };
      });
      events.forEach(e => {
        const d = parseISO(e.created_at);
        if (!isAfter(d, subDays(now, 1))) return;
        const h = d.getHours();
        if (hours[h]) {
          hours[h].total++;
          if (e.event_type === 'CTA_PRIMARY') hours[h].cta++;
        }
      });
      return hours;
    }

    // Agrupado por dia (7 ou 30)
    const days = period === '7d' ? 7 : 30;
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = subDays(now, days - 1 - i);
      return { label: format(d, 'dd/MM', { locale: ptBR }), total: 0, cta: 0, _date: d };
    });
    events.forEach(e => {
      const d = parseISO(e.created_at);
      const cutoff = subDays(now, days);
      if (!isAfter(d, cutoff)) return;
      const key = format(d, 'dd/MM', { locale: ptBR });
      const bucket = buckets.find(b => b.label === key);
      if (bucket) {
        bucket.total++;
        if (e.event_type === 'CTA_PRIMARY') bucket.cta++;
      }
    });
    return buckets;
  }, [events, period]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="total" name="Total" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="cta" name="Inscreva-se" stroke="#f97316" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}