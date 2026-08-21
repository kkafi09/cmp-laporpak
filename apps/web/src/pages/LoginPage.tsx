import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogIn, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'ADMIN_ASN'>('CITIZEN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Mohon masukkan username atau email Anda.');
      return;
    }

    login(selectedRole, { username, password });

    if (selectedRole === 'ADMIN_ASN') {
      navigate({ to: '/admin' });
    } else {
      navigate({ to: '/' });
    }
  };

  const handleQuickDemo = (role: 'CITIZEN' | 'ADMIN_ASN') => {
    if (role === 'ADMIN_ASN') {
      setUsername('hendra_asn');
      setPassword('••••••••');
      setSelectedRole('ADMIN_ASN');
      login('ADMIN_ASN', { username: 'hendra_asn' });
      navigate({ to: '/admin' });
    } else {
      setUsername('budi_santoso');
      setPassword('••••••••');
      setSelectedRole('CITIZEN');
      login('CITIZEN', { username: 'budi_santoso' });
      navigate({ to: '/' });
    }
  };

  return (
    <div className="min-h-screen bg-slateNavy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slateNavy-500 hover:text-brand-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <img src="/logo-2.jpeg" alt="LaporPak! Logo" className="h-12 mx-auto object-contain mb-2" />
        <p className="text-xs text-slateNavy-500 font-medium">
          Masuk ke Akun Portal Pengaduan atau Dashboard ASN
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200 space-y-6">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slateNavy-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('CITIZEN')}
              className={`py-2 rounded-xl transition-all ${
                selectedRole === 'CITIZEN'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-slateNavy-600 hover:text-slateNavy-900'
              }`}
            >
              👤 Akun Warga
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN_ASN')}
              className={`py-2 rounded-xl transition-all ${
                selectedRole === 'ADMIN_ASN'
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-slateNavy-600 hover:text-slateNavy-900'
              }`}
            >
              🏛️ Admin ASN
            </button>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="bg-slateNavy-50 p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slateNavy-500 uppercase block mb-1.5">
              Akses Cepat (Demo Akun):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('CITIZEN')}
                className="flex-1 py-1.5 text-xs bg-white border border-slate-200 text-slateNavy-800 font-bold rounded-lg hover:border-brand-primary hover:text-brand-primary"
              >
                Masuk Warga
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN_ASN')}
                className="flex-1 py-1.5 text-xs bg-slateNavy-900 text-white font-bold rounded-lg hover:bg-black"
              >
                Masuk Admin ASN
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slateNavy-700 block mb-1">
                {selectedRole === 'ADMIN_ASN' ? 'Username / NIP ASN' : 'Username / Email / NIK'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="text"
                  required
                  placeholder={selectedRole === 'ADMIN_ASN' ? '198403152008011004' : 'budi.santoso@email.com'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slateNavy-700">Kata Sandi</label>
                <a href="#" className="text-[11px] font-semibold text-brand-primary hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-glow-red flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>

          <div className="text-center text-xs text-slateNavy-500 pt-2 border-t border-slate-100">
            Belum memiliki akun?{' '}
            <Link to="/register" className="font-bold text-brand-primary hover:underline">
              Daftar Warga Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
