// ==============================================
// FEC 2026 | Rota protegida para o painel administrativo
// ==============================================
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="p-10 text-center font-mono text-xs text-tech animate-pulseGlow">verificando_sessão...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
