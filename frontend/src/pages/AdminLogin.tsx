// ==============================================
// FEC 2026 | Login administrativo
// ==============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HUDCorners, SectionEyebrow } from '../components/HUD';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'ACCESS_DENIED');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-4 py-24 md:px-8">
      <SectionEyebrow>ADMIN ACCESS</SectionEyebrow>
      <div className="hud-panel relative p-6">
        <HUDCorners />
        <div className="mb-6 flex items-center gap-2">
          <Lock className="text-cyan" size={20} />
          <h1 className="font-display text-sm tracking-widest text-metal">RESTRICTED AREA</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-cyan/80">
              usuário
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-metal focus:border-cyan/50 focus:outline-none"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-cyan/80">
              senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-metal focus:border-cyan/50 focus:outline-none"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
              [ ACCESS_DENIED ] {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-cyan bg-cyan/10 py-2.5 font-mono text-xs uppercase tracking-widest text-cyan shadow-neon transition hover:bg-cyan/20 disabled:opacity-50"
          >
            {loading ? 'autenticando...' : 'Autenticar'}
          </button>
        </form>
      </div>
    </div>
  );
}
