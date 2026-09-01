import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogIn, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login('CITIZEN', { username, password });
      const role = JSON.parse(localStorage.getItem('laporpak_auth_user') || '{}').role;
      await navigate({ to: role === 'ADMIN_ASN' || role === 'SUPER_ADMIN' ? '/admin' : '/' });
    } catch (error) {
      toast({ kind: 'error', title: 'Login gagal', message: error instanceof Error ? error.message : 'Periksa kredensial.' });
    }
  };

  return <div className="min-h-screen bg-slateNavy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slateNavy-500 hover:text-brand-primary mb-6"><ArrowLeft className="w-4 h-4" /><span>Kembali ke Beranda</span></Link>
      <img src="/logo-2.jpeg" alt="LaporPak! Logo" className="h-12 mx-auto object-contain mb-2" />
      <p className="text-xs text-slateNavy-500 font-medium">Masuk ke akun portal pengaduan</p>
    </div>
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4"><div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200">
      <form onSubmit={handleLogin} className="space-y-4">
        <div><label className="text-xs font-bold text-slateNavy-700 block mb-1">Username atau Email</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" /><input required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-3 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl" /></div></div>
        <div><label className="text-xs font-bold text-slateNavy-700 block mb-1">Kata Sandi</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateNavy-400" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2.5 text-xs bg-slateNavy-50 border border-slate-200 rounded-xl" /></div></div>
        <button type="submit" className="w-full py-3 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"><LogIn className="w-4 h-4" />Masuk</button>
      </form>
      <div className="text-center text-xs text-slateNavy-500 pt-5 mt-5 border-t border-slate-100">Belum memiliki akun? <Link to="/register" className="font-bold text-brand-primary hover:underline">Daftar warga</Link></div>
    </div></div>
  </div>;
}
