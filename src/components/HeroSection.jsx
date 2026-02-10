
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, ArrowDown, Users, Zap, Sparkles, Code, Award, GraduationCap } from 'lucide-react';
// Removed: import CountdownTimer from './CountdownTimer';
import FloatingElements from './FloatingElements';
import MobileFloatingIcons from './MobileFloatingIcons';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const mobileImages = [
    'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/8aaa4372b_lavinia_home.png',
    'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/919540a7b_lavinia-02.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // New state and assets for desktop carousel
  const [currentDesktopImageIndex, setCurrentDesktopImageIndex] = useState(0);
  const desktopImages = [
    'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/788879148_lavinia-capa.png', // Lavinia
    'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/257efcd44_julia.png'    // Julia
  ];
  const desktopImageAlts = [
    'Jovem estudante sorrindo, participante do projeto Conecta Jovem',
    'Outra jovem estudante sorrindo, participante do projeto Conecta Jovem'
  ];

  useEffect(() => {
    // Mobile image rotation
    const mobileTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mobileImages.length);
    }, 7000); // Rotação a cada 7 segundos

    // Desktop image rotation
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let desktopTimer;
    if (!motionQuery.matches) {
      desktopTimer = setInterval(() => {
        setCurrentDesktopImageIndex((prevIndex) => (prevIndex + 1) % desktopImages.length);
      }, 5000); // 5 seconds for desktop
    }

    return () => {
      clearInterval(mobileTimer); // Limpeza ao desmontar
      if (desktopTimer) {
        clearInterval(desktopTimer);
      }
    };
  }, [mobileImages.length, desktopImages.length]);

  // Removed: useEffect for Facebook Pixel event listener and button click handling

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile-specific styles */}
      <style jsx>{`
        /* Mobile smooth scrolling and scrollbar styling */
        @media (max-width: 768px) {
          html, body {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Custom scrollbar for mobile */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f97316 100%);
            border-radius: 10px;
            opacity: 0.8;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          }
          
          ::-webkit-scrollbar-thumb:hover {
            opacity: 1;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
          }
          
          /* Firefox scrollbar */
          html {
            scrollbar-width: thin;
            scrollbar-color: #8b5cf6 rgba(0, 0, 0, 0.05);
          }
          
          .mobile-hero-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: clamp(16px, 4vw, 20px); /* Adjusted gap for removed elements */
            padding: clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px) clamp(32px, 8vw, 40px);
            padding-top: calc(env(safe-area-inset-top, 8px) + clamp(88px, 20vw, 108px));
            min-height: 100vh;
            box-sizing: border-box;
            z-index: 1000;
            position: relative;
          }
          
          .mobile-hero-image {
            width: clamp(92%, 96vw, 98%); /* Maximized image width */
            max-width: 500px; /* Increased max-width */
            height: auto; /* Allow height to be determined by aspect-ratio */
            border-radius: 20px;
            object-fit: cover;
            margin: 0;
            margin-bottom: 0; /* Removed margin-bottom */
            filter: none;
            box-shadow: none;
            overflow: hidden; /* Ensure rounded corners for slideshow */
          }
          
          /* Removed: .mobile-countdown-container */
          /* Removed: .mobile-countdown-wrapper */
          
          .mobile-badges-container {
            display: none !important;
          }
          
          /* Removed: .mobile-cta-group */
          /* Removed: .mobile-cta-primary */
          
          .mobile-tagline {
            font-size: clamp(12px, 3.4vw, 14px);
            color: rgba(255, 255, 255, 0.85);
            font-weight: 450;
            letter-spacing: 0.01em;
            text-align: center;
            max-width: 90%;
            margin-top: clamp(16px, 4vw, 20px); /* Adjusted margin-top */
            margin-bottom: 0;
            line-height: 1.4;
            z-index: 1000;
            position: relative;
          }
          
          .mobile-hero-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.08) 100%);
            pointer-events: none;
            z-index: 100;
          }

          /* --- New Animations for Mobile --- */

          .hero-motion-layer {
            position: absolute;
            inset: 0;
            overflow: hidden;
            z-index: 0;
            pointer-events: none;
          }

          /* Rocket Animations */
          @keyframes diagonal-travel {
            from {
              transform: translate(-10vw, 100vh) rotate(35deg);
              opacity: 0;
            }
            20% { opacity: 0.28; }
            80% { opacity: 0.28; }
            to {
              transform: translate(100vw, -20vh) rotate(35deg);
              opacity: 0;
            }
          }

          .motion-rocket {
            position: absolute;
            color: white;
            animation: diagonal-travel linear infinite;
            will-change: transform, opacity;
          }

          /* Utility Icon Animations */
          @keyframes pulse-fade {
            0%, 100% {
              opacity: 0;
              transform: scale(0.98);
            }
            50% {
              opacity: 0.22;
              transform: scale(1.03);
            }
          }

          .motion-utility-icon {
            position: absolute;
            color: white;
            animation: pulse-fade ease-in-out infinite;
            will-change: transform, opacity;
          }

          /* Removed: Animated CTA Border styles */
          /* Removed: @keyframes rotate-gradient */

          /* Reduced Motion */
          @media (prefers-reduced-motion: reduce) {
            .motion-rocket, .motion-utility-icon /* Removed: , .mobile-cta-animated-border::before */ {
              animation: none !important;
            }
            .motion-rocket, .motion-utility-icon {
              opacity: 0.1 !important;
            }
            /* Removed: .mobile-cta-animated-border::before */
          }
        }
      `}</style>

      <section className="relative w-screen h-screen overflow-hidden">
        {/* Enhanced Fullscreen Gradient Background */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y }}>

          <div className="absolute inset-0 bg-gradient-to-br from-[#e6ae4d] via-[#e0975a] to-[#d3733e] w-full h-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 w-full h-full"></div>
        </motion.div>
        
        {/* Mobile-only Floating Icons - Updated */}
        <div className="md:hidden">
            <MobileFloatingIcons />
            {/* New Motion Layer for Rockets and Utility Icons */}
            <div className="hero-motion-layer">
                {/* Rockets */}
                <Rocket className="motion-rocket w-4 h-4" style={{ animationDuration: '12s', animationDelay: '0s', opacity: 0.25 }} />
                <Rocket className="motion-rocket w-5 h-5" style={{ animationDuration: '16s', animationDelay: '3s', opacity: 0.28 }} />
                <Rocket className="motion-rocket w-3 h-3" style={{ animationDuration: '20s', animationDelay: '7s', opacity: 0.22 }} />
                <Rocket className="motion-rocket w-4 h-4" style={{ animationDuration: '24s', animationDelay: '10s', opacity: 0.26 }} />

                {/* Utility Icons */}
                <Award className="motion-utility-icon w-6 h-6" style={{ top: '15%', left: '85%', animationDuration: '4.5s', animationDelay: '0.5s' }} />
                <GraduationCap className="motion-utility-icon w-7 h-7" style={{ top: '70%', left: '10%', animationDuration: '5.5s', animationDelay: '1.5s' }} />
                <Award className="motion-utility-icon w-5 h-5" style={{ top: '85%', right: '15%', animationDuration: '6.5s', animationDelay: '2.5s' }} />
                <GraduationCap className="motion-utility-icon w-6 h-6" style={{ top: '30%', right: '80%', animationDuration: '4s', animationDelay: '3.5s' }} />
            </div>
        </div>

        {/* Floating Elements - Hidden on mobile */}
        <div className="hidden md:block">
          <FloatingElements sectionId="hero" />
        </div>

        {/* DESKTOP LAYOUT - Using absolute positioning */}
        <motion.div
          className="relative z-10 w-full h-full hidden md:flex items-center justify-center px-6"
          style={{ opacity }}>

          <motion.div initial={{ opacity: 0, x: -60, y: -30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-32 left-16 z-20">
            <div className="space-y-3">
              <motion.span className="friendly-text text-white/80 font-medium text-lg block" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>🚀 Projeto</motion.span>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 inline-block">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/b7aa5a616_PERFIL_02.png" alt="Conecta Jovem" className="h-16 w-auto object-contain" />
              </motion.div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 60, y: -30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="absolute top-32 right-16 z-20">
            <div className="space-y-4">
              <div className="glass-effect rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-blue-300" /><span className="friendly-text font-semibold text-white">15 a 24 Anos</span></div>
                <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-green-300" /><span className="friendly-text font-semibold text-white">100% Gratuito</span></div>
              </div>
              <div className="glass-effect rounded-xl p-3 border border-white/20 text-center"><span className="friendly-text text-white font-semibold text-sm">Conexão que transforma.</span></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.7, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.8 }} className="relative z-30">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-blue-400/30 rounded-full blur-3xl scale-125"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-purple-400/20 rounded-full blur-2xl scale-110"></div>
            <div className="relative group w-96 h-96 lg:w-[450px] lg:h-[450px] transition-all duration-700 hover:scale-105">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentDesktopImageIndex}
                  src={desktopImages[currentDesktopImageIndex]}
                  alt={desktopImageAlts[currentDesktopImageIndex]}
                  className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl group-hover:shadow-3xl transition-shadow duration-700"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </AnimatePresence>
              <motion.div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg" animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}><Sparkles className="w-6 h-6 text-white" /></motion.div>
              <motion.div className="absolute -bottom-6 -left-6 w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center shadow-lg" animate={{ y: [0, 8, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}><Code className="w-5 h-5 text-white" /></motion.div>
              <motion.div className="absolute top-20 -left-12 w-8 h-8 bg-green-400 rounded-full animate-pulse shadow-lg" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -60, y: 60 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 1 }} className="absolute bottom-32 left-16 z-20 max-w-md">
            <p className="text-lg text-white/90 leading-relaxed font-medium glass-effect rounded-2xl p-6 border border-white/20">Capacitamos jovens com <span className="font-bold text-yellow-200">formação técnica em TI</span>, preparando-os para um futuro promissor na era digital.</p>
          </motion.div>
          {/* Removed: motion.div containing CountdownTimer and "VAGAS LIMITADAS" */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4 }} className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-4 items-center">
              {/* Removed: Button with id="hero-desktop-register-btn" */}
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" className="text-white hover:bg-white/10 text-lg font-semibold px-10 py-4 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40" onClick={() => scrollToSection('sobre')}>SAIBA MAIS <ArrowDown className="ml-3 w-5 h-5" /></Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* MOBILE LAYOUT - No scroll animations */}
        <div className="md:hidden mobile-hero-container">

          {/* Hero Image Slideshow */}
          <div className="relative mobile-hero-image" style={{ aspectRatio: '1 / 1.05' }}>
            <AnimatePresence>
              <motion.img
                key={currentImageIndex}
                src={mobileImages[currentImageIndex]}
                alt="Jovem participante do projeto Conecta Jovem"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ borderRadius: 'inherit' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                aria-hidden="true" />

            </AnimatePresence>
          </div>

          {/* Removed: Countdown - Moved down */}
          {/* Removed: Single CTA - Moved down */}

          {/* Static tagline */}
          <p className="mobile-tagline">
            Construindo o futuro através da tecnologia ✨
          </p>
        </div>
      </section>
    </>);
}
