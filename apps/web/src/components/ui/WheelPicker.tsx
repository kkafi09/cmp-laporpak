import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export function WheelPicker({ options, value, onValueChange, className, ariaLabel }: { options: string[]; value: string; onValueChange: (value: string) => void; className?: string; ariaLabel: string }) {
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startIndex = useRef(0);
  const index = Math.max(0, options.indexOf(value));
  const choose = (nextIndex: number) => onValueChange(options[Math.max(0, Math.min(options.length - 1, nextIndex))]);

  useEffect(() => {
    if (!dragging) return;
    const move = (event: PointerEvent) => {
      const delta = Math.round((startY.current - event.clientY) / 34);
      if (delta) choose(startIndex.current + delta);
    };
    const end = () => setDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end, { once: true });
    return () => window.removeEventListener('pointermove', move);
  }, [dragging]);

  return <div className={cn('relative h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slateNavy-50 select-none', className)} role="listbox" aria-label={ariaLabel} onPointerDown={(event) => { setDragging(true); startY.current = event.clientY; startIndex.current = index; }} onWheel={(event) => { event.preventDefault(); choose(index + (event.deltaY > 0 ? 1 : -1)); }}>
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2 rounded-xl border border-brand-primary/30 bg-white/70 shadow-sm" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 py-16">
      {options.map((option, optionIndex) => <motion.button key={option} type="button" role="option" aria-selected={option === value} tabIndex={option === value ? 0 : -1} onClick={() => choose(optionIndex)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); choose(optionIndex + 1); } if (event.key === 'ArrowUp') { event.preventDefault(); choose(optionIndex - 1); } }} animate={{ opacity: Math.max(0.25, 1 - Math.min(1, Math.abs(optionIndex - index) / 4)), scale: option === value ? 1.04 : 0.94, y: (optionIndex - index) * 34 }} transition={{ type: 'spring', stiffness: 360, damping: 30 }} className={cn('absolute h-9 w-full text-center text-sm font-semibold text-slateNavy-600 outline-none', option === value && 'z-20 font-black text-brand-primary')}>{option}</motion.button>)}
    </div>
  </div>;
}
