import { useState, useEffect } from 'react';
import { useSearch, Link } from '@tanstack/react-router';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { ComplaintTicket, URGENCY_CONFIG, UrgencyLevel } from '@laporpak/shared';
import { fetchComplaints } from '../services/api';

export function TrackComplaint() {
  const searchParams: { q?: string } = useSearch({ strict: false });
  const [query, setQuery] = useState(searchParams.q || '');
  const [tickets, setTickets] = useState<ComplaintTicket[]>([]);

  const handleSearch = async (searchTerm: string) => {
    try {
      const data = await fetchComplaints({ search: searchTerm });
      // Hanya tampilkan laporan yang valid (non-spam) pada portal lacak publik
      const legitimateTickets = data.filter(
        (ticket) => !ticket.security.isSpam && ticket.status !== 'SPAM_REJECTED'
      );
      setTickets(legitimateTickets);
    } catch (err) {
      console.error('Error tracking complaints:', err);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, []);

  return (
    <div className="min-h-screen bg-slateNavy-50 text-slateNavy-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xs font-bold text-slateNavy-700 hover:text-brand-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Portal</span>
          </Link>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto w-full px-4 py-8 flex-1 flex flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slateNavy-900">Lacak Status Pengaduan Publik</h1>
          <p className="text-xs text-slateNavy-500 mt-1">
            Pantau transparansi tindak lanjut laporan dari tahap sensor PII hingga verifikasi dan penanganan OPD.
          </p>

          <div className="mt-4 max-w-lg mx-auto flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
              <input
                type="text"
                placeholder="Ketik Nomor Tiket atau kata kunci aduan..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <button
              onClick={() => handleSearch(query)}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-glow-red"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 pt-4">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slateNavy-500">
              <FileText className="w-10 h-10 mx-auto text-slateNavy-400 mb-2" />
              <div className="text-sm font-bold">Tidak ada laporan yang cocok dengan pencarian</div>
              <p className="text-xs mt-1">Pastikan nomor tiket yang Anda masukkan sesuai format (e.g. LPK-20260820-0042).</p>
            </div>
          ) : (
            tickets.map((ticket) => {
              const urgencyMeta =
                URGENCY_CONFIG[ticket.triage.urgencyLevel as UrgencyLevel] || URGENCY_CONFIG.MEDIUM;

              const parentStatus = ticket.deduplication?.parentTicketStatus || ticket.deduplication?.parentTicket?.status;
              const isMerged = ticket.status === 'DUPLICATE_MERGED' || Boolean(ticket.deduplication?.parentTicketId);

              // Jika tiket ter-merge, progres dan penyelesaiannya menyatu mengikuti tiket acuan/induk
              const isResolved = ticket.status === 'RESOLVED' || (isMerged && parentStatus === 'RESOLVED');
              const isInProgress = !isResolved && (ticket.status === 'IN_PROGRESS' || (isMerged && parentStatus === 'IN_PROGRESS'));
              const isDispatched = !isResolved && !isInProgress && (ticket.status === 'DISPATCHED' || (isMerged && parentStatus === 'DISPATCHED'));

              const effectiveOpdName = ticket.assignedOpdName || ticket.deduplication?.parentTicket?.assignedOpdName || 'Dinas Terkait';
              const effectiveAsnName = ticket.approvedByAsn?.asnName || ticket.deduplication?.parentTicket?.approvedByAsn || 'ASN Verifikator';

              return (
                <div key={ticket.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono font-bold text-slateNavy-900">{ticket.id}</span>
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
                      <span className="text-xs text-slateNavy-500">Kategori: {ticket.triage.category}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isResolved ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Selesai Ditangani {isMerged && ticket.deduplication?.parentTicketId ? `(via #${ticket.deduplication.parentTicketId})` : ''}
                          </span>
                        </span>
                      ) : isInProgress ? (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            Sedang Ditindaklanjuti {isMerged && ticket.deduplication?.parentTicketId ? `(via #${ticket.deduplication.parentTicketId})` : ''}
                          </span>
                        </span>
                      ) : isDispatched ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Didisposisikan</span>
                        </span>
                      ) : ticket.status === 'SPAM_REJECTED' ? (
                        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <span>Ditolak (Spam)</span>
                        </span>
                      ) : isMerged ? (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Duplikat (Tergabung ke #{ticket.deduplication.parentTicketId})</span>
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tahap Verifikasi ASN</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Redacted Content */}
                  <p className="text-xs text-slateNavy-800 leading-relaxed bg-slateNavy-50 p-3.5 rounded-2xl border border-slate-100">
                    {ticket.security.maskedContent}
                  </p>

                  {/* Progress Pipeline Timeline */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slateNavy-500 uppercase tracking-wider block mb-3">
                      Tahapan Penanganan Birokrasi:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>1. Sensor PII (UU PDP)</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 mt-1">Data pribadi pelapor disterilkan secara lokal.</p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>2. Triage & Smart Routing</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 mt-1">
                          Rekomendasi: {ticket.routing.recommendedDepartment?.departmentName || 'Menunggu routing manual'}
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-2xl border ${isResolved || isInProgress || isDispatched
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          {isResolved || isInProgress || isDispatched ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                          )}
                          <span>3. Disposisi & Penanganan OPD</span>
                        </div>
                        <p className="text-[10px] mt-1 opacity-90">
                          {isResolved
                            ? `Selesai ditangani oleh ${effectiveOpdName}${isMerged && ticket.deduplication?.parentTicketId ? ` (melalui tiket acuan #${ticket.deduplication.parentTicketId})` : ''}`
                            : isInProgress
                            ? `Sedang diproses oleh ${effectiveOpdName}`
                            : isDispatched
                            ? `Disetujui oleh ${effectiveAsnName}`
                            : 'Menunggu review final verifikator'}
                        </p>
                      </div>
                    </div>

                    {/* Banner khusus jika laporan digabung ke tiket acuan */}
                    {isMerged && (
                      <div className="mt-3.5 p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-start space-x-2.5">
                        <Layers className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold text-purple-900">Laporan Digabungkan (Duplikasi Insiden): </span>
                          <span className="text-purple-800 leading-relaxed">
                            Laporan ini diidentifikasi memiliki kesamaan dengan laporan acuan{' '}
                            <span className="font-mono font-bold text-purple-950">#{ticket.deduplication?.parentTicketId}</span>.
                            {isResolved
                              ? ' Penanganan lapangan pada laporan acuan tersebut telah dinyatakan SELESAI / TUNTAS, sehingga aduan Anda ini juga telah tuntas diselesaikan.'
                              : ' Progres perbaikan teknis dan tindak lanjut lapangan disatukan mengikuti laporan acuan tersebut.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
