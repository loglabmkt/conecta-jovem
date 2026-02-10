import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return isMobile;
};

export default function ParallaxSection({ children, className, parallaxOffset = 50 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, parallaxOffset]);
  const isMobile = useIsMobile();

  // For mobile, render as a simple div without any motion effects
  if (isMobile) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  // For desktop, keep the parallax effects
  return (
    <motion.div
      style={{ y }}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, margin: "-200px" }}
    >
      {children}
    </motion.div>
  );
}