import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  TrafficCone,
  Car,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { OPD_LIST, ComplaintTicket, URGENCY_CONFIG, UrgencyLevel } from '@laporpak/shared';
import { fetchComplaints, submitNewComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { Checkbox } from '../components/ui/Checkbox';
import { DatePicker, formatDateShort } from '../components/ui/DatePicker';
import { Combobox } from '../components/ui/Combobox';

export function CitizenPortal() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);
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

  const [recentComplaints, setRecentComplaints] = useState<ComplaintTicket[]>([]);

  useEffect(() => {
    fetchComplaints()
      .then((data) => setRecentComplaints(data.slice(0, 4)))
      .catch((err) => console.error('Failed to load recent complaints:', err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) {
      toast({ kind: 'error', title: 'Isi laporan belum lengkap', message: 'Mohon tuliskan isi laporan Anda terlebih dahulu.' });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
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
      setShowConfirmation(false);
      setShowSuccess(true);
      setReportTitle('');
      setReportContent('');
      toast({ kind: 'success', title: 'Laporan berhasil terkirim', message: `Ticket ${res.ticket_id} sudah tercatat.` });
    } catch (err) {
      toast({ kind: 'error', title: 'Laporan gagal dikirim', message: 'Pastikan backend API aktif lalu coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = async () => {
    if (!submittedTicket) return;
    await navigator.clipboard.writeText(submittedTicket.ticket_id);
    setCopiedTicket(true);
    window.setTimeout(() => setCopiedTicket(false), 1800);
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
      <div className="bg-slateNavy-950 text-white/80 py-2.5 px-4 text-[11px] border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">PORTAL RESMI LAPORPAK!</span>
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
            <img src="/LaporPak Main logo.svg" alt="LaporPak! SP4N-LAPOR Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slateNavy-700">
            <Link to="/" className="hover:text-brand-primary">
              Beranda
            </Link>
            <Link to="/lacak" className="hover:text-brand-primary">
              Lacak Pengaduan
            </Link>
            <button type="button" onClick={() => document.getElementById('statistik-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-primary">
              Statistik
            </button>
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
                className={`py-3.5 transition-all ${activeTab === 'PENGADUAN'
                  ? 'bg-brand-primary text-white shadow-inner font-extrabold'
                  : 'bg-slateNavy-50 text-slateNavy-700 hover:bg-slateNavy-100'
                  }`}
              >
                PENGADUAN
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ASPIRASI')}
                className={`py-3.5 transition-all ${activeTab === 'ASPIRASI'
                  ? 'bg-brand-primary text-white shadow-inner font-extrabold'
                  : 'bg-slateNavy-50 text-slateNavy-700 hover:bg-slateNavy-100'
                  }`}
              >
                ASPIRASI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('INFORMASI')}
                className={`py-3.5 transition-all ${activeTab === 'INFORMASI'
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
                    <TrafficCone className="inline h-3.5 w-3.5 mr-1 text-brand-primary" /> Lampu Merah Mati
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExample('jalan')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slateNavy-800 font-semibold hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    <Car className="inline h-3.5 w-3.5 mr-1 text-brand-primary" /> Jalan Amblas RS PMI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExample('sampah')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slateNavy-800 font-semibold hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    <Trash2 className="inline h-3.5 w-3.5 mr-1 text-brand-primary" /> Sampah Jembatan Merah
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
                        <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-purple-600" /> Data Pribadi (NIK/Telp) telah disensor otomatis sesuai UU PDP No. 27/2022.
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
                    <DatePicker value={incidentDate} onValueChange={setIncidentDate} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-slateNavy-400" />
                      Lokasi Kejadian
                    </label>
                    <Combobox value={incidentLocation} onValueChange={setIncidentLocation} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                      <Building2 className="w-3.5 h-3.5 inline mr-1 text-slateNavy-400" />
                      Instansi Tujuan
                    </label>
                    <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                      <SelectTrigger><SelectValue placeholder="Pilih instansi" /></SelectTrigger>
                      <SelectContent>{OPD_LIST.map((opd) => <SelectItem key={opd.id} value={opd.name}>{opd.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slateNavy-700 block mb-1">Kategori Laporan</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {['Transportasi & Lalu Lintas', 'Infrastruktur Pekerjaan Umum', 'Lingkungan Hidup & Kebersihan', 'Kesehatan Masyarakat', 'Kependudukan & Pencatatan Sipil', 'Pendidikan', 'Ketertiban & Keamanan Umum'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                      <label className="text-[11px] font-bold text-slateNavy-700">NIK 16 Digit (Terlindungi)</label>
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
                    <Checkbox checked={isAnonymous} onCheckedChange={setIsAnonymous} label="Anonim (Nama Disamarkan)" />
                    <Checkbox checked={isSecret} onCheckedChange={setIsSecret} label="Rahasia (Tidak Dipublikasi)" />
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
                        <span>KIRIM LAPORAN</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
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
                      {ticket.routing.recommendedDepartment?.departmentName || 'Menunggu routing manual'}
                    </span>
                    <span className="font-medium inline-flex items-center gap-1">{ticket.status === 'DISPATCHED' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />}{ticket.status === 'DISPATCHED' ? 'Terdisposisi' : 'Diverifikasi'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Modal
        open={showConfirmation}
        onClose={() => !isSubmitting && setShowConfirmation(false)}
        title="Periksa kembali laporan Anda"
        description="Pastikan data yang dikirim sudah benar dan sesuai sebelum laporan diproses."
      >
        <div className="space-y-3 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-slateNavy-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slateNavy-900"><Building2 className="h-4 w-4 text-brand-primary" />Ringkasan laporan</div>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Judul</dt><dd className="font-semibold">{reportTitle || 'Tanpa judul'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Tanggal</dt><dd className="font-semibold">{formatDateShort(incidentDate)}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Lokasi</dt><dd className="font-semibold">{incidentLocation || 'Tidak diisi'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Kategori</dt><dd className="font-semibold">{category}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Instansi tujuan</dt><dd className="font-semibold">{targetDepartment}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Pelapor</dt><dd className="font-semibold">{isAnonymous ? 'Warga Anonim' : reporterName || 'Warga Masyarakat'}</dd></div>
            </dl>
            <div className="mt-3 border-t border-slate-200 pt-3"><dt className="text-[10px] font-bold uppercase text-slateNavy-400">Isi laporan</dt><dd className="mt-1 max-h-28 overflow-y-auto whitespace-pre-wrap leading-relaxed text-slateNavy-700">{reportContent}</dd></div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-[11px] leading-relaxed text-purple-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" /><span>Data pribadi Anda dilindungi dan akan disensor sesuai UU PDP No. 27/2022 sebelum diproses.</span></div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" disabled={isSubmitting} onClick={() => setShowConfirmation(false)}>Kembali Edit</Button><Button type="button" disabled={isSubmitting} onClick={handleConfirmSubmit}>{isSubmitting ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Mengirim laporan...</> : <><Send className="h-3.5 w-3.5" /> Kirim Laporan</>}</Button></div>
        </div>
      </Modal>

      <Modal
        open={showSuccess && Boolean(submittedTicket)}
        onClose={() => setShowSuccess(false)}
        title="Laporan berhasil terkirim"
        description="Simpan ticket ID ini untuk memantau perkembangan laporan Anda."
      >
        {submittedTicket && <div className="space-y-4 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"><CheckCircle2 className="h-8 w-8 text-emerald-600" /></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Ticket ID Anda</p><p className="mt-1 font-mono text-xl font-black tracking-wider text-slateNavy-900">{submittedTicket.ticket_id}</p><button type="button" onClick={handleCopyTicket} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-900"><Copy className="h-3.5 w-3.5" />{copiedTicket ? 'ID berhasil disalin' : 'Salin ticket ID'}</button></div><div className="flex flex-col gap-2 sm:flex-row sm:justify-center"><Link to="/lacak" search={{ q: submittedTicket.ticket_id }}><Button type="button" className="w-full sm:w-auto"><ExternalLink className="h-3.5 w-3.5" /> Lacak Tiket</Button></Link><Button type="button" variant="secondary" onClick={() => setShowSuccess(false)}>Tutup</Button></div></div>}
      </Modal>

      {/* FOOTER */}
      <footer className="bg-slateNavy-950 text-white/70 py-10 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <img src="/favicon.svg" alt="LaporPak!" className="w-8 h-8 object-contain" />
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
          Copyright © 2026 LaporPak!
        </div>
      </footer>
    </div>
  );
}
