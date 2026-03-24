import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import InscricaoForm from './InscricaoForm';

const RESPONSIVE_CSS = `
  .hero-form-card {
    position: relative;
    width: 100%;
    max-width: 340px;
    background: #FFFFFF;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15);
    padding: clamp(16px, 2.5vh, 28px) clamp(16px, 2vw, 24px);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    max-height: calc(100vh - 160px);
    box-sizing: border-box;
  }
  .hero-form-card::-webkit-scrollbar { display: none; }
  .hf-badge-wrap { margin-bottom: clamp(6px, 1vh, 12px); }
  .hf-badge-span { font-size: clamp(9px, 1.1vh, 11px) !important; padding: 4px 12px; }
  .hf-urgency {
    padding: clamp(5px, 0.8vh, 8px) clamp(8px, 1vw, 12px) !important;
    font-size: clamp(10px, 1.2vh, 12px) !important;
    margin-bottom: clamp(6px, 1vh, 12px) !important;
  }
  .hf-title { font-size: clamp(15px, 2.2vh, 22px) !important; margin-bottom: clamp(2px, 0.5vh, 6px) !important; }
  .hf-subtitle { font-size: clamp(11px, 1.3vh, 13px) !important; margin-bottom: clamp(10px, 1.5vh, 18px) !important; }
  .hf-footer { font-size: clamp(9px, 1vh, 11px) !important; margin-top: clamp(6px, 1vh, 12px) !important; }
  .hf-form-group { margin-bottom: clamp(8px, 1.2vh, 14px) !important; }
  .hf-form-label { font-size: clamp(10px, 1.2vh, 12px) !important; margin-bottom: clamp(3px, 0.5vh, 6px) !important; }
  .hf-form-input { padding-top: clamp(8px, 1.2vh, 12px) !important; padding-bottom: clamp(8px, 1.2vh, 12px) !important; font-size: clamp(12px, 1.4vh, 14px) !important; }
  .hf-form-btn { height: clamp(40px, 5.5vh, 50px) !important; font-size: clamp(13px, 1.6vh, 15px) !important; margin-top: clamp(4px, 0.8vh, 10px) !important; }
  /* 1280–1439px width */
  @media (max-width: 1439px) and (min-width: 1280px) {
    .hero-form-card { max-width: 320px; border-radius: 16px; }
  }
  /* 1024–1279px width */
  @media (max-width: 1279px) and (min-width: 1024px) {
    .hero-form-card { max-width: 290px; border-radius: 14px; }
  }
  /* 768–1023px: hide inline form, show tablet button */
  @media (max-width: 1023px) and (min-width: 768px) {
    .hero-form-card { display: none !important; }
    .hero-form-tablet-btn { display: flex !important; }
  }
  /* Very short viewports */
  @media (max-height: 700px) {
    .hf-urgency { display: none !important; }
    .hf-form-group { margin-bottom: 6px !important; }
    .hero-form-card { padding: 14px 16px; max-height: calc(100vh - 120px); }
  }
  @media (max-height: 800px) {
    .hero-form-card { max-height: calc(100vh - 140px); }
  }
  @media (min-height: 900px) {
    .hero-form-card { max-height: none; overflow: visible; }
  }
  .hero-form-tablet-btn { display: none; }
  @keyframes urgencyPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.6; transform:scale(1.3); }
  }
`;

function SuccessDesktop() {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Inscrição realizada!</h3>
      <p style={{ fontSize: 13, color: '#64748B' }}>Em breve entraremos em contato pelo WhatsApp 🎉</p>
    </div>
  );
}

export default function HeroFormDesktop() {
  const [success, setSuccess] = useState(false);

  const { data: inscricoes = [] } = useQuery({
    queryKey: ['inscricoes-count-today'],
    queryFn: () => base44.entities.Inscricao.list('-created_date', 200),
    refetchInterval: 60000
  });

  const today = new Date().toDateString();
  const todayCount = inscricoes.filter((i) => new Date(i.created_date || i.created_at).toDateString() === today).length;
  const displayCount = Math.max(todayCount, 12);

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>

      {/* Tablet fallback button (768–1023px) */}
      <button
        className="hero-form-tablet-btn mt-20 ml-10 items-center justify-center gap-2 text-white font-bold text-base px-8 py-4 rounded-full shadow-xl"
        style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', border: 'none', cursor: 'pointer' }}
        onClick={() => window.dispatchEvent(new CustomEvent('open-inscricao', { detail: { origem: 'modal_cta' } }))}
      >
        📝 Inscreva-se
      </button>

      {/* Main inline form card */}
      <div className="hidden md:block hero-form-card">

        {/* Accent line top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 32, right: 32,
          height: 3,
          background: 'linear-gradient(90deg, #F97316, #3B82F6)',
          borderRadius: '0 0 4px 4px'
        }} />

        {success ? <SuccessDesktop /> :
          <div>
            {/* Badge */}
            <div className="hf-badge-wrap" style={{ marginBottom: 10 }}>
              <span className="hf-badge-span" style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #F97316, #EA580C)',
                borderRadius: 20
              }}>
                🎓 Inscrições Abertas — 2ª Edição
              </span>
            </div>

            {/* Urgency bar */}
            <div className="hf-urgency" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFF7ED',
              border: '1px solid #FED7AA',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              color: '#C2410C',
              fontWeight: 500,
              marginBottom: 14
            }}>
              <span style={{
                width: 8, height: 8,
                background: '#22C55E',
                borderRadius: '50%',
                flexShrink: 0,
                animation: 'urgencyPulse 1.5s infinite',
                display: 'inline-block'
              }} />
              {displayCount} jovens já se inscreveram hoje
            </div>

            {/* Title */}
            <h2 className="hf-title" style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, marginBottom: 6 }}>
              Garanta sua vaga agora!
            </h2>
            <p className="hf-subtitle" style={{ fontSize: 13, fontWeight: 400, color: '#64748B', marginBottom: 20 }}>
              Gratuito · Vagas limitadas · Não perca!
            </p>

            <InscricaoForm origem="hero_desktop" theme="light" onSuccess={() => setSuccess(true)} />

            <p className="hf-footer" style={{ textAlign: 'center', marginTop: 12, color: '#94A3B8', fontSize: 11 }}>
              🔒 Seus dados estão seguros. Sem spam.
            </p>
          </div>
        }
      </div>
    </>
  );
}