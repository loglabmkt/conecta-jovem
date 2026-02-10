import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const keywords = ["tecnologia", "futuro", "aprender", "protagonismo"];

export default function RotatingKeywords() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % keywords.length);
    }, 2100); // 2.1 seconds for smooth rotation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-6 flex items-center justify-center overflow-hidden">
      <span className="text-white/60 text-sm friendly-text mr-1">
        Construindo o futuro através da
      </span>
      <div className="relative min-w-[80px] flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute text-white font-semibold text-sm friendly-text tracking-wider"
            style={{ letterSpacing: '0.01em' }}
          >
            {keywords[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-white/60 text-sm friendly-text ml-1">✨</span>
    </div>
  );
}