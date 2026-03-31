import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CertificadoPublico() {
  const [certificado, setCertificado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const codigo = parts[parts.length - 1];
    if (!codigo) { setNaoEncontrado(true); setLoading(false); return; }

    base44.entities.CertificadoEmitido.filter({ codigo_rastreio: codigo })
      .then(lista => {
        if (lista?.length > 0) {
          setCertificado(lista[0]);
        } else {
          setNaoEncontrado(true);
        }
        setLoading(false);
      });
  }, []);

  const formatarData = (dateStr) => {
    if (!dateStr) return '—';
    try { return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }); }
    catch { return dateStr; }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #E2E8F0', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748B', fontSize: 14 }}>Verificando certificado...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (naoEncontrado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #FEE2E2' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#DC2626', marginBottom: 8 }}>Certificado Não Encontrado</h1>
          <p style={{ fontSize: 14, color: '#64748B' }}>O código de rastreio informado não corresponde a nenhum certificado em nossa base de dados.</p>
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 16 }}>Verifique se o código está correto e tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 540, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.10)', border: '1px solid #BBF7D0', textAlign: 'center' }}>
        {/* Ícone */}
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
          ✅
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#064E3B', marginBottom: 6 }}>Certificado Válido</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>Este documento foi verificado com sucesso pela plataforma Conecta Jovem</p>

        {/* Informações */}
        <div style={{ background: '#F0FDF4', borderRadius: 14, padding: '20px 24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '👤', label: 'Aluno', value: certificado.nome_aluno },
            { icon: '📚', label: 'Curso', value: certificado.nome_curso },
            { icon: '📅', label: 'Concluído em', value: certificado.data_conclusao },
            { icon: '🔑', label: 'Código', value: certificado.codigo_rastreio },
            { icon: '📆', label: 'Emitido em', value: formatarData(certificado.created_at || certificado.created_date) },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 12, padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Documento Original Verificado</span>
        </div>

        {/* Rodapé */}
        <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
          © Conecta Jovem — Este certificado foi emitido e verificado pela plataforma Conecta Jovem
        </p>
      </div>
    </div>
  );
}