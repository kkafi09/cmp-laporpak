import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { UserPlus, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeUuPdp, setAgreeUuPdp] = useState(true);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Mohon lengkapi semua field wajib.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    register({ name, nik, email, phone, password });
    alert('Pendaftaran akun berhasil! Anda sekarang masuk sebagai warga terverifikasi.');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-slateNavy-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slateNavy-500 hover:text-brand-primary mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <img src="/logo-2.jpeg" alt="LaporPak! Logo" className="h-11 mx-auto object-contain mb-2" />
        <h2 className="text-xl font-black text-slateNavy-900 tracking-tight">Daftar Akun Warga Baru</h2>
        <p className="text-xs text-slateNavy-500 font-medium">
          Dapatkan kemudahan pelacakan aduan dan perlindungan privasi UU PDP No. 27/2022
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200 space-y-4">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                Nama Lengkap (Sesuai KTP) <span className="text-brand-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                Nomor Induk Kependudukan (NIK 16 Digit)
              </label>
              <input
                type="text"
                placeholder="3271012345670001"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-brand-primary/30"
              />
              <span className="text-[10px] text-purple-700 font-medium mt-0.5 block">
                🛡️ NIK Anda otomatis dienkripsi dan disensor sebelum diproses LLM.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                Alamat Email Aktif <span className="text-brand-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="email"
                  required
                  placeholder="budi.santoso@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                Nomor WhatsApp / Handphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="tel"
                  placeholder="081298765432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slateNavy-700 block mb-1">Konfirmasi Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start space-x-2 text-[11px] text-slateNavy-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeUuPdp}
                  onChange={(e) => setAgreeUuPdp(e.target.checked)}
                  className="mt-0.5 rounded accent-brand-primary w-4 h-4"
                />
                <span>
                  Saya menyetujui pemrosesan data pengaduan sesuai ketentuan pelindungan data pribadi (UU PDP No. 27/2022).
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-glow-red flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akun Warga</span>
            </button>
          </form>

          <div className="text-center text-xs text-slateNavy-500 pt-2 border-t border-slate-100">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
