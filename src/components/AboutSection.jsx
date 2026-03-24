import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Code, Users, Award, Briefcase, Sparkles, ChevronDown } from 'lucide-react';
import FloatingElements from './FloatingElements';
import ParallaxSection from './ParallaxSection';

export default function AboutSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [
  {
    icon: Code,
    title: "Formação gratuita em tecnologia",
    description: "Aprenda as tecnologias mais demandadas do mercado com metodologia prática"
  },
  {
    icon: Users,
    title: "Acesso a mentores especialistas",
    description: "Seja orientado por profissionais experientes que atuam na área"
  },
  {
    icon: Award,
    title: "Certificado reconhecido",
    description: "Receba um certificado com valor no mercado de trabalho"
  },
  {
    icon: Briefcase,
    title: "Preparação para o mercado",
    description: "Desenvolva habilidades práticas e seja protagonista da sua jornada"
  }];

  return (
    <>
      {/* Mobile-specific styles */}
      <style>{`
        .static-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #e6ae4d, #d3733e, #e6ae4d);
          border-radius: inherit;
          z-index: -1;
          opacity: 0.4;
          transition: opacity 0.3s ease-in-out;
        }

        .static-glow:hover::before {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .about-section-mobile {
            padding: 40px 0 !important;
            display: block;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .about-title-mobile {
            margin-bottom: 48px !important;
          }
          
          .about-cta-mobile {
            margin-top: 48px !important;
          }
          
          /* Mobile card interactions with fixed border */
          .mobile-feature-card {
            transition: transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out;
            position: relative;
            z-index: 1;
            border: 2px solid rgba(249, 115, 22, 0.3) !important;
          }
          
          .mobile-feature-card:hover, .mobile-feature-card:active {
            transform: scale(0.985);
            box-shadow: 0 20px 30px -10px rgba(249, 115, 22, 0.25);
            border-color: rgba(249, 115, 22, 0.6) !important;
          }
          
          .mobile-feature-card:active {
            transform: scale(0.98);
            box-shadow: 0 15px 25px -8px rgba(249, 115, 22, 0.2);
          }

          /* Mobile "Saiba mais" panel improvements */
          .saiba-mais-panel {
            max-width: min(90vw, 600px);
            width: 88vw;
            margin-inline: auto;
            padding: 20px 24px;
            border-radius: 14px;
            /* backdrop-filter: blur(10px); -- Removed to fix iOS text clipping */
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: visible !important;
            margin-top: 16px;
            margin-bottom: 20px;
            -webkit-mask-image: none !important;
            mask-image: none !important;
            clip-path: none !important;
            -webkit-overflow-scrolling: touch;
            box-sizing: border-box;
          }

          .saiba-mais-content {
            font-size: clamp(14px, 3.8vw, 16px);
            line-height: 1.6;
            text-align: justify;
            text-justify: inter-word;
            letter-spacing: normal;
            word-spacing: normal;
            hyphens: auto;
            -webkit-hyphens: auto;
            overflow-wrap: anywhere;
            word-break: normal;
            color: #374151;
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }

          .saiba-mais-content p {
            margin-block: 10px;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 0;
          }

          .saiba-mais-content h3 {
            font-weight: 700;
            font-size: 1em;
            margin: 12px 0 6px;
            color: #1f2937;
            font-family: 'Montserrat', sans-serif;
            text-align: left;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 0;
          }

          .saiba-mais-content strong {
            color: #c2410c;
          }
        }
        
        .prose-custom p {
          margin-bottom: 1.25em;
          line-height: 1.7;
        }
        .prose-custom h3 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          margin-top: 2em;
          margin-bottom: 1em;
          color: #1f2937;
        }
        .prose-custom strong {
          color: #c2410c;
        }
      `}</style>
      
      <ParallaxSection className="py-16 md:py-24 about-section-mobile bg-white relative overflow-hidden" parallaxOffset={30}>
        
        <div className="hidden md:block">
          <FloatingElements sectionId="about" />
        </div>

        {/* Background Pattern with Parallax - Desktop only */}
        <div className="hidden md:block">
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{ y }}>
            <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 gradient-inverted rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 gradient-primary rounded-full blur-2xl"></div>
          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Desktop version with animations */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block text-center mb-16 md:mb-20 about-title-mobile">

            <motion.div
              className="inline-flex items-center gap-3 mb-8"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}>

              <Sparkles className="w-8 h-8 text-orange-500" />
              <span className="friendly-text text-orange-600 font-semibold text-lg">SOBRE O PROJETO</span>
              <Sparkles className="w-8 h-8 text-orange-500" />
            </motion.div>
            
            <motion.h2
              className="title text-4xl md:text-6xl font-black text-gray-900 mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}>

              O que é o <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Conecta Jovem?</span>
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}>

              Um projeto revolucionário que conecta jovens talentosos ao mundo da tecnologia, 
              oferecendo <span className="font-bold text-orange-600">formação gratuita e de qualidade</span> para construir o futuro digital.
            </motion.p>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center mb-16 about-title-mobile">
            <div className="inline-flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-orange-500" />
              <span className="friendly-text text-orange-600 font-semibold text-lg">SOBRE O PROJETO</span>
              <Sparkles className="w-8 h-8 text-orange-500" />
            </div>
            
            <h2 className="title text-4xl font-black text-gray-900 mb-8">
              O que é o <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Conecta Jovem?</span>
            </h2>
            
            <p className="text-gray-700 mx-auto text-sm font-medium max-w-4xl leading-relaxed">Um projeto revolucionário que conecta jovens talentosos ao mundo da tecnologia, oferecendo formação gratuita e de qualidade para construir o futuro digital.


            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) =>
            <div key={index} className="group relative">
                {/* Desktop version with animations - borda no hover */}
                <motion.div
                className="hidden md:block glass-effect rounded-3xl p-8 h-full transition-all duration-500 border border-gray-200/50 group-hover:border-orange-300/50 static-glow"
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 20px 30px -10px rgba(249, 115, 22, 0.2)",
                  transition: { duration: 0.3 }
                }}>

                  <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.5 }}>

                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="title text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </motion.div>
                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                    className="w-2 h-2 bg-orange-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  </div>
                </motion.div>

                {/* Mobile version without scroll animations - borda fixa */}
                <div className="md:hidden mobile-feature-card glass-effect rounded-3xl p-8 h-full">
                  <div className="mb-6">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="title text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Collapsible Section */}
          <div className="text-center mt-12 md:mt-16">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg relative overflow-hidden gradient-primary shadow-lg transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-orange-500"
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(230, 174, 77, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              aria-expanded={isExpanded}
              aria-controls="about-details">

              <span>Saiba mais</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}>

                <ChevronDown className="w-6 h-6" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 transform -translate-x-full group-hover:translate-x-0"></div>
            </motion.button>
          </div>

          <AnimatePresence>
            {isExpanded &&
            <motion.div
              id="about-details"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-8 max-w-5xl mx-auto overflow-hidden">

                <div className="hidden md:block glass-effect rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200/50 shadow-md">
                  <div className="max-w-3xl mx-auto px-4 md:px-6">
                    <div className="prose-custom text-neutral-800 friendly-text">
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">Para muitos jovens, o acesso a um computador e a um curso de tecnologia parece um sonho distante. Mas agora, esse sonho está mais próximo de se tornar realidade. O Projeto Conecta Jovem nasceu com um objetivo claro: quebrar barreiras sociais e criar oportunidades concretas para jovens da baixada cuiabana que vivem em situação de vulnerabilidade.</p>
                      
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">Fruto de uma parceria inédita entre a Log Lab Tecnologia que Transforma, a Universidade Federal de Mato Grosso (UFMT) – por meio do Instituto de Computação – o projeto vai oferecer formação prática e gratuita em tecnologia, conectando o conhecimento acadêmico à realidade do mercado de trabalho.</p>
                      
                      <h3 className="text-base md:text-lg font-bold text-neutral-800 mt-6 mb-2">Histórias que inspiram</h3>
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">Imagine João*, 19 anos, morador de Várzea Grande, que sempre sonhou em trabalhar com computadores, mas nunca teve condições de pagar um curso especializado. Ou Ana*, 18, que adora matemática e lógica, mas nunca soube como transformar esse talento em uma carreira. O Conecta Jovem foi criado para transformar a realidade de jovens como eles.</p>
                      
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">Com dez módulos de até 30 horas cada, o programa vai muito além de ensinar a mexer em softwares: prepara para pensar como um profissional de tecnologia. Do uso consciente e seguro da internet até noções de programação e resolução de problemas, cada etapa foi pensada para ser prática e aplicável. (*Nomes fictícios para preservar a identidade dos futuros participantes).</p>
                      
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">O impacto vai além da sala de aula.</p>
                      
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">Segundo dados da Brasscom (Associação das Empresas de Tecnologia da Informação e Comunicação), até 2025 o Brasil precisará de 797 mil novos profissionais de TI, mas forma apenas 53 mil por ano. Essa lacuna é uma oportunidade para quem está se preparando agora – e o Conecta Jovem quer que esses jovens estejam prontos.</p>
                      
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">"O Conecta Jovem não é apenas um curso. É uma porta aberta para um futuro promissor. Ao unir universidade, empresa e comunidade, estamos criando um caminho real de transformação e inclusão social. Fico extremamente honrado em poder retribuir para esta terra que me acolheu", afirma Antônio Fernando Ribeiro Pereira, fundador da Log Lab Tecnologia que Transforma.</p>

                      <h3 className="text-base md:text-lg font-bold text-neutral-800 mt-6 mb-2">União que gera transformação</h3>
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">O Conecta Jovem é um exemplo de parceria público-privada que funciona. De um lado, a Log Lab investe recursos financeiros e know-how do setor privado; de outro, a UFMT e a Fundação Uniselva oferecem estrutura acadêmica, professores qualificados e gestão eficiente. Essa união permite que o projeto seja gratuito para os participantes e mantenha alta qualidade de conteúdo e metodologia.</p>

                      <h3 className="text-base md:text-lg font-bold text-neutral-800 mt-6 mb-2">Sobre a LogLab</h3>
                      <p className="text-base md:text-lg leading-relaxed text-justify mb-4">A LogLab é uma fábrica de software sediada em Cuiabá (MT) especializada no desenvolvimento de soluções tecnológicas para o setor público. Nascida com o propósito de transformar a relação entre governo e cidadão por meio da inovação, a empresa combina excelência técnica, agilidade e profundo conhecimento dos processos da administração pública. Com um time multidisciplinar e altamente qualificado, a LogLab atua desde a concepção até a entrega de sistemas complexos, garantindo qualidade, segurança e impacto social em cada projeto. A empresa também se destaca pelo compromisso com o desenvolvimento de talentos locais, investindo em programas de formação e empregabilidade para jovens profissionais da região, fortalecendo o ecossistema de tecnologia do estado.</p>
                    <div className="text-center mt-10">
                        <motion.button
                          onClick={() => window.open('https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem', '_blank')}
                    </div>
                  </div>
                </div>

                {/* Mobile version with improved layout */}
                <div className="md:hidden saiba-mais-panel">
                  <div className="saiba-mais-content">
                    <p>Para muitos jovens, o acesso a um computador e a um curso de tecnologia parece um sonho distante. Mas agora, esse sonho está mais próximo de se tornar realidade. O Projeto Conecta Jovem nasceu com um objetivo claro: quebrar barreiras sociais e criar oportunidades concretas para jovens da baixada cuiabana que vivem em situação de vulnerabilidade.</p>
                    
                    <p>Fruto de uma parceria inédita entre a Log Lab Tecnologia que Transforma, a Universidade Federal de Mato Grosso (UFMT) – por meio do Instituto de Computação – o projeto vai oferecer formação prática e gratuita em tecnologia, conectando o conhecimento acadêmico à realidade do mercado de trabalho.</p>
                    
                    <h3>Histórias que inspiram</h3>
                    <p>Imagine João*, 19 anos, morador de Várzea Grande, que sempre sonhou em trabalhar com computadores, mas nunca teve condições de pagar um curso especializado. Ou Ana*, 18, que adora matemática e lógica, mas nunca soube como transformar esse talento em uma carreira. O Conecta Jovem foi criado para transformar a realidade de jovens como eles.</p>
                    
                    <p>Com dez módulos de até 30 horas cada, o programa vai muito além de ensinar a mexer em softwares: prepara para pensar como um profissional de tecnologia. Do uso consciente e seguro da internet até noções de programação e resolução de problemas, cada etapa foi pensada para ser prática e aplicável. (*Nomes fictícios para preservar a identidade dos futuros participantes).</p>
                    
                    <p>O impacto vai além da sala de aula.</p>
                    
                    <p>Segundo dados da Brasscom (Associação das Empresas de Tecnologia da Informação e Comunicação), até 2025 o Brasil precisará de 797 mil novos profissionais de TI, mas forma apenas 53 mil por ano. Essa lacuna é uma oportunidade para quem está se preparando agora – e o Conecta Jovem quer que esses jovens estejam prontos.</p>
                    
                    <p>"O Conecta Jovem não é apenas um curso. É uma porta aberta para um futuro promissor. Ao unir universidade, empresa e comunidade, estamos criando um caminho real de transformação e inclusão social. Fico extremamente honrado em poder retribuir para esta terra que me acolheu", afirma Antônio Fernando Ribeiro Pereira, fundador da Log Lab Tecnologia que Transforma.</p>

                    <h3>União que gera transformação</h3>
                    <p>O Conecta Jovem é um exemplo de parceria público-privada que funciona. De um lado, a Log Lab investe recursos financeiros e know-how do setor privado; de outro, a UFMT e a Fundação Uniselva oferecem estrutura acadêmica, professores qualificados e gestão eficiente. Essa união permite que o projeto seja gratuito para os participantes e mantenha alta qualidade de conteúdo e metodologia.</p>

                    <h3>Sobre a LogLab</h3>
                    <p>A LogLab é uma fábrica de software sediada em Cuiabá (MT) especializada no desenvolvimento de soluções tecnológicas para o setor público. Nascida com o propósito de transformar a relação entre governo e cidadão por meio da inovação, a empresa combina excelência técnica, agilidade e profundo conhecimento dos processos da administração pública. Com um time multidisciplinar e altamente qualificado, a LogLab atua desde a concepção até a entrega de sistemas complexos, garantindo qualidade, segurança e impacto social em cada projeto. A empresa também se destaca pelo compromisso com o desenvolvimento de talentos locais, investindo em programas de formação e empregabilidade para jovens profissionais da região, fortalecendo o ecossistema de tecnologia do estado.</p>
                    <div className="text-center mt-8">
                        <button
                          onClick={() => window.open('https://loglabdigital.inhire.app/conecta-jovem/vagas/52d79473-4854-4af8-a6e5-b0c9f42d3e99/conecta-jovem', '_blank')}
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>


        </div>
      </ParallaxSection>
    </>);

}