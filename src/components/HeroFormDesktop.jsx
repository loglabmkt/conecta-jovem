import React from 'react';

const RESPONSIVE_CSS = `
  /* 768–1023px: hide cta block, show tablet button */
  @media (max-width: 1023px) and (min-width: 768px) {
    .hero-cta-container { display: none !important; }
    .hero-form-tablet-btn { display: flex !important; }
  }
  .hero-form-tablet-btn { display: none; }
  @keyframes urgencyPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.6; transform:scale(1.3); }
  }
`;

const CTA_URL = 'https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem';

export default function HeroFormDesktop() {
  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      {/* Tablet fallback button (768–1023px) */}
      <button
        className="hero-form-tablet-btn mt-20 ml-10 items-center justify-center gap-2 text-white font-bold text-base px-8 py-4 rounded-full shadow-xl"
        style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', border: 'none', cursor: 'pointer' }}
        onClick={() => window.open(CTA_URL, '_blank')}
      >
        📝 Inscreva-se
      </button>

      {/* FORMULÁRIO TEMPORARIAMENTE SUBSTITUÍDO POR LINK EXTERNO — REATIVAR QUANDO NECESSÁRIO */}
      {/* Hero CTA externo (desktop ≥1024px) */}
      <div
        className="mt-32 ml-20 hidden md:flex hero-cta-container"
        style={{ flexDirection: 'column', gap: 16, maxWidth: 380 }}
      >
        {/* Badge */}
        <div>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#FFFFFF',
            textTransform: 'uppercase', letterSpacing: '0.10em',
            padding: '6px 14px', background: 'linear-gradient(135deg, #F97316, #EA580C)', borderRadius: 20,
          }}>
            🎓 Inscrições Abertas — 2ª Edição
          </span>
        </div>

        {/* Urgency bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#FFF7ED', border: '1px solid #FED7AA',
          borderRadius: 8, padding: '8px 12px', fontSize: 12,
          color: '#C2410C', fontWeight: 500,
        }}>
          <span style={{
            width: 8, height: 8, background: '#22C55E', borderRadius: '50%',
            flexShrink: 0, animation: 'urgencyPulse 1.5s infinite', display: 'inline-block',
          }} />
          🟢 Inscrições abertas · Vagas limitadas
        </div>

        {/* Título */}
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, margin: 0 }}>
          Garanta sua vaga agora!
        </h2>

        {/* Subtítulo */}
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
          Formação gratuita em tecnologia para jovens de 15 a 24 anos de Cuiabá
        </p>

        {/* Botão CTA */}
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg, #F97316, #EA580C)',
            color: 'white', padding: '18px 40px', borderRadius: 14,
            fontSize: 17, fontWeight: 700, textDecoration: 'none',
            display: 'inline-block', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(249,115,22,0.45)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.45)'; }}
        >
          🚀 Quero me inscrever agora
        </a>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0 }}>
          🔒 Gratuito · Sem spam · Vagas limitadas
        </p>
      </div>
    </>
  );
}