import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointer, Target, Users, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsSummaryCards({ events }) {
  const total = events.length;

  const ctaPrimary = events.filter(e => e.event_type === 'CTA_PRIMARY').length;

  const uniqueSessions = new Set(events.map(e => e.session_id)).size;

  const conversionRate = uniqueSessions > 0
    ? ((ctaPrimary / uniqueSessions) * 100).toFixed(1)
    : '0.0';

  const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 };
  events.forEach(e => {
    if (deviceCounts[e.device_type] !== undefined) deviceCounts[e.device_type]++;
  });
  const topDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0];
  const topDevicePct = total > 0 ? ((topDevice[1] / total) * 100).toFixed(0) : 0;

  const stats = [
    {
      title: 'Total de Cliques',
      value: total.toLocaleString('pt-BR'),
      subtitle: 'todos os eventos',
      icon: MousePointer,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Cliques Inscreva-se',
      value: ctaPrimary.toLocaleString('pt-BR'),
      subtitle: `${conversionRate}% de conversão`,
      icon: Target,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Sessões Únicas',
      value: uniqueSessions.toLocaleString('pt-BR'),
      subtitle: 'visitantes distintos',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Dispositivo Líder',
      value: topDevice[0].charAt(0).toUpperCase() + topDevice[0].slice(1),
      subtitle: `${topDevicePct}% dos cliques`,
      icon: Smartphone,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${stat.color} text-white py-4 px-5`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{stat.title}</CardTitle>
                <stat.icon className="w-6 h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4 px-5">
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}