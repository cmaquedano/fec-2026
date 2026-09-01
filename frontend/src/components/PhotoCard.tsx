// ==============================================
// FEC 2026 | Card de foto para a galeria pública
// ==============================================
import React from 'react';
import { Photo } from '../api/client';
import { Eye } from 'lucide-react';

export default function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden border border-cyan/15 bg-black/40 text-left transition hover:border-cyan/50 hover:shadow-neon"
    >
      <img
        src={photo.thumbnail_path}
        alt={photo.nickname || 'Registro FEC_2026'}
        loading="lazy"
        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
        <p className="font-mono text-[10px] tracking-widest text-cyan">[ VERIFIED ]</p>
        <p className="truncate font-mono text-xs text-metal">
          {photo.nickname ? `@${photo.nickname.replace(/^@/, '')}` : 'USER: ANONYMOUS'}
        </p>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-tech">
          <span>{photo.packet_code}</span>
          <span className="flex items-center gap-1">
            <Eye size={10} /> {photo.views}
          </span>
        </div>
      </div>
    </button>
  );
}
