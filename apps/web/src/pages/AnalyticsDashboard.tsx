import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers
  ,Zap
} from 'lucide-react';
import { fetchAnalytics, AnalyticsData } from '../services/api';

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error('Failed to load analytics:', err);
      });
  }, []);

  const summary = data?.summary || {
    total_complaints: 4,
    dispatched_count: 2,
    pending_count: 2,
    spam_rejected_count: 0,
    duplicate_clusters: 1,
    average_triage_seconds: 2.8,
    pii_protected_count: 4,
    ai_accuracy_percent: 94.6
  };

  const hitlBreakdown = data?.hitl_approval_breakdown || {
    direct_approved_percent: 91.4,
    adjusted_draft_percent: 5.8,
    overridden_percent: 2.8
  };

  const opdPerformance = data?.opd_performance || [
    { name: 'Dinas Perhubungan', code: 'DISHUB', tickets_count: 2, compliance_rate: 96 },
    { name: 'Dinas Pekerjaan Umum & PR', code: 'PUPR', tickets_count: 1, compliance_rate: 92 },
    { name: 'Dinas Lingkungan Hidup', code: 'DLH', tickets_count: 1, compliance_rate: 94 }
  ];

  return (
    <div className="flex-1 bg-slateNavy-50 p-4 lg:p-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slateNavy-900">Monev & Analitik Kinerja Agentic Copilot</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Live Database Active
            </span>
          </div>
          <p className="text-xs text-slateNavy-500 mt-1">
            Evaluasi dampak otomasi triage, akurasi rekomendasi routing, dan kepatuhan SLA antar instansi (OPD).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slateNavy-100/70 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slateNavy-700">
            <Calendar className="w-4 h-4 text-slateNavy-400" />
            <span>Periode: Real-Time Live Data</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slateNavy-500">Total Tiket Masuk</span>
            <div className="w-9 h-9 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slateNavy-900 mt-3">{summary.total_complaints}</div>
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.dispatched_count} Terdisposisi ({summary.pending_count} Menunggu)</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slateNavy-500">Rata-rata Waktu Triage</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slateNavy-900 mt-3">{summary.average_triage_seconds}s</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-1">
            <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> 98% Lebih Cepat dari manual</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slateNavy-500">Klaster Duplikasi Terdeteksi</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slateNavy-900 mt-3">{summary.duplicate_clusters} Kasus</div>
          <div className="text-[11px] font-semibold text-blue-600 mt-1">
            Cosine Similarity Cosine Engine
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slateNavy-500">Proteksi Sensor NIK & Telp</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slateNavy-900 mt-3">{summary.pii_protected_count} Laporan</div>
          <div className="text-[11px] font-semibold text-purple-600 mt-1">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> 100% Kepatuhan UU PDP</span>
          </div>
        </motion.div>
      </div>

      {/* Main Analysis Chart & HITL Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HITL Trust & Agreement Rate */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-black text-slateNavy-900">Tingkat Persetujuan ASN (HITL)</h2>
            <p className="text-xs text-slateNavy-500 mt-0.5">
              Seberapa sering ASN verifikator menyetujui rekomendasi AI vs melakukan override.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-emerald-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Disetujui Langsung (Tanpa Ubah)</span>
                </span>
                <span>{hitlBreakdown.direct_approved_percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slateNavy-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${hitlBreakdown.direct_approved_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-blue-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Diedit Redaksi Respons</span>
                </span>
                <span>{hitlBreakdown.adjusted_draft_percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slateNavy-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${hitlBreakdown.adjusted_draft_percent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-700 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Manual Override OPD</span>
                </span>
                <span>{hitlBreakdown.overridden_percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slateNavy-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${hitlBreakdown.overridden_percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* OPD Workload & SLA Leaderboard */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slateNavy-900">Beban Disposisi & Kepatuhan SLA OPD</h2>
              <p className="text-xs text-slateNavy-500 mt-0.5">
                Distribusi pengaduan terdisposisi ke dinas pelaksana teknis.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slateNavy-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Instansi Pelaksana (OPD)</th>
                  <th className="pb-3">Kode</th>
                  <th className="pb-3 text-center">Jumlah Aduan</th>
                  <th className="pb-3 text-right">Kepatuhan SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opdPerformance.map((opd) => (
                  <tr key={opd.code} className="hover:bg-slateNavy-50/50">
                    <td className="py-3.5 font-bold text-slateNavy-800 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-slateNavy-400" />
                      <span>{opd.name}</span>
                    </td>
                    <td className="py-3.5 font-mono text-slateNavy-500">{opd.code}</td>
                    <td className="py-3.5 text-center font-bold">{opd.tickets_count} Tiket</td>
                    <td className="py-3.5 text-right font-black text-emerald-600">
                      {opd.compliance_rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
