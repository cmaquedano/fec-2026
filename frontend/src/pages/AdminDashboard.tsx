// ==============================================
// FEC 2026 | Painel administrativo — moderação de fotos
// ==============================================
import React, { useEffect, useState } from 'react';
import { Check, X as XIcon, LogOut, Eye } from 'lucide-react';
import { api, Photo } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { HUDCorners, SectionEyebrow } from '../components/HUD';

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [preview, setPreview] = useState<Photo | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.adminGetAllPhotos();
      setPhotos(res.photos);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: number) {
    await api.adminApprove(id);
    load();
  }

  async function handleReject(id: number) {
    await api.adminReject(id);
    load();
  }

  const filtered = photos.filter((p) => p.status === tab);
  const totals = {
    pending: photos.filter((p) => p.status === 'pending').length,
    approved: photos.filter((p) => p.status === 'approved').length,
    rejected: photos.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <SectionEyebrow>ADMIN DASHBOARD</SectionEyebrow>
          <p className="font-mono text-xs text-tech">sessão: {username}</p>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-metal/70 hover:border-danger/40 hover:text-danger"
        >
          <LogOut size={14} /> Encerrar sessão
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {(['pending', 'approved', 'rejected'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border px-4 py-3 text-left font-mono text-xs uppercase tracking-widest transition ${
              tab === t ? 'border-cyan bg-cyan/10 text-cyan shadow-neon' : 'border-white/10 text-tech hover:border-cyan/30'
            }`}
          >
            {t === 'pending' ? 'Pendentes' : t === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
            <div className="mt-1 text-lg text-metal">{totals[t]}</div>
          </button>
        ))}
      </div>

      {loading && <p className="font-mono text-xs text-tech animate-pulseGlow">carregando_registros...</p>}

      {!loading && filtered.length === 0 && (
        <p className="font-mono text-xs text-tech">[ NO_DATA ] Nenhum registro nesta categoria.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="hud-panel relative p-3">
            <HUDCorners />
            <img
              src={p.thumbnail_path}
              alt={p.nickname || 'registro'}
              className="mb-3 aspect-square w-full cursor-pointer object-cover"
              onClick={() => setPreview(p)}
            />
            <div className="space-y-1 font-mono text-[10px] text-tech">
              <p className="text-cyan">{p.packet_code}</p>
              <p>{p.nickname ? `@${p.nickname.replace(/^@/, '')}` : 'ANONYMOUS'}</p>
              <p>LGPD: {p.lgpd_authorized ? 'AUTORIZADO' : 'NÃO AUTORIZADO'}</p>
              <p>{new Date(p.created_at).toLocaleString('pt-BR')}</p>
            </div>

            {tab === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleApprove(p.id)}
                  className="flex flex-1 items-center justify-center gap-1 border border-cyan/40 bg-cyan/10 py-2 font-mono text-[10px] uppercase text-cyan hover:bg-cyan/20"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  onClick={() => handleReject(p.id)}
                  className="flex flex-1 items-center justify-center gap-1 border border-danger/40 bg-danger/10 py-2 font-mono text-[10px] uppercase text-danger hover:bg-danger/20"
                >
                  <XIcon size={12} /> Reject
                </button>
                <button
                  onClick={() => setPreview(p)}
                  className="flex items-center justify-center border border-white/10 px-2 text-metal/70 hover:text-cyan"
                >
                  <Eye size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview.path}
            alt={preview.nickname || 'preview'}
            className="max-h-[85vh] max-w-3xl border border-cyan/20 object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
