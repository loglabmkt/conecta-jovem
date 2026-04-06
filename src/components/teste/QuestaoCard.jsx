import React, { useState, useEffect } from 'react';

const OPCOES = [
  { valor: 1, cor: '#EF4444', label: 'Discordo Totalmente' },
  { valor: 2, cor: '#F97316', label: 'Discordo' },
  { valor: 3, cor: '#EAB308', label: 'Neutro' },
  { valor: 4, cor: '#3B82F6', label: 'Concordo' },
  { valor: 5, cor: '#22C55E', label: 'Concordo Totalmente' },
];

const MOTIVACOES = {
  20: '🎯 Ótimo! Você está no caminho certo!',
  40: '💪 Incrível! Só mais 20 questões!',
};

export default function QuestaoCard({ questao, indice, total, respostaSalva, onResponder, onAnterior, onProxima }) {
  const [selecionado, setSelecionado] = useState(respostaSalva || null);
  const [animando, setAnimando] = useState(false);
  const percentual = Math.round((indice / total) * 100);

  useEffect(() => {
    setSelecionado(respostaSalva || null);
    setAnimando(true);
    const t = setTimeout(() => setAnimando(false), 300);
    return () => clearTimeout(t);
  }, [questao.id, respostaSalva]);

  const handleSelecionar = (valor) => {
    setSelecionado(valor);
    onResponder(valor);
  };

  const motivacao = MOTIVACOES[indice + 1];

  return (
    <div style={{ minHeight: '100vh', background: '#F3F0FF', display: 'flex', flexDirection: 'column' }}>
      {/* Header progress */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>Questão {indice + 1}/{total}</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>{indice} respondidas · {percentual}% Completo</span>
          </div>
          <div style={{ height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(90deg, #7C3AED, #F97316)',
              width: `${percentual}%`, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          maxWidth: 640, width: '100%',
          overflow: 'hidden',
          opacity: animando ? 0 : 1,
          transform: animando ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.25s, transform 0.25s',
        }}>
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            padding: '14px 24px', textAlign: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Avalie a afirmação
            </span>
          </div>

          <div style={{ padding: '28px 28px 24px' }}>
            {/* Pergunta */}
            <div style={{
              background: '#F3F0FF', borderRadius: 12,
              padding: '28px 24px', textAlign: 'center',
              minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
            }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#1E1B4B', margin: 0, lineHeight: 1.6 }}>
                {questao.texto}
              </p>
            </div>

            {/* Escala */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, gap: 8 }}>
              {OPCOES.map(({ valor, cor, label }) => {
                const sel = selecionado === valor;
                return (
                  <div key={valor} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                    <button
                      onClick={() => handleSelecionar(valor)}
                      style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: cor, border: sel ? '3px solid #1E1B4B' : '3px solid transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: sel ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s',
                        boxShadow: sel ? `0 4px 14px ${cor}66` : 'none',
                      }}
                    >
                      {sel && <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />}
                    </button>
                    <span style={{ fontSize: 10, fontWeight: 600, color: sel ? cor : '#94A3B8', textAlign: 'center', lineHeight: 1.3 }}>
                      {valor}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Labels extremos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Discordo Totalmente</span>
              <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>Concordo Totalmente</span>
            </div>

            {/* Label selecionado */}
            <div style={{ height: 24, textAlign: 'center' }}>
              {selecionado && (
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: OPCOES.find(o => o.valor === selecionado)?.cor,
                }}>
                  {OPCOES.find(o => o.valor === selecionado)?.label}
                </span>
              )}
            </div>

            {/* Motivação */}
            {motivacao && (
              <div style={{
                background: '#F0FDF4', border: '1px solid #86EFAC',
                borderRadius: 10, padding: '10px 16px', textAlign: 'center',
                fontSize: 13, fontWeight: 700, color: '#15803D', marginTop: 16,
              }}>
                {motivacao}
              </div>
            )}
          </div>

          {/* Navegação */}
          <div style={{
            borderTop: '1px solid #F1F5F9', padding: '16px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onClick={onAnterior}
              disabled={indice === 0}
              style={{
                background: indice === 0 ? '#F1F5F9' : '#F8FAFC',
                color: indice === 0 ? '#CBD5E1' : '#475569',
                border: '1px solid #E2E8F0', borderRadius: 10,
                padding: '10px 20px', fontSize: 13, fontWeight: 600,
                cursor: indice === 0 ? 'not-allowed' : 'pointer',
              }}
            >← Anterior</button>

            <span style={{
              fontSize: 12, fontWeight: 700, color: '#7C3AED',
              background: '#F3F0FF', padding: '6px 14px', borderRadius: 20,
            }}>
              {indice + 1} de {total}
            </span>

            <button
              onClick={() => selecionado && onProxima()}
              disabled={!selecionado}
              style={{
                background: selecionado ? 'linear-gradient(135deg,#7C3AED,#4F46E5)' : '#E2E8F0',
                color: selecionado ? '#fff' : '#94A3B8',
                border: 'none', borderRadius: 10,
                padding: '10px 20px', fontSize: 13, fontWeight: 700,
                cursor: selecionado ? 'pointer' : 'not-allowed',
                boxShadow: selecionado ? '0 2px 8px rgba(124,58,237,0.3)' : 'none',
              }}
            >Próxima →</button>
          </div>
        </div>
      </div>
    </div>
  );
}