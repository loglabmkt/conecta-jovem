import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BACKUP = [
  { email: "nicollaskawe182@gmail.com", whatsapp: "(65) 99292-0032" },
  { email: "carlosaugustho4@gmail.com", whatsapp: "(66) 98121-8398" },
  { email: "kaue07095@gmail.com", whatsapp: "(65) 98453-1347" },
  { email: "joao.pedrosilva@gmail.com", whatsapp: "(65) 99635-8965" },
  { email: "isaqueruben24@gmail.com", whatsapp: "(65) 93406-081" },
  { email: "leonardoribeirodasilvameireles@gmail.com", whatsapp: "(65) 99953-9082" },
  { email: "biancasterling15@gmail.com", whatsapp: "(55) 65981-3163" },
  { email: "ea7047909@gmail.com", whatsapp: "(65) 98131-5633" },
  { email: "oliveiralauren705@gmail.com", whatsapp: "(68) 98427-0686" },
  { email: "isamendestar@gmail.com", whatsapp: "(65) 98124-4835" },
  { email: "davicesarsvila02@gmail.com", whatsapp: "(65) 99635-7236" },
  { email: "kaweguato@gmail.com", whatsapp: "(65) 99905-6419" },
  { email: "luaralima.1703@gmail.com", whatsapp: "(65) 98455-9527" },
  { email: "rg983241@gmail.com", whatsapp: "(65) 98146-2343" },
  { email: "mouraclaraaa@gmail.com", whatsapp: "(65) 99966-7223" },
  { email: "otavio.170609@icloud.com", whatsapp: "(65) 98103-3283" },
  { email: "herick.moi@gmail.com", whatsapp: "(65) 99210-6671" },
  { email: "lovin361@gmail.com", whatsapp: "(21) 96447-4459" },
  { email: "sampaiojosiane.10@gmail.com", whatsapp: "(65) 99284-2027" },
  { email: "stephanykawany087@gmail.com", whatsapp: "(65) 99624-8730" },
  { email: "terezamariabio@hotmail.com", whatsapp: "(65) 99345-1604" },
  { email: "jemmilysantos03@icloud.com", whatsapp: "(65) 99351-5164" },
  { email: "parnovlais@gmail.com", whatsapp: "(65) 99331-8473" },
  { email: "yannelysravelbastardo@gmail.com", whatsapp: "(65) 98416-6287" },
  { email: "gaelnoah34@gmail.com", whatsapp: "(65) 99607-4882" },
  { email: "taismaiara1845@gmail.com", whatsapp: "(65) 99355-0494" },
  { email: "cristian-willer10@hotmail.com", whatsapp: "(65) 99286-7817" },
  { email: "nathanasiaah@gmail.com", whatsapp: "(65) 98143-4855" },
  { email: "awannyrafaelyq@gmail.com", whatsapp: "(65) 99249-0868" },
  { email: "anaclararocha1604@icloud.com", whatsapp: "(65) 99239-0685" },
  { email: "bolivargallardowilsonjose@gmail.com", whatsapp: "(65) 98129-6915" },
  { email: "yoximargallardo@gmail.com", whatsapp: "(65) 99233-6910" },
  { email: "gallardobellimar8@gmail.com", whatsapp: "(68) 98104-2550" },
  { email: "natanaellyrodrigues08@gmail.com", whatsapp: "(65) 98432-6178" },
  { email: "andressavivih2004@gmail.com", whatsapp: "(65) 99661-9187" },
  { email: "heitormarquesleite@gmail.com", whatsapp: "(65) 99956-3939" },
  { email: "joaolnetolira@gmail.com", whatsapp: "(65) 99359-5707" },
  { email: "weslleibarbosam@gmail.com", whatsapp: "(65) 99339-2223" },
  { email: "ojedaaaa88@gmail.com", whatsapp: "(65) 99256-5292" },
  { email: "aghatta74@gmail.com", whatsapp: "(65) 98119-2702" },
  { email: "botelhoveronica@hotmail.com", whatsapp: "(65) 68123-5757" },
  { email: "e2301592@edu.mt.gov.br", whatsapp: "(65) 99678-1119" },
  { email: "juoliveir4.2003@gmail.com", whatsapp: "(65) 99664-8549" },
  { email: "paolavitoriadu20019@gmail.com", whatsapp: "(65) 98121-7489" },
  { email: "anna.carol01@outlook.com", whatsapp: "(65) 98138-7979" },
  { email: "anniellygeovanna31@gmail.com", whatsapp: "(65) 99345-3285" },
  { email: "enzitoalencar@gmail.com", whatsapp: "(65) 99938-5968" },
  { email: "jpeodr@icloud.com", whatsapp: "(65) 96600-8815" },
  { email: "jumirandasales@gmail.com", whatsapp: "(65) 99353-5887" },
  { email: "xtel2009@hotmail.com", whatsapp: "(65) 99951-9113" },
  { email: "michelly.esdra.12@gmail.com", whatsapp: "(65) 98441-6099" },
  { email: "santosezequiel33229@gmail.com", whatsapp: "(65) 99360-9877" },
  { email: "ec762410@gmail.com", whatsapp: "(65) 99221-3725" },
  { email: "angelyna244@gmail.com", whatsapp: "(65) 98463-0778" },
  { email: "maraduarteadryan2025@gmail.com", whatsapp: "(65) 99815-8564" },
  { email: "giovannasilvamendes2306@gmail.com", whatsapp: "(65) 98463-3332" },
  { email: "gisaarts@hotmail.com", whatsapp: "(65) 99679-9600" },
  { email: "luannagabrirlly432@gmail.com", whatsapp: "(65) 98402-9364" },
  { email: "geovanassampaio@gmail.com", whatsapp: "(65) 99305-6897" },
  { email: "mariadso2001@gmail.com", whatsapp: "(65) 99339-5966" },
  { email: "nascimentoluanna056@gmail.com", whatsapp: "(65) 99810-8021" },
  { email: "fabypereira404@gmail.com", whatsapp: "(65) 99615-6026" },
  { email: "gustavojosecba@gmail.com", whatsapp: "(65) 99352-1908" },
  { email: "cleidimara_pereira@hotmail.com", whatsapp: "(65) 99317-6474" },
  { email: "alvesdasilvaviniciusgabriel@gmail.com", whatsapp: "(65) 99327-2522" },
  { email: "breno.p.c@outlook.com", whatsapp: "(65) 99626-7748" },
  { email: "guilherme.costa.10.11.12@gmail.com", whatsapp: "(65) 99359-2100" },
  { email: "venegafernanda@gmail.com", whatsapp: "(65) 99220-3506" },
  { email: "tallyson81@gmail.com", whatsapp: "(65) 99956-1716" },
  { email: "aparecidamaria79697@gmail.com", whatsapp: "(65) 99227-9042" },
  { email: "rhuanlouispinheiroadm@gmail.com", whatsapp: "(65) 99218-2306" },
  { email: "nelson.c.goncalves@hotmail.com", whatsapp: "(65) 99629-3034" },
  { email: "viniwagper@gmail.com", whatsapp: "(65) 99806-2130" },
  { email: "srkobra33@gmail.com", whatsapp: "(65) 99207-9607" },
  { email: "caicfe22@gmail.com", whatsapp: "(65) 99295-7837" },
  { email: "marcio2805junior@gmail.com", whatsapp: "(65) 99936-2765" },
  { email: "victormonestar@gmail.com", whatsapp: "(65) 99926-2389" },
  { email: "wanialima.boasorte@gmail.com", whatsapp: "(65) 98403-4948" },
  { email: "manuschons.med@gmail.com", whatsapp: "(65) 99329-9104" },
  { email: "tatylimapreta@gmail.com", whatsapp: "(65) 98408-0006" },
  { email: "gennisonsouza4@gmail.com", whatsapp: "(65) 99255-1033" },
  { email: "lefreitasjor@gmail.com", whatsapp: "(65) 99206-5635" },
  { email: "raulgustavoarruda@gmail.com", whatsapp: "(65) 99239-4585" },
  { email: "lilibazzi@gmail.com", whatsapp: "(65) 98117-8735" },
  { email: "aquintananunes@gmail.com", whatsapp: "(65) 99685-6760" },
  { email: "emmanuelamaral1402@gmail.com", whatsapp: "(65) 99266-9770" },
  { email: "henrriquejose2020@gmail.com", whatsapp: "(65) 99258-9348" },
  { email: "silva749tu@gmail.com", whatsapp: "(65) 99246-1379" },
  { email: "jackeline_meiga@hotmail.com", whatsapp: "(65) 99213-7079" },
  { email: "karlosmelo988@gmail.com", whatsapp: "(65) 99242-8599" },
  { email: "danieljunior155santosousa@gmail.com", whatsapp: "(65) 98443-8578" },
  { email: "code.allanjose@gmail.com", whatsapp: "(65) 99618-1514" },
  { email: "enrico.mendanha@gmail.com", whatsapp: "(65) 98121-4974" },
  { email: "geovannagabriella20042009@gmail.com", whatsapp: "(65) 99682-5180" },
  { email: "nayne16@icloud.com", whatsapp: "(65) 99261-8658" },
  { email: "alvesmanulinda30@gmail.com", whatsapp: "(65) 99692-5249" },
  { email: "ellenvivian059@gmail.com", whatsapp: "(65) 99664-6981" },
  { email: "lukasmarianobrandao@gmail.com", whatsapp: "(65) 99334-5351" },
  { email: "thiagobritto2@hotmail.com", whatsapp: "(65) 98121-1901" },
  { email: "kevencampos2023@gmail.com", whatsapp: "(65) 98112-4951" },
  { email: "11.marquesdro@gmail.com", whatsapp: "(66) 99924-8358" },
  { email: "nicollynobregamarques2207@gmail.com", whatsapp: "(65) 99354-9798" },
  { email: "carloseduardo2018.n@gmail.com", whatsapp: "(65) 99944-4407" },
  { email: "lysefranca@gmail.com", whatsapp: "(65) 99219-5874" },
  { email: "luishenrique07072010@gmail.com", whatsapp: "(65) 99251-6778" },
  { email: "edasilvaarruda@gmail.com", whatsapp: "(65) 99238-2667" },
  { email: "joaoguilhermeresendemarinho@gmail.com", whatsapp: "(65) 99936-1580" },
  { email: "adagil.rosa@gmail.com", whatsapp: "(65) 99212-9119" },
  { email: "henriquedanillo556@gmail.com", whatsapp: "(65) 99807-0966" },
  { email: "marianateodoro363@gmail.com", whatsapp: "(65) 99203-4626" },
  { email: "fredericoeric1@gmail.vom", whatsapp: "(62) 99627-8009" },
  { email: "fredericoeric1@gmail.com", whatsapp: "(65) 99627-8009" },
  { email: "yaninabritez12@gmail.com", whatsapp: "(65) 98467-7496" },
  { email: "garcezjoaoivo@gmail.com", whatsapp: "(65) 99324-4527" },
  { email: "dayanaarruda@hormail.com", whatsapp: "(65) 99290-9130" },
  { email: "rjraphaelaraujo@gmail.com", whatsapp: "(65) 99362-4047" },
];

const WHATSAPP_CORROMPIDO = "(65) 98446-6587";

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  // Busca TODOS os registros corrompidos de uma vez (1 chamada só)
  const corrompidos = await base44.asServiceRole.entities.Inscricao.filter({ whatsapp: WHATSAPP_CORROMPIDO });
  console.log(`[INFO] Registros corrompidos encontrados: ${corrompidos.length}`);

  // Indexar por email para lookup rápido
  const mapaEmail = {};
  for (const reg of corrompidos) {
    const emailNorm = (reg.email || '').toLowerCase().trim();
    mapaEmail[emailNorm] = reg;
  }

  let atualizados = 0;
  let naoEncontrados = [];
  let jaCorrigidos = [];
  let erros = [];

  for (const item of BACKUP) {
    const emailNorm = item.email.toLowerCase().trim();
    const reg = mapaEmail[emailNorm];

    if (!reg) {
      naoEncontrados.push(emailNorm);
      continue;
    }

    // Atualizar com delay entre cada chamada
    try {
      await base44.asServiceRole.entities.Inscricao.update(reg.id, { whatsapp: item.whatsapp });
      atualizados++;
      console.log(`[OK] ${emailNorm} → ${item.whatsapp}`);
      await new Promise(r => setTimeout(r, 800));
    } catch (e) {
      console.error(`[ERRO] ${emailNorm}: ${e.message}`);
      erros.push({ email: emailNorm, erro: e.message });
    }
  }

  return Response.json({
    total_lista: BACKUP.length,
    corrompidos_no_banco: corrompidos.length,
    atualizados,
    nao_encontrados: naoEncontrados.length,
    erros: erros.length,
    detalhes: {
      nao_encontrados: naoEncontrados,
      erros,
    }
  });
});