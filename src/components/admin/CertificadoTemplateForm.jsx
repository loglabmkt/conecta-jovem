import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const TEXTO_PADRAO = 'Certificamos que {full_name} concluiu com êxito\no curso {course_name} em {completion_date}.';

export default function CertificadoTemplateForm({ template, onSalvo, onCancelar }) {
  const [aba, setAba] = useState('frente');
  const [nome, setNome] = useState('');
  const [imagemFundoUrl, setImagemFundoUrl] = useState('');
  const [texto, setTexto] = useState(TEXTO_PADRAO);
  const [versoHabilitado, setVersoHabilitado] = useState(false);
  const [versoImagemUrl, setVersoImagemUrl] = useState('');
  const [versoConteudo, setVersoConteudo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (template) {
      setNome(template.nome || '');
      setImagemFundoUrl(template.imagem_fundo_url || '');
      setTexto(template.texto_certificado || TEXTO_PADRAO);
      setVersoHabilitado(template.verso_habilitado || false);
      setVersoImagemUrl(template.verso_imagem_url || '');
      setVersoConteudo(template.verso_conteudo || '');
    }
  }, [template]);

  const handleUploadFundo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) { alert('Imagem deve ter no máximo 1,5MB.'); return; }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImagemFundoUrl(file_url);
    setUploading(false);
  };

  const handleUploadVerso = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVerso(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setVersoImagemUrl(file_url);
    setUploadingVerso(false);
  };

  const handleSalvar = async () => {
    if (!nome.trim()) { alert('Informe o nome do template.'); return; }
    setSalvando(true);
    const dados = {
      nome: nome.trim(),
      imagem_fundo_url: imagemFundoUrl,
      texto_certificado: texto,
      verso_habilitado: versoHabilitado,
      verso_imagem_url: versoImagemUrl,
      verso_conteudo: versoConteudo,
      created_at: new Date().toISOString(),
    };
    if (template?.id) {
      await base44.entities.CertificadoTemplate.update(template.id, dados);
    } else {
      await base44.entities.CertificadoTemplate.create(dados);
    }
    setSalvando(false);
    onSalvo();
  };

  const textoPreview = texto
    .replace(/{full_name}/g, 'João da Silva')
    .replace(/{course_name}/g, 'Workshop de Liderança')
    .replace(/{completion_date}/g, '31/03/2026');

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8,
    padding: '10px 12px', fontSize: 13, color: '#1E293B',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', padding: '18px 24px' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: 17, fontWeight: 700 }}>
          {template?.id ? '✏️ Editar Template' : '🎨 Novo Template'}
        </h2>
      </div>

      {/* Abas frente/verso */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
        {['frente', 'verso'].map(a => (
          <button key={a} onClick={() => setAba(a)} style={{
            flex: 1, padding: '12px', border: 'none', background: aba === a ? '#F5F3FF' : '#fff',
            color: aba === a ? '#7C3AED' : '#64748B', fontWeight: aba === a ? 700 : 500,
            fontSize: 13, cursor: 'pointer', borderBottom: aba === a ? '2px solid #7C3AED' : '2px solid transparent',
          }}>
            {a === 'frente' ? '🖼️ Frente' : '📄 Verso'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, padding: 24, alignItems: 'flex-start' }}>
        {/* Formulário */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {aba === 'frente' && (
            <>
              <div>
                <label style={labelStyle}>Nome do Template *</label>
                <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Certificado Padrão 2026" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Imagem de Fundo (recomendado 1920×1080px, máx 1,5MB)</label>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  border: '1.5px dashed #C4B5FD', borderRadius: 8, cursor: 'pointer',
                  background: '#FAFAFA', fontSize: 13, color: '#7C3AED', fontWeight: 600,
                }}>
                  {uploading ? '⏳ Enviando...' : '📁 Selecionar imagem'}
                  <input type="file" accept="image/*" onChange={handleUploadFundo} style={{ display: 'none' }} />
                </label>
                {imagemFundoUrl && (
                  <p style={{ fontSize: 11, color: '#10B981', marginTop: 4, fontWeight: 600 }}>✅ Imagem carregada</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Texto do Certificado</label>
                <textarea
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 8, padding: '10px 14px', marginTop: 8, fontSize: 12, color: '#5B21B6' }}>
                  💡 <strong>Tags disponíveis:</strong><br />
                  <code>{'{full_name}'}</code> — Nome do aluno &nbsp;|&nbsp;
                  <code>{'{course_name}'}</code> — Nome do curso &nbsp;|&nbsp;
                  <code>{'{completion_date}'}</code> — Data<br />
                  <span style={{ color: '#7C3AED', marginTop: 4, display: 'block' }}>O nome do aluno será exibido em negrito automaticamente.</span>
                </div>
              </div>
            </>
          )}

          {aba === 'verso' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="versoToggle" checked={versoHabilitado} onChange={e => setVersoHabilitado(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="versoToggle" style={{ fontSize: 14, fontWeight: 700, color: '#374151', cursor: 'pointer' }}>
                  Habilitar Verso no PDF
                </label>
              </div>

              {versoHabilitado && (
                <>
                  <div>
                    <label style={labelStyle}>Imagem de Fundo do Verso (Opcional)</label>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      border: '1.5px dashed #C4B5FD', borderRadius: 8, cursor: 'pointer',
                      background: '#FAFAFA', fontSize: 13, color: '#7C3AED', fontWeight: 600,
                    }}>
                      {uploadingVerso ? '⏳ Enviando...' : '📁 Selecionar imagem do verso'}
                      <input type="file" accept="image/*" onChange={handleUploadVerso} style={{ display: 'none' }} />
                    </label>
                    {versoImagemUrl && <p style={{ fontSize: 11, color: '#10B981', marginTop: 4, fontWeight: 600 }}>✅ Imagem carregada</p>}
                  </div>

                  <div>
                    <label style={labelStyle}>Conteúdo Programático</label>
                    <textarea
                      value={versoConteudo}
                      onChange={e => setVersoConteudo(e.target.value)}
                      rows={8}
                      placeholder={'MÓDULO I - Introdução\n• Conceitos básicos\n\nMÓDULO II - Práticas\n• Exercícios práticos\n\nCarga Horária Total: 40 horas'}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Botões */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onCancelar} style={{
              background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
              borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={handleSalvar} disabled={salvando} style={{
              background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff',
              border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              {salvando ? '⏳ Salvando...' : '💾 Salvar Template'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>PREVIEW</p>
          {aba === 'frente' && (
            <div style={{
              width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden',
              border: '1px solid #E2E8F0', position: 'relative', background: '#F8F8F8',
            }}>
              {imagemFundoUrl && (
                <img src={imagemFundoUrl} alt="fundo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 16, textAlign: 'center',
              }}>
                <p style={{ fontSize: 11, color: '#000', lineHeight: 1.6, whiteSpace: 'pre-line', fontFamily: 'serif' }}>
                  {textoPreview.split('João da Silva').map((part, i, arr) => (
                    <span key={i}>{part}{i < arr.length - 1 && <strong>João da Silva</strong>}</span>
                  ))}
                </p>
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', padding: 4, borderRadius: 4, fontSize: 8, color: '#666', border: '1px solid #ddd' }}>
                📷 QR Code
              </div>
            </div>
          )}
          {aba === 'verso' && versoHabilitado && (
            <div style={{
              width: '100%', aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden',
              border: '1px solid #E2E8F0', position: 'relative', background: '#FAFAFA',
              padding: 16, boxSizing: 'border-box',
            }}>
              {versoImagemUrl && (
                <img src={versoImagemUrl} alt="verso" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginTop: 4, marginBottom: 12 }}>CONTEÚDO PROGRAMÁTICO</p>
                <p style={{ fontSize: 9, color: '#333', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{versoConteudo || 'Conteúdo aparecerá aqui...'}</p>
              </div>
            </div>
          )}
          {aba === 'verso' && !versoHabilitado && (
            <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              Habilite o verso para ver o preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}