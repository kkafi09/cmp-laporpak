import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  Send,
  ShieldCheck,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { MascotAvatar } from '../components/MascotAvatar';
import { OPD_LIST, ComplaintTicket, URGENCY_CONFIG, UrgencyLevel } from '@laporpak/shared';
import { fetchComplaints, submitNewComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function CitizenPortal() {
  const { user, isAuthenticated, logout } = useAuth();

  // Form State
  const [activeTab, setActiveTab] = useState<'PENGADUAN' | 'ASPIRASI' | 'INFORMASI'>('PENGADUAN');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [incidentLocation, setIncidentLocation] = useState('Kota Bogor, Jawa Barat');
  const [targetDepartment, setTargetDepartment] = useState('Dinas Perhubungan');
  const [category, setCategory] = useState('Transportasi & Lalu Lintas');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSecret, setIsSecret] = useState(false);

  // Reporter Info
  const [reporterName, setReporterName] = useState(user?.name || 'Warga Masyarakat');
  const [reporterNik, setReporterNik] = useState(user?.nik || '');
  const [reporterPhone, setReporterPhone] = useState(user?.phone || '');

  // Submission & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    status: string;
    ticket_id: string;
    complaint: {
      id: string;
      category: string;
      urgency: string;
      recommended_opd: string;
      confidence: number;
      pii_masked: string;
      status: string;
    };
  } | null>(null);

  // Tracking Search
  const [trackQuery, setTrackQuery] = useState('');
  const [recentComplaints, setRecentComplaints] = useState<ComplaintTicket[]>([]);

  useEffect(() => {
    fetchComplaints()
      .then((data) => setRecentComplaints(data.slice(0, 4)))
      .catch((err) => console.error('Failed to load recent complaints:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) {
      alert('Mohon tuliskan isi laporan Anda terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        raw_content: `${reportTitle ? `[${reportTitle}] ` : ''}${reportContent}`,
        reporter_name: isAnonymous ? 'Warga Anonim' : (reporterName || 'Warga Masyarakat'),
        reporter_nik: isAnonymous ? '' : reporterNik,
        reporter_phone: reporterPhone,
        channel: 'SP4N_LAPOR_PORTAL'
      };

      const res = await submitNewComplaint(payload);
      setSubmittedTicket(res);
      // Reset form
      setReportTitle('');
      setReportContent('');
    } catch (err) {
      alert('Gagal mengirim aduan. Pastikan backend API aktif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickExample = (type: string) => {
    if (type === 'lampu') {
      setReportTitle('Lampu Lalu Lintas Padam Simpang Sekolah');
      setReportContent(
        'Lapor pak, lampu merah perempatan di depan SMPN 1 Jl. Pemuda padam dari pagi. Anak sekolah mau nyebrang hampir tertabrak motor yang ngebut. NIK saya 3271012345670001 tolong segera diperbaiki.'
      );
      setCategory('Transportasi & Lalu Lintas');
      setTargetDepartment('Dinas Perhubungan');
    } else if (type === 'jalan') {
      setReportTitle('Jalan Amblas dan Pipa Air Bocor');
      setReportContent(
        'Jalan amblas berlubang dan pipa bocor menggenangi Jl. Pajajaran samping RS PMI. Banyak pengendara motor tergelincir jatuh tadi subuh. Mohon dinas PUPR segera memperbaiki.'
      );
      setCategory('Infrastruktur Pekerjaan Umum');
      setTargetDepartment('Dinas Pekerjaan Umum & Penataan Ruang (Bina Marga)');
    } else if (type === 'sampah') {
      setReportTitle('Tumpukan Sampah Liar Mengotori Aliran Sungai');
      setReportContent(
        'Sampah menumpuk liar di pinggir Kali Ciliwung Jembatan Merah dekat pasar. Baunya sangat menyengat dan mulai mencemari air sungai. Tolong armada DLH segera angkut.'
      );
      setCategory('Lingkungan Hidup & Kebersihan');
      setTargetDepartment('Dinas Lingkungan Hidup');
    }
  };

  return (
    <div className="min-h-screen bg-slateNavy-50 text-slateNavy-900 flex flex-col font-sans">
      {/* Top Republic Emblem Bar */}
      <div className="bg-slateNavy-950 text-white/80 py-1.5 px-4 text-[11px] border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">PORTAL RESMI SP4N-LAPOR!</span>
            <span className="text-white/40">|</span>
            <span className="hidden sm:inline">KemenPAN-RB • Kemendagri • Ombudsman RI • KSP • Kominfo</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">Halo, {user?.name}</span>
                {user?.role === 'ADMIN_ASN' && (
                  <Link
                    to="/admin"
                    className="text-[11px] bg-brand-primary text-white font-bold px-2.5 py-0.5 rounded-full hover:bg-brand-primary-hover"
                  >
                    Ke Panel Admin ASN →
                  </Link>
                )}
                <button onClick={logout} className="text-rose-300 hover:text-white text-[11px] underline">
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="hover:text-white font-semibold flex items-center space-x-1">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-[1280px] mx-auto px-4 h-18 py-3 flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <img src="/logo-2.jpeg" alt="LaporPak! SP4N-LAPOR Logo" className="h-10 w-auto object-contain" />
            <span className="text-[10px] text-slateNavy-500 font-semibold tracking-tight mt-0.5">
              Layanan Aspirasi dan Pengaduan Online Rakyat
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slateNavy-700">
            <Link to="/" className="text-brand-primary">
              Beranda
            </Link>
            <a href="#form-section" className="hover:text-brand-primary">
              Tulis Laporan
            </a>
            <Link to="/lacak" className="hover:text-brand-primary">
              Lacak Pengaduan
            </Link>
            <a href="#statistik-section" className="hover:text-brand-primary">
              Statistik
            </a>
            {user?.role === 'ADMIN_ASN' && (
              <Link
                to="/admin"
                className="bg-slateNavy-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-sm"
              >
                Dashboard Admin ASN
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* HERO SECTION (SP4N-LAPOR! Banner + Complaint Box) */}
      <section className="relative bg-gradient-to-b from-brand-primary to-brand-hover text-white pt-10 pb-20 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-[960px] mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center space-x-2 bg-white/15 border border-white/25 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Didukung AI Agentic Intelligence Layer & Kepatuhan UU PDP</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
              Layanan Aspirasi dan Pengaduan Online Rakyat
            </h1>
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang secara cepat, transparan, dan terlindungi.
            </p>
          </motion.div>

          {/* MAIN COMPLAINT FORM CARD */}
          <motion.div
            id="form-section"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 bg-white rounded-3xl shadow-2xl border border-slate-200 text-left text-slateNavy-900 overflow-hidden"
          >
            {/* Form Type Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-200 text-center font-bold text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setActiveTab('PENGADUAN')}
                className={`py-3.5 transition-all ${
                  activeTab === 'PENGADUAN'
                    ? 'bg-brand-primary text-white shadow-inner font-extrabold'
                    : 'bg-slateNavy-50 text-slateNavy-700 hover:bg-slateNavy-100'
                }`}
              >
                PENGADUAN
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ASPIRASI')}
                className={`py-3.5 transition-all ${
                  activeTab === 'ASPIRASI'
                    ? 'bg-brand-primary text-white shadow-inner font-extrabold'
                    : 'bg-slateNavy-50 text-slateNavy-700 hover:bg-slateNavy-100'
                }`}
              >
                ASPIRASI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('INFORMASI')}
                className={`py-3.5 transition-all ${
                  activeTab === 'INFORMASI'
                    ? 'bg-brand-primary text-white shadow-inner font-extrabold'
                    : 'bg-slateNavy-50 text-slateNavy-700 hover:bg-slateNavy-100'
                }`}
              >
                PERMINTAAN INFORMASI
              </button>
            </div>

            {/* Quick Template Presets */}
            <div className="p-4 sm:p-6 pb-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 bg-slateNavy-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slateNavy-600 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Coba Contoh Laporan Siap Pakai:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickExample('lampu')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slateNavy-800 font-semibold hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    🚦 Lampu Merah Mati (SMPN 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExample('jalan')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slateNavy-800 font-semibold hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    🚗 Jalan Amblas RS PMI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExample('sampah')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slateNavy-800 font-semibold hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    🗑️ Sampah Jembatan Merah
                  </button>
                </div>
              </div>

              {/* Submission Result Notification */}
              <AnimatePresence>
                {submittedTicket && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-emerald-950"
                  >
                    <div className="flex items-center space-x-2 font-bold text-sm text-emerald-800 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Laporan Berhasil Diterima & Diverifikasi oleh Agentic Layer!</span>
                    </div>
                    <div className="text-xs space-y-1.5 mt-2 bg-white p-3 rounded-xl border border-emerald-200">
                      <div>
                        Nomor Tiket: <span className="font-mono font-bold text-slateNavy-900">{submittedTicket.ticket_id}</span>
                      </div>
                      <div>
                        Kategori Teridentifikasi:{' '}
                        <span className="font-bold text-slateNavy-800">{submittedTicket.complaint.category}</span> (
                        <span className="font-semibold text-brand-primary">Urgensi {submittedTicket.complaint.urgency}</span>)
                      </div>
                      <div>
                        Rekomendasi Rute Instansi (XAI):{' '}
                        <span className="font-bold text-emerald-700">{submittedTicket.complaint.recommended_opd}</span> (Keyakinan{' '}
                        {Math.round(submittedTicket.complaint.confidence * 100)}%)
                      </div>
                      <div className="text-[11px] text-purple-700 font-medium">
                        🛡️ Data Pribadi (NIK/Telp) telah disensor otomatis sesuai UU PDP No. 27/2022.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                    Judul Laporan <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ketik judul laporan Anda..."
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                    Isi Laporan <span className="text-brand-primary">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan kronologi kejadian, detail keluhan, dan harapan tindak lanjut secara lengkap..."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    className="w-full p-3.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                      <Calendar className="w-3.5 h-3.5 inline mr-1 text-slateNavy-400" />
                      Tanggal Kejadian
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-slateNavy-400" />
                      Lokasi Kejadian
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jl. Pajajaran, Kota Bogor"
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                      <Building2 className="w-3.5 h-3.5 inline mr-1 text-slateNavy-400" />
                      Instansi Tujuan (Rekomendasi AI Otomatis)
                    </label>
                    <select
                      value={targetDepartment}
                      onChange={(e) => setTargetDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {OPD_LIST.map((opd) => (
                        <option key={opd.id} value={opd.name}>
                          {opd.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">Kategori Laporan</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Transportasi & Lalu Lintas">Transportasi & Lalu Lintas</option>
                      <option value="Infrastruktur Pekerjaan Umum">Infrastruktur Pekerjaan Umum</option>
                      <option value="Lingkungan Hidup & Kebersihan">Lingkungan Hidup & Kebersihan</option>
                      <option value="Kesehatan Masyarakat">Kesehatan Masyarakat</option>
                      <option value="Kependudukan & Pencatatan Sipil">Kependudukan & Pencatatan Sipil</option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Ketertiban & Keamanan Umum">Ketertiban & Keamanan Umum</option>
                    </select>
                  </div>
                </div>

                {/* Identity info if not anonymous */}
                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <div>
                      <label className="text-[11px] font-bold text-slateNavy-700">Nama Lengkap</label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Nama Sesuai KTP"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slateNavy-700">NIK (16 Digit - Terlindungi)</label>
                      <input
                        type="text"
                        value={reporterNik}
                        onChange={(e) => setReporterNik(e.target.value)}
                        placeholder="327101xxxxxx0001"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slateNavy-700">No. WhatsApp / Telp</label>
                      <input
                        type="text"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Privacy Checkboxes */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1.5 text-xs font-bold text-slateNavy-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded accent-brand-primary w-4 h-4"
                      />
                      <span>Anonim (Nama Disamarkan)</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs font-bold text-slateNavy-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSecret}
                        onChange={(e) => setIsSecret(e.target.checked)}
                        className="rounded accent-brand-primary w-4 h-4"
                      />
                      <span>Rahasia (Tidak Dipublikasi)</span>
                    </label>
                  </div>

                  <span className="text-[10px] text-slateNavy-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-shield-purple" />
                    <span>UU PDP No. 27/2022 Protected</span>
                  </span>
                </div>

                {/* Submit Action */}
                <div className="pt-4 pb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-extrabold rounded-2xl shadow-glow-red flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menganalisis & Menyaring Laporan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>LAPOR! SEKARANG</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK TRACKING SEARCH SECTION */}
      <section className="bg-white py-10 px-4 border-b border-slate-200">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-lg font-black text-slateNavy-900 mb-2">Lacak Status Aduan Publik Anda</h2>
          <p className="text-xs text-slateNavy-500 mb-4">
            Masukkan nomor tiket laporan (contoh: <code className="font-mono text-brand-primary font-bold">LPK-20260820-0042</code>)
            untuk memeriksa status tindak lanjut instansi.
          </p>
          <div className="flex items-center space-x-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
              <input
                type="text"
                placeholder="Masukkan Nomor Tiket..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
            <Link
              to="/lacak"
              search={{ q: trackQuery }}
              className="px-5 py-2.5 bg-slateNavy-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Lacak
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTICS COUNTER SECTION */}
      <section id="statistik-section" className="py-12 px-4 bg-slateNavy-100/60 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-black text-slateNavy-900">Statistik Pengaduan Nasional SP4N-LAPOR!</h2>
            <p className="text-xs text-slateNavy-500 mt-1">
              Data real-time efisiensi birokrasi dan akselerasi penanganan aduan masyarakat bersama LaporPak!.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-brand-primary">151.500+</div>
              <div className="text-xs font-bold text-slateNavy-700 mt-1">Laporan Dikelola / Tahun</div>
              <div className="text-[11px] text-slateNavy-400 mt-0.5">Seluruh Indonesia</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-slateNavy-900">679+</div>
              <div className="text-xs font-bold text-slateNavy-700 mt-1">Instansi Terhubung</div>
              <div className="text-[11px] text-slateNavy-400 mt-0.5">Kementerian, Lembaga & Pemda</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">94.8%</div>
              <div className="text-xs font-bold text-slateNavy-700 mt-1">Akurasi Smart Routing</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">No Wrong Door Policy</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-700">100%</div>
              <div className="text-xs font-bold text-slateNavy-700 mt-1">Proteksi NIK Warga</div>
              <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Kepatuhan UU PDP</div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT PUBLIC COMPLAINTS FEED */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slateNavy-900">Laporan Publik Terkini</h2>
              <p className="text-xs text-slateNavy-500 mt-0.5">
                Transparansi penanganan aduan masyarakat yang telah disterilisasi oleh sensor PII otomatis.
              </p>
            </div>
            <Link to="/lacak" className="text-xs font-bold text-brand-primary hover:underline flex items-center space-x-1">
              <span>Lihat Semua Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentComplaints.map((ticket) => {
              const urgencyMeta =
                URGENCY_CONFIG[ticket.triage.urgencyLevel as UrgencyLevel] || URGENCY_CONFIG.MEDIUM;

              return (
                <div
                  key={ticket.id}
                  className="p-5 rounded-3xl bg-slateNavy-50/70 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slateNavy-600">{ticket.id}</span>
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
                    <h3 className="text-sm font-bold text-slateNavy-900 mb-1.5">{ticket.triage.category}</h3>
                    <p className="text-xs text-slateNavy-700 line-clamp-3 leading-relaxed mb-3">
                      {ticket.security.maskedContent}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slateNavy-500">
                    <span className="font-semibold text-brand-primary">
                      {ticket.routing.recommendedDepartment.departmentName}
                    </span>
                    <span className="font-medium">{ticket.status === 'DISPATCHED' ? '🟢 Terdisposisi' : '🟡 Diverifikasi'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slateNavy-950 text-white/70 py-10 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <MascotAvatar status="idle" size="sm" />
              <span className="text-base font-black text-white">LaporPak!</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-md">
              Agentic Intelligence Layer untuk Pengelolaan Pengaduan Publik Nasional. Mengintegrasikan otomasi triage cerdas,
              Explainable Smart Routing, dan proteksi UU PDP No. 27/2022 bagi masyarakat dan aparatur negara.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Tautan Cepat</div>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  Beranda Portal
                </Link>
              </li>
              <li>
                <Link to="/lacak" className="hover:text-white">
                  Lacak Pengaduan
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Daftar Warga
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Kepatuhan Regulasi</div>
            <ul className="space-y-2 text-white/60">
              <li>• UU No. 27 Tahun 2022 (UU PDP)</li>
              <li>• Perpres No. 95 Tahun 2018 (SPBE)</li>
              <li>• KepmenPAN-RB Pelayanan Publik</li>
              <li>• Prinsip No Wrong Door Policy</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-white/40 text-[11px]">
          © 2026 LaporPak! - Tim Sebelah
        </div>
      </footer>
    </div>
  );
}
