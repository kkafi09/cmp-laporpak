import { Calendar, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { WheelPicker } from './WheelPicker';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
const DAYS_IN_MONTH = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const now = new Date();
  return { year: year || now.getFullYear(), month: (month || now.getMonth() + 1) - 1, day: day || now.getDate() };
}

export function DatePicker({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => parseDate(value));
  const current = parseDate(value);
  const years = useMemo(() => Array.from({ length: 21 }, (_, index) => String(new Date().getFullYear() - 10 + index)), []);
  const days = useMemo(() => Array.from({ length: DAYS_IN_MONTH(draft.month, draft.year) }, (_, index) => String(index + 1)), [draft.month, draft.year]);
  const displayValue = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(current.year, current.month, current.day));

  const openPicker = () => { setDraft(current); setOpen(true); };
  const apply = () => { const safeDay = Math.min(draft.day, DAYS_IN_MONTH(draft.month, draft.year)); onValueChange(`${draft.year}-${String(draft.month + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`); setOpen(false); };

  return <><button type="button" onClick={openPicker} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slateNavy-50 px-3 py-2.5 text-left text-xs font-semibold text-slateNavy-800 transition hover:border-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"><span>{displayValue}</span><Calendar className="h-4 w-4 text-slateNavy-400" /></button><Modal open={open} onClose={() => setOpen(false)} title="Pilih tanggal kejadian" description="Geser atau gunakan tombol panah untuk memilih bulan, tanggal, dan tahun."><div className="space-y-5"><div className="grid grid-cols-[1.25fr_0.8fr_1fr] gap-2"><WheelPicker ariaLabel="Bulan" options={MONTHS} value={MONTHS[draft.month]} onValueChange={(month) => setDraft((currentDraft) => ({ ...currentDraft, month: MONTHS.indexOf(month) }))} /><WheelPicker ariaLabel="Tanggal" options={days} value={String(Math.min(draft.day, days.length))} onValueChange={(day) => setDraft((currentDraft) => ({ ...currentDraft, day: Number(day) }))} /><WheelPicker ariaLabel="Tahun" options={years} value={String(draft.year)} onValueChange={(year) => setDraft((currentDraft) => ({ ...currentDraft, year: Number(year) }))} /></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button><Button type="button" onClick={apply}><Check className="h-3.5 w-3.5" />Terapkan</Button></div></div></Modal></>;
}

export function formatDateShort(value: string) { const date = parseDate(value); return `${date.day} ${MONTHS_SHORT[date.month]} ${date.year}`; }
