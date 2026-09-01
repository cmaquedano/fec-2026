// ==============================================
// FEC 2026 | Painel de status do sistema (dados reais via API)
// ==============================================
import React, { useEffect, useState } from 'react';
import { api, SystemStats } from '../api/client';
import { SectionEyebrow, HUDCorners } from './HUD';

const ROWS: { key: keyof SystemStats; label: string; icon: string }[] = [
  { key: 'core_status', label: 'CORE STATUS', icon: '🟢' },
  { key: 'agents_connected', label: 'AGENTES CONECTADOS', icon: '📡' },
  { key: 'packets_received', label: 'PACOTES RECEBIDOS', icon: '📂' },
  { key: 'records_published', label: 'REGISTROS PUBLICADOS', icon: '🖼' },
  { key: 'pending_review', label: 'EM ANÁLISE', icon: '🛰' },
  { key: 'database', label: 'DATABASE', icon: '🔐' },
];

export default function StatusPanel() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .getStats()
      .then((s) => mounted && setStats(s))
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="system" className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <SectionEyebrow>SYSTEM STATUS</SectionEyebrow>
      <div className="hud-panel p-5 md:p-8">
        <HUDCorners />
        {error && (
          <p className="font-mono text-xs text-danger">
            [ ERROR ] Não foi possível conectar ao backend. Verifique se a API está em execução.
          </p>
        )}
        {!error && !stats && (
          <p className="font-mono text-xs text-tech animate-pulseGlow">carregando_dados_do_núcleo...</p>
        )}
        {stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROWS.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between border border-white/5 bg-black/30 px-4 py-3 font-mono text-xs"
              >
                <span className="text-tech tracking-wide">
                  {row.icon} {row.label}
                </span>
                <span className="text-cyan text-glow-cyan">{String(stats[row.key])}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border border-white/5 bg-black/30 px-4 py-3 font-mono text-xs sm:col-span-2 lg:col-span-3">
              <span className="text-tech tracking-wide">🛡 SEGURANÇA LGPD</span>
              <span className="text-cyan text-glow-cyan">{stats.lgpd_secured} REGISTROS PROTEGIDOS</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
