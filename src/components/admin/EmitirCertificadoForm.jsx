import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { gerarCertificadoPDF } from '@/functions/gerarCertificadoPDF';

export default function EmitirCertificadoForm() {
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [nomeAluno, setNomeAluno] = useState('');
  const [nomeCurso, setNomeCurso] = useState('');
  const [dataConclusao, setDataConclusao] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [gerando, setGerando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    base44.entities.CertificadoTemplate.list('-created_date', 100).then(setTemplates);
  }, []);

  const templateSelecionado = templates.find(t => t.id === templateId);

  const textoPreview = templateSelecionado
    ? (templateSelecionado.texto_certificado || '')
        .replace(/{full_name}/g, nomeAluno || '{full_name}')
        .replace(/{course_name}/g, nomeCurso || '{course_name}')
        .replace(/{completion_date}/g, dataConclusao)
    : '';

  const handleGerar = async () => {
    setErro('');
    setSucesso('');
    if (!templateId || !nomeAluno.trim() || !nomeCurso.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setGerando(true);
    try {
      const response = await gerarCertificadoPDF({
        template_id: templateId,
        nome_aluno: nomeAluno.trim(),
        nome_curso: nomeCurso.trim(),
        data_conclusao: dataConclusao,
      });

      const data = response.data;
      if (!data?.pdf_base64) {
        throw new Error(data?.error || 'PDF não retornado');
      }

      // Decodificar base64 → bytes → blob (preserva binário)
      const binary = atob(data.pdf_base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || `certificado_${nomeAluno.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setSucesso(`✅ Certificado de "${nomeAluno}" gerado e baixado com sucesso!`);
    } catch (e) {
      setErro('❌ Erro ao gerar certificado: ' + (e?.response?.data?.error || e?.message || 'Tente novamente.'));
    }
    setGerando(false);
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8,
    padding: '10px 12px', fontSize: 13, color: '#1E293B',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Formulário */}
      <div style={{ flex: 1, minWidth: 280, background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0F172A' }}>📄 Emitir Certificado</h3>

        <div>
          <label style={labelStyle}>Template *</label>
          <select value={templateId} onChange={e => setTemplateId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Selecione um template...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
          {templates.length === 0 && (
            <p style={{ fontSize: 11, color: '#F97316', marginTop: 4 }}>⚠️ Nenhum template cadastrado. Crie um na aba "Templates".</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Nome Completo do Aluno *</label>
          <input value={nomeAluno} onChange={e => setNomeAluno(e.target.value)} placeholder="Ex: João da Silva Santos" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Nome do Curso / Evento *</label>
          <input value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} placeholder="Ex: Workshop de Liderança 2025" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Data de Conclusão</label>
          <input value={dataConclusao} onChange={e => setDataConclusao(e.target.value)} placeholder="DD/MM/AAAA" style={inputStyle} />
        </div>

        {erro && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
            {erro}
          </div>
        )}
        {sucesso && (
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803D', fontWeight: 600 }}>
            {sucesso}
          </div>
        )}

        <button
          onClick={handleGerar}
          disabled={gerando || !templateId || !nomeAluno.trim() || !nomeCurso.trim()}
          style={{
            background: gerando || !templateId || !nomeAluno.trim() || !nomeCurso.trim()
              ? '#E2E8F0' : 'linear-gradient(135deg,#F97316,#EA580C)',
            color: gerando || !templateId || !nomeAluno.trim() || !nomeCurso.trim() ? '#94A3B8' : '#fff',
            border: 'none', borderRadius: 10, padding: '12px 20px',
            fontSize: 14, fontWeight: 700, cursor: gerando || !templateId || !nomeAluno.trim() || !nomeCurso.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {gerando ? '⏳ Gerando PDF...' : '📄 Gerar e Baixar PDF'}
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, minWidth: 280 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8 }}>PREVIEW DO CERTIFICADO</p>
        <div style={{
          width: '100%', aspectRatio: '1754/1240', borderRadius: 12, overflow: 'hidden',
          border: '1px solid #E2E8F0', position: 'relative',
          background: templateSelecionado?.imagem_fundo_url ? 'transparent' : '#F8F8F8',
        }}>
          {templateSelecionado?.imagem_fundo_url && (
            <img src={templateSelecionado.imagem_fundo_url} alt="fundo" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {!templateSelecionado && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', fontSize: 13 }}>
              Selecione um template para ver o preview
            </div>
          )}
          {templateSelecionado && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#000', lineHeight: 1.7, whiteSpace: 'pre-line', fontFamily: 'serif' }}>
                {textoPreview.split(nomeAluno || '\x00').map((part, i, arr) => (
                  <span key={i}>{part}{i < arr.length - 1 && <strong>{nomeAluno}</strong>}</span>
                ))}
              </p>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.9)', padding: '4px 6px', borderRadius: 4, fontSize: 8, color: '#666' }}>
            📷 QR Code
          </div>
        </div>
      </div>
    </div>
  );
}