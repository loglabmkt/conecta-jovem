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

    // PDF na proporção exata da arte (1920x1080 = 16:9), em pontos.
    // Mantemos 1920x1080 como dimensões em pontos para preservar a proporção
    // sem achatar a imagem de fundo.
    const pdfDoc = await PDFDocument.create();
    const W = 1920;
    const H = 1080;
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

    // Texto centralizado (escalado para 1920x1080)
    const fontSize = 36;
    const lineHeight = 54;
    const maxTextWidth = W - 360;
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

    // Conteúdo programático (se habilitado) — escalado para 1920x1080
    if (template.verso_habilitado && template.verso_conteudo) {
      const titulo = 'CONTEÚDO PROGRAMÁTICO';
      const tituloSize = 36;
      const tituloW = fontBold.widthOfTextAtSize(titulo, tituloSize);
      page2.drawText(titulo, {
        x: (W - tituloW) / 2, y: H - 110, size: tituloSize, font: fontBold, color: rgb(0.1, 0.1, 0.1),
      });
      page2.drawLine({
        start: { x: W / 2 - 320, y: H - 130 },
        end: { x: W / 2 + 320, y: H - 130 },
        thickness: 4, color: rgb(0.976, 0.451, 0.086),
      });

      const conteudoSize = 24;
      const conteudoLineH = 36;
      const linhasVerso = wrapText(template.verso_conteudo, fontRegular, conteudoSize, W - 280);
      let yVerso = H - 200;
      const limiteY = 350; // espaço pro QR Code
      for (const l of linhasVerso) {
        if (yVerso < limiteY) break;
        page2.drawText(l, { x: 140, y: yVerso, size: conteudoSize, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        yVerso -= conteudoLineH;
      }
    }

    // QR Code à direita, dentro da área branca, mais alto para caber o link abaixo
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 600, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));
    const qrImg = await pdfDoc.embedPng(qrBytes);

    const qrSize = 220;
    const qrX = W - qrSize - 240; // alinhado à direita, dentro do retângulo branco
    const qrY = 280;               // sobe para caber código + URL abaixo
    page2.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    // Código + URL abaixo do QR (centralizados sob o QR)
    const txtCodigo = `Código: ${codigo}`;
    const codigoSize = 20;
    const txtCodigoW = fontBold.widthOfTextAtSize(txtCodigo, codigoSize);
    page2.drawText(txtCodigo, {
      x: qrX + (qrSize - txtCodigoW) / 2,
      y: qrY - 36,
      size: codigoSize, font: fontBold, color: rgb(0.25, 0.25, 0.25),
    });

    const urlSize = 16;
    const txtUrlW = fontRegular.widthOfTextAtSize(validacaoUrl, urlSize);
    page2.drawText(validacaoUrl, {
      x: qrX + (qrSize - txtUrlW) / 2,
      y: qrY - 62,
      size: urlSize, font: fontRegular, color: rgb(0.45, 0.45, 0.45),
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