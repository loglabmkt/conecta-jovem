import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const HEADER = `
  <div style="background:linear-gradient(135deg,#F97316,#3B82F6);padding:32px 40px;text-align:center;">
    <span style="color:#fff;font-size:24px;font-weight:700;font-family:'Inter',Arial,sans-serif;">Conecta Jovem</span>
  </div>
`;

const FOOTER = `
  <div style="background:#0F172A;padding:24px 40px;text-align:center;">
    <p style="color:#64748B;font-size:12px;margin:0;">© 2026 Conecta Jovem · Todos os direitos reservados</p>
    <p style="color:#475569;font-size:11px;margin:8px 0 0 0;">Você está recebendo este e-mail porque se inscreveu em conectajovem.loglabdigital.com.br</p>
  </div>
`;

function htmlQualificado(nome) {
  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  ${HEADER}
  <div style="padding:40px 40px 32px 40px;">
    <p style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 16px 0;">Olá, ${nome}! 👋</p>
    <p style="font-size:15px;color:#374151;margin:0 0 8px 0;">Aqui é a Amanda, do Conecta Jovem!</p>
    <p style="font-size:15px;color:#374151;margin:0 0 20px 0;">Continue sua inscrição no Conecta Jovem: envie um vídeo curto de breve apresentação (até 1m30s) no WhatsApp.</p>
    <div style="height:2px;background:linear-gradient(135deg,#F97316,#3B82F6);margin:24px 0;border-radius:2px;"></div>
    <p style="font-size:14px;font-weight:700;color:#0F172A;margin:0 0 16px 0;">No vídeo, responda apenas:</p>
    <div style="margin-bottom:12px;display:flex;align-items:flex-start;gap:12px;">
      <div style="min-width:24px;height:24px;background:#F97316;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;margin-right:12px;">1</div>
      <span style="font-size:14px;color:#374151;">Qual seu nome e idade?</span>
    </div>
    <div style="margin-bottom:12px;">
      <div style="min-width:24px;height:24px;background:#F97316;border-radius:50%;display:inline-block;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;margin-right:12px;width:24px;">2</div>
      <span style="font-size:14px;color:#374151;">Com quem você mora?</span>
    </div>
    <div style="margin-bottom:12px;">
      <div style="min-width:24px;height:24px;background:#F97316;border-radius:50%;display:inline-block;color:#fff;font-size:12px;font-weight:700;text-align:center;line-height:24px;margin-right:12px;width:24px;">3</div>
      <span style="font-size:14px;color:#374151;">Por que você quer participar do programa?</span>
    </div>
    <div style="background:#FFF7ED;border-left:4px solid #F97316;border-radius:8px;padding:16px 20px;margin:24px 0;">
      <p style="font-size:13px;color:#C2410C;font-style:italic;margin:0;">📱 Dica rápida: Grave com o celular em pé, em um lugar claro e sem muito barulho.</p>
    </div>
    <a href="https://wa.me/556598083086?text=Ol%C3%A1%20Amanda!%20Vim%20pelo%20Conecta%20Jovem%20e%20quero%20enviar%20meu%20v%C3%ADdeo%20de%20inscri%C3%A7%C3%A3o!"
       target="_blank"
       style="background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;text-decoration:none;display:block;text-align:center;padding:16px 32px;border-radius:14px;font-size:16px;font-weight:700;margin:28px 0 8px 0;">
      📹 Envie seu vídeo agora
    </a>
    <p style="font-size:12px;color:#94A3B8;text-align:center;margin:0;">💬 WhatsApp: (65) 98083-0860</p>
  </div>
  ${FOOTER}
</div>
</body></html>`;
}

function htmlNaoQualificado(nome) {
  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  ${HEADER}
  <div style="padding:40px;">
    <p style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 16px 0;">Olá, ${nome}! 👋</p>
    <p style="font-size:15px;color:#374151;margin:0 0 4px 0;">Aqui é a Amanda, do Conecta Jovem!</p>
    <p style="font-size:15px;color:#374151;margin:16px 0;">Agradecemos muito o seu interesse em fazer parte do nosso projeto.</p>
    <div style="background:#FFF1F2;border-left:4px solid #F43F5E;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="font-size:14px;color:#BE123C;margin:0;">Como o nosso edital desta edição é focado exclusivamente na formação de jovens de 15 a 24 anos, infelizmente a sua inscrição não poderá avançar para a próxima fase desta vez.</p>
    </div>
    <p style="font-size:15px;font-weight:600;color:#0F172A;margin:20px 0 8px 0;">Mas você ainda pode ajudar a transformar o futuro de alguém! 💛</p>
    <p style="font-size:14px;color:#374151;margin:0 0 16px 0;">Se você conhece algum jovem da Baixada Cuiabana que tenha entre 15 e 24 anos, encaminhe o nosso site para ele não perder essa chance:</p>
    <a href="https://conectajovem.loglabdigital.com.br"
       target="_blank"
       style="background:linear-gradient(135deg,#F97316,#EA580C);color:#fff;text-decoration:none;display:block;text-align:center;padding:14px 32px;border-radius:14px;font-size:15px;font-weight:700;margin:20px 0;">
      🔗 Compartilhar o Conecta Jovem
    </a>
    <p style="font-size:14px;color:#64748B;text-align:center;margin-top:20px;">Obrigada por apoiar a nossa iniciativa e espalhar essa ideia! 🚀</p>
  </div>
  ${FOOTER}
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { nome, email, data_nascimento } = await req.json();

    // Calcular idade a partir de DD/MM/AAAA
    const parts = (data_nascimento || '').split('/');
    if (parts.length !== 3) {
      return Response.json({ error: 'Data inválida' }, { status: 400 });
    }
    const nascimento = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;

    const qualificado = idade >= 15 && idade <= 24;

    // Enviar e-mail via Resend
    let emailEnviado = false;
    try {
      await resend.emails.send({
        from: 'Amanda · Conecta Jovem <noreply@loglabdigital.com.br>',
        to: email,
        subject: qualificado
          ? '🚀 Continue sua inscrição no Conecta Jovem!'
          : 'Obrigada pelo seu interesse no Conecta Jovem 💙',
        html: qualificado ? htmlQualificado(nome) : htmlNaoQualificado(nome),
      });
      emailEnviado = true;
    } catch (emailErr) {
      console.error('Resend error:', emailErr.message);
    }

    return Response.json({ qualificado, idade, emailEnviado });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});