import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { metaConversions } from '@/functions/metaConversions';
import { enviarEmailInscricao } from '@/functions/enviarEmailInscricao';
import { User, Mail, Phone, Cake } from 'lucide-react';

function maskDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function calcularIdade(dataNasc) {
  const parts = dataNasc.split('/');
  if (parts.length !== 3 || parts[2].length !== 4) return null;
  const nascimento = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  if (isNaN(nascimento.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade >= 0 && idade <= 120 ? idade : null;
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function InscricaoForm({ origem = 'modal_cta', theme = 'dark', onSuccess }) {
  const [fields, setFields] = useState({ nome: '', email: '', whatsapp: '', data_nascimento: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme === 'dark';
  const errorStyle = 'text-red-400 text-xs mt-1';

  const labelSx = isDark
    ? { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }
    : { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 };

  const getInputSx = (hasError) => ({
    width: '100%',
    background: hasError ? '#FFF5F5' : '#F8FAFC',
    border: `1.5px solid ${hasError ? '#F87171' : '#E2E8F0'}`,
    borderRadius: 10,
    padding: '12px 14px 12px 42px',
    fontSize: 14,
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  const handleFocus = (e) => {
    e.target.style.borderColor = '#F97316';
    e.target.style.background = '#FFFFFF';
    e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#E2E8F0';
    e.target.style.background = '#F8FAFC';
    e.target.style.boxShadow = 'none';
  };

  const handleChange = (field, value) => {
    if (field === 'whatsapp') value = maskPhone(value);
    if (field === 'data_nascimento') value = maskDate(value);
    setFields(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!fields.nome.trim() || fields.nome.trim().length < 3) e.nome = 'Informe seu nome completo (mín. 3 caracteres)';
    if (!fields.data_nascimento) {
      e.data_nascimento = 'Informe sua data de nascimento';
    } else {
      const idade = calcularIdade(fields.data_nascimento);
      if (idade === null) e.data_nascimento = 'Data inválida. Use o formato DD/MM/AAAA';
    }
    if (!fields.email.trim() || !validateEmail(fields.email)) e.email = 'Informe um e-mail válido';
    const digits = fields.whatsapp.replace(/\D/g, '');
    if (!digits || digits.length < 10) e.whatsapp = 'Informe um WhatsApp válido';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitted) return; // bloqueia duplo envio
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    // Verificar duplicata de e-mail
    const existing = await base44.entities.Inscricao.filter({ email: fields.email.toLowerCase().trim() });
    if (existing.length > 0) {
      setApiError('Este e-mail já está inscrito! 🎉 Fique de olho no seu WhatsApp.');
      setLoading(false);
      return;
    }

    const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

    // Chamar backend: calcular qualificação e enviar e-mail
    let qualificado = null;
    let idadeCalculada = fields.data_nascimento ? calcularIdade(fields.data_nascimento) : null;
    let emailEnviado = false;
    try {
      const resp = await enviarEmailInscricao({
        nome: fields.nome.trim(),
        email: fields.email.toLowerCase().trim(),
        data_nascimento: fields.data_nascimento,
      });
      qualificado = resp.data?.qualificado ?? null;
      idadeCalculada = resp.data?.idade ?? idadeCalculada;
      emailEnviado = resp.data?.emailEnviado ?? false;
    } catch (e) {
      console.error('Email func error:', e);
    }

    // Dispara evento Lead no pixel client-side com deduplicação
    if (window.fbq) {
      window.fbq('track', 'Lead', {}, { eventID: eventId });
    }

    await base44.entities.Inscricao.create({
      nome: fields.nome.trim(),
      email: fields.email.toLowerCase().trim(),
      whatsapp: fields.whatsapp,
      data_nascimento: fields.data_nascimento,
      idade: idadeCalculada !== null ? idadeCalculada : undefined,
      qualificado: qualificado !== null ? qualificado : undefined,
      email_enviado: emailEnviado,
      origem,
      created_at: new Date().toISOString(),
    });

    // Envia evento Lead via Conversions API (server-side) com deduplicação
    metaConversions({
      event_name: 'Lead',
      email: fields.email.toLowerCase().trim(),
      phone: fields.whatsapp,
      event_id: eventId,
      source_url: window.location.href,
    }).catch(() => {});

    setLoading(false);
    setSubmitted(true);
    onSuccess && onSuccess();
  };

  return (
    <>
    <style>{`
      @media (max-width: 1279px) and (min-width: 768px) {
        .hf-form-label { font-size: 11px !important; margin-bottom: 4px !important; }
        .hf-form-input { padding: 9px 11px 9px 36px !important; font-size: 13px !important; border-radius: 8px !important; }
        .hf-form-icon { left: 10px !important; width: 14px !important; height: 14px !important; }
        .hf-form-btn { height: 42px !important; font-size: 13px !important; border-radius: 10px !important; margin-top: 6px !important; }
        .hf-form-group { margin-bottom: 10px !important; }
      }
    `}</style>
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="hf-form-group">
        <label className="hf-form-label" style={labelSx}>Seu nome completo</label>
        <div className="relative">
          <User className="hf-form-icon" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#94A3B8' }} />
          <input
            type="text"
            aria-label="Nome completo"
            placeholder="Ex: João Silva"
            value={fields.nome}
            onChange={e => handleChange('nome', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="hf-form-input"
            style={getInputSx(!!errors.nome)}
          />
        </div>
        {errors.nome && <p className={errorStyle}>{errors.nome}</p>}
      </div>

      <div className="hf-form-group">
        <label className="hf-form-label" style={labelSx}>Data de nascimento</label>
        <div className="relative">
          <Cake className="hf-form-icon" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#94A3B8' }} />
          <input
            type="text"
            aria-label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={fields.data_nascimento}
            onChange={e => handleChange('data_nascimento', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="hf-form-input"
            style={getInputSx(!!errors.data_nascimento)}
            maxLength={10}
          />
          {fields.data_nascimento && calcularIdade(fields.data_nascimento) !== null && (
            <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:12, fontWeight:700, color:'#F97316', background:'#FFF7ED', borderRadius:6, padding:'2px 8px' }}>
              {calcularIdade(fields.data_nascimento)} anos
            </span>
          )}
        </div>
        {errors.data_nascimento && <p className={errorStyle}>{errors.data_nascimento}</p>}
      </div>

      <div className="hf-form-group">
        <label className="hf-form-label" style={labelSx}>Seu melhor e-mail</label>
        <div className="relative">
          <Mail className="hf-form-icon" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#94A3B8' }} />
          <input
            type="email"
            aria-label="E-mail"
            placeholder="exemplo@email.com"
            value={fields.email}
            onChange={e => handleChange('email', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="hf-form-input"
            style={getInputSx(!!errors.email)}
          />
        </div>
        {errors.email && <p className={errorStyle}>{errors.email}</p>}
      </div>

      <div className="hf-form-group">
        <label className="hf-form-label" style={labelSx}>Seu WhatsApp</label>
        <div className="relative">
          <Phone className="hf-form-icon" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#94A3B8' }} />
          <input
            type="tel"
            aria-label="WhatsApp"
            placeholder="(65) 99999-9999"
            value={fields.whatsapp}
            onChange={e => handleChange('whatsapp', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="hf-form-input"
            style={getInputSx(!!errors.whatsapp)}
          />
        </div>
        {errors.whatsapp && <p className={errorStyle}>{errors.whatsapp}</p>}
      </div>

      {apiError && (
        <p className="text-orange-400 text-xs text-center bg-orange-400/10 rounded-lg px-3 py-2">{apiError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 disabled:opacity-70 hf-form-btn"
        style={{
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          color: '#FFFFFF',
          height: 50,
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          marginTop: 8,
          boxShadow: '0 4px 20px rgba(249, 115, 22, 0.45)',
          transition: 'all 0.2s ease',
          width: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.45)'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enviando...
          </>
        ) : '🚀 Quero me inscrever agora!'}
      </button>
    </form>
    </>
  );
}