import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Button({ className, variant = 'primary', ...props }: HTMLMotionProps<'button'> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors disabled:pointer-events-none disabled:opacity-60',
        variant === 'primary' && 'bg-brand-primary text-white shadow-glow-red hover:bg-brand-primary-hover',
        variant === 'secondary' && 'border border-slate-200 bg-white text-slateNavy-800 hover:border-brand-primary hover:text-brand-primary',
        variant === 'ghost' && 'text-slateNavy-600 hover:bg-slateNavy-100 hover:text-slateNavy-900',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        className
      )}
      {...props}
    />
  );
}
