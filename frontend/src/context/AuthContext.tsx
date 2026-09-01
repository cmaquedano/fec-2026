// ==============================================
// FEC 2026 | Contexto de autenticação administrativa
// ==============================================
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .adminMe()
      .then((res) => setUsername(res.admin.username))
      .catch(() => setUsername(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(u: string, p: string) {
    const res = await api.adminLogin(u, p);
    setUsername(res.admin.username);
  }

  async function logout() {
    await api.adminLogout().catch(() => {});
    setUsername(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!username, username, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
