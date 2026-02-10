import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Data de encerramento: 14/10/2025 às 23:59:59
    const targetDate = new Date('2025-10-14T23:59:59');
    const targetTime = targetDate.getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label, delay = 0 }) => (
    <motion.div 
      className="text-center group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 md:p-3 border border-white/20 transition-all duration-300 min-w-[55px] md:min-w-[60px]">
        <motion.div 
          key={value}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          className="text-lg md:text-2xl font-bold text-white mb-1 title"
        >
          {String(value).padStart(2, '0')}
        </motion.div>
        <div className="text-white/70 text-[10px] md:text-xs font-semibold uppercase tracking-wider friendly-text">
          {label}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        <TimeUnit value={timeLeft.days} label="DIAS" delay={0} />
        <TimeUnit value={timeLeft.hours} label="HRS" delay={0.1} />
        <TimeUnit value={timeLeft.minutes} label="MIN" delay={0.2} />
        <TimeUnit value={timeLeft.seconds} label="SEG" delay={0.3} />
      </div>
    </div>
  );
}