import React, { useState, useEffect } from 'react';
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
  PlusCircle,
  X,
  FileText
} from 'lucide-react';
import { URGENCY_CONFIG } from '@laporpak/shared';
import { ComplaintTicket, UrgencyLevel } from '@laporpak/shared';
import { MascotAvatar } from './components/MascotAvatar';
import { fetchComplaints, submitNewComplaint, submitHitlAction } from './services/api';

export function App() {
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMaskedPII, setShowMaskedPII] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [draftText, setDraftText] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New Complaint Form State
  const [newReporterName, setNewReporterName] = useState<string>('');
  const [newReporterNik, setNewReporterNik] = useState<string>('');
  const [newReporterPhone, setNewReporterPhone] = useState<string>('');
  const [newRawContent, setNewRawContent] = useState<string>('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchComplaints({
        urgency: filterUrgency,
        search: searchQuery
      });
      setTickets(data);
      if (data.length > 0 && !selectedTicketId) {
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
  }, [filterUrgency]);

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  const handleSelectTicket = (ticket: ComplaintTicket) => {
    setSelectedTicketId(ticket.id);
    setDraftText(ticket.responseCopilot.draftBody);
  };

  const handleApprove = async () => {
    if (!currentTicket) return;
    try {
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
        `Tiket #${currentTicket.id} berhasil diverifikasi & didisposisikan ke ${currentTicket.routing.recommendedDepartment.departmentName}`
      );
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err) {
      alert('Gagal memproses aksi disposisi. Pastikan backend API aktif.');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRawContent.trim()) {
      alert('Isi laporan aduan tidak boleh kosong!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitNewComplaint({
        reporter_name: newReporterName || 'Warga Masyarakat',
        reporter_nik: newReporterNik,
        reporter_phone: newReporterPhone,
        raw_content: newRawContent
      });

      setShowCreateModal(false);
      setNewRawContent('');
      setNewReporterName('');
      setNewReporterNik('');
      setNewReporterPhone('');

      setActionSuccessMessage(`Laporan baru #${res.ticket_id} berhasil diproses oleh Agentic Layer!`);
      setTimeout(() => setActionSuccessMessage(null), 4000);

      // Refresh list
      await loadData();
      setSelectedTicketId(res.ticket_id);
    } catch (err) {
      alert('Gagal mengirim aduan. Pastikan backend server API berjalan di port 8000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickTemplate = (type: string) => {
    if (type === 'jalan') {
      setNewReporterName('Rahmat Hidayat');
      setNewReporterNik('3271041122330005');
      setNewReporterPhone('081234567890');
      setNewRawContent(
        'Lapor pak, jalan berlubang cukup dalam di Jl. Sudirman depan Bank Mandiri sangat berbahaya bagi pengendara motor. NIK saya 3271041122330005 mohon ditambal segera dinas terkait.'
      );
    } else if (type === 'sampah') {
      setNewReporterName('Dewi Lestari');
      setNewReporterNik('3271059988770006');
      setNewReporterPhone('085699887766');
      setNewRawContent(
        'Tumpukan sampah liar di samping Pasar Anyar baunya menyengat dan berserakan ke jalan. Tolong armada kebersihan DLH segera mengangkut.'
      );
    } else if (type === 'spam') {
      setNewReporterName('Bot Promosi');
      setNewReporterNik('0000000000000000');
      setNewReporterPhone('08999999999');
      setNewRawContent('DAPATKAN DANA TUNAI PINJOL BUNGA 0% CAIR 5 MENIT DI HTTP://BIT.LY/DANA-KILAT HUB 08999999999!');
    }
  };

  return (
    <div className="min-h-screen bg-slateNavy-50 text-slateNavy-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MascotAvatar status="idle" size="md" />
            <div className="flex items-center space-x-2">
              <img src="/logo-2.jpeg" alt="LaporPak! Logo" className="h-9 w-auto object-contain" />
              <span className="hidden sm:inline-block ml-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20">
                Agentic Copilot
              </span>
            </div>
          </div>

          {/* Live Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
              <input
                type="text"
                placeholder="Cari kata kunci, ID tiket, kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadData()}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slateNavy-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-glow-red flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulasi Aduan Warga</span>
            </button>

            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-2 rounded-xl border border-slate-200 text-slateNavy-700 hover:bg-slateNavy-100 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-primary' : ''}`} />
            </button>

            <div className="hidden lg:flex items-center space-x-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slateNavy-900 text-white font-bold text-xs flex items-center justify-center">
                HG
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slateNavy-900">Dr. Hendra Gunawan</span>
                <span className="text-[10px] text-slateNavy-500">ASN Verifikator Pusat</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
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

      {/* Main Content Layout */}
      <main className="max-w-[1600px] mx-auto w-full px-4 lg:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
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
                ⚡
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

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterUrgency(lvl)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  filterUrgency === lvl
                    ? 'bg-slateNavy-900 text-white shadow-sm'
                    : 'bg-white text-slateNavy-700 hover:bg-slateNavy-100 border border-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'Semua Urgensi' : lvl}
              </button>
            ))}
          </div>

          {/* Ticket List Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[calc(100vh-250px)]">
            {tickets.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slateNavy-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slateNavy-400" />
                <p className="text-sm font-semibold">Tidak ada aduan ditemukan</p>
                <p className="text-xs mt-1">Klik tombol "Simulasi Aduan Warga" untuk membuat aduan baru.</p>
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
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-white border-brand-primary shadow-glow-red ring-1 ring-brand-primary'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slateNavy-700">{ticket.id}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase"
                          style={{
                            backgroundColor: urgencyMeta.bg,
                            color: urgencyMeta.color,
                            borderColor: urgencyMeta.border
                          }}
                        >
                          {ticket.triage.urgencyLevel}
                        </span>
                      </div>
                      <span className="text-[11px] text-slateNavy-400 font-medium">{ticket.channel}</span>
                    </div>

                    <p className="text-xs text-slateNavy-800 line-clamp-2 leading-relaxed mb-3">
                      {ticket.security.maskedContent}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slateNavy-500">
                      <div className="flex items-center space-x-1 font-medium text-slateNavy-700">
                        <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                        <span className="truncate max-w-[170px]">
                          {ticket.routing.recommendedDepartment.departmentName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-emerald-600">
                          {Math.round(ticket.routing.recommendedDepartment.confidenceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: AI Agent Triage & HITL Decision Studio */}
        {currentTicket ? (
          <section className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-6">
            {/* Header Info of Current Ticket */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-lg font-black text-slateNavy-900">{currentTicket.id}</h2>
                  <span className="text-xs text-slateNavy-500 font-medium">({currentTicket.externalTicketId})</span>
                  {currentTicket.status === 'DISPATCHED' ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terdisposisi</span>
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Menunggu Review ASN</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slateNavy-500 mt-0.5">
                  Dilaporkan oleh: <span className="font-semibold text-slateNavy-700">{currentTicket.reporter.name}</span> • Waktu:{' '}
                  {currentTicket.reportedAt}
                </p>
              </div>

              {/* SLA Target */}
              <div className="flex items-center space-x-3 bg-slateNavy-50 px-3.5 py-2 rounded-2xl border border-slate-200">
                <Clock className="w-4 h-4 text-brand-primary animate-pulse" />
                <div>
                  <div className="text-[10px] font-bold text-slateNavy-500 uppercase">Target Batas SLA</div>
                  <div className="text-xs font-black text-slateNavy-900">{currentTicket.triage.slaDeadlineHours} Jam</div>
                </div>
              </div>
            </div>

            {/* Module 1: Security & PII Masking (UU PDP No. 27/2022) */}
            <div className="bg-shield-light/40 border border-shield-purple/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-shield-purple" />
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                    Security & Trust Gateway (Kepatuhan UU PDP No. 27/2022)
                  </span>
                </div>
                <button
                  onClick={() => setShowMaskedPII(!showMaskedPII)}
                  className="text-[11px] font-bold text-shield-purple hover:underline"
                >
                  {showMaskedPII ? 'Lihat Teks Asli (Privat)' : 'Kembali ke Mode Sensor (Masked)'}
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
                      🛡️ {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Module 2: Semantic Deduplication Alert */}
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
                  Terdeteksi laporan serupa dengan isu <span className="font-semibold">"{currentTicket.deduplication.clusterIncidentName}"</span>.
                </div>
              </motion.div>
            )}

            {/* Module 3 & 4: Explainable Smart Routing & Triage */}
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
                      {Math.round(currentTicket.routing.recommendedDepartment.confidenceScore * 100)}% Confidence
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slateNavy-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-brand-primary" />
                    <span>{currentTicket.routing.recommendedDepartment.departmentName}</span>
                  </div>
                  <p className="text-xs text-slateNavy-600 mt-1.5 leading-relaxed italic">
                    "{currentTicket.routing.recommendedDepartment.reasoning}"
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slateNavy-500 font-medium">Tingkat Yurisdiksi:</span>
                  <span className="font-semibold text-slateNavy-800">
                    {currentTicket.routing.recommendedDepartment.jurisdictionLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Module 5: Response Copilot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-slateNavy-900 uppercase tracking-wide">
                    Response Copilot (Draf Balasan Resmi Standar Pelayanan Publik)
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

            {/* Module 7: Human-in-the-Loop Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slateNavy-500">
                <UserCheck className="w-4 h-4 text-brand-primary" />
                <span>Keputusan Akhir berada di tangan ASN verifikator (Human-in-the-Loop).</span>
              </div>
              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  onClick={handleApprove}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-glow-red flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui & Disposisikan</span>
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* CREATE COMPLAINT MODAL (Simulasi Aduan Warga Realtime) */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slateNavy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-base font-extrabold text-slateNavy-900">Simulasi Aduan Warga Baru</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slateNavy-400 hover:text-slateNavy-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="my-4">
                <span className="text-[11px] font-bold text-slateNavy-500 uppercase">Coba Contoh Kasus:</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('jalan')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slateNavy-100 hover:bg-slateNavy-200 text-slateNavy-800 font-semibold"
                  >
                    🚗 Jalan Berlubang + NIK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('sampah')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slateNavy-100 hover:bg-slateNavy-200 text-slateNavy-800 font-semibold"
                  >
                    🗑️ Sampah Liar Pasar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTemplate('spam')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold"
                  >
                    🚫 Pinjol / Spam Bot
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700">Nama Pelapor</label>
                    <input
                      type="text"
                      placeholder="e.g. Budi Santoso"
                      value={newReporterName}
                      onChange={(e) => setNewReporterName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700">NIK (16 Digit - UU PDP)</label>
                    <input
                      type="text"
                      placeholder="e.g. 3271012345670001"
                      value={newReporterNik}
                      onChange={(e) => setNewReporterNik(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slateNavy-700">Isi Pengaduan Warga</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan keluhan atau aduan fasilitas publik..."
                    value={newRawContent}
                    onChange={(e) => setNewRawContent(e.target.value)}
                    className="w-full mt-1 p-3 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slateNavy-600 hover:bg-slateNavy-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-glow-red rounded-xl flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menganalisis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Kirim ke AI Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
