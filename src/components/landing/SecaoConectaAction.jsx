import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { emoji: '🧠', titulo: 'Perfil Personalizado', desc: 'Identifica seus valores e traços únicos' },
  { emoji: '🎯', titulo: '60 Questões Estratégicas', desc: 'Algoritmo avançado de análise vocacional' },
  { emoji: '🚀', titulo: 'Resultado Imediato', desc: 'Descubra sua carreira ideal em minutos' },
];

export default function SecaoConectaAction() {
  const navigate = useNavigate();

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      padding: '80px 40px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#F97316',
            textTransform: 'uppercase', letterSpacing: '0.15em',
            padding: '6px 16px', border: '1px solid #F97316',
            borderRadius: 20,
          }}>⚡ CONECTA ACTION</span>
        </div>

        {/* Título */}
        <h2 style={{ fontSize: 42, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
          Conheça o <span style={{ color: '#F97316' }}>Conecta Action</span>
        </h2>

        {/* Subtítulo */}
        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.7)',
          maxWidth: 600, margin: '0 auto 48px',
          lineHeight: 1.7,
        }}>
          Nossa plataforma exclusiva oferece um teste vocacional personalizado, adaptado ao seu perfil e às suas respostas.
        </p>

        {/* Cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20, marginBottom: 48,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 24, textAlign: 'center',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.titulo}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Botão CTA */}
        <button
          onClick={() => navigate('/teste-vocacional')}
          style={{
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '18px 48px', fontSize: 17, fontWeight: 700,
            cursor: 'pointer', marginBottom: 16,
            boxShadow: '0 4px 24px rgba(249,115,22,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(249,115,22,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(249,115,22,0.4)'; }}
        >
          ⚡ Fazer o Teste Agora — É Gratuito
        </button>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          ✨ Mais de 300 jovens já descobriram seu perfil
        </p>
      </div>
    </section>
  );
}