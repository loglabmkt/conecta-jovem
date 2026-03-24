import React, { useState } from 'react';
import InscricaoForm from './InscricaoForm';

function SuccessDesktop() {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black text-white mb-2">Inscrição realizada!</h3>
      <p className="text-sm text-white/70">Em breve entraremos em contato pelo WhatsApp 🎉</p>
    </div>);

}

export default function HeroFormDesktop() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="mt-10 mr-64 ml-32 hidden md:block"

    style={{
      width: '100%',
      maxWidth: 380,
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.30)',
      borderRadius: 20,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.2) inset',
      padding: '28px 28px 24px 28px'
    }}>
      
      {success ?
      <SuccessDesktop /> :

      <div>
          {/* Badge */}
          <div className="mb-3">
            <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '5px 12px',
            background: '#F97316',
            borderRadius: 20
          }}>
              🎓 Inscrições Abertas — 2ª Edição
            </span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, color: '#1e293b', marginBottom: 4 }}>
            Garanta sua vaga agora!
          </h2>
          <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(30,41,59,0.65)', letterSpacing: '0.02em', marginBottom: 16 }}>
            Gratuito · Vagas limitadas · Não perca!
          </p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 16 }} />

          <InscricaoForm origem="hero_desktop" theme="dark" onSuccess={() => setSuccess(true)} />

          <p style={{ textAlign: 'center', marginTop: 12, color: 'rgba(30,41,59,0.45)', fontSize: 11 }}>
            🔒 Seus dados estão seguros. Sem spam.
          </p>
        </div>
      }
    </div>);

}