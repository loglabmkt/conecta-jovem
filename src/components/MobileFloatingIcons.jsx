import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Circle, Star, Plus } from 'lucide-react';

const icons = [
  // Rockets
  { Icon: Rocket, size: 'w-4 h-4', style: { left: '10%', bottom: '-20%', transform: 'rotate(-45deg)' }, animate: { y: '-120vh', x: [0, 30] }, transition: { duration: 8, delay: 0, repeat: Infinity, ease: 'linear' }, opacity: 0.3 },
  { Icon: Rocket, size: 'w-5 h-5', style: { left: '30%', bottom: '-20%', transform: 'rotate(-40deg)' }, animate: { y: '-120vh', x: [0, -20] }, transition: { duration: 10, delay: 2.5, repeat: Infinity, ease: 'linear' }, opacity: 0.4 },
  { Icon: Rocket, size: 'w-3 h-3', style: { left: '80%', bottom: '-20%', transform: 'rotate(-50deg)' }, animate: { y: '-120vh', x: [0, 10] }, transition: { duration: 7, delay: 5, repeat: Infinity, ease: 'linear' }, opacity: 0.25 },
  
  // Floating shapes
  { Icon: Circle, size: 'w-10 h-10', style: { top: '20%', left: '5%' }, animate: { y: [0, -15, 0] }, transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' }, opacity: 0.1 },
  { Icon: Star, size: 'w-8 h-8', style: { top: '50%', right: '10%' }, animate: { y: [0, 20, 0], rotate: [0, 45, 0] }, transition: { duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }, opacity: 0.15 },
  { Icon: Plus, size: 'w-12 h-12', style: { top: '80%', left: '15%' }, animate: { y: [0, -25, 0], rotate: [0, -30, 0] }, transition: { duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }, opacity: 0.08 },
  { Icon: Circle, size: 'w-6 h-6', style: { top: '15%', right: '20%' }, animate: { y: [0, 10, 0] }, transition: { duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }, opacity: 0.12 },
];

export default function MobileFloatingIcons() {
  return (
    <div className="absolute inset-0 z-0 md:hidden overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute text-white`}
          style={{ ...item.style, opacity: item.opacity }}
          animate={item.animate}
          transition={item.transition}
        >
          <item.Icon className={item.size} />
        </motion.div>
      ))}
    </div>
  );
}