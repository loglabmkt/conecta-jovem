import React, { useMemo, useState } from 'react';

const CANVAS_W = 390;
const CANVAS_H = 844;
const CLUSTER_RADIUS = 20;

function clusterPoints(events) {
  const points = events.map(e => ({
    x: (e.x_percent / 100) * CANVAS_W,
    y: (e.y_percent / 100) * CANVAS_H,
    type: e.event_type,
    text: e.element_text,
    ts: e.created_at,
  }));

  const clusters = [];
  const used = new Set();

  points.forEach((p, i) => {
    if (used.has(i)) return;
    const cluster = { x: p.x, y: p.y, count: 1, types: [p.type], texts: [p.text] };
    points.forEach((q, j) => {
      if (i === j || used.has(j)) return;
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      if (Math.sqrt(dx * dx + dy * dy) <= CLUSTER_RADIUS) {
        cluster.count++;
        cluster.types.push(q.type);
        cluster.texts.push(q.text);
        used.add(j);
      }
    });
    used.add(i);
    clusters.push(cluster);
  });

  return clusters;
}

function heatColor(count, maxCount) {
  const ratio = Math.min(count / Math.max(maxCount, 1), 1);
  if (ratio < 0.33) return `rgba(59,130,246,${0.4 + ratio})`;
  if (ratio < 0.66) return `rgba(234,179,8,${0.5 + ratio * 0.4})`;
  return `rgba(239,68,68,${0.6 + ratio * 0.4})`;
}

export default function AnalyticsHeatmap({ events, opacity }) {
  const [tooltip, setTooltip] = useState(null);

  const clusters = useMemo(() => clusterPoints(events), [events]);
  const maxCount = useMemo(() => Math.max(...clusters.map(c => c.count), 1), [clusters]);

  return (
    <div
      className="relative mx-auto"
      style={{ width: CANVAS_W, maxWidth: '100%', height: CANVAS_H, background: '#1a1a2e', borderRadius: 12, overflow: 'hidden' }}
    >
      {/* Grade de fundo */}
      <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i * CANVAS_H) / 20} x2={CANVAS_W} y2={(i * CANVAS_H) / 20} stroke="white" strokeWidth={1} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={(i * CANVAS_W) / 10} y1={0} x2={(i * CANVAS_W) / 10} y2={CANVAS_H} stroke="white" strokeWidth={1} />
        ))}
      </svg>

      {/* Labels de seção */}
      {[
        { label: 'Hero', y: 0.05 },
        { label: 'Sobre', y: 0.22 },
        { label: 'Galeria', y: 0.38 },
        { label: 'Requisitos', y: 0.54 },
        { label: 'Benefícios', y: 0.70 },
        { label: 'Inscrição', y: 0.85 },
      ].map(s => (
        <div
          key={s.label}
          style={{ position: 'absolute', left: 8, top: s.y * CANVAS_H, color: 'rgba(255,255,255,0.25)', fontSize: 10, pointerEvents: 'none' }}
        >
          {s.label}
        </div>
      ))}

      {/* Pontos de calor */}
      {clusters.map((c, i) => {
        const r = Math.max(8, Math.min(28, 8 + (c.count / maxCount) * 20));
        const color = heatColor(c.count, maxCount);
        return (
          <div
            key={i}
            onMouseEnter={() => setTooltip({ ...c, i })}
            onMouseLeave={() => setTooltip(null)}
            style={{
              position: 'absolute',
              left: c.x - r,
              top: c.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: color,
              opacity: opacity / 100,
              cursor: 'pointer',
              transition: 'transform 0.15s',
              zIndex: 2,
            }}
          />
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 12, CANVAS_W - 170),
            top: Math.max(tooltip.y - 60, 4),
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 11,
            zIndex: 10,
            minWidth: 160,
            pointerEvents: 'none',
          }}
        >
          <p className="font-bold">{tooltip.count} clique{tooltip.count > 1 ? 's' : ''}</p>
          <p style={{ opacity: 0.7 }}>{tooltip.texts.filter(Boolean)[0]?.slice(0, 40) || 'sem texto'}</p>
          <p style={{ opacity: 0.5 }}>Tipo: {[...new Set(tooltip.types)].join(', ')}</p>
        </div>
      )}

      {events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
          Nenhum clique registrado ainda
        </div>
      )}
    </div>
  );
}