import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Laptop, Award, Code2, Hash, FileCode, Infinity } from 'lucide-react';

export default function FloatingElements({ sectionId }) {
  const getElementsForSection = (section) => {
    const elements = {
      hero: [
        { Icon: Rocket, x: '5%', y: '15%', delay: 0, size: 'w-8 h-8', color: 'text-white/10' },
        { Icon: Code2, x: '85%', y: '20%', delay: 1, size: 'w-10 h-10', color: 'text-white/8' },
        { Icon: Hash, x: '10%', y: '80%', delay: 2, size: 'w-6 h-6', color: 'text-white/12' },
        { Icon: Infinity, x: '90%', y: '75%', delay: 3, size: 'w-7 h-7', color: 'text-white/10' },
      ],
      about: [
        { Icon: Laptop, x: '8%', y: '25%', delay: 0, size: 'w-12 h-12', color: 'text-orange-200/15' },
        { Icon: FileCode, x: '88%', y: '30%', delay: 1, size: 'w-8 h-8', color: 'text-orange-300/12' },
        { Icon: Award, x: '12%', y: '75%', delay: 2, size: 'w-10 h-10', color: 'text-orange-400/10' },
      ],
      eligibility: [
        { Icon: Hash, x: '7%', y: '20%', delay: 0, size: 'w-8 h-8', color: 'text-white/15' },
        { Icon: Code2, x: '85%', y: '25%', delay: 1, size: 'w-12 h-12', color: 'text-white/10' },
        { Icon: Rocket, x: '15%', y: '70%', delay: 2, size: 'w-10 h-10', color: 'text-white/12' },
        { Icon: Infinity, x: '80%', y: '80%', delay: 3, size: 'w-6 h-6', color: 'text-white/8' },
      ],
      benefits: [
        { Icon: Award, x: '10%', y: '15%', delay: 0, size: 'w-10 h-10', color: 'text-blue-300/15' },
        { Icon: Laptop, x: '82%', y: '22%', delay: 1, size: 'w-8 h-8', color: 'text-purple-300/12' },
        { Icon: FileCode, x: '6%', y: '80%', delay: 2, size: 'w-12 h-12', color: 'text-orange-300/10' },
      ],
      registration: [
        { Icon: Rocket, x: '12%', y: '18%', delay: 0, size: 'w-14 h-14', color: 'text-blue-200/12' },
        { Icon: Hash, x: '85%', y: '15%', delay: 1, size: 'w-6 h-6', color: 'text-cyan-200/15' },
        { Icon: Code2, x: '8%', y: '75%', delay: 2, size: 'w-8 h-8', color: 'text-purple-200/10' },
        { Icon: Infinity, x: '88%', y: '80%', delay: 3, size: 'w-10 h-10', color: 'text-blue-300/8' },
      ]
    };
    return elements[section] || [];
  };

  const elements = getElementsForSection(sectionId);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {elements.map(({ Icon, x, y, delay, size, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 2,
            delay: delay * 0.3,
            type: "spring",
            stiffness: 100
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            animate={{ 
              y: [0, -30, 15, 0],
              rotate: [0, 5, -8, 3, 0],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: delay * 0.5,
              ease: "easeInOut"
            }}
          >
            <Icon className={size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}