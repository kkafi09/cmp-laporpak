import { useState, useEffect } from 'react';
import { Settings, Shield, Cpu, Key, Check, Sliders } from 'lucide-react';
import { fetchSettings, saveSettings } from '../services/api';

export function SettingsPage() {
  const [primaryModel, setPrimaryModel] = useState('gemini-1.5-pro');
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyD-••••••••••••••••••••••••');
  const [dedupThreshold, setDedupThreshold] = useState(0.65);
  const [enablePiiMasking, setEnablePiiMasking] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        if (settings.primary_llm_model) setPrimaryModel(settings.primary_llm_model);
        if (settings.dedup_similarity_threshold) setDedupThreshold(parseFloat(settings.dedup_similarity_threshold));
        if (settings.enable_pii_masking) setEnablePiiMasking(settings.enable_pii_masking === 'true');
        if (settings.gemini_api_key) setGeminiApiKey(settings.gemini_api_key);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSettings({
        primary_llm_model: primaryModel,
        dedup_similarity_threshold: String(dedupThreshold),
        enable_pii_masking: String(enablePiiMasking),
        gemini_api_key: geminiApiKey
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      alert('Gagal menyimpan pengaturan ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full flex-1 flex flex-col space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slateNavy-900 tracking-tight flex items-center space-x-2">
            <Settings className="w-6 h-6 text-brand-primary" />
            <span>Pengaturan Guardrails & Konfigurasi Sistem</span>
          </h1>
          <p className="text-xs text-slateNavy-500 mt-1">
            Atur parameter keamanan, integrasi model Gemini LLM, kepatuhan UU PDP, dan ambang batas deduplikasi semantik.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 self-start">
          Live Database Active
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Model AI Configuration */}
        <div>
          <h2 className="text-sm font-extrabold text-slateNavy-900 flex items-center space-x-2 mb-3">
            <Cpu className="w-4 h-4 text-brand-primary" />
            <span>Konfigurasi LLM Reasoning Engine</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slateNavy-700">Primary Reasoning Engine</label>
              <select
                value={primaryModel}
                onChange={(e) => setPrimaryModel(e.target.value)}
                className="w-full mt-1.5 p-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Recommended)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Ultra-Fast)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slateNavy-700">Google Gemini API Key</label>
              <div className="relative mt-1.5">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* UU PDP Security Shield */}
        <div>
          <h2 className="text-sm font-extrabold text-slateNavy-900 flex items-center space-x-2 mb-3">
            <Shield className="w-4 h-4 text-shield-purple" />
            <span>Kepatuhan UU PDP (UU No. 27 Tahun 2022)</span>
          </h2>
          <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
            <div>
              <div className="text-xs font-bold text-purple-950">Wajib Masking PII Deterministik Lokal</div>
              <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
                Sensor otomatis NIK 16-digit, Nomor Telepon, Email, dan data perbankan sebelum payload dikirim ke API LLM publik.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enablePiiMasking}
              onChange={(e) => setEnablePiiMasking(e.target.checked)}
              className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary accent-brand-primary cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Semantic Deduplication Threshold */}
        <div>
          <h2 className="text-sm font-extrabold text-slateNavy-900 flex items-center space-x-2 mb-3">
            <Sliders className="w-4 h-4 text-brand-primary" />
            <span>Ambang Batas (Threshold) Semantic Deduplication</span>
          </h2>
          <div className="p-4 bg-slateNavy-50 rounded-2xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slateNavy-800 mb-2">
              <span>Cosine Similarity Threshold</span>
              <span className="text-brand-primary font-mono font-black">{Math.round(dedupThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.95"
              step="0.05"
              value={dedupThreshold}
              onChange={(e) => setDedupThreshold(parseFloat(e.target.value))}
              className="w-full accent-brand-primary cursor-pointer"
            />
            <p className="text-[11px] text-slateNavy-500 mt-2">
              Laporan dengan kemiripan di atas {Math.round(dedupThreshold * 100)}% otomatis dikelompokkan ke dalam klaster insiden yang sama.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-emerald-600 font-semibold">{isSaved ? '✓ Pengaturan berhasil disimpan ke database!' : ''}</span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-glow-red flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
