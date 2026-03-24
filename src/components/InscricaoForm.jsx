import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Mail, Phone } from 'lucide-react';

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
  const [fields, setFields] = useState({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const isDark = theme === 'dark';

  const inputBase = isDark
    ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-orange-400'
    : 'bg-white border border-slate-200 text-gray-900 placeholder-gray-400 focus:border-orange-400';

  const labelStyle = isDark ? 'text-white/80' : 'text-gray-700';
  const errorStyle = 'text-red-400 text-xs mt-1';

  const handleChange = (field, value) => {
    if (field === 'whatsapp') value = maskPhone(value);
    setFields(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!fields.nome.trim() || fields.nome.trim().length < 3) e.nome = 'Informe seu nome completo (mín. 3 caracteres)';
    if (!fields.email.trim() || !validateEmail(fields.email)) e.email = 'Informe um e-mail válido';
    const digits = fields.whatsapp.replace(/\D/g, '');
    if (!digits || digits.length < 10) e.whatsapp = 'Informe um WhatsApp válido';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    await base44.entities.Inscricao.create({
      nome: fields.nome.trim(),
      email: fields.email.toLowerCase().trim(),
      whatsapp: fields.whatsapp,
      origem,
      created_at: new Date().toISOString(),
    });

    setLoading(false);
    onSuccess && onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Nome */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${labelStyle}`}>Seu nome completo</label>
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
          <input
            type="text"
            aria-label="Nome completo"
            placeholder="Ex: João Silva"
            value={fields.nome}
            onChange={e => handleChange('nome', e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all ${inputBase} ${errors.nome ? 'border-red-400' : ''}`}
          />
        </div>
        {errors.nome && <p className={errorStyle}>{errors.nome}</p>}
      </div>

      {/* E-mail */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${labelStyle}`}>Seu melhor e-mail</label>
        <div className="relative">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
          <input
            type="email"
            aria-label="E-mail"
            placeholder="exemplo@email.com"
            value={fields.email}
            onChange={e => handleChange('email', e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all ${inputBase} ${errors.email ? 'border-red-400' : ''}`}
          />
        </div>
        {errors.email && <p className={errorStyle}>{errors.email}</p>}
      </div>

      {/* WhatsApp */}
      <div>
        <label className={`block text-xs font-semibold mb-1.5 ${labelStyle}`}>Seu WhatsApp</label>
        <div className="relative">
          <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
          <input
            type="tel"
            aria-label="WhatsApp"
            placeholder="(65) 99999-9999"
            value={fields.whatsapp}
            onChange={e => handleChange('whatsapp', e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all ${inputBase} ${errors.whatsapp ? 'border-red-400' : ''}`}
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
        className="w-full h-[52px] rounded-[14px] font-black text-base text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enviando...
          </>
        ) : '🚀 Quero me inscrever agora!'}
      </button>
    </form>
  );
}