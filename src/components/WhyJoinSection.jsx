
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Brain, Users2, Target } from 'lucide-react';
import FloatingElements from './FloatingElements';
import ParallaxSection from './ParallaxSection';

export default function WhyJoinSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [2000, 3000], [0, -80]);

  const benefits = [
  {
    icon: Code2,
    title: "Aprender tecnologia de verdade",
    description: "Noção em programação, desenvolvimento web, banco de dados e muito mais"
  },
  {
    icon: Brain,
    title: "Desenvolver habilidades do futuro",
    description: "Pensamento lógico, resolução de problemas e criatividade"
  },
  {
    icon: Users2,
    title: "Ser orientado por profissionais",
    description: "Mentoria direta com especialistas que atuam no mercado"
  },
  {
    icon: Target,
    title: "Conseguir sua primeira oportunidade",
    description: "Preparação completa para estágios e empregos na área"
  }];


  return (
    <>
      {/* Mobile-specific styles */}
      <style jsx>{`
        .section-beneficio {
        padding-top: -20px !important;
        margin-top: -100px !important;
        margin-bottom: -100px !important;
        padding-bottom: 0px !important;
        }
        @media (max-width: 768px) {
          .benefits-section-mobile {
            padding: 40px 0 !important;
            display: block;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .benefits-title-mobile {
            margin-bottom: 48px !important;
          }
          
          .benefits-grid-mobile {
            margin-bottom: 48px !important;
          }
          
          /* Mobile card interactions */
          .mobile-benefit-card {
            transition: transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out;
            position: relative;
            z-index: 1;
          }
          
          .mobile-benefit-card:hover, .mobile-benefit-card:active {
            transform: scale(0.985);
            box-shadow: 0 15px 30px rgba(59, 130, 246, 0.25);
            border-color: rgba(59, 130, 246, 0.6);
          }
          
          .mobile-benefit-card:active {
            transform: scale(0.98);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
          }
        }
      `}</style>
      
      <ParallaxSection className="section-beneficio mt-0 md:pt-0 md:pb-32 benefits-section-mobile bg-gray-900 relative overflow-hidden" parallaxOffset={60}>
        
        <div className="hidden md:block">
          <FloatingElements sectionId="benefits" />
        </div>

        {/* Animated background elements with parallax - Desktop only */}
        <div className="hidden md:block">
          <motion.div
            className="absolute inset-0"
            style={{ y }}>
            
            <motion.div
              className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-10"
              animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
              transition={{ duration: 8, repeat: Infinity }} />

            <motion.div
              className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-3xl opacity-10"
              animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }} />

          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Desktop version with animations */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block text-center mb-12 md:mb-16 benefits-title-mobile md:pt-24">
            
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 title"
              initial={{ opacity: 0, rotateX: -90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}>
              
              Por que <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">participar?</span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}>
              
              Esta é sua oportunidade de entrar no mundo da tecnologia e construir uma carreira sólida e promissora
            </motion.p>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center mb-12 benefits-title-mobile">
            <h2 className="text-4xl font-bold text-white mb-6 title">
              Por que <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">participar?</span>
            </h2>
            <p className="text-gray-300 mx-auto text-sm max-w-3xl leading-relaxed">É a sua chance de transformar curiosidade em conhecimento, conhecimento em prática e prática em futuro

            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 benefits-grid-mobile">
            {benefits.map((benefit, index) =>
            <div key={index} className="group">
                {/* Desktop version with animations */}
                <motion.div
                className="hidden md:block bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden h-full"
                initial={{ opacity: 0, y: 100, rotateY: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}>
                  
                  {/* Animated shine effect */}
                  <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }} />

                  
                  <div className="text-center relative z-10">
                    <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}>
                      
                      <benefit.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>

                {/* Mobile version without scroll animations */}
                <div className="md:hidden mobile-benefit-card bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 relative overflow-hidden h-full">
                  <div className="text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop animated CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="hidden md:block text-center">
            
            <motion.div
              className="inline-block relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }} />

              <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-white">
                <motion.h3
                  className="text-3xl font-bold mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  
                  🚀 Sua jornada na tecnologia começa aqui!
                </motion.h3>
                <p className="text-xl text-orange-100">
                  Transforme sua paixão por tecnologia em um futuro cheio de possibilidades
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-50" />
              <div className="bg-gradient-to-r text-white mb-24 p-8 relative from-orange-500 to-yellow-500 rounded-3xl">
                <h3 className="mb-4 text-base font-bold"> Sua jornada na tecnologia começa aqui!

                </h3>
                <p className="text-xl text-orange-100">
                  Transforme sua paixão por tecnologia em um futuro cheio de possibilidades
                </p>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>
    </>);

}