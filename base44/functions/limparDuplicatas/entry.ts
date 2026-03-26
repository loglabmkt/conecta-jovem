import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Buscar TODOS os registros
  const todos = await base44.asServiceRole.entities.Inscricao.list('-created_date', 2000);

  // Agrupar por email (normalizado)
  const porEmail = {};
  const porWhatsapp = {};

  for (const r of todos) {
    const email = (r.email || '').toLowerCase().trim();
    const wa = (r.whatsapp || '').replace(/\D/g, '');

    if (email) {
      if (!porEmail[email]) porEmail[email] = [];
      porEmail[email].push(r);
    }
    if (wa) {
      if (!porWhatsapp[wa]) porWhatsapp[wa] = [];
      porWhatsapp[wa].push(r);
    }
  }

  // Função para escolher o melhor registro de um grupo
  function escolherMelhor(grupo) {
    return grupo.sort((a, b) => {
      // 1. qualificado = true tem prioridade
      if (a.qualificado === true && b.qualificado !== true) return -1;
      if (b.qualificado === true && a.qualificado !== true) return 1;
      // 2. email_enviado = true tem prioridade
      if (a.email_enviado === true && b.email_enviado !== true) return -1;
      if (b.email_enviado === true && a.email_enviado !== true) return 1;
      // 3. mais antigo (created_at ou created_date)
      const da = new Date(a.created_at || a.created_date || 0).getTime();
      const db = new Date(b.created_at || b.created_date || 0).getTime();
      return da - db;
    })[0];
  }

  // Coletar IDs a deletar
  const idsParaDeletar = new Set();
  const grupos = [];

  // Processar duplicatas por email
  for (const [email, grupo] of Object.entries(porEmail)) {
    if (grupo.length > 1) {
      const melhor = escolherMelhor([...grupo]);
      const deletar = grupo.filter(r => r.id !== melhor.id).map(r => r.id);
      deletar.forEach(id => idsParaDeletar.add(id));
      grupos.push({ tipo: 'email', chave: email, total: grupo.length, manter: melhor.id, deletar });
    }
  }

  // Processar duplicatas por whatsapp (apenas se não já marcado para deletar)
  for (const [wa, grupo] of Object.entries(porWhatsapp)) {
    if (grupo.length > 1) {
      const grupoVivo = grupo.filter(r => !idsParaDeletar.has(r.id));
      if (grupoVivo.length > 1) {
        const melhor = escolherMelhor([...grupoVivo]);
        const deletar = grupoVivo.filter(r => r.id !== melhor.id).map(r => r.id);
        deletar.forEach(id => idsParaDeletar.add(id));
        grupos.push({ tipo: 'whatsapp', chave: wa, total: grupo.length, manter: melhor.id, deletar });
      }
    }
  }

  // Deletar sequencialmente com delay para evitar rate limit
  const idsArray = [...idsParaDeletar];
  let deletados = 0;
  const erros = [];

  for (let i = 0; i < idsArray.length; i++) {
    try {
      await base44.asServiceRole.entities.Inscricao.delete(idsArray[i]);
      deletados++;
      await sleep(300);
    } catch (e) {
      erros.push({ id: idsArray[i], erro: e?.message });
    }
  }

  // Verificação final: buscar duplicatas restantes
  const restantes = await base44.asServiceRole.entities.Inscricao.list('-created_date', 2000);
  const emailCount = {};
  const waCount = {};
  for (const r of restantes) {
    const em = (r.email || '').toLowerCase().trim();
    const wa = (r.whatsapp || '').replace(/\D/g, '');
    if (em) emailCount[em] = (emailCount[em] || 0) + 1;
    if (wa) waCount[wa] = (waCount[wa] || 0) + 1;
  }

  const emailsDuplicados = Object.entries(emailCount).filter(([, c]) => c > 1).map(([e, c]) => ({ email: e, count: c }));
  const wasDuplicados = Object.entries(waCount).filter(([, c]) => c > 1).map(([w, c]) => ({ whatsapp: w, count: c }));

  return Response.json({
    resumo: {
      totalAntes: todos.length,
      totalDeletados: deletados,
      totalDepois: restantes.length,
      erros: erros.length,
      detalhesErros: erros.slice(0, 5),
    },
    gruposDuplicatas: grupos,
    verificacaoFinal: {
      emailsDuplicadosRestantes: emailsDuplicados,
      whatsappsDuplicadosRestantes: wasDuplicados,
      limpo: emailsDuplicados.length === 0 && wasDuplicados.length === 0,
    },
  });
});