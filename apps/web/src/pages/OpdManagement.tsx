import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Tag,
  AlertCircle
} from 'lucide-react';
import { fetchOpds, createOpd, OPDData } from '../services/api';

export function OpdManagement() {
  const [opdList, setOpdList] = useState<OPDData[]>([]);
  const [selectedOpd, setSelectedOpd] = useState<OPDData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new OPD
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newScope, setNewScope] = useState('');
  const [newSla, setNewSla] = useState(24);

  const loadOpds = async () => {
    try {
      const data = await fetchOpds();
      setOpdList(data);
      if (data.length > 0 && !selectedOpd) {
        setSelectedOpd(data[0]);
      }
    } catch (err) {
      console.error('Failed to load OPD list:', err);
    }
  };

  useEffect(() => {
    loadOpds();
  }, []);

  const handleCreateOpd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) {
      alert('Mohon isi kode dan nama OPD.');
      return;
    }

    try {
      const scopeArray = newScope
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await createOpd({
        id: `OPD-${newCode.toUpperCase()}`,
        code: newCode.toUpperCase(),
        name: newName,
        jurisdiction: 'KOTA_KABUPATEN',
        scope: scopeArray,
        sla_standard_hours: Number(newSla)
      });

      alert('OPD baru berhasil ditambahkan ke database!');
      setShowAddModal(false);
      setNewCode('');
      setNewName('');
      setNewScope('');
      loadOpds();
    } catch (err) {
      alert('Gagal menambah OPD baru ke database backend.');
    }
  };

  return (
    <div className="flex-1 bg-slateNavy-50 p-4 lg:p-8 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slateNavy-900">Manajemen Kewenangan & Tupoksi OPD</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Live Database Active
            </span>
          </div>
          <p className="text-xs text-slateNavy-500 mt-1">
            Basis pengetahuan (*Knowledge Base*) rujukan Explainable Smart Routing AI untuk mencegah salah disposisi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-glow-red flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Instansi (OPD)</span>
        </button>
      </div>

      {/* OPD Grid List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slateNavy-500 uppercase tracking-wider block px-1">
            Daftar Instansi Terdaftar ({opdList.length})
          </span>

          {opdList.map((opd) => {
            const isSelected = selectedOpd?.id === opd.id;

            return (
              <motion.div
                key={opd.id}
                onClick={() => setSelectedOpd(opd)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-brand-primary shadow-md ring-2 ring-brand-primary/10'
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-brand-primary text-white' : 'bg-slateNavy-100 text-slateNavy-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slateNavy-900 line-clamp-1">{opd.name}</h3>
                      <span className="text-[10px] font-mono font-bold text-slateNavy-400">{opd.code}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slateNavy-100 text-slateNavy-600">
                    SLA {opd.sla_standard_hours}h
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-2">
          {selectedOpd ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slateNavy-900">{selectedOpd.name}</h2>
                    <div className="flex items-center space-x-2 text-xs text-slateNavy-500 mt-0.5">
                      <span className="font-mono font-bold text-brand-primary">{selectedOpd.id}</span>
                      <span>•</span>
                      <span className="font-medium">{selectedOpd.jurisdiction}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl text-right">
                  <span className="text-[10px] text-emerald-600 font-bold block uppercase">Standar SLA</span>
                  <span className="text-sm font-black text-emerald-800">{selectedOpd.sla_standard_hours} Jam</span>
                </div>
              </div>

              {/* Scopes Tag Cloud */}
              <div>
                <span className="text-xs font-bold text-slateNavy-700 uppercase tracking-wider block mb-2">
                  Cakupan Kewenangan & Kata Kunci Triage AI ({selectedOpd.scope.length} Bidang)
                </span>
                <p className="text-xs text-slateNavy-500 mb-3">
                  AI Smart Routing mencocokkan kata kunci laporan publik dengan batasan tupoksi di bawah ini:
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedOpd.scope.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slateNavy-50 border border-slate-200 text-slateNavy-800 flex items-center space-x-1.5"
                    >
                      <Tag className="w-3 h-3 text-brand-primary" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Guardrails Box */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3 text-xs text-purple-900">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Prinsip No Wrong Door Policy (SP4N-LAPOR!)</span>
                  Jika laporan warga menyangkut kewenangan instansi vertikal atau jalan nasional, AI akan tetap menerima laporan dan meneruskan rekomendasi rute instansi secara lintas-kewenangan.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slateNavy-400 text-xs">
              Pilih salah satu instansi di sebelah kiri untuk melihat detail cakupan tupoksi.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slateNavy-900">Tambah Instansi (OPD) Baru</h3>
            <form onSubmit={handleCreateOpd} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">Kode Instansi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DISKOMINFO"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">Nama Lengkap Instansi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinas Komunikasi dan Informatika"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                  Cakupan Tupoksi (Pisahkan dengan koma)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Jaringan Internet Publik, Website Pemda, Menara BTS"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="w-full p-3 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">Standar SLA (Jam)</label>
                <input
                  type="number"
                  value={newSla}
                  onChange={(e) => setNewSla(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slateNavy-600 hover:bg-slateNavy-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-glow-red"
                >
                  Simpan OPD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
