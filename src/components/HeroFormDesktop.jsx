import React, { useState } from 'react';
import InscricaoForm from './InscricaoForm';

function SuccessDesktop() {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black text-white mb-2">Inscrição realizada!</h3>
      <p className="text-sm text-white/70">Em breve entraremos em contato pelo WhatsApp 🎉</p>
    </div>
  );
}

export default function HeroFormDesktop() {
  const [success, setSuccess] = useState(false);

  return (
    <div
      className="hidden md:block w-full max-w-[420px]"
      style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 24,
        boxShadow: '0 8px 48px rgba(0,0,0,0.3)',
        padding: 32,
      }}
    >
      {success ? (
        <SuccessDesktop />
      ) : (
        <>
          {/* Badge */}
          <div className="mb-4">
            <span
              className="inline-block text-xs font-bold text-white uppercase px-3 py-1.5 tracking-wide"
              style={{ background: '#F97316', borderRadius: 20, fontSize: 12 }}
            >
              🎓 Inscrições Abertas — 2ª Edição
            </span>
          </div>

          <h2 className="text-white font-black mb-1" style={{ fontSize: 22 }}>
            Garanta sua vaga agora!
          </h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            Gratuito · Vagas limitadas · Não perca!
          </p>

          <div className="mb-4" style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />

          <InscricaoForm origem="hero_desktop" theme="dark" onSuccess={() => setSuccess(true)} />

          <p className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
            🔒 Seus dados estão seguros. Sem spam.
          </p>
        </>
      )}
    </div>
  );
}