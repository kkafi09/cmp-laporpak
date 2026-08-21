import React from 'react';
import { motion } from 'framer-motion';

interface MascotAvatarProps {
  status?: 'idle' | 'thinking' | 'verified';
  size?: 'sm' | 'md' | 'lg';
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({ status = 'idle', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden shadow-glow-red flex items-center justify-center bg-brand-primary"
        animate={status === 'thinking' ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/logo-1.jpeg"
          alt="LaporPak! Mascot"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
