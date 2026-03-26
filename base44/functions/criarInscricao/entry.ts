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

  if (registro.count >= 3) {
    return { bloqueado: true };
  }

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

  const emailLower = email.toLowerCase().trim();

  // Deduplicação server-side: bloqueia se email ou whatsapp já existir
  const [byEmail, byPhone] = await Promise.all([
    base44.asServiceRole.entities.Inscricao.filter({ email: emailLower }),
    base44.asServiceRole.entities.Inscricao.filter({ whatsapp: whatsapp }),
  ]);

  if (byEmail.length > 0) {
    return Response.json({ duplicate: true, campo: 'email', message: 'Este e-mail já está inscrito.' }, { status: 409 });
  }
  if (byPhone.length > 0) {
    return Response.json({ duplicate: true, campo: 'whatsapp', message: 'Este WhatsApp já está inscrito.' }, { status: 409 });
  }

  const inscricao = await base44.asServiceRole.entities.Inscricao.create({
    nome: nome.trim(),
    email: emailLower,
    whatsapp,
    data_nascimento,
    idade,
    qualificado,
    email_enviado: email_enviado ?? false,
    origem,
    created_at: created_at || new Date().toISOString(),
  });

  return Response.json({ success: true, inscricao });
});