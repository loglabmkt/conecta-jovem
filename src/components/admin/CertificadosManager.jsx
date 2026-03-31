import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CertificadoTemplateForm from './CertificadoTemplateForm';
import EmitirCertificadoForm from './EmitirCertificadoForm';

export default function CertificadosManager() {
  const [aba, setAba] = useState('emitir');
  const [formAberto, setFormAberto] = useState(false);
  const [templateEditando, setTemplateEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['certificado-templates'],
    queryFn: () => base44.entities.CertificadoTemplate.list('-created_date', 100),
  });

  const handleNovo = () => { setTemplateEditando(null); setFormAberto(true); };
  const handleEditar = (t) => { setTemplateEditando(t); setFormAberto(true); };
  const handleExcluir = async (id) => {
    if (!confirm('Excluir este template?')) return;
    await base44.entities.CertificadoTemplate.delete(id);
    queryClient.invalidateQueries({ queryKey: ['certificado-templates'] });
  };
  const handleSalvo = () => {
    setFormAberto(false);
    setTemplateEditando(null);
    queryClient.invalidateQueries({ queryKey: ['certificado-templates'] });
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '60vh' }}>
      {/* Cabeçalho + Abas */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>📄 Certificados</h2>
        <div style={{ display: 'flex', gap: 0, background: '#F1F5F9', borderRadius: 12, padding: 4 }}>
          {[
            { key: 'emitir', label: '📄 Emitir Certificado' },
            { key: 'templates', label: `🎨 Templates (${templates.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setAba(tab.key); setFormAberto(false); }} style={{
              background: aba === tab.key ? '#fff' : 'transparent',
              color: aba === tab.key ? '#0F172A' : '#64748B',
              border: 'none', borderRadius: 9, padding: '9px 18px',
              fontSize: 13, fontWeight: aba === tab.key ? 700 : 500,
              cursor: 'pointer', boxShadow: aba === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      {aba === 'emitir' && <EmitirCertificadoForm />}

      {aba === 'templates' && (
        <>
          {formAberto ? (
            <CertificadoTemplateForm
              template={templateEditando}
              onSalvo={handleSalvo}
              onCancelar={() => { setFormAberto(false); setTemplateEditando(null); }}
            />
          ) : (
            <div>
              {/* Botão novo template */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button onClick={handleNovo} style={{
                  background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13,
                  fontWeight: 700, cursor: 'pointer',
                }}>+ Novo Template</button>
              </div>

              {isLoading && <p style={{ textAlign: 'center', color: '#94A3B8', padding: 40 }}>Carregando...</p>}

              {!isLoading && templates.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>🎨</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Nenhum template criado</h3>
                  <p style={{ fontSize: 14, color: '#64748B' }}>Crie seu primeiro template para começar a emitir certificados.</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {templates.map(t => (
                  <div key={t.id} style={{
                    background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0',
                    overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                  }}>
                    {/* Miniatura */}
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#F1F5F9', position: 'relative', overflow: 'hidden' }}>
                      {t.imagem_fundo_url
                        ? <img src={t.imagem_fundo_url} alt={t.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', fontSize: 12 }}>Sem imagem</div>
                      }
                      {t.verso_habilitado && (
                        <span style={{ position: 'absolute', top: 8, right: 8, background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                          Com verso
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', margin: '0 0 12px' }}>{t.nome}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEditar(t)} style={{
                          flex: 1, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE',
                          borderRadius: 8, padding: '7px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>✏️ Editar</button>
                        <button onClick={() => handleExcluir(t.id)} style={{
                          flex: 1, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
                          borderRadius: 8, padding: '7px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>🗑️ Excluir</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}