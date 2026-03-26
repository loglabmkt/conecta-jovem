import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

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

  if (byEmail.length > 0 || byPhone.length > 0) {
    return Response.json({ duplicate: true, message: 'Inscrição já existe.' }, { status: 409 });
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