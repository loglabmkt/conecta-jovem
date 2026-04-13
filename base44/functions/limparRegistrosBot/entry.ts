import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const ID_LEGITIMO = '69d82b300b799bff1443d943';
const EMAIL_BOT = 'riquelmemiranda3374@gmail.com';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  let totalDeletado = 0;
  let totalErros = 0;
  let rodada = 0;

  // Loop: fetch → delete → repeat até filter retornar só o legítimo (ou vazio)
  while (rodada < 30) {
    rodada++;

    const lote = await base44.asServiceRole.entities.Inscricao.filter(
      { email: EMAIL_BOT }, '-created_date', 500
    );

    const paraDeletear = (lote || []).filter(r => r.id !== ID_LEGITIMO);
    console.log(`[RODADA ${rodada}] filter retornou ${lote?.length || 0}, para deletar: ${paraDeletear.length}`);

    if (paraDeletear.length === 0) {
      console.log('[DONE] Nenhum bot restante.');
      break;
    }

    for (const r of paraDeletear) {
      try {
        await base44.asServiceRole.entities.Inscricao.delete(r.id);
        totalDeletado++;
        if (totalDeletado % 20 === 0) console.log(`[PROGRESS] ${totalDeletado} deletados no total`);
      } catch (e) {
        if (e.message?.includes('not found') || e.message?.includes('404')) {
          // já deletado, ignorar
        } else if (e.message?.includes('Rate limit')) {
          console.error('[RATE LIMIT] aguardando 3s...');
          await new Promise(r => setTimeout(r, 3000));
          totalErros++;
        } else {
          console.error(`[ERRO] ${r.id}: ${e.message}`);
          totalErros++;
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }

    // Pausa entre rodadas
    await new Promise(r => setTimeout(r, 500));
  }

  // Verificação final
  const restantesEmail = await base44.asServiceRole.entities.Inscricao.filter(
    { email: EMAIL_BOT }, '-created_date', 500
  );
  const totalGeral = await base44.asServiceRole.entities.Inscricao.list('-created_date', 500);

  return Response.json({
    rodadas_executadas: rodada,
    total_deletado: totalDeletado,
    total_erros: totalErros,
    restantes_com_email_bot: restantesEmail.length,
    restantes_ids: restantesEmail.map(r => ({ id: r.id, nome: r.data?.nome })),
    total_geral_banco: totalGeral.length,
  });
});