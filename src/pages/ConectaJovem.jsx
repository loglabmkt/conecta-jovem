import React, { useState, useEffect } from 'react';
import ScrollProgressBar from '../components/ScrollProgressBar';
import Navigation from '../components/Navigation';
import SliderPrincipal from '../components/SliderPrincipal';
import AboutSection from '../components/AboutSection';
import ConteudosSecao from '../components/ConteudosSecao';
import EligibilitySection from '../components/EligibilitySection';
import WhyJoinSection from '../components/WhyJoinSection';
import RegistrationSection from '../components/RegistrationSection';
import Footer from '../components/Footer';
import BackToTopButton from '../components/BackToTopButton';
import CookieConsentBanner from '../components/CookieConsentBanner';
import AdminLogin from '../components/AdminLogin';
import VideoPopup from '../components/VideoPopup';
import GaleriaImagens from '../components/GaleriaImagens';

export default function ConectaJovem() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Verificar se a URL tem o parâmetro admin=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdminLogin(true);
    }
  }, []);

  // Add Meta Pixel to head
  React.useEffect(() => {
    // Meta Pixel Code
    !function (f, b, e, v, n, t, s)
    {if (f.fbq) return;n = f.fbq = function () {n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments);};
      if (!f._fbq) f._fbq = n;n.push = n;n.loaded = !0;n.version = '2.0';
      n.queue = [];t = b.createElement(e);t.async = !0;
      t.src = v;s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', '1526401935381764');
    window.fbq('track', 'PageView');

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1526401935381764&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);
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
          
          <div id="inscricao">
            <RegistrationSection />
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