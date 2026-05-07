import { createClientFromRequest } from 'npm:@base44/sdk@0.8.27';
import { jsPDF } from 'npm:jspdf@2.5.2';
import QRCode from 'npm:qrcode@1.5.4';

function gerarCodigo() {
  return 'CJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Conversão segura de ArrayBuffer para base64 (em chunks pra evitar stack overflow)
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

async function urlToBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buf = await res.arrayBuffer();
  return arrayBufferToBase64(buf);
}

function detectarFormatoImagem(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('.png')) return 'PNG';
  if (u.includes('.webp')) return 'WEBP';
  return 'JPEG';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { template_id, nome_aluno, nome_curso, data_conclusao } = await req.json();

    if (!template_id || !nome_aluno || !nome_curso || !data_conclusao) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    // Buscar template
    const templates = await base44.asServiceRole.entities.CertificadoTemplate.filter({ id: template_id });
    const template = templates?.[0];
    if (!template) {
      return Response.json({ error: 'Template não encontrado.' }, { status: 404 });
    }

    const codigo = gerarCodigo();
    const validacaoUrl = `https://conectajovem.loglabdigital.com.br/certificado/${codigo}`;

    // Gerar QR Code como PNG base64
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 200, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];

    // Texto com substituição de tags
    const textoFinal = (template.texto_certificado || '')
      .replace(/\{full_name\}/g, nome_aluno)
      .replace(/\{course_name\}/g, nome_curso)
      .replace(/\{completion_date\}/g, data_conclusao);

    // Criar PDF A4 landscape (297x210mm)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
    const W = 297;
    const H = 210;

    // ==================== PÁGINA 1 — FRENTE ====================
    if (template.imagem_fundo_url) {
      try {
        const imgBase64 = await urlToBase64(template.imagem_fundo_url);
        const ext = detectarFormatoImagem(template.imagem_fundo_url);
        doc.addImage(imgBase64, ext, 0, 0, W, H, undefined, 'FAST');
      } catch (e) {
        console.error('[PDF] Erro fundo frente:', e.message);
      }
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, 'F');
    }

    // Texto centralizado com quebras automáticas
    const linhasTexto = textoFinal.split('\n').flatMap(l => doc.splitTextToSize(l, W - 60));
    const lineHeight = 9;
    const startY = H / 2 - (linhasTexto.length * lineHeight) / 2;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);

    linhasTexto.forEach((linha, idx) => {
      const yPos = startY + idx * lineHeight;
      if (linha.includes(nome_aluno)) {
        const partes = linha.split(nome_aluno);
        const antes = partes[0];
        const depois = partes.slice(1).join(nome_aluno);

        doc.setFont('helvetica', 'normal');
        const larguraAntes = doc.getTextWidth(antes);
        doc.setFont('helvetica', 'bold');
        const larguraNome = doc.getTextWidth(nome_aluno);
        doc.setFont('helvetica', 'normal');
        const larguraDepois = doc.getTextWidth(depois);

        const totalW = larguraAntes + larguraNome + larguraDepois;
        const x = (W - totalW) / 2;

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

    // ==================== PÁGINA 2 — VERSO (com QR Code) ====================
    doc.addPage();

    // Fundo do verso
    if (template.verso_habilitado && template.verso_imagem_url) {
      try {
        const versoBase64 = await urlToBase64(template.verso_imagem_url);
        const ext = detectarFormatoImagem(template.verso_imagem_url);
        doc.addImage(versoBase64, ext, 0, 0, W, H, undefined, 'FAST');
      } catch (e) {
        console.error('[PDF] Erro fundo verso:', e.message);
        doc.setFillColor(250, 250, 250);
        doc.rect(0, 0, W, H, 'F');
      }
    } else {
      doc.setFillColor(252, 252, 252);
      doc.rect(0, 0, W, H, 'F');
    }

    // Conteúdo programático (se habilitado)
    if (template.verso_habilitado && template.verso_conteudo) {
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 26);
      doc.text('CONTEÚDO PROGRAMÁTICO', W / 2, 22, { align: 'center' });

      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(1);
      doc.line(W / 2 - 50, 27, W / 2 + 50, 27);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      const linhasVerso = template.verso_conteudo.split('\n');
      let yVerso = 38;
      const limiteY = H - 60;
      linhasVerso.forEach(l => {
        if (yVerso > limiteY) return;
        doc.text(l, 22, yVerso);
        yVerso += 6.5;
      });
    }

    // QR Code centralizado no rodapé do verso
    const qrSize = 35;
    const qrX = (W - qrSize) / 2;
    const qrY = H - qrSize - 18;
    doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

    // Texto de validação
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Verifique a autenticidade deste certificado', W / 2, qrY - 5, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`Código: ${codigo}`, W / 2, H - 10, { align: 'center' });
    doc.text(validacaoUrl, W / 2, H - 5, { align: 'center' });

    // ==================== Salvar registro ====================
    await base44.asServiceRole.entities.CertificadoEmitido.create({
      template_id,
      codigo_rastreio: codigo,
      nome_aluno,
      nome_curso,
      data_conclusao,
      created_at: new Date().toISOString(),
    });

    // ==================== Retornar PDF como base64 dentro de JSON ====================
    // (evita corrupção do SDK ao manipular bytes binários como JSON)
    const pdfBuffer = doc.output('arraybuffer');
    const pdfBase64 = arrayBufferToBase64(pdfBuffer);
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