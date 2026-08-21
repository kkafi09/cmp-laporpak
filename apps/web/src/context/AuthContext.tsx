import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  nik?: string;
  phone?: string;
  role: 'CITIZEN' | 'ADMIN_ASN';
  nip?: string;
  agency?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (role: 'CITIZEN' | 'ADMIN_ASN', credentials?: { username?: string; password?: string }) => void;
  register: (data: { name: string; nik: string; email: string; phone: string; password: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('laporpak_auth_user');
    if (saved) {
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

  const login = (role: 'CITIZEN' | 'ADMIN_ASN', credentials?: { username?: string; password?: string }) => {
    if (role === 'ADMIN_ASN') {
      setUser({
        id: 'usr-admin-01',
        username: credentials?.username || 'hendra_asn',
        name: 'Dr. Hendra Gunawan, M.Si',
        email: 'hendra.gunawan@laporpak.go.id',
        role: 'ADMIN_ASN',
        nip: '198403152008011004',
        agency: 'Kementerian PAN-RB / Verifikator Nasional'
      });
    } else {
      setUser({
        id: 'usr-citizen-01',
        username: credentials?.username || 'budi_santoso',
        name: credentials?.username || 'Budi Santoso',
        email: 'budi.santoso@email.com',
        nik: '3271012345670001',
        phone: '081298765432',
        role: 'CITIZEN'
      });
    }
  };

  const register = (data: { name: string; nik: string; email: string; phone: string; password: string }) => {
    setUser({
      id: 'usr-citizen-' + Date.now(),
      username: data.email.split('@')[0],
      name: data.name,
      email: data.email,
      nik: data.nik,
      phone: data.phone,
      role: 'CITIZEN'
    });
  };

  const logout = () => {
    setUser(null);
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
