import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, parseISO, isToday, isThisWeek, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, Calendar, TrendingUp, BarChart2, Search, Download, Mail, Phone, Copy, Check, RefreshCw, CheckCircle2 } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ORIGEM_CONFIG = {
  hero_desktop:    { label: '🖥 Desktop',   bg: '#DBEAFE', color: '#1D4ED8' },
  modal_mobile:    { label: '📱 Mobile',    bg: '#DCFCE7', color: '#15803D' },
  modal_cta:       { label: '🎯 CTA',       bg: '#FFEDD5', color: '#C2410C' },
  modal_flutuante: { label: '⚡ Flutuante',  bg: '#EDE9FE', color: '#6D28D9' },
};

const AVATAR_COLORS = {
  'ABCDEF':   'linear-gradient(135deg, #F97316, #EA580C)',
  'GHIJKL':   'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  'MNOPQR':   'linear-gradient(135deg, #8B5CF6, #6D28D9)',
  'STUVWXYZ': 'linear-gradient(135deg, #10B981, #059669)',
};

function getAvatarBg(name = '') {
  const letter = name.toUpperCase()[0] || 'A';
  for (const [letters, gradient] of Object.entries(AVATAR_COLORS)) {
    if (letters.includes(letter)) return gradient;
  }
  return 'linear-gradient(135deg, #F97316, #EA580C)';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try { return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }); }
  catch { return '—'; }
}

function exportCSV(data) {
  const headers = ['Nome', 'E-mail', 'WhatsApp', 'Origem', 'Data', 'Contatado'];
  const rows = data.map(d => [
    d.nome, d.email, d.whatsapp,
    ORIGEM_CONFIG[d.origem]?.label || d.origem,
    formatDate(d.created_at || d.created_date),
    d.contatado ? 'Sim' : 'Não',
  ].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'inscricoes.csv'; a.click();
  URL.revokeObjectURL(url);
}

function exportXLSX(data) {
  const headers = ['Nome', 'E-mail', 'WhatsApp', 'Origem', 'Data', 'Contatado'];
  const rows = data.map(d => [
    d.nome, d.email, d.whatsapp,
    ORIGEM_CONFIG[d.origem]?.label || d.origem,
    formatDate(d.created_at || d.created_date),
    d.contatado ? 'Sim' : 'Não',
  ].join('\t'));
  const tsv = [headers.join('\t'), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + tsv], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'inscricoes.xls'; a.click();
  URL.revokeObjectURL(url);
}

function openWhatsApp(inscricao) {
  const digits = (inscricao.whatsapp || '').replace(/\D/g, '');
  const phone = '55' + digits;
  const firstName = (inscricao.nome || '').split(' ')[0];
  const msg = `Olá ${firstName}! 👋 Somos do Conecta Jovem e vimos que você se inscreveu no nosso programa de formação em tecnologia. Ficamos muito felizes! 🚀 Vamos te passar todas as informações sobre as próximas etapas.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

const PAGE_SIZE = 30;

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, gradient, icon: Icon }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
    }}>
      <div style={{ background: gradient, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, opacity: 0.9 }}>{label}</span>
        <Icon style={{ color: '#fff', opacity: 0.8, width: 20, height: 20 }} />
      </div>
      <div style={{ padding: '12px 18px' }}>
        <p style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function InscricaoRow({ inscricao, onToggleContatado }) {
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);
  const origem = ORIGEM_CONFIG[inscricao.origem] || { label: inscricao.origem, bg: '#F1F5F9', color: '#475569' };
  const dateStr = formatDate(inscricao.created_at || inscricao.created_date);

  const handleCopy = () => {
    const text = [`Nome: ${inscricao.nome}`, `E-mail: ${inscricao.email}`, `WhatsApp: ${inscricao.whatsapp}`, `Inscrito em: ${dateStr}`].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleToggle = async () => {
    setToggling(true);
    await onToggleContatado(inscricao);
    setToggling(false);
  };

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 12, border: '1px solid #F1F5F9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.2s',
      flexWrap: 'wrap',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
    >
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: getAvatarBg(inscricao.nome),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 18, fontWeight: 700,
      }}>
        {(inscricao.nome || '?')[0].toUpperCase()}
      </div>

      {/* Name + contacts */}
      <div style={{ flex: '1 1 180px', minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {inscricao.nome}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px' }}>
          <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Mail style={{ width: 11, height: 11 }} /> {inscricao.email}
          </span>
          <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone style={{ width: 11, height: 11 }} /> {inscricao.whatsapp}
          </span>
          {inscricao.data_nascimento && (
            <span style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              🎂 {inscricao.data_nascimento}{inscricao.idade != null ? ` · ${inscricao.idade} anos` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Qualification badge */}
      {inscricao.qualificado === true && (
        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, flexShrink: 0, whiteSpace: 'nowrap' }}>✅ Qualificado</span>
      )}
      {inscricao.qualificado === false && (
        <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, flexShrink: 0, whiteSpace: 'nowrap' }}>❌ Fora do perfil</span>
      )}
      {!inscricao.email_enviado && inscricao.email_enviado !== undefined && (
        <span title="E-mail não enviado" style={{ fontSize: 14 }}>⚠️</span>
      )}

      {/* Origin badge */}
      <span style={{
        background: origem.bg, color: origem.color,
        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>
        {origem.label}
      </span>

      {/* Date */}
      <span style={{ fontSize: 12, color: '#94A3B8', flexShrink: 0, whiteSpace: 'nowrap' }}>
        📅 {dateStr}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => openWhatsApp(inscricao)}
          style={{
            background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
            padding: '7px 14px', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          <WhatsAppIcon /> WhatsApp
        </button>

        <button onClick={handleCopy} style={{
          background: copied ? '#DCFCE7' : '#F1F5F9',
          color: copied ? '#15803D' : '#475569',
          border: '1px solid #E2E8F0', borderRadius: 8,
          padding: '7px 12px', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          whiteSpace: 'nowrap',
        }}>
          {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>

        {/* Contatado toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={inscricao.contatado ? 'Desfazer: mover de volta para Leads' : 'Marcar como contatado'}
          style={{
            background: inscricao.contatado ? '#DCFCE7' : '#F8FAFC',
            color: inscricao.contatado ? '#15803D' : '#64748B',
            border: `1.5px solid ${inscricao.contatado ? '#86EFAC' : '#E2E8F0'}`,
            borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            transition: 'all 0.2s', whiteSpace: 'nowrap', opacity: toggling ? 0.6 : 1,
          }}
        >
          <CheckCircle2 style={{ width: 14, height: 14 }} />
          {inscricao.contatado ? 'Contatado' : 'Contatar?'}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function InscricoesManager() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [qualFilter, setQualFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('leads');
  const [lastCount, setLastCount] = useState(null);
  const [toast, setToast] = useState(null);
  const listRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: inscricoes = [], isLoading, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['inscricoes-manager'],
    queryFn: () => base44.entities.Inscricao.list('-created_date', 2000),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (lastCount !== null && inscricoes.length > lastCount) {
      const newest = inscricoes[0];
      setToast(`🎉 Nova inscrição! ${newest?.nome || ''} acabou de se inscrever`);
      setTimeout(() => setToast(null), 5000);
    }
    setLastCount(inscricoes.length);
  }, [inscricoes.length]);

  const handleToggleContatado = async (inscricao) => {
    await base44.entities.Inscricao.update(inscricao.id, { contatado: !inscricao.contatado });
    queryClient.invalidateQueries({ queryKey: ['inscricoes-manager'] });
  };

  // Metrics
  const today = new Date();
  const totalCount = inscricoes.length;
  const todayCount = inscricoes.filter(i => { const d = i.created_date || i.created_at; return d && isToday(parseISO(d)); }).length;
  const weekCount = inscricoes.filter(i => { const d = i.created_date || i.created_at; return d && isThisWeek(parseISO(d), { locale: ptBR }); }).length;
  const prevWeekStart = startOfWeek(subWeeks(today, 1), { locale: ptBR });
  const prevWeekEnd = endOfWeek(subWeeks(today, 1), { locale: ptBR });
  const prevWeekCount = inscricoes.filter(i => {
    const d = i.created_date || i.created_at;
    if (!d) return false;
    const dt = parseISO(d);
    return dt >= prevWeekStart && dt <= prevWeekEnd;
  }).length;
  const growth = prevWeekCount === 0 ? 100 : Math.round(((weekCount - prevWeekCount) / prevWeekCount) * 100);

  const naoContatados = inscricoes.filter(i => !i.contatado);
  const contatados = inscricoes.filter(i => i.contatado);
  const source = activeTab === 'leads' ? naoContatados : contatados;

  const filtered = source.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (i.nome || '').toLowerCase().includes(q) ||
      (i.email || '').toLowerCase().includes(q) ||
      (i.whatsapp || '').includes(q);
    const d = i.created_date || i.created_at;
    let matchPeriod = true;
    if (period === 'today') matchPeriod = d && isToday(parseISO(d));
    else if (period === '7d') matchPeriod = d && isThisWeek(parseISO(d), { locale: ptBR });
    else if (period === '30d') { const limit = new Date(); limit.setDate(limit.getDate() - 30); matchPeriod = d && parseISO(d) >= limit; }
    let matchQual = true;
    if (qualFilter === 'qualified') matchQual = i.qualificado === true;
    else if (qualFilter === 'unqualified') matchQual = i.qualificado === false;
    return matchSearch && matchPeriod && matchQual;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (p) => {
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updatedLabel = dataUpdatedAt
    ? format(new Date(dataUpdatedAt), "'🟢 Atualizado às' HH:mm", { locale: ptBR })
    : '';

  return (
    <div style={{ background: '#F8FAFC', minHeight: '80vh', padding: '4px 0' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: '#F0FDF4', border: '1px solid #86EFAC',
          borderRadius: 12, padding: '14px 20px',
          fontSize: 14, fontWeight: 600, color: '#15803D',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: 340,
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>Inscrições</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>{updatedLabel}</span>
          <button onClick={() => refetch()} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, color: '#475569',
          }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Atualizar
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <MetricCard label="Total de Inscrições" value={totalCount} gradient="linear-gradient(135deg, #3B82F6, #1D4ED8)" icon={Users} />
        <MetricCard label="Inscrições Hoje" value={todayCount} gradient="linear-gradient(135deg, #F97316, #EA580C)" icon={Calendar} />
        <MetricCard label="Leads Qualificados" value={inscricoes.filter(i => i.qualificado === true).length} gradient="linear-gradient(135deg, #10B981, #059669)" icon={TrendingUp} />
        <MetricCard label="Fora do Perfil" value={inscricoes.filter(i => i.qualificado === false).length} gradient="linear-gradient(135deg, #EF4444, #DC2626)" icon={BarChart2} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: '#F1F5F9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[
          { key: 'leads', label: '📋 Novos Leads', count: naoContatados.length },
          { key: 'relacionamento', label: '✅ Relacionamento', count: contatados.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); }}
            style={{
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#0F172A' : '#64748B',
              border: 'none', borderRadius: 9, padding: '9px 18px',
              fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.key ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#CBD5E1',
              color: '#fff', fontSize: 11, fontWeight: 700,
              borderRadius: 20, padding: '2px 8px', minWidth: 24, textAlign: 'center',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #F1F5F9',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: '16px 20px',
        marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94A3B8' }} />
          <input
            placeholder="Buscar por nome, e-mail ou WhatsApp..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
              border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13,
              color: '#1E293B', outline: 'none', boxSizing: 'border-box', background: '#F8FAFC',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 4 }}>
          {[['all','Todos'],['qualified','✅ Qualificados'],['unqualified','❌ Fora do perfil']].map(([val, lbl]) => (
            <button key={val} onClick={() => { setQualFilter(val); setPage(1); }} style={{
              background: qualFilter === val ? '#fff' : 'transparent',
              color: qualFilter === val ? '#0F172A' : '#64748B',
              border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12,
              fontWeight: qualFilter === val ? 700 : 500, cursor: 'pointer',
              boxShadow: qualFilter === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{lbl}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 4 }}>
          {[['all','Todos'],['today','Hoje'],['7d','7 dias'],['30d','30 dias']].map(([val, lbl]) => (
            <button key={val} onClick={() => { setPeriod(val); setPage(1); }} style={{
              background: period === val ? '#fff' : 'transparent',
              color: period === val ? '#0F172A' : '#64748B',
              border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12,
              fontWeight: period === val ? 700 : 500, cursor: 'pointer',
              boxShadow: period === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>{lbl}</button>
          ))}
        </div>

        <button onClick={() => exportCSV(filtered)} style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          padding: '9px 14px', fontSize: 13, fontWeight: 600, color: '#475569',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Download style={{ width: 14, height: 14 }} /> CSV
        </button>
        <button onClick={() => exportXLSX(filtered)} style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          padding: '9px 14px', fontSize: 13, fontWeight: 600, color: '#475569',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Download style={{ width: 14, height: 14 }} /> Excel
        </button>

        <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          Exibindo {paginated.length} de {filtered.length} inscrições
        </span>
      </div>

      {/* List */}
      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8', fontSize: 14 }}>Carregando inscrições...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{activeTab === 'relacionamento' ? '✅' : '👤'}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              {activeTab === 'relacionamento' ? 'Nenhum lead contatado ainda' : 'Nenhuma inscrição encontrada'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748B' }}>
              {activeTab === 'relacionamento'
                ? 'Marque leads como contatados usando o botão ✅ na aba Novos Leads'
                : 'As inscrições realizadas na landing page aparecerão aqui automaticamente'}
            </p>
          </div>
        ) : (
          paginated.map(i => (
            <InscricaoRow key={i.id} inscricao={i} onToggleContatado={handleToggleContatado} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
          <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '8px 16px', fontSize: 13, fontWeight: 600,
            color: page === 1 ? '#CBD5E1' : '#475569', cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}>← Anterior</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
              acc.push(p); return acc;
            }, [])
            .map((p, idx) => p === '...' ? (
              <span key={`e-${idx}`} style={{ color: '#94A3B8', padding: '0 4px' }}>…</span>
            ) : (
              <button key={p} onClick={() => handlePageChange(p)} style={{
                background: p === page ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#fff',
                color: p === page ? '#fff' : '#475569',
                border: p === page ? 'none' : '1px solid #E2E8F0',
                borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', minWidth: 38,
              }}>{p}</button>
            ))
          }

          <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)} style={{
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '8px 16px', fontSize: 13, fontWeight: 600,
            color: page === totalPages ? '#CBD5E1' : '#475569',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}>Próximo →</button>
        </div>
      )}
    </div>
  );
}