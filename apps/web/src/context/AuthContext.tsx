import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, meApi } from '../services/api';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  nik?: string;
  phone?: string;
  role: 'CITIZEN' | 'ADMIN_ASN' | 'SUPER_ADMIN';
  nip?: string;
  agency?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (role: 'CITIZEN' | 'ADMIN_ASN', credentials?: { username?: string; password?: string }) => Promise<void>;
  register: (data: { name: string; nik: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('laporpak_auth_user');
    if (saved && localStorage.getItem('laporpak_auth_token')) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('laporpak_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('laporpak_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (!localStorage.getItem('laporpak_auth_token')) return;
    meApi().then(setUser).catch(() => { localStorage.removeItem('laporpak_auth_token'); setUser(null); });
  }, []);

  const login = async (_role: 'CITIZEN' | 'ADMIN_ASN', credentials?: { username?: string; password?: string }) => {
    if (!credentials?.username || !credentials.password) throw new Error('Username dan password wajib diisi');
    const data = await loginApi(credentials.username, credentials.password);
    localStorage.setItem('laporpak_auth_token', data.token);
    setUser(data.user);
  };

  const register = async (data: { name: string; nik: string; email: string; phone: string; password: string }) => {
    const result = await registerApi(data);
    localStorage.setItem('laporpak_auth_token', result.token);
    setUser(result.user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('laporpak_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
