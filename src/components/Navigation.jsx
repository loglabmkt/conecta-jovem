import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navItems = [
    { name: 'Início', href: '#hero' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Conteúdos', href: '#conteudos' },
    { name: 'Requisitos', href: '#elegibilidade' },
    { name: 'Benefícios', href: '#beneficios' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleNavClick = (item) => {
    if (item.external) {
      window.open(item.href, '_blank');
      setIsOpen(false);
    } else {
      // Verificar se estamos na página ConectaJovem
      const isHomePage = window.location.pathname.includes('ConectaJovem') || 
                         window.location.pathname === '/' ||
                         !window.location.pathname.includes('ConteudoDetalhes');
      
      if (isHomePage) {
        // Estamos na home, fazer scroll normal
        scrollToSection(item.href);
      } else {
        // Estamos em outra página, redirecionar para home com âncora
        window.location.href = createPageUrl('ConectaJovem') + item.href;
      }
    }
  };

  const handleLogoClick = () => {
    // Sempre voltar para a home
    window.location.href = createPageUrl('ConectaJovem');
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
      {/* Desktop Menu - Much Larger */}
      <div className="hidden md:flex w-full max-w-6xl bg-black/15 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl items-center justify-between p-4">
        
        {/* Logo Section - Much Larger */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="pl-6"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/b7aa5a616_PERFIL_02.png"
            alt="Conecta Jovem"
            className="h-16 w-auto object-contain cursor-pointer drop-shadow-lg"
            onClick={handleLogoClick}
          />
        </motion.div>

        {/* Navigation Items */}
        <ul 
          className="flex items-center space-x-4 relative pr-6"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navItems.map((item, index) => (
            <li 
              key={index} 
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <button
                onClick={() => handleNavClick(item)}
                className="px-8 py-4 text-white/95 friendly-text font-bold text-lg transition-colors duration-300 relative z-10"
              >
                {item.name}
              </button>
              {hoveredIndex === index && (
                <motion.div
                  layoutId="glass-drop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg"
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu - Enhanced visibility */}
      <div className="md:hidden flex justify-between items-center w-full max-w-sm bg-black/25 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c833941e7874dfa03c2a0b/b7aa5a616_PERFIL_02.png"
            alt="Conecta Jovem"
            className="h-12 w-auto object-contain drop-shadow-lg cursor-pointer"
            onClick={handleLogoClick}
          />
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 text-white shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            y: isOpen ? 0 : -20,
            pointerEvents: isOpen ? 'auto' : 'none'
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-4 right-4 bg-black/50 backdrop-blur-3xl border border-white/40 rounded-3xl shadow-2xl p-6"
        >
          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <motion.button
                  onClick={() => handleNavClick(item)}
                  whileHover={{ x: 8 }}
                  className="w-full text-left px-6 py-4 text-white/95 friendly-text font-bold text-lg hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  {item.name}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
}