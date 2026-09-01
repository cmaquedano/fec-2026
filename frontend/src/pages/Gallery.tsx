// ==============================================
// FEC 2026 | Galeria pública de registros aprovados
// ==============================================
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api, Photo } from '../api/client';
import { SectionEyebrow } from '../components/HUD';
import PhotoCard from '../components/PhotoCard';

const FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'recent', label: 'RECENT' },
  { key: 'most_viewed', label: 'MOST VIEWED' },
];

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getApprovedPhotos(filter)
      .then((res) => setPhotos(res.photos))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, [filter]);

  function openPhoto(p: Photo) {
    setSelected(p);
    api.registerView(p.id).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <SectionEyebrow>REGISTROS CAPTURADOS NA REDE</SectionEyebrow>

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition ${
              filter === f.key
                ? 'border-cyan bg-cyan/10 text-cyan shadow-neon'
                : 'border-white/10 text-tech hover:border-cyan/40 hover:text-cyan'
            }`}
          >
            [ {f.label} ]
          </button>
        ))}
      </div>

      {loading && (
        <p className="font-mono text-xs text-tech animate-pulseGlow">decodificando_registros...</p>
      )}

      {!loading && photos.length === 0 && (
        <p className="font-mono text-xs text-tech">
          [ NO_DATA ] Nenhum registro publicado até o momento. Volte em breve.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p) => (
          <PhotoCard key={p.id} photo={p} onClick={() => openPhoto(p)} />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-h-[85vh] max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-metal/70 hover:text-cyan"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <img
              src={selected.path}
              alt={selected.nickname || 'Registro FEC_2026'}
              className="max-h-[75vh] w-full border border-cyan/20 object-contain"
            />
            <div className="mt-3 flex items-center justify-between font-mono text-xs text-tech">
              <span className="text-cyan">[ VERIFIED ]</span>
              <span>{selected.packet_code}</span>
              <span>{selected.nickname ? `@${selected.nickname.replace(/^@/, '')}` : 'ANONYMOUS'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
