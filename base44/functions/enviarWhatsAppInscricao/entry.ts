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

  // Buscar lead no banco
  const inscricoes = await base44.asServiceRole.entities.Inscricao.filter({ id: inscricaoId });
  const inscricao = inscricoes?.[0];

  if (!inscricao) {
    return Response.json({ sucesso: false, erro: 'Inscrição não encontrada.' }, { status: 404 });
  }

  // Proteção: não reenviar antes de 1 hora
  if (inscricao.whatsapp_enviado_em) {
    const diff = Date.now() - new Date(inscricao.whatsapp_enviado_em).getTime();
    if (diff < 60 * 60 * 1000) {
      const minutosRestantes = Math.ceil((60 * 60 * 1000 - diff) / 60000);
      return Response.json({
        sucesso: false,
        erro: `Mensagem já enviada. Aguarde ${minutosRestantes} minuto(s) para reenviar.`
      }, { status: 429 });
    }
  }

  // Normalizar número
  const numeroLimpo = (inscricao.whatsapp || '').replace(/\D/g, '');
  if (numeroLimpo.length < 10 || numeroLimpo.length > 13) {
    return Response.json({ sucesso: false, erro: 'Número de WhatsApp inválido.' }, { status: 400 });
  }
  const numeroFinal = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;

  // Primeiro nome
  const primeiroNome = (inscricao.nome || '').trim().split(' ')[0];

  const payload = {
    whatsapp_account_id: Deno.env.get('WHATSAPP_ACCOUNT_ID'),
    template_sid: Deno.env.get('WHATSAPP_TEMPLATE_SID'),
    to: numeroFinal,
    content_variables: { "1": primeiroNome }
  };

  const response = await fetch(Deno.env.get('WHATSAPP_API_URL'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-system-id': Deno.env.get('WHATSAPP_SYSTEM_ID'),
      'Authorization': `Bearer ${Deno.env.get('WHATSAPP_API_KEY')}`
    },
    body: JSON.stringify(payload)
  });

  const resultado = await response.json();

  if (!response.ok) {
    console.error(JSON.stringify({ evento: 'WHATSAPP_ERROR', inscricaoId, resultado }));
    return Response.json({ sucesso: false, erro: resultado.message || 'Erro na API do WhatsApp', status: response.status }, { status: 502 });
  }

  // Atualizar banco
  await base44.asServiceRole.entities.Inscricao.update(inscricao.id, {
    whatsapp_enviado: true,
    whatsapp_enviado_em: new Date().toISOString()
  });

  console.log(JSON.stringify({ evento: 'WHATSAPP_ENVIADO', inscricaoId, numero: numeroFinal, nome: primeiroNome, timestamp: new Date().toISOString() }));

  return Response.json({ sucesso: true, resultado });
});