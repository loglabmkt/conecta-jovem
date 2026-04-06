import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import FormIdentificacao from '../components/teste/FormIdentificacao';
import QuestaoCard from '../components/teste/QuestaoCard';
import ResultadoTeste from '../components/teste/ResultadoTeste';
import { QUESTOES, embaralharQuestoes } from '../data/questoes';
import { calcularScores, determinarPerfil } from '../utils/algoritmoVocacional';

const STORAGE_KEY = 'conecta_action_progresso';

export default function TesteVocacional() {
  const [etapa, setEtapa] = useState('identificacao'); // identificacao | teste | calculando | resultado
  const [identificacao, setIdentificacao] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [retomando, setRetomando] = useState(false);

  // Verificar progresso salvo
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const dados = JSON.parse(salvo);
        if (dados.identificacao && dados.questoes?.length > 0) {
          setRetomando(true);
        }
      } catch { /* ignorar */ }
    }
  }, []);

  const iniciarTeste = (ident, retomar = false) => {
    setIdentificacao(ident);
    if (retomar) {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
      setQuestoes(salvo.questoes);
      setRespostas(salvo.respostas || {});
      setIndiceAtual(salvo.indiceAtual || 0);
    } else {
      const embaralhadas = embaralharQuestoes(QUESTOES);
      setQuestoes(embaralhadas);
      setRespostas({});
      setIndiceAtual(0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ identificacao: ident, questoes: embaralhadas, respostas: {}, indiceAtual: 0 }));
    }
    setEtapa('teste');
    setRetomando(false);
  };

  const handleIdentificacao = (ident) => {
    iniciarTeste(ident, false);
  };

  const handleResponder = (valor) => {
    const questaoId = questoes[indiceAtual].id;
    const novasRespostas = { ...respostas, [questaoId]: valor };
    setRespostas(novasRespostas);
    const progresso = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progresso, respostas: novasRespostas, indiceAtual }));
  };

  const handleProxima = async () => {
    if (indiceAtual < questoes.length - 1) {
      const novoIndice = indiceAtual + 1;
      setIndiceAtual(novoIndice);
      const progresso = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progresso, indiceAtual: novoIndice }));
    } else {
      // Última questão — calcular resultado
      setEtapa('calculando');
      await calcularEMostrarResultado();
    }
  };

  const handleAnterior = () => {
    if (indiceAtual > 0) setIndiceAtual(i => i - 1);
  };

  const calcularEMostrarResultado = async () => {
    const respostasArray = Object.entries(respostas).map(([questao_id, valor]) => ({
      questao_id: parseInt(questao_id), valor,
    }));
    const scores = calcularScores(respostasArray, QUESTOES);
    const resultado = determinarPerfil(scores);

    // Salvar no banco
    base44.entities.ResultadoTeste.create({
      nome: identificacao.nome,
      email: identificacao.email,
      whatsapp: identificacao.whatsapp,
      respostas: respostasArray,
      perfil_primario: resultado.primario,
      perfil_secundario: resultado.secundario,
      perfil_chave: resultado.chave,
      scores: resultado.scores || scores,
      created_at: new Date().toISOString(),
    }).catch(() => { /* silencioso */ });

    localStorage.removeItem(STORAGE_KEY);
    setResultado({ ...resultado, scores });
    setEtapa('resultado');
  };

  if (etapa === 'identificacao') {
    return (
      <div>
        {retomando && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#1E1B4B', color: '#fff', borderRadius: 14,
            padding: '14px 24px', zIndex: 100, display: 'flex', gap: 12,
            alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            💾 Você tem um teste em andamento!
            <button onClick={() => {
              const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
              iniciarTeste(d.identificacao, true);
            }} style={{ background: '#F97316', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Continuar
            </button>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setRetomando(false); }}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>
              Novo
            </button>
          </div>
        )}
        <FormIdentificacao onContinuar={handleIdentificacao} />
      </div>
    );
  }

  if (etapa === 'calculando') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F172A,#1E1B4B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: 'spin 1s linear infinite' }}>⚙️</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Calculando seu perfil...</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Analisando suas 60 respostas</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (etapa === 'resultado' && resultado) {
    return <ResultadoTeste resultado={resultado} nome={identificacao?.nome} />;
  }

  if (etapa === 'teste' && questoes.length > 0) {
    const questaoAtual = questoes[indiceAtual];
    const respostaSalva = respostas[questaoAtual.id] || null;
    return (
      <QuestaoCard
        questao={questaoAtual}
        indice={indiceAtual}
        total={questoes.length}
        respostaSalva={respostaSalva}
        onResponder={handleResponder}
        onAnterior={handleAnterior}
        onProxima={handleProxima}
      />
    );
  }

  return null;
}