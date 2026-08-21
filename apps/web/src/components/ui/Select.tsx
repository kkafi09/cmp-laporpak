import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SelectContextValue { value?: string; select: (value: string, label: string) => void; register: (value: string, label: string) => void; labels: Map<string, string>; open: boolean; setOpen: (open: boolean) => void; }
const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({ value, defaultValue, onValueChange, children, className }: { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children: ReactNode; className?: string }) {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState(new Map<string, string>());
  const rootRef = useRef<HTMLDivElement>(null);
  const current = value ?? internal;
  const id = useId();
  const register = (itemValue: string, label: string) => setLabels((previous) => new Map(previous).set(itemValue, label));
  const select = (next: string, label: string) => { setInternal(next); register(next, label); onValueChange?.(next); setOpen(false); };

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return <div ref={rootRef} className={cn('relative', className)} data-select={id}><SelectContext.Provider value={{ value: current, select, register, labels, open, setOpen }}>{children}</SelectContext.Provider><input type="hidden" value={current ?? ''} readOnly /></div>;
}

function useSelect() { const context = useContext(SelectContext); if (!context) throw new Error('Select components must be used inside Select'); return context; }

export function SelectTrigger({ className, disabled, children }: { className?: string; disabled?: boolean; children?: ReactNode }) {
  const { value, labels, open, setOpen } = useSelect();
  return <button type="button" role="combobox" aria-expanded={open} disabled={disabled} onClick={() => setOpen(!open)} className={cn('flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slateNavy-50 px-3 py-2.5 text-left text-xs font-semibold text-slateNavy-800 transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-60', className)}><span className={value ? '' : 'text-slateNavy-400'}>{children || (value && labels.get(value)) || 'Pilih opsi'}</span><ChevronDown className={cn('h-4 w-4 text-slateNavy-400 transition-transform', open && 'rotate-180')} /></button>;
}

export function SelectValue({ placeholder = 'Pilih opsi', className }: { placeholder?: string; className?: string }) { const { value, labels } = useSelect(); return <span className={cn(!value && 'text-slateNavy-400', className)}>{value ? labels.get(value) || value : placeholder}</span>; }

export function SelectContent({ children, className }: { children: ReactNode; className?: string }) { const { open } = useSelect(); return <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 4, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} className={cn('absolute left-0 right-0 top-full z-50 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl', className)} role="listbox">{children}</motion.div>}</AnimatePresence>; }

export function SelectItem({ value, children, disabled = false, className }: { value: string; children: ReactNode; disabled?: boolean; className?: string }) {
  const { value: selected, select, register } = useSelect();
  const label = typeof children === 'string' ? children : value;
  useEffect(() => { register(value, label); }, [value, label]);
  return <button type="button" role="option" aria-selected={selected === value} disabled={disabled} onClick={() => select(value, label)} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-slateNavy-700 transition hover:bg-brand-primary-subtle hover:text-brand-primary disabled:opacity-50', selected === value && 'bg-brand-primary-subtle font-bold text-brand-primary', className)}><span>{children}</span>{selected === value && <Check className="h-3.5 w-3.5" />}</button>;
}
