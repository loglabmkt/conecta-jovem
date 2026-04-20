import React, { useState, useEffect } from 'react';
import ScrollProgressBar from '../components/ScrollProgressBar';
import Navigation from '../components/Navigation';
import SliderPrincipal from '../components/SliderPrincipal';
import AboutSection from '../components/AboutSection';
import ConteudosSecao from '../components/ConteudosSecao';
import EligibilitySection from '../components/EligibilitySection';
import WhyJoinSection from '../components/WhyJoinSection';
import Footer from '../components/Footer';
import BackToTopButton from '../components/BackToTopButton';
import CookieConsentBanner from '../components/CookieConsentBanner';
import AdminLogin from '../components/AdminLogin';
import VideoPopup from '../components/VideoPopup';
import GaleriaImagens from '../components/GaleriaImagens';
import ClickTracker from '../components/ClickTracker';
import InscricaoModal from '../components/InscricaoModal';

export default function ConectaJovem() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Verificar se a URL tem o parâmetro admin=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdminLogin(true);
    }
  }, []);



  // Se deve mostrar login admin, renderizar apenas o componente de login
  if (showAdminLogin) {
    return <AdminLogin />;
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;300;400;600;700;900&display=swap');
          
          * {
            font-family: 'Titillium Web', sans-serif;
            font-weight: 400;
          }
          
          h1, h2, h3, .title {
            font-family: 'Titillium Web', sans-serif;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          
          h1 {
            font-weight: 900;
          }
          
          .friendly-text {
            font-family: 'Titillium Web', sans-serif;
            font-weight: 600;
          }
          
          button, .button {
            font-family: 'Titillium Web', sans-serif;
            font-weight: 600;
            letter-spacing: 0.01em;
          }
          
          p {
            font-weight: 400;
            line-height: 1.7;
          }
          
          strong, b {
            font-weight: 700;
          }
          
          .gradient-primary {
            background: linear-gradient(135deg, #e6ae4d 0%, #d3733e 100%);
          }
          
          .gradient-inverted {
            background: linear-gradient(135deg, #d3733e 0%, #e6ae4d 100%);
          }
          
          .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .glow-border {
            position: relative;
          }
          
          .glow-border::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #e6ae4d, #d3733e, #e6ae4d);
            border-radius: inherit;
            z-index: -1;
            opacity: 0;
            animation: glowPulse 3s ease-in-out infinite;
          }
          
          @keyframes glowPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.8; }
          }
          
          .floating-icon {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(5deg); }
            66% { transform: translateY(10px) rotate(-3deg); }
          }
        `}
      </style>
      
      <ClickTracker />
      <InscricaoModal />
      <div className="min-h-screen">
        {/* Scroll Progress Bar */}
        <ScrollProgressBar />
        
        {/* Main Website Content */}
        <Navigation />
        
        <main>
          {/* Slider Principal Dinâmico */}
          <div id="hero">
            <SliderPrincipal />
          </div>
          
          <div id="sobre">
            <AboutSection />
          </div>
          
          {/* Galeria de Imagens */}
          <GaleriaImagens />
          
          {/* Seção de Conteúdos Dinâmica */}
          <ConteudosSecao />
          
          <div id="elegibilidade">
            <EligibilitySection />
          </div>
          
          <div id="beneficios">
            <WhyJoinSection />
          </div>
          

        </main>
        
        <Footer />
        
        {/* Back to top button */}
        <BackToTopButton />
        
        {/* Cookie Consent Banner */}
        <CookieConsentBanner />
        
        {/* Video Popup */}
        <VideoPopup />
      </div>
    </>
  );
}