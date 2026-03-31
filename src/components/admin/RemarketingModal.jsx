import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { enviarRemarketingEmail } from '@/functions/enviarRemarketingEmail';

export default function RemarketingModal({ onClose }) {
  const [totalQualificados, setTotalQualificados] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState('');
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    base44.entities.Inscricao.filter({ qualificado: true }).then(lista => {
      setTotalQualificados(lista.length);
    });
  }, []);

  const handleConfirmar = async () => {
    setEnviando(true);
    setProgresso('Iniciando envios...');
    try {
      const res = await enviarRemarketingEmail({});
      const data = res?.data || {};
      setResultado({
        enviados: data.enviados ?? 0,
        falhas: data.falhas ?? 0,
        total: data.total ?? 0,
      });
      setProgresso('');
    } catch (e) {
      setResultado({ erro: e.message });
      setProgresso('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget && !enviando) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 16, maxWidth: 520, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', padding: '20px 28px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>📣 Envio de Remarketing</h2>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Info */}
          <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>
            Esta ação enviará e-mail para todos os leads <strong>QUALIFICADOS</strong> cadastrados.
          </p>

          {/* Preview do e-mail */}
          <div style={{
            border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', fontSize: 12,
          }}>
            <div style={{ background: 'linear-gradient(135deg,#F97316,#3B82F6)', padding: '10px 16px', color: '#fff', fontWeight: 700 }}>
              Conecta Jovem
            </div>
            <div style={{ padding: '12px 16px', background: '#FAFAFA' }}>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#0F172A' }}>Olá, [Nome]! 👋</p>
              <p style={{ margin: '0 0 6px', color: '#374151' }}>Continue sua inscrição — envie seu vídeo de apresentação no WhatsApp.</p>
              <div style={{ background: '#25D366', color: '#fff', textAlign: 'center', padding: '8px', borderRadius: 8, fontWeight: 700 }}>
                📹 Envie seu vídeo agora
              </div>
            </div>
          </div>

          {/* Contador */}
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#15803D' }}>
              Total de destinatários:{' '}
              {totalQualificados === null ? '...' : `${totalQualificados} leads qualificados`}
            </span>
          </div>

          {/* Aviso */}
          <div style={{ background: '#FEFCE8', border: '1px solid #FDE047', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#854D0E', fontWeight: 600 }}>
              ⚠️ Esta ação enviará e-mails reais para todos os leads qualificados. Confirme antes de prosseguir.
            </p>
          </div>

          {/* Progresso */}
          {progresso && (
            <div style={{ textAlign: 'center', color: '#6D28D9', fontSize: 13, fontWeight: 600 }}>
              {progresso}
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div style={{
              background: resultado.erro ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${resultado.erro ? '#FECACA' : '#86EFAC'}`,
              borderRadius: 10, padding: '14px 16px',
            }}>
              {resultado.erro ? (
                <p style={{ margin: 0, color: '#DC2626', fontWeight: 600 }}>❌ Erro: {resultado.erro}</p>
              ) : (
                <>
                  <p style={{ margin: '0 0 4px', color: '#15803D', fontWeight: 700 }}>✅ Enviados com sucesso: {resultado.enviados}</p>
                  <p style={{ margin: '0 0 4px', color: '#DC2626', fontWeight: 600 }}>❌ Falhas: {resultado.falhas}</p>
                  <p style={{ margin: 0, color: '#475569', fontWeight: 600 }}>📊 Total processado: {resultado.total}</p>
                </>
              )}
            </div>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              onClick={onClose}
              disabled={enviando}
              style={{
                background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
                borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600,
                cursor: enviando ? 'not-allowed' : 'pointer', opacity: enviando ? 0.5 : 1,
              }}
            >
              Cancelar
            </button>
            {!resultado && (
              <button
                onClick={handleConfirmar}
                disabled={enviando || totalQualificados === null}
                style={{
                  background: enviando ? '#A78BFA' : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '10px 20px', fontSize: 13, fontWeight: 700,
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {enviando ? (
                  <>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Enviando...
                  </>
                ) : '🚀 Confirmar e Enviar'}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}