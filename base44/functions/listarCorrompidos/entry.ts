import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  const corrompidos = await base44.asServiceRole.entities.Inscricao.filter({ whatsapp: "(65) 98446-6587" });

  const lista = corrompidos.map(r => ({
    id: r.id,
    nome: r.nome,
    email: r.email,
    whatsapp: r.whatsapp,
    created_date: r.created_date,
  }));

  return Response.json({ total: lista.length, registros: lista });
});