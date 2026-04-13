import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// ── Rate limiting em memória ──────────────────────────────────────────────────
// tentativas: conta qualquer requisição (inclui falhas)
// sucessos:   conta apenas INSERTs bem-sucedidos
const tentativasPorIP = new Map();
const sucessosPorIP   = new Map();

function checkRateLimit(ip) {
  const agora = Date.now();
  const JANELA_TENTATIVAS = 5 * 60 * 1000;  // 5 minutos
  const JANELA_SUCESSO    = 30 * 60 * 1000; // 30 minutos
  const MAX_TENTATIVAS    = 3;
  const MAX_SUCESSO       = 1;

  // Bloquear se >= 3 tentativas em 5 min
  const reg = tentativasPorIP.get(ip) || { count: 0, inicio: agora };
  if (agora - reg.inicio > JANELA_TENTATIVAS) {
    tentativasPorIP.set(ip, { count: 1, inicio: agora });
  } else {
    if (reg.count >= MAX_TENTATIVAS) {
      return { bloqueado: true, motivo: 'rate_limit_tentativas' };
    }
    tentativasPorIP.set(ip, { count: reg.count + 1, inicio: reg.inicio });
  }

  // Bloquear se já teve 1 sucesso nos últimos 30 min
  const suc = sucessosPorIP.get(ip) || { count: 0, inicio: agora };
  if (agora - suc.inicio <= JANELA_SUCESSO && suc.count >= MAX_SUCESSO) {
    return { bloqueado: true, motivo: 'rate_limit_sucesso' };
  }

  return { bloqueado: false };
}

function registrarSucesso(ip) {
  const agora = Date.now();
  const suc = sucessosPorIP.get(ip) || { count: 0, inicio: agora };
  sucessosPorIP.set(ip, { count: suc.count + 1, inicio: suc.inicio });
}

// ── Handler ───────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown';

  const rateCheck = checkRateLimit(ip);
  if (rateCheck.bloqueado) {
    console.log(JSON.stringify({ evento: 'BLOQUEADO_RATE_LIMIT', ip, motivo: rateCheck.motivo, timestamp: new Date().toISOString() }));
    return Response.json({ error: 'Muitas tentativas. Aguarde antes de tentar novamente.' }, { status: 429 });
  }

  const body = await req.json();
  const { nome, email, whatsapp, data_nascimento, idade, qualificado, email_enviado, origem, created_at, _hp } = body;

  // ── Honeypot: bots preenchem campo oculto, humanos não ──
  if (_hp && _hp.trim() !== '') {
    console.log(JSON.stringify({ evento: 'HONEYPOT_DETECTADO', ip, timestamp: new Date().toISOString() }));
    return Response.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  if (!nome || !email || !whatsapp || !data_nascimento) {
    return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
  }

  const emailNorm    = email.toLowerCase().trim();
  const whatsappNorm = whatsapp.replace(/\D/g, '');

  console.log(JSON.stringify({ evento: 'TENTATIVA_INSCRICAO', email: emailNorm, whatsapp: whatsappNorm, ip, timestamp: new Date().toISOString() }));

  // ── Proteção atômica: tentar INSERT direto e capturar violação de unicidade ──
  // Ainda fazemos 1 check rápido para retornar mensagem mais precisa ao usuário,
  // mas o INSERT dentro do try/catch é a verdadeira barreira atômica contra race condition.
  const [byEmail, byPhoneDigits, byPhoneMasked] = await Promise.all([
    base44.asServiceRole.entities.Inscricao.filter({ email: emailNorm }),
    base44.asServiceRole.entities.Inscricao.filter({ whatsapp: whatsappNorm }),
    base44.asServiceRole.entities.Inscricao.filter({ whatsapp: whatsapp.trim() }),
  ]);

  if (byEmail.length > 0) {
    console.log(JSON.stringify({ evento: 'DUPLICATA_BLOQUEADA', campo: 'email', email: emailNorm, timestamp: new Date().toISOString() }));
    return Response.json({ duplicate: true, campo: 'email', message: 'Este e-mail já está inscrito.' }, { status: 409 });
  }
  if (byPhoneDigits.length > 0 || byPhoneMasked.length > 0) {
    console.log(JSON.stringify({ evento: 'DUPLICATA_BLOQUEADA', campo: 'whatsapp', whatsapp: whatsappNorm, timestamp: new Date().toISOString() }));
    return Response.json({ duplicate: true, campo: 'whatsapp', message: 'Este WhatsApp já está inscrito.' }, { status: 409 });
  }

  // ── INSERT atômico — race condition tratada aqui ──────────────────────────
  let inscricao;
  try {
    inscricao = await base44.asServiceRole.entities.Inscricao.create({
      nome: nome.trim(),
      email: emailNorm,
      whatsapp: whatsapp.trim(),
      data_nascimento,
      idade,
      qualificado,
      email_enviado: email_enviado ?? false,
      origem,
      created_at: created_at || new Date().toISOString(),
    });
  } catch (error) {
    const msg = (error?.message || '').toLowerCase();
    const isDuplicata =
      msg.includes('unique') ||
      msg.includes('duplicate') ||
      msg.includes('already exists') ||
      msg.includes('11000') ||
      msg.includes('23505') ||
      error?.code === '23505';

    console.error(JSON.stringify({ evento: 'INSERT_ERROR', email: emailNorm, error: error?.message, timestamp: new Date().toISOString() }));

    if (isDuplicata) {
      return Response.json({ duplicate: true, message: 'Inscrição já existe.' }, { status: 409 });
    }
    return Response.json({ error: 'Erro ao processar inscrição.' }, { status: 500 });
  }

  registrarSucesso(ip);
  console.log(JSON.stringify({ evento: 'INSCRICAO_CRIADA', email: emailNorm, id: inscricao?.id, timestamp: new Date().toISOString() }));
  return Response.json({ success: true, inscricao });
});