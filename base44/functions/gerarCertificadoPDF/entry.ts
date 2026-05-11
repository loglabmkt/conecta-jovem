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
// Preserva linhas vazias (Enters duplos) como espaçamento extra.
function wrapText(text, font, fontSize, maxWidth) {
  const linhasOriginais = text.split('\n');
  const resultado = [];
  for (const linhaOrig of linhasOriginais) {
    const trimmed = linhaOrig.trim();
    // Linha vazia → preserva como espaçamento
    if (trimmed === '') {
      resultado.push('');
      continue;
    }
    const palavras = trimmed.split(/\s+/);
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
    const textoSubstituido = (template.texto_certificado || '')
      .replace(/\{full_name\}/g, nome_aluno)
      .replace(/\{course_name\}/g, nome_curso)
      .replace(/\{completion_date\}/g, data_conclusao);

    // Normalizar quebras de linha:
    // - Duplo \n (linha em branco) = parágrafo intencional → preservar
    // - \n simples = quebra manual indesejada → vira espaço (wrap automático)
    const textoFinal = textoSubstituido
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{2,}/g, '§PARAGRAFO§')
      .replace(/\n/g, ' ')
      .replace(/§PARAGRAFO§/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    // PDF em A4 paisagem (297mm × 210mm = 842 × 595 pt).
    // Proporção 1.414:1 — equivale a 1754×1240px @ 150dpi para impressão.
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

    // Texto centralizado (escalado para A4 paisagem 842×595pt)
    const fontSize = 16;
    const lineHeight = 24;
    const maxTextWidth = W - 160;

    // Sanitiza removendo caracteres de controle que o WinAnsi não codifica
    const sanitize = (s) => (s || '').replace(/[\x00-\x1F\x7F-\x9F]/g, '');

    // Substitui o nome do aluno por um placeholder ANTES do wrap.
    // Motivo: nomes com espaços internos (ex: "DANIEL W. MOYA CATRINO")
    // são fragmentados pelo wrapText (split por espaços), perdendo a
    // referência. Placeholder é ASCII puro, sem caracteres especiais.
    const NOME_PLACEHOLDER = 'XNOMEALUNOX';
    const nomeAlunoTrim = sanitize(nome_aluno).trim();
    const textoComPlaceholder = sanitize(textoFinal).replace(nomeAlunoTrim, NOME_PLACEHOLDER);
    const linhas = wrapText(textoComPlaceholder, fontRegular, fontSize, maxTextWidth);
    const blocoH = linhas.length * lineHeight;
    // Sobe o bloco: centraliza entre o título "CERTIFICADO" (topo) e as assinaturas
    const startY = H * 0.62 + blocoH / 2 - lineHeight;

    linhas.forEach((linha, idx) => {
      const y = startY - idx * lineHeight;
      if (linha.includes(NOME_PLACEHOLDER)) {
        // Dividir pelo placeholder — sem ambiguidade, mesmo para nomes
        // com pontos/abreviações (ex: "DANIEL W. MOYA CATRINO").
        const partes = linha.split(NOME_PLACEHOLDER);
        const antesTrim = sanitize(partes[0]).replace(/ +$/, '');
        const depoisTrim = sanitize(partes.slice(1).join(NOME_PLACEHOLDER)).replace(/^ +/, '');

        // Largura do espaço explícita (widthOfTextAtSize ignora espaços de borda)
        const wSpace = fontRegular.widthOfTextAtSize(' ', fontSize);
        const wAntes = fontRegular.widthOfTextAtSize(antesTrim, fontSize);
        const wNome = fontBold.widthOfTextAtSize(nomeAlunoTrim, fontSize);
        const wDepois = fontRegular.widthOfTextAtSize(depoisTrim, fontSize);

        const hasAntes = antesTrim.length > 0;
        const hasDepois = depoisTrim.length > 0;
        const total = wAntes
          + (hasAntes ? wSpace : 0)
          + wNome
          + (hasDepois ? wSpace : 0)
          + wDepois;
        let x = (W - total) / 2;

        if (hasAntes) {
          page1.drawText(antesTrim, { x, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
          x += wAntes + wSpace;
        }
        page1.drawText(nomeAlunoTrim, { x, y, size: fontSize, font: fontBold, color: rgb(0, 0, 0) });
        x += wNome;
        if (hasDepois) {
          x += wSpace;
          page1.drawText(depoisTrim, { x, y, size: fontSize, font: fontRegular, color: rgb(0, 0, 0) });
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

    // Conteúdo programático (se habilitado) — renderizado como tabela
    if (template.verso_habilitado && template.verso_conteudo) {
      const titulo = 'CONTEÚDO PROGRAMÁTICO';
      const tituloSize = 18;
      const tituloW = fontBold.widthOfTextAtSize(titulo, tituloSize);
      page2.drawText(titulo, {
        x: (W - tituloW) / 2, y: H - 90, size: tituloSize, font: fontBold, color: rgb(0.1, 0.1, 0.1),
      });

      // Parse das linhas: aceita formatos "Nome - 25H", "Nome - 25h", "Nome | 25", "Nome 25"
      // Captura o último número da linha como total de horas.
      const linhasRaw = template.verso_conteudo.split('\n').map(s => s.trim()).filter(Boolean);
      const itens = linhasRaw.map(linha => {
        const m = linha.match(/^(.*?)[\s\-\|:•·]+(\d{1,4})\s*[hH]?\s*$/);
        if (m) return { nome: m[1].trim().replace(/[\-\|:•·]+$/, '').trim(), horas: m[2] };
        return { nome: linha, horas: '' };
      });

      // Layout da tabela
      const tableW = 560;
      const tableX = (W - tableW) / 2;
      const colHorasW = 90;
      const colNomeW = tableW - colHorasW;
      const rowH = 22;
      const cellPadX = 10;
      const fontSizeRow = 10;
      const fontSizeHead = 9;

      let yTable = H - 120;

      // Cabeçalho
      page2.drawRectangle({
        x: tableX, y: yTable - rowH, width: tableW, height: rowH,
        color: rgb(0.96, 0.96, 0.97),
      });
      page2.drawText('Módulo', {
        x: tableX + cellPadX, y: yTable - rowH + (rowH - fontSizeHead) / 2 + 2,
        size: fontSizeHead, font: fontBold, color: rgb(0.4, 0.4, 0.45),
      });
      const headHorasW = fontBold.widthOfTextAtSize('Total (h)', fontSizeHead);
      page2.drawText('Total (h)', {
        x: tableX + tableW - cellPadX - headHorasW,
        y: yTable - rowH + (rowH - fontSizeHead) / 2 + 2,
        size: fontSizeHead, font: fontBold, color: rgb(0.4, 0.4, 0.45),
      });
      yTable -= rowH;

      const limiteY = 110; // reserva espaço pro rodapé/logos (QR fica ao lado, não embaixo)
      for (let i = 0; i < itens.length; i++) {
        if (yTable - rowH < limiteY) break;
        const { nome, horas } = itens[i];
        const isUltima = i === itens.length - 1;

        if (isUltima) {
          // Linha "Total" com fundo cinza claro
          page2.drawRectangle({
            x: tableX, y: yTable - rowH, width: tableW, height: rowH,
            color: rgb(0.96, 0.96, 0.97),
          });
        }

        // Linha divisória superior
        page2.drawLine({
          start: { x: tableX, y: yTable },
          end: { x: tableX + tableW, y: yTable },
          thickness: 0.5, color: rgb(0.85, 0.85, 0.88),
        });

        // Nome (truncar se passar)
        let nomeTxt = nome;
        const maxNomeW = colNomeW - cellPadX * 2;
        const fNome = isUltima ? fontBold : fontRegular;
        while (fNome.widthOfTextAtSize(nomeTxt, fontSizeRow) > maxNomeW && nomeTxt.length > 1) {
          nomeTxt = nomeTxt.slice(0, -1);
        }
        if (nomeTxt !== nome) nomeTxt = nomeTxt.slice(0, -1) + '…';

        page2.drawText(nomeTxt, {
          x: tableX + cellPadX,
          y: yTable - rowH + (rowH - fontSizeRow) / 2 + 2,
          size: fontSizeRow, font: fNome, color: rgb(0.15, 0.15, 0.18),
        });

        // Horas (alinhadas à direita)
        if (horas) {
          const fHoras = isUltima ? fontBold : fontRegular;
          const horasW = fHoras.widthOfTextAtSize(horas, fontSizeRow);
          page2.drawText(horas, {
            x: tableX + tableW - cellPadX - horasW,
            y: yTable - rowH + (rowH - fontSizeRow) / 2 + 2,
            size: fontSizeRow, font: fHoras, color: rgb(0.15, 0.15, 0.18),
          });
        }

        yTable -= rowH;
      }

      // Linha final
      page2.drawLine({
        start: { x: tableX, y: yTable },
        end: { x: tableX + tableW, y: yTable },
        thickness: 0.5, color: rgb(0.85, 0.85, 0.88),
      });
    }

    // QR Code à direita, dentro da área branca, mais alto para caber o link abaixo
    const qrDataUrl = await QRCode.toDataURL(validacaoUrl, { width: 600, margin: 1 });
    const qrBase64 = qrDataUrl.split(',')[1];
    const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));
    const qrImg = await pdfDoc.embedPng(qrBytes);

    // QR Code (canto inferior direito, acima dos logos) — escalado para A4
    const qrSize = 70;
    const qrX = W - qrSize - 80; // canto direito, dentro da área branca
    const qrY = 70;               // acima dos logos do rodapé
    page2.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    // Código abaixo do QR
    const txtCodigo = `Código: ${codigo}`;
    const codigoSize = 8;
    const txtCodigoW = fontBold.widthOfTextAtSize(txtCodigo, codigoSize);
    page2.drawText(txtCodigo, {
      x: qrX + (qrSize - txtCodigoW) / 2,
      y: qrY - 12,
      size: codigoSize, font: fontBold, color: rgb(0.25, 0.25, 0.25),
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