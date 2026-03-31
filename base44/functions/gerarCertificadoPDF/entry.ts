import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@4.0.0';
import QRCode from 'npm:qrcode@1.5.4';

function gerarCodigo() {
  return 'CJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

async function urlToBase64(url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
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
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 150, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];

    // Texto com substituição de tags
    const textoFinal = (template.texto_certificado || '')
      .replace(/\{full_name\}/g, nome_aluno)
      .replace(/\{course_name\}/g, nome_curso)
      .replace(/\{completion_date\}/g, data_conclusao);

    // Criar PDF A4 landscape (297x210mm)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = 297;
    const H = 210;

    // Página 1 — Frente
    if (template.imagem_fundo_url) {
      try {
        const imgBase64 = await urlToBase64(template.imagem_fundo_url);
        const ext = template.imagem_fundo_url.split('.').pop().toLowerCase().includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(imgBase64, ext, 0, 0, W, H);
      } catch (e) {
        console.error('[PDF] Erro ao carregar imagem de fundo:', e.message);
      }
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, 'F');
    }

    // Texto centralizado
    const linhas = textoFinal.split('\n');
    const totalLinhas = linhas.length;
    const lineHeight = 9;
    const startY = H / 2 - (totalLinhas * lineHeight) / 2;

    linhas.forEach((linha, idx) => {
      // Destacar nome do aluno em negrito
      if (linha.includes(nome_aluno)) {
        const partes = linha.split(nome_aluno);
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);

        // calcular posição X para centralizar manualmente
        const yPos = startY + idx * lineHeight;
        doc.setFont('helvetica', 'normal');
        const antes = partes[0];
        const depois = partes[1] || '';
        const larguraAntes = doc.getTextWidth(antes);
        const larguraNome = doc.getTextWidth(nome_aluno);
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
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(linha, W / 2, startY + idx * lineHeight, { align: 'center' });
      }
    });

    // QR Code no canto inferior direito
    const qrSize = 28;
    const qrX = W - qrSize - 10;
    const qrY = H - qrSize - 16;
    doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

    // Código de rastreio abaixo do QR
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text(`Código: ${codigo}`, qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });

    // Página 2 — Verso (se habilitado)
    if (template.verso_habilitado && template.verso_conteudo) {
      doc.addPage();

      if (template.verso_imagem_url) {
        try {
          const versoBase64 = await urlToBase64(template.verso_imagem_url);
          const ext = template.verso_imagem_url.split('.').pop().toLowerCase().includes('png') ? 'PNG' : 'JPEG';
          doc.addImage(versoBase64, ext, 0, 0, W, H);
        } catch (e) {
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

      // Conteúdo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      const linhasVerso = template.verso_conteudo.split('\n');
      let yVerso = 42;
      linhasVerso.forEach(l => {
        if (yVerso > H - 15) return;
        doc.text(l, 20, yVerso);
        yVerso += 7;
      });
    }

    // Salvar registro no banco
    await base44.asServiceRole.entities.CertificadoEmitido.create({
      template_id,
      codigo_rastreio: codigo,
      nome_aluno,
      nome_curso,
      data_conclusao,
      created_at: new Date().toISOString(),
    });

    // Retornar PDF
    const pdfBuffer = doc.output('arraybuffer');
    const filename = `certificado_${nome_aluno.replace(/\s+/g, '_')}_${codigo}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('[PDF_ERRO]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});