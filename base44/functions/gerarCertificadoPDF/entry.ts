import { createClientFromRequest } from 'npm:@base44/sdk@0.8.27';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';
import QRCode from 'npm:qrcode@1.5.4';

function gerarCodigo() {
  return 'CJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
}

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

async function fetchImageBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

function isPng(bytes) {
  return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
}

async function embedImage(pdfDoc, bytes) {
  if (isPng(bytes)) return await pdfDoc.embedPng(bytes);
  return await pdfDoc.embedJpg(bytes);
}

// Quebra texto em linhas que cabem na largura, respeitando \n existentes
function wrapText(text, font, fontSize, maxWidth) {
  const linhasOriginais = text.split('\n');
  const resultado = [];
  for (const linhaOrig of linhasOriginais) {
    const palavras = linhaOrig.split(' ');
    let linhaAtual = '';
    for (const palavra of palavras) {
      const teste = linhaAtual ? linhaAtual + ' ' + palavra : palavra;
      const w = font.widthOfTextAtSize(teste, fontSize);
      if (w > maxWidth && linhaAtual) {
        resultado.push(linhaAtual);
        linhaAtual = palavra;
      } else {
        linhaAtual = teste;
      }
    }
    if (linhaAtual) resultado.push(linhaAtual);
  }
  return resultado;
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

    // Texto com substituição
    const textoFinal = (template.texto_certificado || '')
      .replace(/\{full_name\}/g, nome_aluno)
      .replace(/\{course_name\}/g, nome_curso)
      .replace(/\{completion_date\}/g, data_conclusao);

    // Criar PDF A4 landscape em pontos: 842 x 595
    const pdfDoc = await PDFDocument.create();
    const W = 842;
    const H = 595;
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ==================== FRENTE ====================
    const page1 = pdfDoc.addPage([W, H]);

    if (template.imagem_fundo_url) {
      try {
        const bytes = await fetchImageBytes(template.imagem_fundo_url);
        const img = await embedImage(pdfDoc, bytes);
        page1.drawImage(img, { x: 0, y: 0, width: W, height: H });
      } catch (e) {
        console.error('[PDF] Erro fundo frente:', e.message);
      }
    }

    // Texto centralizado
    const fontSize = 16;
    const lineHeight = 24;
    const maxTextWidth = W - 160;
    const linhas = wrapText(textoFinal, fontRegular, fontSize, maxTextWidth);
    const blocoH = linhas.length * lineHeight;
    const startY = H / 2 + blocoH / 2 - lineHeight; // pdf-lib: y de baixo p/ cima

    linhas.forEach((linha, idx) => {
      const y = startY - idx * lineHeight;
      if (linha.includes(nome_aluno)) {
        // Renderizar partes com nome em negrito
        const partes = linha.split(nome_aluno);
        const antes = partes[0];
        const depois = partes.slice(1).join(nome_aluno);

        const wAntes = fontRegular.widthOfTextAtSize(antes, fontSize);
        const wNome = fontBold.widthOfTextAtSize(nome_aluno, fontSize);
        const wDepois = fontRegular.widthOfTextAtSize(depois, fontSize);
        const total = wAntes + wNome + wDepois;
        let x = (W - total) / 2;

        if (antes) {
          page1.drawText(antes, { x, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
          x += wAntes;
        }
        page1.drawText(nome_aluno, { x, y, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });
        x += wNome;
        if (depois) {
          page1.drawText(depois, { x, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
        }
      } else {
        const w = fontRegular.widthOfTextAtSize(linha, fontSize);
        page1.drawText(linha, {
          x: (W - w) / 2, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0),
        });
      }
    });

    // ==================== VERSO ====================
    const page2 = pdfDoc.addPage([W, H]);

    if (template.verso_habilitado && template.verso_imagem_url) {
      try {
        const bytes = await fetchImageBytes(template.verso_imagem_url);
        const img = await embedImage(pdfDoc, bytes);
        page2.drawImage(img, { x: 0, y: 0, width: W, height: H });
      } catch (e) {
        console.error('[PDF] Erro fundo verso:', e.message);
        page2.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.99, 0.99, 0.99) });
      }
    } else {
      page2.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.99, 0.99, 0.99) });
    }

    // Conteúdo programático (se habilitado)
    if (template.verso_habilitado && template.verso_conteudo) {
      const titulo = 'CONTEÚDO PROGRAMÁTICO';
      const tituloSize = 16;
      const tituloW = fontBold.widthOfTextAtSize(titulo, tituloSize);
      page2.drawText(titulo, {
        x: (W - tituloW) / 2, y: H - 50, size: tituloSize, font: fontBold, color: rgb(0.1, 0.1, 0.1),
      });
      // Linha laranja
      page2.drawLine({
        start: { x: W / 2 - 140, y: H - 60 },
        end: { x: W / 2 + 140, y: H - 60 },
        thickness: 2, color: rgb(0.976, 0.451, 0.086),
      });

      const conteudoSize = 11;
      const conteudoLineH = 16;
      const linhasVerso = wrapText(template.verso_conteudo, fontRegular, conteudoSize, W - 100);
      let yVerso = H - 90;
      const limiteY = 180; // espaço pro QR Code
      for (const l of linhasVerso) {
        if (yVerso < limiteY) break;
        page2.drawText(l, { x: 60, y: yVerso, size: conteudoSize, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        yVerso -= conteudoLineH;
      }
    }

    // QR Code no rodapé do verso
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 300, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));
    const qrImg = await pdfDoc.embedPng(qrBytes);

    const qrSize = 100;
    const qrX = (W - qrSize) / 2;
    const qrY = 50;
    page2.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    // Textos de validação
    const lblTitulo = 'Verifique a autenticidade deste certificado';
    const lblTituloSize = 10;
    const lblTituloW = fontBold.widthOfTextAtSize(lblTitulo, lblTituloSize);
    page2.drawText(lblTitulo, {
      x: (W - lblTituloW) / 2, y: qrY + qrSize + 10, size: lblTituloSize, font: fontBold, color: rgb(0.25, 0.25, 0.25),
    });

    const txtCodigo = `Código: ${codigo}`;
    const txtCodigoW = fontRegular.widthOfTextAtSize(txtCodigo, 9);
    page2.drawText(txtCodigo, {
      x: (W - txtCodigoW) / 2, y: 32, size: 9, font: fontRegular, color: rgb(0.45, 0.45, 0.45),
    });

    const txtUrlW = fontRegular.widthOfTextAtSize(validacaoUrl, 8);
    page2.drawText(validacaoUrl, {
      x: (W - txtUrlW) / 2, y: 18, size: 8, font: fontRegular, color: rgb(0.55, 0.55, 0.55),
    });

    // Salvar registro
    await base44.asServiceRole.entities.CertificadoEmitido.create({
      template_id,
      codigo_rastreio: codigo,
      nome_aluno,
      nome_curso,
      data_conclusao,
      created_at: new Date().toISOString(),
    });

    // Saída
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = arrayBufferToBase64(pdfBytes.buffer);
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