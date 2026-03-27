import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  const { inscricaoId } = await req.json();
  if (!inscricaoId) {
    return Response.json({ error: 'inscricaoId é obrigatório.' }, { status: 400 });
  }

  // ETAPA 1 — Buscar inscrição
  let inscricao;
  try {
    const inscricoes = await base44.asServiceRole.entities.Inscricao.filter({ id: inscricaoId });
    inscricao = inscricoes?.[0];
    console.log('[WA_STEP1] Inscrição encontrada:', inscricao ? inscricao.id : 'NÃO ENCONTRADA');
    console.log('[WA_STEP1] Dados:', JSON.stringify({ nome: inscricao?.nome, whatsapp: inscricao?.whatsapp, qualificado: inscricao?.qualificado }));
  } catch (e) {
    console.error('[WA_STEP1_ERROR]', e.message, e.stack);
    return Response.json({ sucesso: false, step: 'STEP1', erro: e.message }, { status: 500 });
  }

  if (!inscricao) {
    console.error('[WA_STEP1] Inscrição não encontrada para id:', inscricaoId);
    return Response.json({ sucesso: false, step: 'STEP1', erro: 'Inscrição não encontrada: ' + inscricaoId }, { status: 404 });
  }

  // Proteção: não reenviar antes de 1 hora
  if (inscricao.whatsapp_enviado_em) {
    const diff = Date.now() - new Date(inscricao.whatsapp_enviado_em).getTime();
    if (diff < 60 * 60 * 1000) {
      const minutosRestantes = Math.ceil((60 * 60 * 1000 - diff) / 60000);
      return Response.json({ sucesso: false, erro: `Mensagem já enviada. Aguarde ${minutosRestantes} minuto(s) para reenviar.` }, { status: 429 });
    }
  }

  // ETAPA 2 — Normalizar número
  let numeroFinal;
  try {
    const numeroLimpo = (inscricao.whatsapp || '').replace(/\D/g, '');
    console.log('[WA_STEP2] numeroLimpo:', numeroLimpo, 'length:', numeroLimpo.length);
    if (numeroLimpo.length < 10 || numeroLimpo.length > 13) {
      return Response.json({ sucesso: false, step: 'STEP2', erro: 'Número inválido: ' + numeroLimpo }, { status: 400 });
    }
    numeroFinal = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    console.log('[WA_STEP2] Número normalizado:', numeroFinal);
  } catch (e) {
    console.error('[WA_STEP2_ERROR]', e.message);
    return Response.json({ sucesso: false, step: 'STEP2', erro: e.message }, { status: 500 });
  }

  // ETAPA 3 — Montar payload
  let payload;
  try {
    const primeiroNome = (inscricao.nome || '').trim().split(' ')[0];
    const accountId = Deno.env.get('WHATSAPP_ACCOUNT_ID');
    const templateSid = Deno.env.get('WHATSAPP_TEMPLATE_SID');
    const apiUrl = Deno.env.get('WHATSAPP_API_URL');
    const systemId = Deno.env.get('WHATSAPP_SYSTEM_ID');
    const apiKey = Deno.env.get('WHATSAPP_API_KEY');
    console.log('[WA_STEP3] Env vars presentes:', {
      accountId: !!accountId,
      templateSid: !!templateSid,
      apiUrl: !!apiUrl,
      systemId: !!systemId,
      apiKey: !!apiKey,
      apiUrlValue: apiUrl,
    });
    payload = {
      whatsapp_account_id: accountId,
      template_sid: templateSid,
      to: numeroFinal,
      content_variables: { "1": primeiroNome }
    };
    console.log('[WA_STEP3] Payload montado:', JSON.stringify(payload));
  } catch (e) {
    console.error('[WA_STEP3_ERROR]', e.message);
    return Response.json({ sucesso: false, step: 'STEP3', erro: e.message }, { status: 500 });
  }

  // ETAPA 4 — Chamada HTTP para API externa
  let response;
  try {
    const apiUrl = Deno.env.get('WHATSAPP_API_URL');
    const systemId = Deno.env.get('WHATSAPP_SYSTEM_ID');
    const apiKey = Deno.env.get('WHATSAPP_API_KEY');
    console.log('[WA_STEP4] Iniciando fetch para:', apiUrl);
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-system-id': systemId,
      },
      body: JSON.stringify({
        whatsapp_account_id: Deno.env.get('WHATSAPP_ACCOUNT_ID'),
        template_sid: Deno.env.get('WHATSAPP_TEMPLATE_SID'),
        to: numeroFinal,
      })
    });
    console.log('[WA_STEP4] HTTP Status:', response.status, response.statusText);
  } catch (e) {
    console.error('[WA_STEP4_NETWORK_ERROR]', e.message, e.name, String(e.cause));
    return Response.json({ sucesso: false, step: 'STEP4_NETWORK', erro: e.message, name: e.name, cause: String(e.cause) }, { status: 502 });
  }

  // ETAPA 5 — Ler resposta
  let resultado;
  try {
    const texto = await response.text();
    console.log('[WA_STEP5] Resposta raw:', texto);
    try { resultado = JSON.parse(texto); } catch { resultado = { raw: texto }; }
  } catch (e) {
    console.error('[WA_STEP5_ERROR]', e.message);
    return Response.json({ sucesso: false, step: 'STEP5', erro: e.message }, { status: 500 });
  }

  if (!response.ok) {
    console.error('[WA_STEP5] API retornou erro:', response.status, JSON.stringify(resultado));
    return Response.json({ sucesso: false, step: 'API_ERROR', httpStatus: response.status, erro: resultado?.message || JSON.stringify(resultado) }, { status: 502 });
  }

  // ETAPA 6 — Atualizar banco
  try {
    await base44.asServiceRole.entities.Inscricao.update(inscricao.id, {
      whatsapp_enviado: true,
      whatsapp_enviado_em: new Date().toISOString()
    });
    console.log('[WA_STEP6] Banco atualizado com sucesso.');
  } catch (e) {
    console.error('[WA_STEP6_ERROR]', e.message);
    // Não falha o request por isso
  }

  console.log('[WA_DONE] Mensagem enviada com sucesso para', numeroFinal);
  return Response.json({ sucesso: true, resultado });
});