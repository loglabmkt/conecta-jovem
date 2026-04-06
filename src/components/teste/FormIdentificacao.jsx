import React, { useState } from 'react';

export default function FormIdentificacao({ onContinuar }) {
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState({});

  const mascaraWhatsApp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido';
    if (!form.whatsapp.trim() || form.whatsapp.replace(/\D/g,'').length < 10) e.whatsapp = 'WhatsApp inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) onContinuar(form);
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10,
    padding: '12px 14px', fontSize: 14, color: '#1E293B',
    background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        maxWidth: 480, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#fff',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            padding: '5px 14px', background: 'linear-gradient(135deg,#F97316,#EA580C)',
            borderRadius: 20, marginBottom: 16,
          }}>⚡ CONECTA ACTION</span>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '0 0 8px' }}>
            Teste Vocacional
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
            Descubra qual carreira combina com seu perfil em menos de 10 minutos
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Nome completo *
            </label>
            <input
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              placeholder="Seu nome completo"
              style={{ ...inputStyle, borderColor: errors.nome ? '#EF4444' : '#E2E8F0' }}
            />
            {errors.nome && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0' }}>{errors.nome}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              E-mail *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="seu@email.com"
              style={{ ...inputStyle, borderColor: errors.email ? '#EF4444' : '#E2E8F0' }}
            />
            {errors.email && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0' }}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              WhatsApp *
            </label>
            <input
              value={form.whatsapp}
              onChange={e => setForm(f => ({ ...f, whatsapp: mascaraWhatsApp(e.target.value) }))}
              placeholder="(65) 99999-9999"
              style={{ ...inputStyle, borderColor: errors.whatsapp ? '#EF4444' : '#E2E8F0' }}
            />
            {errors.whatsapp && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0' }}>{errors.whatsapp}</p>}
          </div>

          <button
            type="submit"
            style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', width: '100%',
              boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
            }}
          >
            🚀 Começar o Teste
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', margin: 0 }}>
            🔒 Seus dados são usados apenas para enviar seu resultado. Sem spam.
          </p>
        </form>
      </div>
    </div>
  );
}