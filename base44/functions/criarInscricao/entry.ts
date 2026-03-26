import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// In-memory rate limiting: max 3 attempts per IP in 10 minutes
const tentativasPorIP = new Map();

function checkRateLimit(ip) {
  const agora = Date.now();
  const janela = 10 * 60 * 1000;
  const registro = tentativasPorIP.get(ip) || { count: 0, inicio: agora };
  if (agora - registro.inicio > janela) {
    tentativasPorIP.set(ip, { count: 1, inicio: agora });
    return { bloqueado: false };
  }
  if (registro.count >= 3) return { bloqueado: true };
  tentativasPorIP.set(ip, { count: registro.count + 1, inicio: registro.inicio });
  return { bloqueado: false };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Rate limiting por IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (rateCheck.bloqueado) {
    return Response.json({ error: 'Muitas tentativas. Tente novamente em 10 minutos.' }, { status: 429 });
  }

  const body = await req.json();
  const { nome, email, whatsapp, data_nascimento, idade, qualificado, email_enviado, origem, created_at } = body;

  if (!nome || !email || !whatsapp || !data_nascimento) {
    return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
  }

  // Normalização OBRIGATÓRIA antes de qualquer operação
  const emailNorm = email.toLowerCase().trim();
  const whatsappNorm = whatsapp.replace(/\D/g, ''); // apenas dígitos: 66999103431

  // Deduplicação server-side com dados normalizados
  // Busca por whatsapp em ambos os formatos (dígitos e mascarado) para compatibilidade com registros antigos
  console.log(JSON.stringify({ evento: 'TENTATIVA_INSCRICAO', email: emailNorm, whatsapp: whatsappNorm, ip, timestamp: new Date().toISOString() }));

  const [byEmail, byPhoneDigits, byPhoneMasked] = await Promise.all([
    base44.asServiceRole.entities.Inscricao.filter({ email: emailNorm }),
    base44.asServiceRole.entities.Inscricao.filter({ whatsapp: whatsappNorm }),
    base44.asServiceRole.entities.Inscricao.filter({ whatsapp: whatsapp.trim() }),
  ]);

  if (byEmail.length > 0) {
    console.log(JSON.stringify({ evento: 'DUPLICATA_BLOQUEADA', campo: 'email', email: emailNorm, timestamp: new Date().toISOString() }));
    return Response.json({ duplicate: true, campo: 'email', message: 'Este e-mail j\u00e1 est\u00e1 inscrito.' }, { status: 409 });
  }
  if (byPhoneDigits.length > 0 || byPhoneMasked.length > 0) {
    console.log(JSON.stringify({ evento: 'DUPLICATA_BLOQUEADA', campo: 'whatsapp', whatsapp: whatsappNorm, timestamp: new Date().toISOString() }));
    return Response.json({ duplicate: true, campo: 'whatsapp', message: 'Este WhatsApp j\u00e1 est\u00e1 inscrito.' }, { status: 409 });
  }

  // INSERT com try/catch para capturar race conditions
  let inscricao;
  try {
    inscricao = await base44.asServiceRole.entities.Inscricao.create({
      nome: nome.trim(),
      email: emailNorm,
      whatsapp: whatsapp.trim(), // salva formato original mascarado para consistência com registros existentes
      data_nascimento,
      idade,
      qualificado,
      email_enviado: email_enviado ?? false,
      origem,
      created_at: created_at || new Date().toISOString(),
    });
  } catch (error) {
    const msg = error?.message || '';
    const isDuplicata = msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate') || msg.includes('11000') || msg.includes('23505');
    console.error(JSON.stringify({ evento: 'INSERT_ERROR', email: emailNorm, error: msg, timestamp: new Date().toISOString() }));
    if (isDuplicata) {
      return Response.json({ duplicate: true, message: 'Inscri\u00e7\u00e3o j\u00e1 existe.' }, { status: 409 });
    }
    return Response.json({ error: 'Erro ao processar inscri\u00e7\u00e3o.' }, { status: 500 });
  }

  console.log(JSON.stringify({ evento: 'INSCRICAO_CRIADA', email: emailNorm, id: inscricao?.id, timestamp: new Date().toISOString() }));
  return Response.json({ success: true, inscricao });
});