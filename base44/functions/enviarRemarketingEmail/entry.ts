import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

function htmlRemarketing(nome) {
  const primeiroNome = (nome || '').trim().split(' ')[0];
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:Arial,sans-serif;">
  <div style="background:linear-gradient(135deg,#F97316,#3B82F6);padding:28px 40px;text-align:center;">
    <span style="color:#fff;font-size:22px;font-weight:700;">Conecta Jovem</span>
  </div>
  <div style="padding:36px 40px;">
    <p style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 12px 0;">Olá, ${primeiroNome}! 👋</p>
    <p style="font-size:15px;color:#374151;margin:0 0 16px 0;">Aqui é a Amanda, do Conecta Jovem!</p>
    <p style="font-size:15px;color:#374151;margin:0 0 20px 0;">Continue sua inscrição no Conecta Jovem: envie um vídeo curto de breve apresentação (até 1m30s) no WhatsApp.</p>
    <p style="font-size:14px;font-weight:700;color:#0F172A;margin:0 0 12px 0;">No vídeo, responda apenas:</p>
    <div style="margin-bottom:10px;display:flex;align-items:center;gap:12px;">
      <span style="display:inline-block;min-width:24px;height:24px;width:24px;background:#F97316;border-radius:50%;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">1</span>
      <span style="font-size:14px;color:#374151;">Qual seu nome e idade?</span>
    </div>
    <div style="margin-bottom:10px;display:flex;align-items:center;gap:12px;">
      <span style="display:inline-block;min-width:24px;height:24px;width:24px;background:#F97316;border-radius:50%;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">2</span>
      <span style="font-size:14px;color:#374151;">Com quem você mora?</span>
    </div>
    <div style="margin-bottom:10px;display:flex;align-items:center;gap:12px;">
      <span style="display:inline-block;min-width:24px;height:24px;width:24px;background:#F97316;border-radius:50%;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">3</span>
      <span style="font-size:14px;color:#374151;">Por que você quer participar do programa?</span>
    </div>
    <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:8px;padding:14px 18px;margin:20px 0;">
      <p style="font-size:13px;color:#C2410C;font-style:italic;margin:0;">📱 Dica rápida: Grave com o celular em pé, em um lugar claro e sem muito barulho.</p>
    </div>
    <a href="https://wa.me/5565998083086?text=Ol%C3%A1%20Amanda!%20Vim%20pelo%20Conecta%20Jovem%20e%20quero%20enviar%20meu%20v%C3%ADdeo%20de%20inscri%C3%A7%C3%A3o!"
       target="_blank"
       style="background:#25D366;color:#fff;text-decoration:none;display:block;text-align:center;padding:16px 32px;border-radius:12px;font-size:16px;font-weight:700;margin:24px 0;">
      📹 Envie seu vídeo agora
    </a>
  </div>
  <div style="background:#0F172A;padding:20px 40px;text-align:center;">
    <p style="color:#64748B;font-size:11px;margin:0;">© 2026 Conecta Jovem · Todos os direitos reservados</p>
  </div>
</div>
</body></html>`;
}

const LOTE = 10;
const DELAY_MS = 100;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  // Buscar todos qualificados
  const qualificados = await base44.asServiceRole.entities.Inscricao.filter({ qualificado: true });
  console.log(`[REMARKETING] Total qualificados: ${qualificados.length}`);

  let enviados = 0;
  let falhas = 0;
  const logs = [];

  for (let i = 0; i < qualificados.length; i += LOTE) {
    const lote = qualificados.slice(i, i + LOTE);
    for (const inscricao of lote) {
      try {
        await resend.emails.send({
          from: 'Amanda · Conecta Jovem <noreply@loglabdigital.com.br>',
          to: inscricao.email,
          subject: '📹 Continue sua inscrição no Conecta Jovem!',
          html: htmlRemarketing(inscricao.nome),
        });
        enviados++;
        logs.push({ email: inscricao.email, nome: inscricao.nome, status: 'enviado' });
        console.log(`[OK] ${inscricao.email}`);
      } catch (e) {
        falhas++;
        logs.push({ email: inscricao.email, nome: inscricao.nome, status: 'falha', erro: e.message });
        console.error(`[ERRO] ${inscricao.email}: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  // Registrar log em lote
  if (logs.length > 0) {
    try {
      await base44.asServiceRole.entities.RemarketingLog.bulkCreate(
        logs.map(l => ({
          email: l.email,
          nome: l.nome,
          status: l.status,
          erro: l.erro || null,
          created_at: new Date().toISOString(),
        }))
      );
    } catch (e) {
      console.error('[LOG_ERRO]', e.message);
    }
  }

  return Response.json({
    total: qualificados.length,
    enviados,
    falhas,
  });
});