import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Checkbox({ checked, onCheckedChange, label, className }: { checked: boolean; onCheckedChange: (checked: boolean) => void; label?: ReactNode; className?: string }) {
  return <label className={cn('inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slateNavy-700', className)}><motion.button type="button" role="checkbox" aria-checked={checked} whileTap={{ scale: 0.9 }} onClick={() => onCheckedChange(!checked)} className={cn('flex h-4 w-4 items-center justify-center rounded-md border transition-colors', checked ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 bg-white text-transparent hover:border-brand-primary')}><Check className="h-3 w-3" /></motion.button>{label}</label>;
}
