import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollProgressBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 h-1.5"
    >
      {/* Background track */}
      <div className="w-full h-full bg-black/10 backdrop-blur-sm"></div>
      
      {/* Progress fill */}
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#e6ae4d] via-[#d3733e] to-[#1e90ff] shadow-lg"
        style={{ 
          width,
          boxShadow: '0 0 15px rgba(229, 174, 77, 0.5)'
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40
        }}
      >
        {/* Glow effect */}
        <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/30 to-transparent blur-sm"></div>
      </motion.div>
    </motion.div>
  );
}