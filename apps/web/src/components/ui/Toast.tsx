import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

type ToastKind = 'success' | 'error' | 'info';
interface ToastItem { id: string; title: string; message?: string; kind: ToastKind; }
interface ToastContextValue { toast: (toast: Omit<ToastItem, 'id'>) => void; }
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((item: Omit<ToastItem, 'id'>) => { const id = `${Date.now()}-${crypto.randomUUID()}`; setItems((current) => [...current, { ...item, id }]); window.setTimeout(() => setItems((current) => current.filter((toastItem) => toastItem.id !== id)), 4500); }, []);
  const value = useMemo(() => ({ toast }), [toast]);
  return <ToastContext.Provider value={value}>{children}<div className="fixed bottom-4 right-4 z-[90] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite"><AnimatePresence>{items.map((item) => <ToastCard key={item.id} item={item} onClose={() => setItems((current) => current.filter((toastItem) => toastItem.id !== item.id))} />)}</AnimatePresence></div></ToastContext.Provider>;
}
function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) { const Icon = item.kind === 'success' ? CheckCircle2 : item.kind === 'error' ? TriangleAlert : Info; return <motion.div initial={{ opacity: 0, x: 24, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 24 }} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><Icon className={cn('mt-0.5 h-5 w-5 shrink-0', item.kind === 'success' && 'text-emerald-600', item.kind === 'error' && 'text-rose-600', item.kind === 'info' && 'text-brand-primary')} /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold text-slateNavy-900">{item.title}</p>{item.message && <p className="mt-0.5 text-[11px] leading-relaxed text-slateNavy-500">{item.message}</p>}</div><button type="button" onClick={onClose} className="text-slateNavy-400 hover:text-slateNavy-900"><X className="h-4 w-4" /></button></motion.div>; }
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used inside ToastProvider'); return context; }
