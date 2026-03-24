import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import InscricaoForm from './InscricaoForm';

const RESPONSIVE_CSS = `
  .hero-form-card {
    position: relative;
    width: 100%;
    max-width: 380px;
    background: #FFFFFF;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15);
    padding: 32px 28px 24px 28px;
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
      <div className="ml-20 hidden md:block hero-form-card" style={{ marginTop: 55 }}>

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