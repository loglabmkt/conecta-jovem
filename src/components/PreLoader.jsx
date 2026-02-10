import React from 'react';
import { motion } from 'framer-motion';

export default function PreLoader({ isLoading, onLoadingComplete }) {
  React.useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Diagonal Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#e6ae4d] to-[#d3733e]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
        
        {/* Overlay for depth */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/10"
          animate={{
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Central Infinity Loader */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Infinity Loop Animation */}
        <div className="relative">
          <motion.div
            className="infinity-loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="infinity-path"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="infinity-circle-1"></div>
              <div className="infinity-circle-2"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-white mb-2 title"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Conectando seu futuro...
          </motion.h2>
          <motion.p 
            className="text-white/80 friendly-text text-lg"
            animate={{ opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            Carregando experiência
          </motion.p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* CSS for Infinity Loader */}
      <style jsx>{`
        .infinity-loader {
          width: 120px;
          height: 60px;
          position: relative;
        }
        
        .infinity-path {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .infinity-circle-1,
        .infinity-circle-2 {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          border: 4px solid;
          border-color: white #fde2c2 #f5a623 transparent;
          animation: infinityRotate 2s linear infinite;
        }
        
        .infinity-circle-1 {
          left: 0;
          transform: translateY(-50%);
        }
        
        .infinity-circle-2 {
          right: 0;
          transform: translateY(-50%) scaleX(-1);
          animation-delay: -1s;
        }
        
        @keyframes infinityRotate {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
        
        .infinity-circle-2 {
          animation-name: infinityRotateReverse;
        }
        
        @keyframes infinityRotateReverse {
          0% { transform: translateY(-50%) scaleX(-1) rotate(0deg); }
          100% { transform: translateY(-50%) scaleX(-1) rotate(-360deg); }
        }
      `}</style>
    </motion.div>
  );
}