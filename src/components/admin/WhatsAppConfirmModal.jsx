import React from 'react';

export default function WhatsAppConfirmModal({ inscricao, onConfirm, onCancel, loading }) {
  if (!inscricao) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, padding: 32,
          maxWidth: 400, width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 12, textAlign: 'center' }}>💬</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', textAlign: 'center', marginBottom: 8 }}>
          Enviar mensagem WhatsApp
        </h3>
        <p style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 20 }}>
          Você está prestes a enviar o template <strong>jovem_inscricao</strong> para:
        </p>

        <div style={{
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          borderRadius: 10, padding: '12px 16px', marginBottom: 24,
        }}>
          <p style={{ margin: '0 0 6px', fontSize: 14, color: '#0F172A', fontWeight: 600 }}>
            👤 {inscricao.nome}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
            📱 {inscricao.whatsapp}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: 'none', background: '#F1F5F9',
              color: '#475569', fontWeight: 600, fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10,
              border: 'none', background: '#25D366',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block',
                }} />
                Enviando...
              </>
            ) : '✅ Confirmar envio'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}