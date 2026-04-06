import React, { useEffect, useRef } from 'react';
import { LABELS_DIMENSAO } from '../../utils/algoritmoVocacional';

const CTA_URL = 'https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem';

function BarraScore({ dimensao, score, cor }) {
  const info = LABELS_DIMENSAO[dimensao];
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{info.label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: info.cor }}>{score}%</span>
      </div>
      <div style={{ height: 10, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: info.cor,
          width: `${score}%`,
          animation: 'growBar 0.8s ease forwards',
        }} />
      </div>
    </div>
  );
}

export default function ResultadoTeste({ resultado, nome }) {
  const { perfil, scores } = resultado;

  const handleCompartilhar = async () => {
    const texto = `Fiz o Teste Vocacional Conecta Action e descobri que sou "${perfil.nome}" ${perfil.emoji}! Descubra o seu também em conectajovem.com.br/teste-vocacional`;
    if (navigator.share) {
      await navigator.share({ title: 'Meu Perfil Vocacional', text: texto });
    } else {
      await navigator.clipboard.writeText(texto);
      alert('Texto copiado para a área de transferência!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '32px 16px' }}>
      <style>{`
        @keyframes growBar { from { width: 0 } }
        @keyframes confete { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        .confete-piece { position: fixed; top: -20px; width: 10px; height: 10px; animation: confete 3s ease-in forwards; }
      `}</style>

      {/* Confetes */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="confete-piece" style={{
          left: `${Math.random() * 100}%`,
          background: ['#F97316','#7C3AED','#22C55E','#3B82F6','#EC4899'][i % 5],
          animationDelay: `${Math.random() * 1.5}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : 0,
        }} />
      ))}

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>{perfil.emoji}</div>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 8px' }}>Seu perfil vocacional é:</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: perfil.cor, margin: '0 0 4px' }}>{perfil.nome}</h1>
          {nome && <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>Parabéns, {nome.split(' ')[0]}! 🎉</p>}
        </div>

        {/* Card perfil */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `2px solid ${perfil.cor}22`,
          boxShadow: `0 8px 32px ${perfil.cor}18`,
          padding: 28, marginBottom: 24,
        }}>
          <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>{perfil.descricao}</p>

          {/* Carreiras */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B', marginBottom: 12 }}>🎯 Carreiras para você</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {perfil.carreiras.map((c, i) => (
                <span key={i} style={{
                  background: '#fff', border: `1.5px solid ${perfil.cor}`,
                  color: perfil.cor, borderRadius: 20,
                  padding: '5px 14px', fontSize: 12, fontWeight: 600,
                }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B', marginBottom: 12 }}>💪 Suas habilidades em destaque</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {perfil.habilidades.map((h, i) => (
                <span key={i} style={{
                  background: `${perfil.cor}15`, color: perfil.cor,
                  borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600,
                }}>{h}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B', marginBottom: 20 }}>📊 Seus scores por dimensão</h3>
          {Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .map(([dim, score]) => (
              <BarraScore key={dim} dimensao={dim} score={score} />
            ))}
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1E1B4B)',
          borderRadius: 20, padding: '32px 28px', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Pronto para transformar seu perfil em realidade?
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.6 }}>
            O Conecta Jovem oferece formação gratuita em tecnologia para jovens de Cuiabá — exatamente o que você precisa para começar.
          </p>
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', marginBottom: 12,
              background: 'linear-gradient(135deg,#F97316,#EA580C)',
              color: '#fff', textDecoration: 'none',
              padding: '16px 36px', borderRadius: 14,
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 4px 16px rgba(249,115,22,0.45)',
            }}
          >
            🚀 Quero me inscrever no Conecta Jovem
          </a>
          <br />
          <button
            onClick={handleCompartilhar}
            style={{
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12, padding: '12px 28px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            📤 Compartilhar meu resultado
          </button>
        </div>
      </div>
    </div>
  );
}