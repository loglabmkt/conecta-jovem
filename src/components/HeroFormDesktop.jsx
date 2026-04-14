import React from 'react';

const INHIRE_URL = 'https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem';
// InscricaoForm preservado mas não renderizado (substituído por link externo)

const RESPONSIVE_CSS = `
  .hero-form-card {
    position: relative;
    width: 100%;
    max-width: 320px;
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15);
    padding: 22px 20px 18px 20px;
    overflow: hidden;
  }
  /* 1280–1439px */
  @media (max-width: 1439px) and (min-width: 1280px) {
    .hero-form-card {
      max-width: 340px;
      padding: 22px 22px 18px 22px;
      border-radius: 16px;
    }
    .hf-badge-wrap { margin-bottom: 10px !important; }
    .hf-badge-span { font-size: 10px !important; padding: 4px 10px !important; }
    .hf-urgency { padding: 6px 10px !important; font-size: 11px !important; margin-bottom: 10px !important; }
    .hf-title { font-size: 18px !important; margin-bottom: 4px !important; }
    .hf-subtitle { font-size: 12px !important; margin-bottom: 14px !important; }
    .hf-footer { font-size: 10px !important; margin-top: 10px !important; }
  }
  /* 1024–1279px */
  @media (max-width: 1279px) and (min-width: 1024px) {
    .hero-form-card {
      max-width: 300px;
      padding: 18px 18px 14px 18px;
      border-radius: 14px;
      max-height: 70vh;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .hero-form-card::-webkit-scrollbar { display: none; }
    .hf-badge-wrap { margin-bottom: 8px !important; }
    .hf-badge-span { font-size: 10px !important; padding: 4px 10px !important; }
    .hf-urgency { padding: 6px 10px !important; font-size: 11px !important; margin-bottom: 8px !important; }
    .hf-title { font-size: 16px !important; margin-bottom: 3px !important; }
    .hf-subtitle { font-size: 11px !important; margin-bottom: 12px !important; }
    .hf-footer { font-size: 10px !important; margin-top: 8px !important; }
  }
  /* 768–1023px: hide inline form, show tablet button */
  @media (max-width: 1023px) and (min-width: 768px) {
    .hero-form-card { display: none !important; }
    .hero-form-tablet-btn { display: flex !important; }
  }
  .hero-form-tablet-btn { display: none; }
  @keyframes urgencyPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.6; transform:scale(1.3); }
  }
`;


export default function HeroFormDesktop() {
  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      {/* Tablet fallback button (768–1023px) */}
      <a
        href={INHIRE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-form-tablet-btn mt-20 ml-10 items-center justify-center gap-2 text-white font-bold text-base px-8 py-4 rounded-full shadow-xl"
        style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', textDecoration: 'none' }}>
        📝 Inscreva-se
      </a>

      {/* Main CTA card (substituiu o formulário) */}
      <div className="mt-32 ml-20 hidden md:block" style={{
        display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420
      }}>
        <span style={{
          background: '#F97316', color: 'white', borderRadius: 20,
          padding: '5px 14px', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', display: 'inline-block', width: 'fit-content'
        }}>
          🎓 INSCRIÇÕES ABERTAS — 2ª EDIÇÃO
        </span>

        <div style={{
          background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center',
          gap: 8, fontSize: 12, color: '#dcfce7'
        }}>
          <span style={{
            width: 8, height: 8, background: '#22C55E', borderRadius: '50%',
            animation: 'urgencyPulse 1.5s infinite', flexShrink: 0, display: 'inline-block'
          }} />
          Inscrições abertas · Vagas limitadas
        </div>

        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          Garanta sua vaga agora!
        </h2>

        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, margin: 0 }}>
          Formação gratuita em tecnologia para jovens de 15 a 24 anos de Cuiabá
        </p>

        <a
          href={INHIRE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'linear-gradient(135deg,#F97316,#EA580C)', color: 'white',
            padding: '18px 40px', borderRadius: 14, fontSize: 17, fontWeight: 700,
            textDecoration: 'none', display: 'inline-block', textAlign: 'center',
            boxShadow: '0 4px 20px rgba(249,115,22,0.45)'
          }}>
          🚀 Quero me inscrever agora
        </a>

        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
          🔒 Gratuito · Sem spam · Vagas limitadas
        </span>
      </div>
    </>
  );
}