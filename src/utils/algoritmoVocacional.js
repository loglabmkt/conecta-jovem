export const PERFIS = {
  tech_puro: {
    nome: "Arquiteto Digital",
    emoji: "💻",
    cor: "#3B82F6",
    descricao: "Você tem perfil para Desenvolvimento de Software, Engenharia de Dados ou Cibersegurança. Sua mente lógica e afinidade tecnológica são seus maiores diferenciais no mercado digital.",
    carreiras: ["Desenvolvedor Full Stack", "Engenheiro de Dados", "Analista de Sistemas", "DevOps", "Cibersegurança"],
    habilidades: ["Pensamento lógico", "Resolução de problemas", "Aprendizado contínuo", "Atenção a detalhes"],
  },
  tech_criativo: {
    nome: "Inovador UX/UI",
    emoji: "🎨",
    cor: "#8B5CF6",
    descricao: "Você une tecnologia e criatividade — o perfil mais valorizado do mercado atual. Design de interfaces, desenvolvimento front-end e product design são suas áreas.",
    carreiras: ["UX/UI Designer", "Front-end Developer", "Product Designer", "Motion Designer", "Creative Technologist"],
    habilidades: ["Criatividade técnica", "Empatia com usuário", "Design thinking", "Prototipagem"],
  },
  criativo_puro: {
    nome: "Criador de Conteúdo",
    emoji: "🎬",
    cor: "#EC4899",
    descricao: "Sua criatividade é sua maior força. Áreas como marketing digital, produção audiovisual e design gráfico são onde você brilha naturalmente.",
    carreiras: ["Designer Gráfico", "Social Media Manager", "Produtor Audiovisual", "Copywriter", "Diretor de Arte"],
    habilidades: ["Visão estética", "Storytelling", "Criatividade", "Tendências visuais"],
  },
  lideranca_puro: {
    nome: "Empreendedor Nato",
    emoji: "🚀",
    cor: "#F97316",
    descricao: "Você tem perfil de liderança e visão de negócios. Gestão, empreendedorismo e áreas estratégicas são onde você tem mais potencial de impacto.",
    carreiras: ["Empreendedor", "Gestor de Projetos", "Consultor de Negócios", "Product Manager", "Diretor Comercial"],
    habilidades: ["Liderança", "Visão estratégica", "Tomada de decisão", "Negociação"],
  },
  lideranca_comunicacao: {
    nome: "Estrategista de Marketing",
    emoji: "📣",
    cor: "#EF4444",
    descricao: "Você combina liderança com comunicação — perfeito para marketing, vendas e gestão de marca. Você sabe motivar pessoas e criar mensagens que geram resultados.",
    carreiras: ["Gestor de Marketing", "Diretor Comercial", "Growth Hacker", "Brand Manager", "Head de Vendas"],
    habilidades: ["Comunicação", "Liderança", "Persuasão", "Estratégia"],
  },
  social_puro: {
    nome: "Agente de Impacto",
    emoji: "🤝",
    cor: "#10B981",
    descricao: "Seu propósito está em servir e impactar pessoas. Educação, psicologia, assistência social e gestão de pessoas são áreas onde você encontra significado real.",
    carreiras: ["Psicólogo", "Educador", "Assistente Social", "Gestor de RH", "Coach"],
    habilidades: ["Empatia", "Escuta ativa", "Comunicação interpessoal", "Resiliência"],
  },
  social_comunicacao: {
    nome: "Comunicador Social",
    emoji: "📡",
    cor: "#06B6D4",
    descricao: "Você tem talento natural para se comunicar e conectar pessoas. Jornalismo, relações públicas, RH e educação são caminhos naturais para você.",
    carreiras: ["Jornalista", "RP", "Especialista em RH", "Professor", "Community Manager"],
    habilidades: ["Comunicação", "Empatia", "Escrita", "Networking"],
  },
  ciencia_tech: {
    nome: "Cientista de Dados",
    emoji: "📊",
    cor: "#6366F1",
    descricao: "Você combina raciocínio científico com aptidão tecnológica — o perfil mais demandado em startups e grandes empresas. Data Science, BI e análise preditiva são seu terreno.",
    carreiras: ["Cientista de Dados", "Analista de BI", "Engenheiro de Machine Learning", "Pesquisador em TI", "Estatístico Digital"],
    habilidades: ["Análise de dados", "Pensamento científico", "Programação", "Modelagem"],
  },
  ciencia_puro: {
    nome: "Investigador Científico",
    emoji: "🔬",
    cor: "#0EA5E9",
    descricao: "Sua mente analítica e curiosidade científica te direcionam para saúde, pesquisa e ciências exatas. Você busca entender o mundo por meio de evidências.",
    carreiras: ["Médico", "Farmacêutico", "Biólogo", "Engenheiro", "Pesquisador"],
    habilidades: ["Pensamento crítico", "Precisão", "Curiosidade", "Método científico"],
  },
  comunicacao_puro: {
    nome: "Influenciador de Ideias",
    emoji: "✍️",
    cor: "#F59E0B",
    descricao: "Você tem o dom da comunicação — seja escrita, falada ou visual. Marketing de conteúdo, jornalismo, publicidade e educação são seus campos naturais.",
    carreiras: ["Copywriter", "Jornalista", "Publicitário", "Content Creator", "Redator Criativo"],
    habilidades: ["Escrita", "Oratória", "Persuasão", "Storytelling"],
  },
  tech_lideranca: {
    nome: "Product Manager Tech",
    emoji: "⚙️",
    cor: "#7C3AED",
    descricao: "Você une visão de negócio com habilidade técnica — o perfil ideal para liderar produtos digitais. Product Management, CTO e tech entrepreneurship são seus caminhos.",
    carreiras: ["Product Manager", "Tech Lead", "CTO Startup", "Scrum Master", "Empreendedor Tech"],
    habilidades: ["Visão de produto", "Liderança técnica", "Gestão ágil", "Estratégia digital"],
  },
  multiplo: {
    nome: "Perfil Multidisciplinar",
    emoji: "🌟",
    cor: "#64748B",
    descricao: "Você tem interesses variados e equilibrados — uma característica valiosa no mercado atual. Considere áreas que combinam múltiplas habilidades como gestão de projetos, consultoria ou empreendedorismo.",
    carreiras: ["Consultor", "Gestor de Projetos", "Empreendedor", "UX Researcher", "Analista de Negócios"],
    habilidades: ["Versatilidade", "Adaptabilidade", "Visão holística", "Aprendizado rápido"],
  },
};

export function calcularScores(respostas, questoes) {
  const scores = { tech: 0, criativo: 0, lideranca: 0, social: 0, ciencia: 0, comunicacao: 0 };
  respostas.forEach(({ questao_id, valor }) => {
    const questao = questoes.find(q => q.id === questao_id);
    if (questao) scores[questao.dimensao] += valor;
  });
  const maxPorDimensao = 10 * 5;
  Object.keys(scores).forEach(dim => {
    scores[dim] = Math.round((scores[dim] / maxPorDimensao) * 100);
  });
  return scores;
}

export function determinarPerfil(scores) {
  const ranking = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [primaria, secundaria] = ranking;
  const p1 = primaria[0];
  const p2 = secundaria[0];
  const diff = primaria[1] - secundaria[1];

  if (diff < 10 && primaria[1] < 60) {
    return { perfil: PERFIS.multiplo, primario: p1, secundario: p2, chave: 'multiplo' };
  }

  const combinacoes = {
    tech:        { tech: 'tech_puro', criativo: 'tech_criativo', lideranca: 'tech_lideranca', default: 'tech_puro' },
    criativo:    { tech: 'tech_criativo', default: 'criativo_puro' },
    lideranca:   { comunicacao: 'lideranca_comunicacao', default: 'lideranca_puro' },
    social:      { comunicacao: 'social_comunicacao', default: 'social_puro' },
    ciencia:     { tech: 'ciencia_tech', default: 'ciencia_puro' },
    comunicacao: { social: 'social_comunicacao', lideranca: 'lideranca_comunicacao', default: 'comunicacao_puro' },
  };

  const chave = combinacoes[p1]?.[p2] || combinacoes[p1]?.default || 'multiplo';
  return { perfil: PERFIS[chave], primario: p1, secundario: p2, chave };
}

export const LABELS_DIMENSAO = {
  tech:        { label: "💻 Tecnologia",       cor: "#3B82F6" },
  criativo:    { label: "🎨 Criatividade",      cor: "#EC4899" },
  lideranca:   { label: "🚀 Liderança",         cor: "#F97316" },
  social:      { label: "🤝 Perfil Social",     cor: "#10B981" },
  ciencia:     { label: "🔬 Ciência/Análise",   cor: "#6366F1" },
  comunicacao: { label: "📣 Comunicação",       cor: "#F59E0B" },
};