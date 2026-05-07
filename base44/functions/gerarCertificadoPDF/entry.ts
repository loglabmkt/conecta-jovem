import { createClientFromRequest } from 'npm:@base44/sdk@0.8.27';
import { jsPDF } from 'npm:jspdf@2.5.1';
import QRCode from 'npm:qrcode@1.5.4';
import { encodeBase64 } from 'jsr:@std/encoding@1.0.5/base64';

function gerarCodigo() {
  return 'CJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Conversão segura: usa encodeBase64 do Deno std (não corrompe bytes)
async function urlToBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buf = await res.arrayBuffer();
  return encodeBase64(new Uint8Array(buf));
}

function detectarFormato(url, contentType) {
  const u = (url || '').toLowerCase();
  const ct = (contentType || '').toLowerCase();
  if (u.endsWith('.png') || ct.includes('png')) return 'PNG';
  if (u.endsWith('.webp') || ct.includes('webp')) return 'WEBP';
  return 'JPEG';
}

async function carregarImagem(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar: ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  const buf = await res.arrayBuffer();
  const base64 = encodeBase64(new Uint8Array(buf));
  const formato = detectarFormato(url, contentType);
  return { base64, formato };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { template_id, nome_aluno, nome_curso, data_conclusao } = await req.json();

    if (!template_id || !nome_aluno || !nome_curso || !data_conclusao) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const templates = await base44.asServiceRole.entities.CertificadoTemplate.filter({ id: template_id });
    const template = templates?.[0];
    if (!template) {
      return Response.json({ error: 'Template não encontrado.' }, { status: 404 });
    }

    const codigo = gerarCodigo();
    const validacaoUrl = `https://conectajovem.loglabdigital.com.br/certificado/${codigo}`;

    // QR Code (será usado apenas no verso)
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 200, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];

    const textoFinal = (template.texto_certificado || '')
      .replace(/\{full_name\}/g, nome_aluno)
      .replace(/\{course_name\}/g, nome_curso)
      .replace(/\{completion_date\}/g, data_conclusao);

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
    const W = 297;
    const H = 210;

    // ─── Página 1 — FRENTE ────────────────────────────────────────────────
    if (template.imagem_fundo_url) {
      try {
        const { base64, formato } = await carregarImagem(template.imagem_fundo_url);
        doc.addImage(base64, formato, 0, 0, W, H, undefined, 'FAST');
      } catch (e) {
        console.error('[PDF] Erro fundo frente:', e.message);
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, W, H, 'F');
      }
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, 'F');
    }

    // Texto centralizado
    const linhas = textoFinal.split('\n');
    const lineHeight = 9;
    const startY = H / 2 - (linhas.length * lineHeight) / 2;

    linhas.forEach((linha, idx) => {
      const yPos = startY + idx * lineHeight;
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);

      if (linha.includes(nome_aluno)) {
        const partes = linha.split(nome_aluno);
        const antes = partes[0];
        const depois = partes[1] || '';
        doc.setFont('helvetica', 'normal');
        const larguraAntes = doc.getTextWidth(antes);
        const larguraNome = (() => {
          doc.setFont('helvetica', 'bold');
          const w = doc.getTextWidth(nome_aluno);
          doc.setFont('helvetica', 'normal');
          return w;
        })();
        const larguraDepois = doc.getTextWidth(depois);
        const totalW = larguraAntes + larguraNome + larguraDepois;
        let x = (W - totalW) / 2;

        doc.text(antes, x, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(nome_aluno, x + larguraAntes, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(depois, x + larguraAntes + larguraNome, yPos);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.text(linha, W / 2, yPos, { align: 'center' });
      }
    });

    // ─── Página 2 — VERSO (com QR Code) ──────────────────────────────────
    const temVerso = template.verso_habilitado;
    if (temVerso) {
      doc.addPage();

      if (template.verso_imagem_url) {
        try {
          const { base64, formato } = await carregarImagem(template.verso_imagem_url);
          doc.addImage(base64, formato, 0, 0, W, H, undefined, 'FAST');
        } catch (e) {
          console.error('[PDF] Erro fundo verso:', e.message);
          doc.setFillColor(250, 250, 250);
          doc.rect(0, 0, W, H, 'F');
        }
      } else {
        doc.setFillColor(250, 250, 250);
        doc.rect(0, 0, W, H, 'F');
      }

      // Título
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text('CONTEÚDO PROGRAMÁTICO', W / 2, 25, { align: 'center' });

      // Linha decorativa laranja
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(1.2);
      doc.line(W / 2 - 60, 30, W / 2 + 60, 30);

      // Conteúdo programático
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      const linhasVerso = (template.verso_conteudo || '').split('\n');
      let yVerso = 42;
      const yLimite = H - 55; // reserva espaço para QR Code no rodapé
      linhasVerso.forEach(l => {
        if (yVerso > yLimite) return;
        doc.text(l, 20, yVerso);
        yVerso += 7;
      });

      // QR Code no rodapé centralizado
      const qrSize = 32;
      const qrX = (W - qrSize) / 2;
      const qrY = H - qrSize - 14;
      doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

      // Texto de validação ao lado do QR
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Verifique a autenticidade deste certificado', W / 2, qrY - 4, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`Código: ${codigo}`, W / 2, H - 8, { align: 'center' });
    } else {
      // Se não tem verso habilitado, cria página simples só com QR Code de validação
      doc.addPage();
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, W, H, 'F');

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text('VALIDAÇÃO DO CERTIFICADO', W / 2, 50, { align: 'center' });

      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(1.2);
      doc.line(W / 2 - 60, 56, W / 2 + 60, 56);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text('Escaneie o QR Code abaixo para verificar a autenticidade.', W / 2, 70, { align: 'center' });

      const qrSize = 60;
      const qrX = (W - qrSize) / 2;
      const qrY = 85;
      doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(`Código: ${codigo}`, W / 2, qrY + qrSize + 10, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(validacaoUrl, W / 2, qrY + qrSize + 18, { align: 'center' });
    }

    // Salvar registro
    await base44.asServiceRole.entities.CertificadoEmitido.create({
      template_id,
      codigo_rastreio: codigo,
      nome_aluno,
      nome_curso,
      data_conclusao,
      created_at: new Date().toISOString(),
    });

    // Retornar PDF como base64 dentro de JSON (evita corrupção pelo SDK frontend)
    const pdfBuffer = doc.output('arraybuffer');
    const pdfBase64 = encodeBase64(new Uint8Array(pdfBuffer));
    const filename = `certificado_${nome_aluno.replace(/\s+/g, '_')}_${codigo}.pdf`;

    return Response.json({
      success: true,
      pdf_base64: pdfBase64,
      filename,
      codigo,
    });

  } catch (error) {
    console.error('[PDF_ERRO]', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});