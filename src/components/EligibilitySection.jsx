import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, GraduationCap, Heart, CheckCircle } from 'lucide-react';
import FloatingElements from './FloatingElements';
import ParallaxSection from './ParallaxSection';

export default function EligibilitySection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [1000, 2000], [0, 100]);

  const criteria = [
  {
    icon: Calendar,
    title: "15 a 24 anos",
    description: "Idade ideal para começar na tecnologia",
    color: "blue"
  },
  {
    icon: MapPin,
    title: "Baixada cuiabana",
    description: "Morador da região metropolitana de Cuiabá",
    color: "green"
  },
  {
    icon: GraduationCap,
    title: "Estudante",
    description: "Estudante da rede pública de ensino",
    color: "purple"
  },
  {
    icon: Heart,
    title: "Ofertas de aulas",
    description: "Terças e quintas no periodo matutino",
    color: "pink"
  }];


  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600"
  };

  return (
    <>
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .eligibility-section-mobile {
            padding: 40px 0 !important;
            display: block;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .eligibility-title-mobile {
            margin-bottom: 48px !important;
          }
          
          /* Mobile card interactions */
          .mobile-criteria-card {
            transition: transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out;
            position: relative;
            z-index: 1;
          }
          
          .mobile-criteria-card:hover, .mobile-criteria-card:active {
            transform: scale(0.985);
            box-shadow: 0 12px 25px rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          .mobile-criteria-card:active {
            transform: scale(0.98);
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
          }
        }
      `}</style>
      
      <ParallaxSection className="py-16 md:pt-24 md:pb-0 eligibility-section-mobile gradient-inverted relative overflow-hidden" parallaxOffset={-40}>
        
        <div className="hidden md:block">
          <FloatingElements sectionId="eligibility" />
        </div>

        {/* Floating Elements with Parallax - Desktop only */}
        <div className="hidden md:block">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ y }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full" />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 right-20 w-3 h-3 bg-white/30 rounded-full" />

          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Desktop version with animations */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="hidden md:block text-center mb-16 md:mb-20 eligibility-title-mobile">
            
            <motion.div
              className="inline-flex items-center gap-3 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}>
              
              <CheckCircle className="w-8 h-8 text-white" />
              <span className="friendly-text text-white/90 font-semibold text-lg">REQUISITOS</span>
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h2
              className="title text-4xl md:text-6xl font-black text-white mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}>
              
              Quem pode <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">participar?</span>
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}>
              
              Verificar se você atende aos critérios é simples. Confira abaixo:
            </motion.p>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center mb-16 eligibility-title-mobile">
            <div className="inline-flex items-center gap-3 mb-8">
              <CheckCircle className="w-8 h-8 text-white" />
              <span className="friendly-text text-white/90 font-semibold text-lg">REQUISITOS</span>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-white mb-8 text-base font-black title">Quem pode participar?

            </h2>
            
            <p className="text-white/80 mx-auto text-lg max-w-3xl leading-relaxed">Verificar se você atende aos critérios é simples. Confira abaixo:

            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:mb-20">
            {criteria.map((criterion, index) =>
            <div key={index} className="group">
                {/* Desktop version with animations */}
                <motion.div
                initial={{ opacity: 0, y: 100, rotate: -15 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -15,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="hidden md:block">
                  
                  <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 h-full hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-white/40 glow-border relative overflow-hidden">
                    
                    {/* Animated background effect */}
                    <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }} />

                    
                    <div className="text-center relative z-10">
                      <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${colorMap[criterion.color]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}>
                        
                        <criterion.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <h3 className="title text-xl font-bold text-white mb-4">
                        {criterion.title}
                      </h3>
                      
                      <p className="text-white/80 leading-relaxed friendly-text">
                        {criterion.description}
                      </p>
                    </div>
                    
                    {/* Check mark for completed criteria */}
                    <motion.div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}>
                      
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Mobile version without scroll animations */}
                <div className="md:hidden mobile-criteria-card bg-white/15 backdrop-blur-xl rounded-3xl p-8 h-full border border-white/20 relative overflow-hidden">
                  <div className="text-center relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${colorMap[criterion.color]} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <criterion.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="title text-xl font-bold text-white mb-4">
                      {criterion.title}
                    </h3>
                    
                    <p className="text-white/80 leading-relaxed friendly-text">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Important Notice Desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="hidden md:block text-center pb-24">
            
            <motion.div
              className="inline-block bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 glow-border relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}>
              
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  ⚡
                </motion.div>
                <h3 className="title text-3xl font-bold text-white">
                  IMPORTANTE!
                </h3>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                  ⚡
                </motion.div>
              </motion.div>
              <p className="friendly-text text-xl text-white/90 max-w-2xl">
                As vagas são <span className="font-bold text-yellow-200">limitadas</span> e serão preenchidas através do processo seletivo. 
                Não perca esta oportunidade única!
              </p>
            </motion.div>
          </motion.div>

          {/* Mobile version without animations */}
          <div className="md:hidden text-center mb-16">
            <div className="bg-white/10 mt-5 mb-5 p-8 inline-block backdrop-blur-xl rounded-3xl border-2 border-white/30 relative">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>⚡</div>
                <h3 className="text-white text-lg font-bold title">IMPORTANTE!</h3>
                <div>⚡</div>
              </div>
              <p className="friendly-text text-xl text-white/90 max-w-2xl">
                As vagas são <span className="font-bold text-yellow-200">limitadas</span> e serão preenchidas através do processo seletivo. 
                Não perca esta oportunidade única!
              </p>
            </div>
          </div>
        </div>
      </ParallaxSection>
    </>);

}