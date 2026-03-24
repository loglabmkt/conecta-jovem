import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import InscricaoForm from './InscricaoForm';

function SuccessDesktop() {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Inscrição realizada!</h3>
      <p style={{ fontSize: 13, color: '#64748B' }}>Em breve entraremos em contato pelo WhatsApp 🎉</p>
    </div>);

}

export default function HeroFormDesktop() {
  const [success, setSuccess] = useState(false);

  const { data: inscricoes = [] } = useQuery({
    queryKey: ['inscricoes-count-today'],
    queryFn: () => base44.entities.Inscricao.list('-created_date', 200),
    refetchInterval: 60000
  });

  // Count today's inscriptions
  const today = new Date().toDateString();
  const todayCount = inscricoes.filter((i) => new Date(i.created_date || i.created_at).toDateString() === today).length;
  const displayCount = Math.max(todayCount, 12); // floor at 12 for social proof

  return (
    <div className="mt-10 ml-12 hidden md:block"

    style={{
      position: 'relative',
      width: '100%',
      maxWidth: 380,
      background: '#FFFFFF',
      borderRadius: 20,
      boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)',
      padding: '32px 28px 24px 28px',
      overflow: 'hidden'
    }}>
      
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
          <div style={{ marginBottom: 10 }}>
            <span style={{
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
          <div style={{
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
            <style>{`@keyframes urgencyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }`}</style>
            {displayCount} jovens já se inscreveram hoje
          </div>

          {/* Title */}
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, marginBottom: 6 }}>
            Garanta sua vaga agora!
          </h2>
          <p style={{ fontSize: 13, fontWeight: 400, color: '#64748B', marginBottom: 20 }}>
            Gratuito · Vagas limitadas · Não perca!
          </p>

          <InscricaoForm origem="hero_desktop" theme="light" onSuccess={() => setSuccess(true)} />

          <p style={{ textAlign: 'center', marginTop: 12, color: '#94A3B8', fontSize: 11 }}>
            🔒 Seus dados estão seguros. Sem spam.
          </p>
        </div>
      }
    </div>);

}