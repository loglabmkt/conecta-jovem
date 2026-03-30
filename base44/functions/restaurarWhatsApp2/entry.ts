import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const BACKUP = [
  { email: "tatibriene@icloud.com", whatsapp: "(65) 99989-6239" },
  { email: "darllenesantana123@gmail.com", whatsapp: "(65) 98414-4489" },
  { email: "padilhaamorim350@gmail.com", whatsapp: "(65) 99636-8482" },
  { email: "ponceerasmo310@gmail.com", whatsapp: "(65) 99689-8271" },
  { email: "rosi.mabs@gmail.com", whatsapp: "(65) 99926-9792" },
  { email: "kemis_enns@hotmail.com", whatsapp: "(65) 98111-0199" },
  { email: "cristinaevellyn465@gmail.com", whatsapp: "(65) 99918-5864" },
  { email: "duartesandro10@gmail.com", whatsapp: "(65) 99980-5559" },
  { email: "pedrohnq03@gmail.com", whatsapp: "(65) 99923-2705" },
  { email: "josy.tremelick1190@gmail.com", whatsapp: "(65) 98119-1173" },
  { email: "estelacunha6@gmail.com", whatsapp: "(65) 99999-4319" },
  { email: "azariasfabricia@gmail.com", whatsapp: "(65) 99919-2227" },
  { email: "luceli_pr@hotmail.com", whatsapp: "(65) 99233-3087" },
  { email: "thallysonleite123@gmail.com", whatsapp: "(65) 98414-0277" },
  { email: "samaragalo19489@gmail.com", whatsapp: "(31) 72106-321" },
  { email: "jennifersofiadasilvareis2212@gmail.com", whatsapp: "(65) 99223-9563" },
  { email: "josee22004@gmail.com", whatsapp: "(65) 98476-3213" },
  { email: "josehenrique.dique@gmail.com", whatsapp: "(65) 99668-7793" },
  { email: "guiguedesmmoraes136@gmail.com", whatsapp: "(65) 99688-9111" },
  { email: "rjraphaelaraujo@gmail.com", whatsapp: "(65) 99362-4047" },
  { email: "dayanaarruda@hormail.com", whatsapp: "(65) 99290-9130" },
  { email: "cactusmedia.ag@gmail.com", whatsapp: "(65) 99330-5151" },
  { email: "garcezjoaoivo@gmail.com", whatsapp: "(65) 99324-4527" },
  { email: "danipaivvad@gmail.com", whatsapp: "(65) 99924-8911" },
  { email: "jordaao@hotmail.com", whatsapp: "(65) 99981-9029" },
  { email: "yaninabritez12@gmail.com", whatsapp: "(65) 98467-7496" },
  { email: "fredericoeric1@gmail.com", whatsapp: "(65) 99627-8009" },
  { email: "fredericoeric1@gmail.vom", whatsapp: "(62) 99627-8009" },
  { email: "jccadista@gmail.com", whatsapp: "(65) 99306-0806" },
  { email: "rainaradefrancabrito@gmail.com", whatsapp: "(65) 99287-6531" },
  { email: "hp046624@gmail.com", whatsapp: "(41) 99235-8122" },
  { email: "thaianef240@gmail.com", whatsapp: "(65) 98469-6915" },
  { email: "marianateodoro363@gmail.com", whatsapp: "(65) 99203-4626" },
  { email: "henriquedanillo556@gmail.com", whatsapp: "(65) 99807-0966" },
  { email: "leilabele@hotmail.com", whatsapp: "(65) 99222-4505" },
  { email: "enfermeiradopiolhocuiaba@gmail.com", whatsapp: "(65) 99928-3559" },
  { email: "adagil.rosa@gmail.com", whatsapp: "(65) 99212-9119" },
  { email: "joaoguilhermeresendemarinho@gmail.com", whatsapp: "(65) 99936-1580" },
  { email: "jonathanfreitas2910@gmail.com", whatsapp: "(65) 99904-1661" },
  { email: "edasilvaarruda@gmail.com", whatsapp: "(65) 99238-2667" },
  { email: "luishenrique07072010@gmail.com", whatsapp: "(65) 99251-6778" },
  { email: "lysefranca@gmail.com", whatsapp: "(65) 99219-5874" },
  { email: "jlamuniel123@gmail.com", whatsapp: "(65) 99686-0556" },
  { email: "carloseduardo2018.n@gmail.com", whatsapp: "(65) 99944-4407" },
  { email: "nicollynobregamarques2207@gmail.com", whatsapp: "(65) 99354-9798" },
  { email: "nicollelamuniel16@gmail.com", whatsapp: "(65) 99663-7380" },
  { email: "11.marquesdro@gmail.com", whatsapp: "(66) 99924-8358" },
  { email: "caioferreirajardini@gmail.com", whatsapp: "(65) 99906-9022" },
  { email: "carlosoliveira.mt@hotmail.com", whatsapp: "(65) 99328-1268" },
  { email: "carllosmir2008@hotmail.com", whatsapp: "(65) 99936-6616" },
  { email: "kevencampos2023@gmail.com", whatsapp: "(65) 98112-4951" },
  { email: "thiagobritto2@hotmail.com", whatsapp: "(65) 98121-1901" },
  { email: "lukasmarianobrandao@gmail.com", whatsapp: "(65) 99334-5351" },
  { email: "contatoalejandro23@gmail.com", whatsapp: "(65) 99336-5725" },
  { email: "ellenvivian059@gmail.com", whatsapp: "(65) 99664-6981" },
  { email: "alvesmanulinda30@gmail.com", whatsapp: "(65) 99692-5249" },
  { email: "nayne16@icloud.com", whatsapp: "(65) 99261-8658" },
  { email: "geovannagabriella20042009@gmail.com", whatsapp: "(65) 99682-5180" },
  { email: "enrico.mendanha@gmail.com", whatsapp: "(65) 98121-4974" },
  { email: "code.allanjose@gmail.com", whatsapp: "(65) 99618-1514" },
  { email: "rochawagner535@gmail.com", whatsapp: "(65) 99218-9765" },
  { email: "danieljunior155santosousa@gmail.com", whatsapp: "(65) 98443-8578" },
  { email: "karlosmelo988@gmail.com", whatsapp: "(65) 99242-8599" },
  { email: "jackeline_meiga@hotmail.com", whatsapp: "(65) 99213-7079" },
  { email: "silva749tu@gmail.com", whatsapp: "(65) 99246-1379" },
  { email: "rafalucasitalo517@gmail.com", whatsapp: "(65) 98435-1647" },
  { email: "kauemanoeu@gmail.com", whatsapp: "(65) 99629-4152" },
  { email: "gabrielxpbr@gmail.com", whatsapp: "(65) 99698-2536" },
  { email: "henrriquejose2020@gmail.com", whatsapp: "(65) 99258-9348" },
  { email: "emmanuelamaral1402@gmail.com", whatsapp: "(65) 99266-9770" },
  { email: "aquintananunes@gmail.com", whatsapp: "(65) 99685-6760" },
  { email: "josianedealmeida1810@gmail.comj", whatsapp: "(65) 99229-2088" },
  { email: "lilibazzi@gmail.com", whatsapp: "(65) 98117-8735" },
  { email: "raulgustavoarruda@gmail.com", whatsapp: "(65) 99239-4585" },
  { email: "luanribeiroprof@gmail.com", whatsapp: "(66) 99910-3431" },
  { email: "mh.costafrreira@gmail.com", whatsapp: "(65) 99272-3712" },
  { email: "nathomelo27@gmail.com", whatsapp: "(65) 98105-4762" },
  { email: "naiara.queide.urnau@gmail.com", whatsapp: "(65) 99340-8665" },
  { email: "lefreitasjor@gmail.com", whatsapp: "(65) 99206-5635" },
  { email: "gennisonsouza4@gmail.com", whatsapp: "(65) 99255-1033" },
  { email: "carolmansor@gmail.com", whatsapp: "(65) 99927-8061" },
  { email: "rodrigodejesus.rs@gmail.com", whatsapp: "(65) 99986-9590" },
  { email: "tatylimapreta@gmail.com", whatsapp: "(65) 98408-0006" },
  { email: "manuschons.med@gmail.com", whatsapp: "(65) 99329-9104" },
  { email: "wanialima.boasorte@gmail.com", whatsapp: "(65) 98403-4948" },
  { email: "victormonestar@gmail.com", whatsapp: "(65) 99926-2389" },
  { email: "marcio2805junior@gmail.com", whatsapp: "(65) 99936-2765" },
  { email: "caicfe22@gmail.com", whatsapp: "(65) 99295-7837" },
  { email: "srkobra33@gmail.com", whatsapp: "(65) 99207-9607" },
  { email: "polyannaamericosilva8@gmail.com", whatsapp: "(65) 99271-9564" },
  { email: "amariaantoniadelara@gmail.com", whatsapp: "(65) 99292-6259" },
  { email: "lekaa630@gmail.com", whatsapp: "(65) 99305-7747" },
  { email: "alessandra.rofino@gmail.com", whatsapp: "(65) 99305-7747" },
  { email: "viniwagper@gmail.com", whatsapp: "(65) 99806-2130" },
  { email: "nelson.c.goncalves@hotmail.com", whatsapp: "(65) 99629-3034" },
  { email: "paulohcgarces@gmail.com", whatsapp: "(65) 99923-3967" },
  { email: "edenilsonenfermeiro@gmail.com", whatsapp: "(65) 98442-2298" },
  { email: "saramoreiraa100@gmail.com", whatsapp: "(65) 98080-934" },
  { email: "thiagomg9@gmail.com", whatsapp: "(65) 99218-5430" },
  { email: "rhuanlouispinheiroadm@gmail.com", whatsapp: "(65) 99218-2306" },
  { email: "gabrielbnd@hotmail.com", whatsapp: "(65) 99297-5745" },
  { email: "aparecidamaria79697@gmail.com", whatsapp: "(65) 99227-9042" },
  { email: "tallyson81@gmail.com", whatsapp: "(65) 99956-1716" },
  { email: "venegafernanda@gmail.com", whatsapp: "(65) 99220-3506" },
  { email: "guilherme.costa.10.11.12@gmail.com", whatsapp: "(65) 99359-2100" },
  { email: "ariadnefernandomauricio@gmail.com", whatsapp: "(65) 98416-9660" },
  { email: "breno.p.c@outlook.com", whatsapp: "(65) 99626-7748" },
  { email: "diegoleonardodasilva.jg2@gmail.com", whatsapp: "(65) 98408-0452" },
  { email: "rebertydaniel6@gmail.com", whatsapp: "(65) 99686-5887" },
  { email: "natalymariana66@gmail.com", whatsapp: "(65) 99219-2476" },
  { email: "alvesdasilvaviniciusgabriel@gmail.com", whatsapp: "(65) 99327-2522" },
  { email: "cleidimara_pereira@hotmail.com", whatsapp: "(65) 99317-6474" },
  { email: "gustavojosecba@gmail.com", whatsapp: "(65) 99352-1908" },
  { email: "fabypereira404@gmail.com", whatsapp: "(65) 99615-6026" },
  { email: "nascimentoluanna056@gmail.com", whatsapp: "(65) 99810-8021" },
  { email: "silvanamariamm@hotmail.com", whatsapp: "(66) 98432-2872" },
  { email: "mariadso2001@gmail.com", whatsapp: "(65) 99339-5966" },
  { email: "geovanassampaio@gmail.com", whatsapp: "(65) 99305-6897" },
  { email: "luannagabrirlly432@gmail.com", whatsapp: "(65) 98402-9364" },
  { email: "gisaarts@hotmail.com", whatsapp: "(65) 99679-9600" },
  { email: "giovannasilvamendes2306@gmail.com", whatsapp: "(65) 98463-3332" },
  { email: "davaloskarina10@gmail.com", whatsapp: "(67) 98221-0966" },
  { email: "maraduarteadryan2025@gmail.com", whatsapp: "(65) 99815-8564" },
  { email: "angelyna244@gmail.com", whatsapp: "(65) 98463-0778" },
  { email: "ju755154@gmail.com", whatsapp: "(65) 99234-6463" },
  { email: "ec762410@gmail.com", whatsapp: "(65) 99221-3725" },
  { email: "gilmararaujo130@gmail.com", whatsapp: "(65) 99270-8791" },
  { email: "santosezequiel33229@gmail.com", whatsapp: "(65) 99360-9877" },
  { email: "deboramaria059@gmail.com", whatsapp: "(65) 98125-5897" },
  { email: "josielesantosc@gmail.com", whatsapp: "(65) 99354-7371" },
  { email: "negrafinaloja@gmail.com", whatsapp: "(65) 99975-0071" },
  { email: "michelly.esdra.12@gmail.com", whatsapp: "(65) 98441-6099" },
  { email: "xtel2009@hotmail.com", whatsapp: "(65) 99951-9113" },
  { email: "jumirandasales@gmail.com", whatsapp: "(65) 99353-5887" },
  { email: "fabydigital20@gmail.com", whatsapp: "(65) 99689-5753" },
  { email: "jpeodr@icloud.com", whatsapp: "(65) 96600-8815" },
  { email: "enzitoalencar@gmail.com", whatsapp: "(65) 99938-5968" },
  { email: "anniellygeovanna31@gmail.com", whatsapp: "(65) 99345-3285" },
  { email: "anna.carol01@outlook.com", whatsapp: "(65) 98138-7979" },
  { email: "paolavitoriadu20019@gmail.com", whatsapp: "(65) 98121-7489" },
  { email: "nadineflordosanjos@gmail.com", whatsapp: "(65) 99634-9478" },
  { email: "juoliveir4.2003@gmail.com", whatsapp: "(65) 99664-8549" },
  { email: "calazansjunior@gmail.com", whatsapp: "(65) 98170-6000" },
  { email: "perlajanine7@gmail.com", whatsapp: "(65) 99256-4245" },
  { email: "e2301592@edu.mt.gov.br", whatsapp: "(65) 99678-1119" },
  { email: "botelhoveronica@hotmail.com", whatsapp: "(65) 68123-5757" },
  { email: "aghatta74@gmail.com", whatsapp: "(65) 98119-2702" },
  { email: "h32019747@gmail.com", whatsapp: "(55) 65999-0262" },
  { email: "wellitongweimer@gmail.com", whatsapp: "(65) 98117-0015" },
  { email: "danailafernanda425@gmail.com", whatsapp: "(65) 99985-5675" },
  { email: "ojedaaaa88@gmail.com", whatsapp: "(65) 99256-5292" },
  { email: "joanawcampos@gmail.com", whatsapp: "(65) 99310-9386" },
  { email: "weslleibarbosam@gmail.com", whatsapp: "(65) 99339-2223" },
  { email: "joaolnetolira@gmail.com", whatsapp: "(65) 99359-5707" },
  { email: "heitormarquesleite@gmail.com", whatsapp: "(65) 99956-3939" },
  { email: "alissonrafael015@gmail.com", whatsapp: "(65) 99218-1188" },
  { email: "andressavivih2004@gmail.com", whatsapp: "(65) 99661-9187" },
  { email: "natanaellyrodrigues08@gmail.com", whatsapp: "(65) 98432-6178" },
  { email: "gallardobellimar8@gmail.com", whatsapp: "(68) 98104-2550" },
  { email: "yoximargallardo@gmail.com", whatsapp: "(65) 99233-6910" },
  { email: "bolivargallardowilsonjose@gmail.com", whatsapp: "(65) 98129-6915" },
  { email: "20alejandrarivero@gmail.com", whatsapp: "(65) 99233-6910" },
  { email: "uemersonf@hotmail.com", whatsapp: "(65) 98411-1985" },
  { email: "anaclararocha1604@icloud.com", whatsapp: "(65) 99239-0685" },
  { email: "awannyrafaelyq@gmail.com", whatsapp: "(65) 99249-0868" },
  { email: "athanasiaah@gmail.com", whatsapp: "(65) 98143-4855" },
  { email: "elzafaustina011@gmail.com", whatsapp: "(65) 98137-6789" },
  { email: "cristian-willer10@hotmail.com", whatsapp: "(65) 99286-7817" },
  { email: "taismaiara1845@gmail.com", whatsapp: "(65) 99355-0494" },
  { email: "gaelnoah34@gmail.com", whatsapp: "(65) 99607-4882" },
  { email: "yannelysravelbastardo@gmail.com", whatsapp: "(65) 98416-6287" },
  { email: "parnovlais@gmail.com", whatsapp: "(65) 99331-8473" },
  { email: "jemmilysantos03@icloud.com", whatsapp: "(65) 99351-5164" },
  { email: "terezamariabio@hotmail.com", whatsapp: "(65) 99345-1604" },
  { email: "karencostamt@gmail.com", whatsapp: "(65) 99232-0351" },
  { email: "stephanykawany087@gmail.com", whatsapp: "(65) 99624-8730" },
  { email: "edimarisonpereira@gmail.com", whatsapp: "(65) 99360-0953" },
  { email: "sampaiojosiane.10@gmail.com", whatsapp: "(65) 99284-2027" },
  { email: "lovin361@gmail.com", whatsapp: "(21) 96447-4459" },
  { email: "herick.moi@gmail.com", whatsapp: "(65) 99210-6671" },
  { email: "otavio.170609@icloud.com", whatsapp: "(65) 98103-3283" },
  { email: "diasjosy203@gmail.com", whatsapp: "(65) 99914-9675" },
  { email: "mouraclaraaa@gmail.com", whatsapp: "(65) 99966-7223" },
  { email: "marcossilvadesouza98@gmail.com", whatsapp: "(65) 99253-6620" },
  { email: "rg983241@gmail.com", whatsapp: "(65) 98146-2343" },
  { email: "willianbastosss@gmail.com", whatsapp: "(65) 99923-9758" },
  { email: "igorportugal567@gmail.com", whatsapp: "(65) 99975-7110" },
  { email: "luaralima.1703@gmail.com", whatsapp: "(65) 98455-9527" },
  { email: "kaweguato@gmail.com", whatsapp: "(65) 99905-6419" },
  { email: "davicesarsvila02@gmail.com", whatsapp: "(65) 99635-7236" },
  { email: "talitapinheiro2064@gmail.com", whatsapp: "(65) 99202-4895" },
  { email: "hallija31@gmail.com", whatsapp: "(65) 99209-8890" },
  { email: "isamendestar@gmail.com", whatsapp: "(65) 98124-4835" },
  { email: "edenildesguimaraes9@gmail.com", whatsapp: "(65) 99238-6140" },
  { email: "oliveiralauren705@gmail.com", whatsapp: "(68) 98427-0686" },
  { email: "ea7047909@gmail.com", whatsapp: "(65) 98131-5633" },
  { email: "biancasterling15@gmail.com", whatsapp: "(55) 65981-3163" },
  { email: "leonardoribeirodasilvameireles@gmail.com", whatsapp: "(65) 99953-9082" },
  { email: "isaqueruben24@gmail.com", whatsapp: "(65) 93406-081" },
  { email: "felipeportolima@live.com", whatsapp: "(65) 99280-2286" },
  { email: "mariavitoria3084@gmail.com", whatsapp: "(65) 99302-9234" },
  { email: "mrodriguesdesouza01@gmail.com", whatsapp: "(62) 99203-9940" },
  { email: "esthermoraisfilha10@gmail.com", whatsapp: "(65) 99223-6054" },
  { email: "erikadias33@gmail.com", whatsapp: "(65) 99814-1274" },
  { email: "jovaniadaluz2024@gmail.com", whatsapp: "(65) 99250-3103" },
  { email: "moreira.edilaine1@gmail.com", whatsapp: "(65) 98465-8966" },
  { email: "milenavilarsousa@gmail.com", whatsapp: "(65) 99632-2709" },
];

const WHATSAPP_CORROMPIDO = "(65) 98446-6587";
const LOTE = 20;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  // 1 chamada: busca todos corrompidos
  const corrompidos = await base44.asServiceRole.entities.Inscricao.filter({ whatsapp: WHATSAPP_CORROMPIDO });
  console.log(`[INFO] Corrompidos no banco: ${corrompidos.length}`);

  // Indexar por email
  const mapaEmail = {};
  for (const reg of corrompidos) {
    const k = (reg.email || '').toLowerCase().trim();
    mapaEmail[k] = reg;
  }

  let atualizados = 0;
  let naoEncontrados = [];
  let erros = [];

  // Processar em lotes de 20
  for (let i = 0; i < BACKUP.length; i += LOTE) {
    const lote = BACKUP.slice(i, i + LOTE);
    for (const item of lote) {
      const emailNorm = item.email.toLowerCase().trim();
      const reg = mapaEmail[emailNorm];
      if (!reg) {
        naoEncontrados.push(emailNorm);
        continue;
      }
      try {
        await base44.asServiceRole.entities.Inscricao.update(reg.id, { whatsapp: item.whatsapp });
        atualizados++;
        console.log(`[OK] ${emailNorm} → ${item.whatsapp}`);
      } catch (e) {
        console.error(`[ERRO] ${emailNorm}: ${e.message}`);
        erros.push({ email: emailNorm, erro: e.message });
      }
    }
    // delay 1s entre lotes
    if (i + LOTE < BACKUP.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return Response.json({
    corrompidos_no_banco: corrompidos.length,
    total_lista: BACKUP.length,
    atualizados,
    nao_encontrados: naoEncontrados.length,
    erros: erros.length,
    detalhes_erros: erros,
    nao_encontrados_lista: naoEncontrados,
  });
});