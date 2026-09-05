import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Layers,
  Building2,
  Clock,
  Search,
  UserCheck,
  RefreshCw,
  X,
  FileText,
  Zap
} from 'lucide-react';
import { URGENCY_CONFIG } from '@laporpak/shared';
import { ComplaintTicket, UrgencyLevel } from '@laporpak/shared';
import { fetchComplaints, fetchOpds, OPDData, submitHitlAction } from '../services/api';
import { useToast } from '../components/ui/Toast';

const STATUS_OPTIONS = [
  { id: 'ALL', label: 'Semua Status' },
  { id: 'PENDING_APPROVAL', label: 'Review (Pending)' },
  { id: 'DISPATCHED', label: 'Terdisposisi' },
  { id: 'IN_PROGRESS', label: 'Diproses' },
  { id: 'RESOLVED', label: 'Selesai' },
  { id: 'SPAM_REJECTED', label: 'Spam' },
  { id: 'DUPLICATE_MERGED', label: 'Duplikat' }
];

const CATEGORIES = [
  'Infrastruktur Jalan & Jembatan',
  'Lalu Lintas & Angkutan Jalan',
  'Kebersihan & Lingkungan Hidup',
  'Kependudukan & Catatan Sipil',
  'Kesehatan & Fasilitas Medis',
  'Ketertiban Umum & Satpol PP',
  'Pendidikan & Sekolah',
  'Lainnya'
];

export function TriageDashboard() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMaskedPII, setShowMaskedPII] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterOpd, setFilterOpd] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [opdList, setOpdList] = useState<OPDData[]>([]);
  const [draftText, setDraftText] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOpds().then(setOpdList).catch(() => { });
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchComplaints({
        status: filterStatus,
        urgency: filterUrgency,
        opd: filterOpd,
        category: filterCategory,
        search: searchQuery
      });
      setTickets(data);
      if (data.length > 0 && (!selectedTicketId || !data.some((t) => t.id === selectedTicketId))) {
        setSelectedTicketId(data[0].id);
        setDraftText(data[0].responseCopilot.draftBody);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, filterUrgency, filterOpd, filterCategory]);

  const hasActiveFilters =
    filterStatus !== 'ALL' ||
    filterUrgency !== 'ALL' ||
    filterOpd !== 'ALL' ||
    filterCategory !== 'ALL' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setFilterStatus('ALL');
    setFilterUrgency('ALL');
    setFilterOpd('ALL');
    setFilterCategory('ALL');
    setSearchQuery('');
  };

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  const handleSelectTicket = (ticket: ComplaintTicket) => {
    setSelectedTicketId(ticket.id);
    setDraftText(ticket.responseCopilot.draftBody);
  };

  const handleApprove = async () => {
    if (!currentTicket) return;
    try {
      const isDraftEdited = draftText.trim() !== (currentTicket.responseCopilot.draftBody || '').trim();
      if (isDraftEdited) {
        await submitHitlAction(currentTicket.id, 'UPDATE_DRAFT', { draft_body: draftText });
      }
      await submitHitlAction(currentTicket.id, 'APPROVE');
      setTickets((prev) =>
        prev.map((t) =>
          t.id === currentTicket.id
            ? {
              ...t,
              status: 'DISPATCHED',
              approvedByAsn: {
                asnName: 'Dr. Hendra Gunawan, M.Si',
                asnNip: '198403152008011004',
                approvedAt: new Date().toISOString(),
                overrideOccurred: false
              }
            }
            : t
        )
      );
      setActionSuccessMessage(
        `Tiket #${currentTicket.id} berhasil diverifikasi & didisposisikan ke ${currentTicket.routing.recommendedDepartment?.departmentName || currentTicket.assignedOpdName || 'OPD tujuan'}`
      );
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err) {
      toast({ kind: 'error', title: 'Aksi disposisi gagal', message: 'Pastikan backend API aktif.' });
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!currentTicket) return;
    try {
      await submitHitlAction(currentTicket.id, 'UPDATE_STATUS', { status });
      setTickets((prev) =>
        prev.map((t) => (t.id === currentTicket.id ? { ...t, status: status as any } : t))
      );
      toast({
        kind: 'success',
        title: 'Status Berhasil Diperbarui',
        message: `Status tiket #${currentTicket.id} berhasil diperbarui.`
      });
      await loadData();
    } catch (err) {
      toast({
        kind: 'error',
        title: 'Status gagal diubah',
        message: err instanceof Error ? err.message : 'Periksa koneksi backend.'
      });
    }
  };

  const handleReject = async () => {
    if (!currentTicket || !window.confirm('Tolak laporan ini sebagai spam?')) return;
    try { await submitHitlAction(currentTicket.id, 'REJECT', { reason: 'Ditolak oleh verifikator' }); await loadData(); }
    catch (err) { toast({ kind: 'error', title: 'Penolakan gagal', message: err instanceof Error ? err.message : 'Periksa koneksi backend.' }); }
  };

  const handleOverride = async () => {
    if (!currentTicket) return;
    const target = window.prompt('Masukkan ID OPD tujuan (contoh: OPD-DISHUB)');
    if (!target?.trim()) return;
    try { await submitHitlAction(currentTicket.id, 'OVERRIDE', { target_opd_id: target.trim() }); await loadData(); }
    catch (err) { toast({ kind: 'error', title: 'Override gagal', message: err instanceof Error ? err.message : 'OPD tidak valid.' }); }
  };

  const handleMerge = async () => {
    if (!currentTicket) return;
    const parent = window.prompt('Masukkan ID tiket induk duplicate');
    if (!parent?.trim()) return;
    try { await submitHitlAction(currentTicket.id, 'MERGE', { parent_ticket_id: parent.trim(), reason: 'Duplicate diverifikasi oleh verifikator' }); await loadData(); }
    catch (err) { toast({ kind: 'error', title: 'Merge gagal', message: err instanceof Error ? err.message : 'Tiket induk tidak valid.' }); }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Banner Message */}
      <AnimatePresence>
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 flex items-center justify-center space-x-2 shadow-md z-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="p-4 lg:p-6 flex-1 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full">
        {/* LEFT COLUMN: Live Feed Queue */}
        <section className="w-full lg:w-[420px] flex flex-col space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slateNavy-500 uppercase">Total Aduan</div>
                <div className="text-xl font-extrabold text-slateNavy-900">{tickets.length} Tiket</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slateNavy-500 uppercase">Review Pending</div>
                <div className="text-xl font-extrabold text-amber-600">
                  {tickets.filter((t) => t.status === 'PENDING_APPROVAL').length} Tiket
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                ⏳
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
              <input
                type="text"
                placeholder="Cari kata kunci, ID tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <button
              onClick={loadData}
              title="Segarkan Data"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slateNavy-700 hover:bg-slateNavy-100 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
            </button>
          </div>

          {/* Satu Baris Filter Dropdown Lengkap: Status, Urgensi, Instansi OPD & Kategori */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
            {/* Filter Status */}
            <div>
              <label className="text-[10px] font-bold text-slateNavy-500 block mb-1 truncate">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slateNavy-800 outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer truncate"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Urgensi */}
            <div>
              <label className="text-[10px] font-bold text-slateNavy-500 block mb-1 truncate">Urgensi</label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slateNavy-800 outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer truncate"
              >
                <option value="ALL">Semua Urgensi</option>
                <option value="CRITICAL">🔴 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            {/* Filter Instansi Tujuan (OPD) */}
            <div>
              <label className="text-[10px] font-bold text-slateNavy-500 block mb-1 truncate">Instansi OPD</label>
              <select
                value={filterOpd}
                onChange={(e) => setFilterOpd(e.target.value)}
                className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slateNavy-800 outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer truncate"
              >
                <option value="ALL">Semua OPD</option>
                {opdList.map((opd) => (
                  <option key={opd.id} value={opd.name}>
                    {opd.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kategori Laporan */}
            <div>
              <label className="text-[10px] font-bold text-slateNavy-500 block mb-1 truncate">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-slateNavy-800 outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer truncate"
              >
                <option value="ALL">Semua Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filter Bar (jika ada filter aktif) */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-[11px] bg-slateNavy-100/70 py-1.5 px-3 rounded-xl border border-slate-200/80 text-slateNavy-600">
              <span className="truncate mr-2">
                Filter aktif: {[
                  filterStatus !== 'ALL' && (STATUS_OPTIONS.find(p => p.id === filterStatus)?.label || filterStatus),
                  filterUrgency !== 'ALL' && filterUrgency,
                  filterOpd !== 'ALL' && filterOpd,
                  filterCategory !== 'ALL' && filterCategory,
                  searchQuery && `"${searchQuery}"`
                ].filter(Boolean).join(' • ')}
              </span>
              <button
                onClick={handleResetFilters}
                className="text-brand-primary hover:underline font-bold flex items-center space-x-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          )}

          {/* Ticket List Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-340px)]">
            {tickets.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slateNavy-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slateNavy-400" />
                <p className="text-sm font-semibold">Tidak ada aduan ditemukan</p>
                <p className="text-xs mt-1">Klik tombol "Aduan Baru" untuk memasukkan laporan baru ke server.</p>
              </div>
            ) : (
              tickets.map((ticket) => {
                const isSelected = currentTicket && ticket.id === currentTicket.id;
                const urgencyMeta =
                  URGENCY_CONFIG[ticket.triage.urgencyLevel as UrgencyLevel] || URGENCY_CONFIG.MEDIUM;

                return (
                  <motion.div
                    key={ticket.id}
                    layout
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.992 }}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 relative ${isSelected
                      ? 'bg-brand-primary/[0.03] border-brand-primary shadow-sm ring-1 ring-brand-primary'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slateNavy-50/40 shadow-sm'
                      }`}
                  >
                    {/* Baris 1: ID Tiket, Badge Urgensi & Status */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-slateNavy-800">{ticket.id}</span>
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0"
                          style={{
                            backgroundColor: urgencyMeta.bg,
                            color: urgencyMeta.color,
                            borderColor: urgencyMeta.border
                          }}
                        >
                          {ticket.triage.urgencyLevel}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {ticket.status === 'RESOLVED' ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">Selesai</span>
                        ) : ticket.status === 'IN_PROGRESS' ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-full">Diproses</span>
                        ) : ticket.status === 'DISPATCHED' ? (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100/90 px-2 py-0.5 rounded-full">Terdisposisi</span>
                        ) : ticket.status === 'SPAM_REJECTED' ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full">Spam</span>
                        ) : ticket.status === 'DUPLICATE_MERGED' ? (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full">Duplikat</span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full">Review</span>
                        )}
                      </div>
                    </div>

                    {/* Baris 2: Kategori Aduan */}
                    <div className="text-xs font-bold text-slateNavy-900 truncate mb-1">
                      {ticket.triage.category}
                    </div>

                    {/* Baris 3: Cuplikan Ringkas Aduan (1 Baris) */}
                    <p className="text-[11px] text-slateNavy-500 line-clamp-1 leading-normal">
                      {ticket.security.maskedContent}
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: AI Agent Triage Studio */}
        {currentTicket ? (
          <section className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-black text-slateNavy-900">{currentTicket.id}</h2>
                  <span className="text-xs text-slateNavy-500 font-medium">({currentTicket.externalTicketId})</span>

                  {currentTicket.status === 'RESOLVED' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Selesai / Tuntas</span>
                    </span>
                  ) : currentTicket.status === 'IN_PROGRESS' ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sedang Diproses OPD</span>
                    </span>
                  ) : currentTicket.status === 'DISPATCHED' ? (
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Terdisposisi</span>
                    </span>
                  ) : currentTicket.status === 'SPAM_REJECTED' ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Ditolak (Spam)
                    </span>
                  ) : currentTicket.status === 'DUPLICATE_MERGED' ? (
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Duplikat (Merged)
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Menunggu Review ASN</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slateNavy-500 mt-1">
                  Dilaporkan oleh: <span className="font-semibold text-slateNavy-700">{currentTicket.reporter.name}</span> • Waktu:{' '}
                  {currentTicket.reportedAt}
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slateNavy-50 px-3.5 py-2 rounded-2xl border border-slate-200">
                <Clock className="w-4 h-4 text-brand-primary animate-pulse" />
                <div>
                  <div className="text-[10px] font-bold text-slateNavy-500 uppercase">Target Batas SLA</div>
                  <div className="text-xs font-black text-slateNavy-900">{currentTicket.triage.slaDeadlineHours} Jam</div>
                </div>
              </div>
            </div>

            {/* PII Masking Section */}
            <div className="bg-shield-light/40 border border-shield-purple/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-shield-purple" />
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                    Security & Trust Gateway (UU PDP No. 27/2022)
                  </span>
                </div>
                <button
                  onClick={() => setShowMaskedPII(!showMaskedPII)}
                  className="text-[11px] font-bold text-shield-purple hover:underline"
                >
                  {showMaskedPII ? 'Lihat Teks Asli (Privat)' : 'Mode Sensor (Masked)'}
                </button>
              </div>
              <div className="text-xs text-slateNavy-800 leading-relaxed font-sans bg-white p-3 rounded-xl border border-purple-100">
                {showMaskedPII ? currentTicket.security.maskedContent : currentTicket.rawContent}
              </div>
              {currentTicket.security.piiDetected.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-semibold text-purple-900">Entitas PII Tersensor:</span>
                  {currentTicket.security.piiDetected.map((p) => (
                    <span key={p} className="text-[9px] font-bold bg-purple-200/60 text-purple-900 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="inline h-3.5 w-3.5 text-purple-600" /> {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Deduplication Alert */}
            {currentTicket.deduplication.isDuplicateSuspect && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-3"
              >
                <Layers className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1 text-xs text-amber-900">
                  <span className="font-bold">
                    Potensi Duplikasi Aduan ({Math.round(currentTicket.deduplication.similarityScore * 100)}% Similarity):{' '}
                  </span>
                  Terdeteksi laporan serupa: <span className="font-semibold">"{currentTicket.deduplication.clusterIncidentName}"</span>.
                </div>
              </motion.div>
            )}

            {/* Smart Routing & Triage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slateNavy-50/70 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slateNavy-500 uppercase tracking-wide mb-1">
                    AI Triage & Urgensi
                  </div>
                  <div className="text-sm font-extrabold text-slateNavy-900">{currentTicket.triage.category}</div>
                  <p className="text-xs text-slateNavy-600 mt-1.5 leading-relaxed">
                    {currentTicket.triage.urgencyReason}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slateNavy-500 font-medium">Tingkat Risiko:</span>
                  <span className="font-bold text-brand-primary">{currentTicket.triage.urgencyLevel}</span>
                </div>
              </div>

              <div className="bg-slateNavy-50/70 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] font-bold text-slateNavy-500 uppercase tracking-wide">
                      Explainable Smart Routing (XAI)
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {currentTicket.routing.recommendedDepartment ? `${Math.round(currentTicket.routing.recommendedDepartment.confidenceScore * 100)}% Confidence` : 'Menunggu routing manual'}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slateNavy-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-brand-primary" />
                    <span>{currentTicket.routing.recommendedDepartment?.departmentName || 'Belum ada OPD tujuan'}</span>
                  </div>
                  <p className="text-xs text-slateNavy-600 mt-1.5 leading-relaxed italic">
                    "{currentTicket.routing.recommendedDepartment?.reasoning || 'Belum ada rule routing yang cocok.'}"
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slateNavy-500 font-medium">Tingkat Yurisdiksi:</span>
                  <span className="font-semibold text-slateNavy-800">
                    {currentTicket.routing.recommendedDepartment?.jurisdictionLevel || 'Manual routing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Response Copilot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-slateNavy-900 uppercase tracking-wide">
                    Response Copilot (Draf Balasan Resmi)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slateNavy-500 bg-slateNavy-100 px-2 py-0.5 rounded-md">
                  Tone: {currentTicket.responseCopilot.tone}
                </span>
              </div>
              <textarea
                rows={3}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="w-full text-xs text-slateNavy-800 bg-slateNavy-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all leading-relaxed"
              />
            </div>

            {/* HITL Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slateNavy-500">
                <UserCheck className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Keputusan Akhir berada di tangan ASN verifikator (Human-in-the-Loop).</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {currentTicket.status === 'PENDING_APPROVAL' && (
                  <>
                    {currentTicket.routing.recommendedDepartment && (
                      <button
                        onClick={handleOverride}
                        className="px-4 py-2.5 rounded-xl border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50 transition-colors"
                      >
                        Override OPD
                      </button>
                    )}
                    {currentTicket.deduplication.isDuplicateSuspect && (
                      <button
                        onClick={handleMerge}
                        className="px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-50 transition-colors"
                      >
                        Gabungkan Duplicate
                      </button>
                    )}
                    <button
                      onClick={handleReject}
                      className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors"
                    >
                      Tolak (Spam)
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={!currentTicket.routing.recommendedDepartment}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-bold shadow-glow-red flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui & Disposisikan</span>
                    </button>
                  </>
                )}

                {currentTicket.status === 'DISPATCHED' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mulai Pengerjaan Lapangan</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange('RESOLVED')}
                      className="px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors"
                    >
                      Langsung Selesaikan
                    </button>
                  </>
                )}

                {currentTicket.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('DISPATCHED')}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slateNavy-600 hover:bg-slateNavy-50 text-xs font-semibold transition-colors"
                    >
                      Kembalikan ke Terdisposisi
                    </button>
                    <button
                      onClick={() => handleStatusChange('RESOLVED')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tandai Selesai / Tuntas</span>
                    </button>
                  </>
                )}

                {currentTicket.status === 'RESOLVED' && (
                  <>
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Aduan Telah Tuntas Ditangani OPD</span>
                    </div>
                    <button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slateNavy-700 hover:bg-slateNavy-50 text-xs font-bold transition-colors"
                    >
                      Buka Kembali Tiket
                    </button>
                  </>
                )}

                {currentTicket.status === 'SPAM_REJECTED' && (
                  <>
                    <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-1.5">
                      <span>Status: Laporan Ditolak (Spam)</span>
                    </div>
                    <button
                      onClick={() => handleStatusChange('PENDING_APPROVAL')}
                      className="px-3.5 py-2 rounded-xl bg-brand-primary text-white hover:bg-brand-primary-hover text-xs font-bold shadow-glow-red transition-colors"
                    >
                      Pulihkan ke Review
                    </button>
                  </>
                )}

                {currentTicket.status === 'DUPLICATE_MERGED' && (
                  <>
                    <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center space-x-1.5">
                      <span>Tergabung ke #{currentTicket.deduplication.parentTicketId || 'Induk'}</span>
                    </div>
                    <button
                      onClick={() => handleStatusChange('PENDING_APPROVAL')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slateNavy-700 hover:bg-slateNavy-50 text-xs font-bold transition-colors"
                    >
                      Pisahkan (Unmerge)
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </div>

    </div>
  );
}
