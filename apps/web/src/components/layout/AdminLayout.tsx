import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router';
import {
  Inbox,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Triage & Verifikasi (HITL)', to: '/admin', icon: Inbox },
    { label: 'Manajemen OPD & Tupoksi', to: '/admin/opd', icon: Building2 },
    { label: 'Analitik & Monev SLA', to: '/admin/analytics', icon: BarChart3 },
    { label: 'Pengaturan Guardrails', to: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-slateNavy-50 text-slateNavy-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2">
            <img src="/logo-2.jpeg" alt="LaporPak! Logo" className="h-9 w-auto object-contain" />
            <span className="hidden sm:inline-block ml-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-slateNavy-900 text-white">
              Admin Panel
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slateNavy-100/80 p-1 rounded-2xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-brand-primary shadow-sm'
                      : 'text-slateNavy-700 hover:text-slateNavy-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-primary' : 'text-slateNavy-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="hidden lg:flex items-center space-x-1 text-xs font-bold text-slateNavy-600 hover:text-brand-primary px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slateNavy-100 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Portal Warga</span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Agentic Layer Online</span>
            </div>

            <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slateNavy-900 text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AS'}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slateNavy-900">{user?.name || 'Dr. Hendra Gunawan'}</span>
                <span className="text-[10px] text-slateNavy-500">{user?.nip || 'ASN Verifikator Pusat'}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 text-slateNavy-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Page Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
